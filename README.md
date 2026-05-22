# .NET Fast Debug

A minimal VS Code extension for starting and debugging .NET projects directly from a `.csproj` file.

Right-click a `.csproj` file and select `.NET Fast Debug` > `Debug in New Terminal`, `No Restore - Debug in Integrated Terminal`, or `No Restore + No Dependencies - Debug in Integrated Terminal`.

## Features

- Builds the selected project in `Debug` configuration.
- Includes an optional no-restore debug command for faster restarts when dependencies are already restored.
- Includes an optional no-restore plus no-dependencies debug command for the fastest restart path when referenced projects have not changed.
- Finds the generated `.dll` under `bin/Debug`.
- Starts the application with the VS Code `coreclr` debugger.
- Uses the integrated terminal as the application console.
- Creates or updates a `.vscode/tasks.json` build task.
- Uses that task as `preLaunchTask`, so restarting the debugger rebuilds the project first.

## Demo

### Start debugging from the `.csproj`

Use the Explorer context menu to launch the selected project without manually creating a `launch.json` entry.

![Demo showing how to start debugging from a .csproj file](./images/net-fast-debug-demo-01.gif)

### Reload debug and rebuild automatically

The green reload button in the VS Code debug toolbar works with the generated `preLaunchTask`, so restarting the session rebuilds the project before attaching again.

![Demo showing the debug reload button rebuilding and restarting the application](./images/net-fast-debug-demo-02.gif)

## Requirements

This extension depends on the official C# extension (`ms-dotnettools.csharp`), which provides the `coreclr` debugger.

You also need the .NET SDK available in your terminal path.

## Usage

1. Open a workspace that contains a .NET project.
2. Right-click a `.csproj` file in the Explorer.
3. Select `.NET Fast Debug` > `Debug in New Terminal` for the regular flow.
4. Select `.NET Fast Debug` > `No Restore - Debug in Integrated Terminal` when you want the pre-launch build to skip restore and reduce restart time.
5. Select `.NET Fast Debug` > `No Restore + No Dependencies - Debug in Integrated Terminal` when you also want to skip rebuilding project references that have not changed.
6. Use the debug toolbar reload button to restart the session with the same pre-launch task that was generated for that command.

## Development

This section is only for contributors or anyone who wants to run the extension from source. It is not required to use the extension after installing it in VS Code.

Install project dependencies:

```bash
npm install
```

Open this folder in VS Code and press `F5` to start an Extension Development Host.

Useful scripts:

- `npm run compile`: compile the extension.
- `npm run watch`: recompile automatically during development.
- `npm run lint`: run ESLint.
- `npm test`: compile the extension.

## Packaging

Generate a local `.vsix` package:

```bash
npm run package
```

Install the generated package manually in VS Code with:

```bash
code --install-extension dotnet-fast-debug-1.0.0.vsix
```

Publish to the Visual Studio Marketplace:

```bash
npm run publish:marketplace
```

Publishing requires a Marketplace publisher account and a Personal Access Token configured for `vsce`.
