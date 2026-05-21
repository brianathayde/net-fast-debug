import * as fs from 'fs/promises';
import * as path from 'path';

export async function findFiles(dir: string, fileName: string): Promise<string[]> {
  const entries = await fs.readdir(dir, { withFileTypes: true }).catch(() => []);
  const results: string[] = [];

  for (const entry of entries) {
    const entryPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      results.push(...(await findFiles(entryPath, fileName)));
      continue;
    }

    if (entry.isFile() && entry.name === fileName) {
      results.push(entryPath);
    }
  }

  return results;
}

export async function findNewestFile(files: string[]): Promise<string> {
  const stats = await Promise.all(
    files.map(async (file) => ({
      file,
      mtimeMs: (await fs.stat(file)).mtimeMs
    }))
  );

  return stats.sort((left, right) => right.mtimeMs - left.mtimeMs)[0].file;
}
