import * as ec2 from "@aws-sdk/client-ec2";

import * as aws from "./aws";

export interface RegionalResourceMap {
  vpcs?: ec2.Vpc[];
  subnets?: ec2.Subnet[];
  networkInterfaces?: ec2.NetworkInterface[];
  natGateways?: ec2.NatGateway[];
  instances?: ec2.Instance[];
  vpcEndpoints?: ec2.VpcEndpoint[];
}

export type GlobalResourceMap = { [region: string]: RegionalResourceMap };

export async function fetchAllResources(): Promise<GlobalResourceMap> {
  const resourceMap: GlobalResourceMap = {};

  const regions = await aws.describeRegions();

  await Promise.all(
    regions.map(async (region) => {
      if (!region.RegionName) {
        throw new Error(`region has no name: ${JSON.stringify(region)}`);
      }

      const regionName = region.RegionName;
      resourceMap[regionName] = {};

      resourceMap[regionName]["vpcs"] = await aws.describeVpcs(regionName);
      resourceMap[regionName]["subnets"] = await aws.describeSubnets(regionName);
      resourceMap[regionName]["networkInterfaces"] = await aws.describeNetworkInterfaces(regionName);
      resourceMap[regionName]["natGateways"] = await aws.describeNatGateways(regionName);
      resourceMap[regionName]["instances"] = await aws.describeInstances(regionName);
      resourceMap[regionName]["vpcEndpoints"] = await aws.describeVpcEndpoints(regionName);
    })
  );

  return resourceMap;
}
