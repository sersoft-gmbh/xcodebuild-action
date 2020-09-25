# Xcodebuild Action

![Master Deploy](https://github.com/sersoft-gmbh/xcodebuild-action/workflows/Master%20Deploy/badge.svg)

This action runs `xcodebuild` with the given options.

Note that this action needs to run on macOS. All other platforms will fail!

## Inputs

### `workspace`

The path to the xcworkspace to build. Mutually exclusive with `project` and `spm-package`.  Either `workspace`, `project` or `spm-package` must be set.

### `project`

The path to the xcodeproj to build. Mutually exclusive with `workspace` and `spm-package`.  Either `workspace`, `project` or `spm-package` must be set.

### `spm-package`

The path to the SPM package (folder containing `Package.swift`) to build. Mutually exclusive with `project` and `workspace`. Either `workspace`, `project` or `spm-package` must be set.

### `scheme`

The scheme to build. Required when using a workspace or SPM package.

### `destination`

The destination specifier to build.

### `configuration`

The configuration to build.

### `sdk`

The SDK to use for building.

### `skip-testing`

A list of tests to skip.

### `build-settings`

Arbitrary, space separated build settings (e.g. `PLATFORM_NAME=iphonesimulator`).

### `derived-data-path`

Override the folder that should be used for derived data

### `action`

The action to perform (e.g. build, test, ...).<br/>
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
