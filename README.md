# Xcodebuild Action

![Master Deploy](https://github.com/sersoft-gmbh/xcodebuild-action/workflows/Master%20Deploy/badge.svg)

This action runs `xcodebuild` with the given options.

Note that this action needs to run on macOS. All other platforms will fail!

## Inputs

### `workspace`

The path to the xcworkspace to build. Mutually exclusive with `project`. Either `workspace` or `project` must be set.

### `project`

The path to the xcodeproj to build. Mutually exclusive with `workspace`. Either `workspace` or `project` must be set.

### `scheme`

The scheme to build. Required when using a workspace.

### `destination`

The destination specifier to build.

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
