# Xcodebuild Action

[![Tests](https://github.com/sersoft-gmbh/xcodebuild-action/actions/workflows/tests.yml/badge.svg)](https://github.com/sersoft-gmbh/xcodebuild-action/actions/workflows/tests.yml)

This action runs `xcodebuild` with the given options.

Note that this action needs to run on macOS. All other platforms will fail!

## Inputs

See [action.yml](action.yml) for an overview of all inputs.

## Outputs

### `unprocessed-command`

The unprocessed command from which the executed command was resolved. E.g. paths are not resolved in this one.

### `executed-command`

The command that was executed by this action. This will also be printed to the action output.


## Example Usage

Use the following snippet when you want to run tests configured with the `MyApp` scheme inside a `MyApp` Xcode project:
```yaml
uses: sersoft-gmbh/xcodebuild-action@v3
with:
  project: MyApp.xcodeproj
  scheme: MyApp
  destination: platform=macOS
  action: test
```
