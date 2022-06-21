# Xcodebuild Action

[![Tests](https://github.com/sersoft-gmbh/xcodebuild-action/actions/workflows/tests.yml/badge.svg)](https://github.com/sersoft-gmbh/xcodebuild-action/actions/workflows/tests.yml)

This action runs `xcodebuild` with the given options.

Note that this action needs to run on macOS. All other platforms will fail!

## Inputs

### `workspace`

The path to the xcworkspace to build. Mutually exclusive with `project` and `spm-package`.  Either `workspace`, `project` or `spm-package` must be set. See also `xcodebuild`'s `-workspace`. 

### `project`

The path to the xcodeproj to build. Mutually exclusive with `workspace` and `spm-package`.  Either `workspace`, `project` or `spm-package` must be set. See also `xcodebuild`'s `-project`.

### `spm-package`

The path to the SPM package (folder containing `Package.swift`) to build. Mutually exclusive with `project` and `workspace`. Either `workspace`, `project` or `spm-package` must be set.

### `scheme`

The scheme to build. Required when using a workspace or SPM package. See also `xcodebuild`'s `-scheme`.

### `target`

The target to build. See also `xcodebuild`'s `-target`.

### `destination`

The destination specifier to build. See also `xcodebuild`'s `-destination`.

### `configuration`

The configuration to build. See also `xcodebuild`'s `-configuration`.

### `sdk`

The SDK to use for building. See also `xcodebuild`'s `-sdk`.

### `arch`

The architecture to use for building. See also `xcodebuild`'s `-arch`.

### `xcconfig`

The path to an xcconfig file with build settings overrides. See also `xcodebuild`'s `-xcconfig`.

### `jobs`

The number of jobs to use for building. See also `xcodebuild`'s `-jobs`.

### `parallelize-targets`

If `true`, the targets will be built in parallel. See also `xcodebuild`'s `-parallelizeTargets`.

### `quiet`

If `true`, `xcodebuild` won't print anything except warnings and errors. See also `xcodebuild`'s `-quiet`.

### `hide-shell-script-environment`

If `true`, `xcodebuild` won't print the environment for shell build scripts. See also `xcodebuild`'s `-hideShellScriptEnvironment`.

### `enable-code-coverage`

If `true`, code coverage is enabled while testing. See also `xcodebuild`'s `-enableCodeCoverage`.

### `parallel-testing-enabled`

If `true`, tests are executed in parallel. See also `xcodebuild`'s `-parallel-testing-enabled`.

### `maximum-concurrent-test-device-destinations`

The maximum number of device destinations to run in parallel. See also `xcodebuild`'s `-maximum-concurrent-test-device-destinations`.

### `maximum-concurrent-test-simulator-destinations`

The maximum number of simulator destinations to run in parallel. See also `xcodebuild`'s `-maximum-concurrent-test-simulator-destinations`.

### `enable-address-sanitizer`

Whether the address sanitizer should be enabled. See also `xcodebuild`'s `-enableAddressSanitizer`.

### `enable-thread-sanitizer`

Whether the thread sanitizer should be enabled. See also `xcodebuild`'s `-enableThreadSanitizer`.

### `enable-undefined-behavior-sanitizer`

Whether the undefined behavior sanitizer should be enabled. See also `xcodebuild`'s `-enableUndefinedBehaviorSanitizer`.

### `result-bundle-path`

The path that should be used for the result bundle. See also `xcodebuild`'s `-resultBundlePath`.

### `result-bundle-version`

The version that should be used for the result bundle. See also `xcodebuild`'s `-resultBundleVersion`.

### `cloned-source-packages-path`

The path that should be used for the cloning of remote packages. See also `xcodebuild`'s `-clonedSourcePackagesDirPath`.

### `derived-data-path`

The path that should be used for derived data. See also `xcdodebuild`'s `-derivedDataPath`.

### `xcroot`

The path to a .xcroot to use for building and/or testing. See also `xcodebuild`'s `-xcroot`.

### `xctestrun`

The path to a test run specification. See also `xcodebuild`'s `-xctestrun`.

### `test-plan`

The name of the test plan associated with the scheme to use for testing. See also `xcodebuild`'s `-testPlan`.

### `only-testing`

A list of tests to run. This can be multiline list of test identifiers. See also `xcodebuild`'s `-only-testing`.

### `skip-testing`

A list of tests to skip. This can be multiline list of test identifiers. See also `xcodebuild`'s `-only-testing`.

### `skip-unavailable-actions`

Whether unavailable actions should be skipped instead of failing the execution. See also `xcodebuild`'s `-skipUnavailableActions`.

### `allow-provisioning-updates`

Whether provisioning updates are allowed. See also `xcodebuild`'s `-allowProvisioningUpdates`.

### `allow-provisioning-device-registration`

Whether provisioning device registrations are allowed. See also `xcodebuild`'s `-allowProvisioningDeviceRegistration`.

### `build-settings`

Arbitrary, space separated build settings (e.g. `PLATFORM_NAME=iphonesimulator`).

### `action`

The action to perform (e.g. build, test, ...). Can also contain multiple actions.<br/>
Default: `test`

### `use-xcpretty`

Whether the output of `xcodebuild` should be forwarded to `xcpretty`.<br/>
Default: `true`

### `xcpretty-colored-output`

Whether `xcpretty` should use colored output (e.g. `xcpretty --color`).<br/>
Default: `true`


## Outputs

### `unprocessed-command`

The unprocessed command from which the executed command was resolved. E.g. paths are not resolved in this one.

### `executed-command`

The command that was executed by this action. This will also be printed to the action output.


## Example Usage

Use the following snippet when you want to run tests configured with the `MyApp` scheme inside a `MyApp` Xcode project:
```yaml
uses: sersoft-gmbh/xcodebuild-action@v2
with:
  project: MyApp.xcodeproj
  scheme: MyApp
  destination: platform=macOS
  action: test
```
