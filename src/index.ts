import * as ec2 from "@aws-sdk/client-ec2";

import * as aws from "./aws";
import * as file from "./file";

interface RegionalResourceMap {
  vpcs?: ec2.Vpc[];
  subnets?: ec2.Subnet[];
  networkInterfaces?: ec2.NetworkInterface[];
}

type GlobalResourceMap = { [region: string]: RegionalResourceMap };

async function main() {
  const regions = await aws.describeRegions();
  await file.writeJson("./.cache/global/ec2/regions.json", regions);

  const resourceMap: GlobalResourceMap = {};

  await Promise.all(
    regions.map(async (region) => {
      if (!region.RegionName) {
        throw new Error(`region has no name: ${JSON.stringify(region)}`);
      }

      const regionName = region.RegionName;
      resourceMap[regionName] = {};

      const vpcs = await aws.describeVpcs(regionName);
      resourceMap[regionName]["vpcs"] = vpcs;
      await file.writeJson(`./.cache/${regionName}/ec2/vpcs.json`, vpcs);

      const subnets = await aws.describeSubnets(regionName);
      resourceMap[regionName]["subnets"] = subnets;
      await file.writeJson(`./.cache/${regionName}/ec2/subnets.json`, subnets);

      const networkInterfaces = await aws.describeNetworkInterfaces(regionName);
      resourceMap[regionName]["networkInterfaces"] = networkInterfaces;
      await file.writeJson(`./.cache/${regionName}/ec2/networkInterfaces.json`, networkInterfaces);

      const instances = await aws.describeInstances(regionName);
      await file.writeJson(`./.cache/${regionName}/ec2/instances.json`, instances);
    })
  );

  for (const [region, resources] of Object.entries(resourceMap)) {
    console.log(`# ${region}`);
    console.log("");
    console.log("```mermaid");
    console.log("flowchart RL;");

    // console.log(`  subgraph ${regionName}`);

    if (resources.vpcs) {
      resources.vpcs.forEach((vpc) => {
        if (vpc) {
          console.log(`    ${vpc.VpcId}`);

          if (vpc.IsDefault) {
            console.log(`    ${vpc.VpcId}["${vpc.VpcId} (DEFAULT)"]`);
          }
        }
      });
    }

    if (resources.subnets) {
      resources.subnets.forEach((subnet) => {
        if (subnet) {
          console.log(`    ${subnet.SubnetId} --- ${subnet.VpcId}`);
        }
      });
    }

    if (resources.networkInterfaces) {
      resources.networkInterfaces.forEach((networkInterface) => {
        if (networkInterface) {
          if (networkInterface.Description) {
            console.log(`    ${networkInterface.NetworkInterfaceId}["${networkInterface.Description}"]`);
          } else if (networkInterface.Attachment?.InstanceId) {
            console.log(
              `    ${networkInterface.NetworkInterfaceId}["Instance/${networkInterface.Attachment.InstanceId}"]`
            );
          }

          console.log(`    ${networkInterface.NetworkInterfaceId} --- ${networkInterface.SubnetId}`);
        }
      });
    }

    // console.log("  end");
    console.log("```");
    console.log("");
  }
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
