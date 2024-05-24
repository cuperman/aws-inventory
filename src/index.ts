import { cacheResources } from "./cache";
import { printMarkdown } from "./markdown";
import { fetchAllResources } from "./resources";

async function main() {
  const globalResourceMap = await fetchAllResources();

  for await (const [regionName, resourceMap] of Object.entries(globalResourceMap)) {
    for await (const [resourceName, resources] of Object.entries(resourceMap)) {
      if (resources.length) {
        await cacheResources(`${regionName}/${resourceName}.json`, resources);
      }
    }
  }

  await printMarkdown(globalResourceMap);
}

main()
  .then(() => {
    console.error("Done.");
    process.exit(0);
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
