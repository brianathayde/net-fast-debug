import * as fs from 'fs/promises';
import * as path from 'path';

export type ProjectMetadata = {
  assemblyName: string;
  targetFramework?: string;
};

export async function readProjectMetadata(csprojPath: string): Promise<ProjectMetadata> {
  const projectName = path.basename(csprojPath, '.csproj');
  const content = await fs.readFile(csprojPath, 'utf8');
  const assemblyName = content.match(/<AssemblyName>\s*([^<]+?)\s*<\/AssemblyName>/i)?.[1]?.trim();
  const targetFramework = content.match(/<TargetFramework>\s*([^<]+?)\s*<\/TargetFramework>/i)?.[1]?.trim();
  const targetFrameworks = content.match(/<TargetFrameworks>\s*([^<]+?)\s*<\/TargetFrameworks>/i)?.[1]?.trim();

  return {
    assemblyName: assemblyName || projectName,
    targetFramework: targetFramework || targetFrameworks?.split(';')[0]?.trim()
  };
}
