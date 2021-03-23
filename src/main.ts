import * as core from '@actions/core';
import {spawn, StdioNull, StdioPipe} from "child_process";
import Signals = NodeJS.Signals;

const SIGNAL_NAME_TO_NUMBER_MAP: Record<Signals, number> = {
    'SIGHUP':           1,
    'SIGINT':           2,
    'SIGQUIT':          3,
    'SIGILL':           4,
    'SIGTRAP':          5,
    'SIGABRT':          6,
    'SIGIOT':           6,
    'SIGBUS':           7,
    'SIGFPE':           8,
    'SIGKILL':          9,
    'SIGUSR1':         10,
    'SIGSEGV':         11,
    'SIGUSR2':         12,
    'SIGPIPE':         13,
    'SIGALRM':         14,
    'SIGTERM':         15,
    'SIGSTKFLT':       16,
    'SIGCHLD':         17,
    'SIGCONT':         18,
    'SIGSTOP':         19,
    'SIGTSTP':         20,
    'SIGTTIN':         21,
    'SIGTTOU':         22,
    'SIGURG':          23,
    'SIGXCPU':         24,
    'SIGXFSZ':         25,
    'SIGVTALRM':       26,
    'SIGPROF':         27,
    'SIGWINCH':        28,
    'SIGIO':           29,
    'SIGPOLL':         29,
    'SIGPWR':          30,
    'SIGSYS':          31,
    'SIGUNUSED':       31,
    // there isn't actually a number here.
    'SIGBREAK':         97,
    'SIGINFO':          98,
    'SIGLOST':          99,
};

async function runXcodebuild(args: string[], useXcpretty: boolean) {
    const xcodebuildOut: StdioNull | StdioPipe = useXcpretty ? 'pipe' : process.stdout;
    const xcodebuild = spawn('xcodebuild', args, { stdio: ['inherit', xcodebuildOut, process.stderr] });
    let finishedPromise = new Promise<number>((resolve, reject) => {
        xcodebuild.on('error', reject);
        xcodebuild.on('exit', (exitCode, signal) => {
            if (exitCode) {
                resolve(exitCode);
            } else if (signal) {
                resolve(SIGNAL_NAME_TO_NUMBER_MAP[signal])
            }
        });
    });
    if (useXcpretty) {
        const xcpretty = spawn('xcpretty', { stdio: ['pipe', process.stdout, process.stderr] });
        xcodebuild.stdout?.pipe(xcpretty.stdin);
        finishedPromise = finishedPromise.then((xcodeCode) => new Promise<number>((resolve, reject) => {
            xcpretty.on('error', reject);
            xcpretty.on('exit', (xcprettyCode, xcprettySignal) => {
                if (xcodeCode == 0) {
                    if (xcprettyCode) {
                        resolve(xcprettyCode);
                    } else if (xcprettySignal) {
                        resolve(SIGNAL_NAME_TO_NUMBER_MAP[xcprettySignal])
                    }
                } else {
                    resolve(xcodeCode);
                }
            })
        }));
    }
    const exitCode = await finishedPromise;
    if (exitCode != 0) {
        throw new Error(`Xcodebuild action failed (${exitCode})!`);
    }
}

async function main() {
    let xcodebuildArgs: string[] = [];
    core.startGroup('Validating input');
    const workspace = core.getInput('workspace');
    const project = core.getInput('project');
    const spmPackage = core.getInput('spm-package');

    if ((!workspace && !project && !spmPackage)
        || (workspace && project && spmPackage)
        || (workspace && project)
        || (workspace && spmPackage)
        || (project && spmPackage)) {
        throw new Error("Either `project`, `workspace` or `spm-package-path` must be set, but they are mutually exclusive!");
    } else if (workspace) {
        xcodebuildArgs.push('-workspace', workspace);
    } else if (project) {
        xcodebuildArgs.push('-project', project);
    }
    const scheme = core.getInput('scheme', { required: !!workspace || !!spmPackage });
    if (scheme) {
        xcodebuildArgs.push('-scheme', scheme);
    }

    function addInputArg(inputName: string, argName?: string) {
        const value = core.getInput(inputName);
        if (value) {
            xcodebuildArgs.push(`-${argName ?? inputName}`, value);
        }
    }

    function addBoolArg(inputName: string, argName?: string) {
        const value = core.getInput(inputName);
        if (value) {
            xcodebuildArgs.push(`-${argName ?? inputName}`, value == 'true' ? 'YES' : 'NO');
        }
    }

    function addFlagArg(inputName: string, argName?: string) {
        if (core.getInput(inputName) == 'true') {
            xcodebuildArgs.push(`-${argName ?? inputName}`);
        }
    }

    addInputArg('target');
    addInputArg('destination');
    addInputArg('configuration');
    addInputArg('sdk');
    addInputArg('arch');
    addInputArg('xcconfig');
    addInputArg('jobs');
    addFlagArg('parallelize-targets', 'parallelizeTargets');
    addBoolArg('enable-code-coverage', 'enableCodeCoverage');
    addBoolArg('parallel-testing-enabled');
    addFlagArg('quiet');
    addFlagArg('hide-shell-script-environment', 'hideShellScriptEnvironment');
    addBoolArg('enable-address-sanitizer', 'enableAddressSanitizer');
    addBoolArg('enable-thread-sanitizer', 'enableThreadSanitizer');
    addBoolArg('enable-undefined-behavior-sanitizer', 'enableUndefinedBehaviorSanitizer');
    addInputArg('result-bundle-path', 'resultBundlePath');
    addInputArg('result-bundle-version', 'resultBundleVersion');
    addInputArg('derived-data-path', 'derivedDataPath');
    addInputArg('xcroot');
    addInputArg('xctestrun');
    addInputArg('test-plan', 'testPlan');
    addInputArg('skip-testing');
    addFlagArg('skip-unavailable-actions', 'skipUnavailableActions');
    addFlagArg('allow-provisioning-updates', 'allowProvisioningUpdates');
    addFlagArg('allow-provisioning-device-registration', 'allowProvisioningDeviceRegistration');

    const buildSettings = core.getInput('build-settings');
    if (buildSettings) {
        xcodebuildArgs.push(...buildSettings.split(' '));
    }

    const action = core.getInput('action', { required: true });
    xcodebuildArgs.push(...action.split(' '));

    const useXcpretty = core.getInput('use-xcpretty', { required: true }) == 'true';

    const dryRun = core.isDebug() && core.getInput('dry-run') == 'true';

    // We allow other platforms for dry-runs since this speeds up tests (more parallel builds).
    if (!dryRun && process.platform != "darwin") {
        throw new Error("This action only supports macOS!");
    }
    core.endGroup();

    core.startGroup('Running xcodebuild');
    if (!dryRun) {
        const cwd = process.cwd();
        if (spmPackage) {
            process.chdir(spmPackage);
        }
        try {
            await runXcodebuild(xcodebuildArgs, useXcpretty);
        } finally {
            if (spmPackage) {
                process.chdir(cwd);
            }
        }
    } else {
        let executedCommand = ['xcodebuild'].concat(xcodebuildArgs);
        if (useXcpretty) {
            executedCommand.push('|', 'xcpretty');
        }
        if (spmPackage) {
            executedCommand = ['pushd', spmPackage, '&&', ...executedCommand, ';', 'popd'];
        }
        core.setOutput('executed-command', executedCommand.join(' '));
    }
    core.endGroup();
}

try {
    main().catch(error => core.setFailed(error.message))
} catch (error) {
    core.setFailed(error.message);
}
