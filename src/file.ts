import * as util from "util";
import * as path from "path";
import * as fs from "fs";

export const mkdir = util.promisify(fs.mkdir);
export const writeFile = util.promisify(fs.writeFile);

export async function writeJson(filePath: string, data: any) {
  const dirPath = path.dirname(filePath);

  if (!fs.existsSync(dirPath)) {
    await mkdir(dirPath, { recursive: true });
  }

  const json = JSON.stringify(data, null, 2);

  return writeFile(filePath, json);
}
