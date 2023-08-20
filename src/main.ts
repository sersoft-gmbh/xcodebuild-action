import * as core from '@actions/core';
import * as path from 'path';
import {spawn, StdioNull, StdioPipe} from 'child_process';
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

interface ICommandArgumentValue {
    originalValue: string;
    resolvedValue: string;
}

interface ICommandArgument {
    name: string;
    value?: ICommandArgumentValue;
}

function argumentValueString(value: ICommandArgumentValue,
                             useResolvedValue: boolean = true,
                             escapeValue: boolean = false): string {
    function _cmdEscape(str: string): string {
        return str.replace(/((?!\\).|^)( )/g, `$1\\ `);
    }
    let strValue = useResolvedValue ? value.resolvedValue : value.originalValue
    return escapeValue ? _cmdEscape(strValue) : strValue;
}

function argumentStrings(argument: ICommandArgument,
                         useResolvedValue: boolean = true,
                         escapeValue: boolean = false): string[] {
    let plain = [argument.name];
    if (argument.value) 
        plain.push(argumentValueString(argument.value, useResolvedValue, escapeValue));
    return plain;
}

function allArgumentStrings(args: ICommandArgument[],
                            useResolvedValue: boolean = true,
                            escapeValue: boolean = false): string[] {
    return args.flatMap(a => argumentStrings(a, useResolvedValue, escapeValue));
}

interface IOutputFormatterInvocation {
    tool: string;
    args: ICommandArgument[];
}

