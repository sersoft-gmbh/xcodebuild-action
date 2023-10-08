# <img src="https://avatars.githubusercontent.com/u/17783361?s=48&amp;v=4" width="24" height="24"> Xcodebuild Action

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

## Compatibility Projects:

You can run this action with these dependency managers:
|   Type             |   Status   |
|--------------------|:------------:|
|   CocoaPods        |   ✅       |
|   Swift Package Manager | ✅  |

> If you are not using a dependency manager, you can still utilize this action ✅.<br>

## Action attribute
The action to perform (e.g. build, test, ...). Can also contain multiple actions, for default is **test**

| Action   | Description                                                                                                  |
|----------|--------------------------------------------------------------------------------------------------------------|
| build    | This action is used to compile the project. It generates the necessary binary files for the application.  |
| test     | The "test" action is used to execute tests in the project, ensuring the code functions correctly.  |

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
<details>
<summary>Example for CocoaPods:</summary>
  
> If the CocoaPods dependencies are already present in the repository, you don't need to do anything except passing the workspace

```yaml
uses: sersoft-gmbh/xcodebuild-action@v3
with:
  workspace: MyApp.xcworkspace
  scheme: MyApp
  destination: platform=macOS
  action: test
```
</details>


