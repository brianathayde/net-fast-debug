import * as childProcess from 'child_process';
import * as path from 'path';
import * as util from 'util';
import { findFiles, findNewestFile } from '../utils/fileSearch';
import { readProjectMetadata } from './projectMetadata';

const execFile = util.promisify(childProcess.execFile);

export type BuildOutput = {
  dllPath: string;
  targetFramework: string;
};

export async function resolveBuildOutput(csprojPath: string): Promise<BuildOutput> {
  const metadata = await readProjectMetadata(csprojPath);

  if (metadata.targetFramework) {
    return {
      dllPath: path.join(
        path.dirname(csprojPath),
        'bin',
        'Debug',
        metadata.targetFramework,
        `${metadata.assemblyName}.dll`
      ),
      targetFramework: metadata.targetFramework
    };
  }

  await execFile('dotnet', ['build', csprojPath, '--configuration', 'Debug', '--nologo']);
  return findBuildOutput(csprojPath);
}

async function findBuildOutput(csprojPath: string): Promise<BuildOutput> {
  const projectDir = path.dirname(csprojPath);
  const { assemblyName } = await readProjectMetadata(csprojPath);
  const debugDir = path.join(projectDir, 'bin', 'Debug');

  const dlls = await findFiles(debugDir, `${assemblyName}.dll`);
  const launchDlls = dlls.filter((dll) => !dll.includes(`${path.sep}ref${path.sep}`));

  if (launchDlls.length === 0) {
    throw new Error(`Could not find ${assemblyName}.dll under bin/Debug after the build.`);
  }

  const newestDll = await findNewestFile(launchDlls);

  return {
    dllPath: newestDll,
    targetFramework: path.basename(path.dirname(newestDll))
  };
}