async function runXcodebuild(args: ICommandArgument[], outputFormatter?: IOutputFormatterInvocation | null) {
    const xcodebuildOut: StdioNull | StdioPipe = outputFormatter ? 'pipe' : process.stdout;
    const xcodebuild = spawn('xcodebuild', allArgumentStrings(args), {
        stdio: ['inherit', xcodebuildOut, process.stderr],
    });
    let finishedPromise = new Promise<number>((resolve, reject) => {
        xcodebuild.on('error', reject);
        xcodebuild.on('exit', (exitCode, signal) => {
            if (exitCode) {
                resolve(exitCode);
            } else if (signal) {
                resolve(SIGNAL_NAME_TO_NUMBER_MAP[signal]);
            }
        });
    });
    if (outputFormatter) {
        const formattedOutput = spawn(outputFormatter.tool, allArgumentStrings(outputFormatter.args), {
            stdio: ['pipe', process.stdout, process.stderr],
        });
        xcodebuild.stdout?.pipe(formattedOutput.stdin);
        finishedPromise = finishedPromise.then((xcodeCode) => new Promise<number>((resolve, reject) => {
            formattedOutput.on('error', reject);
            formattedOutput.on('exit', (formattedOutputCode, formattedOutputSignal) => {
                if (xcodeCode == 0) {
                    if (formattedOutputCode) {
                        resolve(formattedOutputCode);
                    } else if (formattedOutputSignal) {
                        resolve(SIGNAL_NAME_TO_NUMBER_MAP[formattedOutputSignal]);
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
    let xcodebuildArgs: ICommandArgument[] = [];
    core.startGroup('Validating input');
    const workspace = core.getInput('workspace');
    const project = core.getInput('project');
    const spmPackage = core.getInput('spm-package');

    if ((!workspace && !project && !spmPackage)
        || (workspace && project && spmPackage)
        || (workspace && project)
        || (workspace && spmPackage)
        || (project && spmPackage)) {
        throw new Error('Either `project`, `workspace` or `spm-package-path` must be set, but they are mutually exclusive!');
    }
    const scheme = core.getInput('scheme', { required: !!workspace || !!spmPackage });

    function _pushArg(name: string, value?: ICommandArgumentValue) {
        xcodebuildArgs.push({ name: `-${name}`, value: value });
    }

    function _pushArgWithValue(name: string,
                               value: string,
                               opts?: { isPath?: boolean, skipEmptyValues?: boolean }) {
        let processedValue = value;
        if (opts?.skipEmptyValues) {
            processedValue = processedValue.trim();
            if (processedValue.length <= 0) return;
        }
        if (opts?.isPath) processedValue = path.resolve(processedValue);
        _pushArg(name, { originalValue: value, resolvedValue: processedValue });
    }

    function _addInputArg(inputName: string, argName?: string, opts?: { isPath?: boolean, isList?: boolean }) {
        if (opts?.isList) {
            let values = core.getMultilineInput(inputName);
            if (values)
                values.forEach(value => _pushArgWithValue(argName ?? inputName, value, {
                    isPath: opts?.isPath,
                    skipEmptyValues: true,
                }));
        } else {
            let value = core.getInput(inputName);
            if (value)
                _pushArgWithValue(argName ?? inputName, value, {
                    isPath: opts?.isPath,
                    skipEmptyValues: false,
                })
        }
    }

    function addInputArg(inputName: string, argName?: string) {
        _addInputArg(inputName, argName);
    }

    function addPathArg(inputName: string, argName?: string) {
        _addInputArg(inputName, argName, { isPath: true });
    }

    function addListArg(inputName: string, argName?: string) {
        _addInputArg(inputName, argName, { isList: true });
    }

    function addBoolArg(inputName: string, argName?: string) {
        const value = core.getInput(inputName);
        if (value?.length)
            _pushArgWithValue(argName ?? inputName, core.getBooleanInput(inputName) ? 'YES' : 'NO')
    }

    function addFlagArg(inputName: string, argName?: string) {
        if (core.getInput(inputName).length && core.getBooleanInput(inputName))
            _pushArg(argName ?? inputName);
    }

    if (workspace) {
        _pushArgWithValue('workspace', workspace, { isPath: true })
    } else if (project) {
        _pushArgWithValue('project', project, { isPath: true })
    }
    if (scheme) _pushArgWithValue('scheme', scheme);

    addInputArg('target');
    addInputArg('destination');
    addInputArg('configuration');
    addInputArg('sdk');
    addInputArg('arch');
    addPathArg('xcconfig');
    addInputArg('jobs');
    addFlagArg('parallelize-targets', 'parallelizeTargets');
    addBoolArg('enable-code-coverage', 'enableCodeCoverage');
    addBoolArg('parallel-testing-enabled');
    addInputArg('maximum-concurrent-test-device-destinations');
    addInputArg('maximum-concurrent-test-simulator-destinations');
    addFlagArg('quiet');
    addFlagArg('hide-shell-script-environment', 'hideShellScriptEnvironment');
    addBoolArg('enable-address-sanitizer', 'enableAddressSanitizer');
    addBoolArg('enable-thread-sanitizer', 'enableThreadSanitizer');
    addBoolArg('enable-undefined-behavior-sanitizer', 'enableUndefinedBehaviorSanitizer');
    addPathArg('result-bundle-path', 'resultBundlePath');
    addInputArg('result-bundle-version', 'resultBundleVersion');
    addPathArg('cloned-source-packages-path', 'clonedSourcePackagesDirPath');
    addPathArg('derived-data-path', 'derivedDataPath');
    addPathArg('xcroot');
    addPathArg('xctestrun');
    addInputArg('test-plan', 'testPlan');
    addListArg('only-testing');
    addListArg('skip-testing');
    addFlagArg('skip-unavailable-actions', 'skipUnavailableActions');
    addFlagArg('allow-provisioning-updates', 'allowProvisioningUpdates');
    addFlagArg('allow-provisioning-device-registration', 'allowProvisioningDeviceRegistration');

    const buildSettings = core.getInput('build-settings');
    if (buildSettings)
        xcodebuildArgs.push(...buildSettings.split(' ').map(v => { return { name: v }; }));

    const action = core.getInput('action', { required: true });
    xcodebuildArgs.push(...action.split(' ').map(v => { return { name: v }; }));

    let outputFormatter = core.getInput('output-formatter');
    if (!outputFormatter && core.getBooleanInput('use-xcpretty')) {
        outputFormatter = 'xcpretty';
        if (core.getBooleanInput('xcpretty-colored-output'))
            outputFormatter += ' --color';
    }

    const dryRun = core.isDebug() && core.getInput('dry-run') == 'true';

    // We allow other platforms for dry-runs since this speeds up tests (more parallel builds).
    if (!dryRun && process.platform !== 'darwin')
        throw new Error('This action only supports macOS!');

    let outputFormatterInv: IOutputFormatterInvocation | null
    if (outputFormatter) {
        const [tool, ...args] = outputFormatter.split(' ');
        outputFormatterInv = { tool, args: args.map(arg => ({ name: arg })) };
    } else {
        outputFormatterInv = null;
    }
    core.endGroup();

    await core.group('Composing command', async () => {
        // We "abuse" ICommandArgument here a bit to make it easier to compose both output variants.
        let allCommands: ICommandArgument[] = [{ name: 'xcodebuild' }].concat(xcodebuildArgs);
        if (outputFormatterInv) {
            allCommands.push({ name: '|' }, { name: outputFormatterInv.tool });
            allCommands.push(...outputFormatterInv.args);
        }
        let unprocessedInvocation = allArgumentStrings(allCommands, false, true);
        let processedInvocation = allArgumentStrings(allCommands, true, true);
        if (spmPackage) {
            const spmPackageValue: ICommandArgumentValue = {
                originalValue: spmPackage,
                resolvedValue: path.resolve(spmPackage),
            };
            function _combinedInv(inv: string[], useResolved: boolean): string[] {
                return [
                    'pushd', argumentValueString(spmPackageValue, useResolved, true),
                    '&&',
                    ...inv,
                    ';',
                    'popd',
                ]
            }
            unprocessedInvocation = _combinedInv(unprocessedInvocation, false);
            processedInvocation = _combinedInv(processedInvocation, true);
        }
        const unprocessedCommand = unprocessedInvocation.join(' ');
        const executedCommand = processedInvocation.join(' ');
        core.setOutput('unprocessed-command', unprocessedCommand);
        core.setOutput('executed-command', executedCommand);
        core.info(`Resolving paths for execution in: \`${unprocessedCommand}\``);
        core.info(`Executing: \`${executedCommand}\``);
    });

    if (!dryRun) {
        core.startGroup('Running xcodebuild');
        const cwd = process.cwd();
        if (spmPackage) process.chdir(spmPackage);
        try {
            await runXcodebuild(xcodebuildArgs, outputFormatterInv);
        } finally {
            if (spmPackage) process.chdir(cwd);
        }
        core.endGroup();
    }
}

try {
    main().catch(error => core.setFailed(error.message));
} catch (error: any) {
    core.setFailed(error.message);
}
