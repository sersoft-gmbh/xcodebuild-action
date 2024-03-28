# Xcodebuild Action

[![Tests](https://github.com/sersoft-gmbh/xcodebuild-action/actions/workflows/tests.yml/badge.svg)](https://github.com/sersoft-gmbh/xcodebuild-action/actions/workflows/tests.yml)

This action runs `xcodebuild` with the given options.

Note that this action needs to run on macOS. All other platforms will fail!

## Inputs

See [action.yml](action.yml) for an overview of all inputs.<br/>
For more information about the various inputs, also see `man xcodebuild`.

**Notes:**
-  If you are missing an input, you can pass them in the `build-settings` input. These will be passed along to `xcodebuild` as is.
-  If an enum input validation fails because you use a value that isn't yet known to this action, set `disable-enum-validation` to `true`.

## Outputs

### `unprocessed-command`

The unprocessed command from which the executed command was resolved. E.g. paths are not resolved in this one.

### `executed-command`

The command that was executed by this action. This will also be printed to the action output.

## Example Usage

<details>
<summary>Example using a Swift Package</summary>

**Note:** If you have multiple products in your package, Xcode will auto-generate a `my-tool-Package` scheme, where `my-tool` is the name of your package. If you only have one product, or wish to only build a specific product, you can use the product name as scheme directly.

```yaml
uses: sersoft-gmbh/xcodebuild-action@v3
with:
  spm-package: './'
  scheme: my-tool-Package
  destination: platform=macOS
  action: test
```
</details>

<details>
<summary>Example using an Xcode project (<code>xcodeproj</code>)</summary>

This will run tests configured with the `MyApp` scheme inside a `MyApp` Xcode project.

```yaml
uses: sersoft-gmbh/xcodebuild-action@v3
with:
  project: MyApp.xcodeproj
  scheme: MyApp
  destination: platform=macOS
  action: test
```
</details>

<details>
<summary>Example using an Xcode workspace (<code>xcworkspace</code>)</summary>

This will run tests configured with the `MyApp` scheme inside a `MyApp` Xcode workspace.

**Note for CocoaPods:** Restoring the CocoaPods dependencies has to be done before running this action.

```yaml
uses: sersoft-gmbh/xcodebuild-action@v3
with:
  workspace: MyApp.xcworkspace
  scheme: MyApp
  destination: platform=macOS
  action: test
```
</details>
