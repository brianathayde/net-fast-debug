# .NET Fast Debug

A minimal VS Code extension for starting and debugging .NET projects directly from a `.csproj` file.

Right-click a `.csproj` file and select `.NET Fast Debug` > `Debug in New Terminal`.

## Features

- Builds the selected project in `Debug` configuration.
- Finds the generated `.dll` under `bin/Debug`.
- Starts the application with the VS Code `coreclr` debugger.
- Uses the integrated terminal as the application console.
- Creates or updates a `.vscode/tasks.json` build task.
- Uses that task as `preLaunchTask`, so restarting the debugger rebuilds the project first.

## Requirements

This extension depends on the official C# extension (`ms-dotnettools.csharp`), which provides the `coreclr` debugger.

You also need the .NET SDK available in your terminal path.

## Usage

1. Open a workspace that contains a .NET project.
2. Right-click a `.csproj` file in the Explorer.
3. Select `.NET Fast Debug` > `Debug in New Terminal`.

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
