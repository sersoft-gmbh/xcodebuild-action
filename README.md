# Xcodebuild Action

![Master Deploy](https://github.com/sersoft-gmbh/xcodebuild-action/workflows/Master%20Deploy/badge.svg)

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

### `enable-code-coverage`

If `true`, code coverage is enabled while testing. See also `xcodebuild`'s `-enableCodeCoverage`.

### `parallel-testing-enabled`

If `true`, tests are executed in parallel. See also `xcodebuild`'s `-parallel-testing-enabled`.

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

### `derived-data-path`

Override the folder that should be used for derived data

### `skip-testing`

A list of tests to skip.

### `skip-unavailable-actions`

Whether unavailable actions should be skipped instead of failing the execution. See also `xcodebuild`'s `-skipUnavailableActions`.

### `build-settings`

Arbitrary, space separated build settings (e.g. `PLATFORM_NAME=iphonesimulator`).

### `action`

The action to perform (e.g. build, test, ...). Can also contain multiple actions.<br/>
Default: `test`

### `use-xcpretty`

Whether the output of `xcodebuild` should be forwarded to `xcpretty`.<br/>
Default: `true`

## Example Usage

Use the following snippet when you want to run tests configured with the `MyApp` scheme inside a `MyApp` Xcode project:
```yaml
uses: sersoft-gmbh/xcodebuild-action@v1
with:
  project: MyApp.xcodeproj
  scheme: MyApp
  destination: platform=macOS
  action: test
```
