import * as path from "path";
import { writeJson } from "./file";

export async function cacheResources(pathPrefix: string, resources: any) {
  const filePath = path.join(".", ".cache", pathPrefix);
  return writeJson(filePath, resources);
}
