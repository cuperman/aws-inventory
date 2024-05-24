import * as ec2 from "@aws-sdk/client-ec2";

export async function describeRegions(): Promise<ec2.Region[]> {
  const client = new ec2.EC2Client({});
  const command = new ec2.DescribeRegionsCommand({});
  const result = await client.send(command);

  if (result.Regions === undefined) {
    throw new Error("Regions undefined");
  }

  return result.Regions;
}

export async function describeInstances(region: string): Promise<ec2.Instance[]> {
  const client = new ec2.EC2Client({ region });
  const paginator = ec2.paginateDescribeInstances({ client }, {});

  const instances: ec2.Instance[] = [];

  for await (const page of paginator) {
    page.Reservations?.forEach((reservation) => {
      reservation.Instances && instances.push(...reservation.Instances);
    });
  }

  return instances;
}

export async function describeVpcs(region: string): Promise<ec2.Vpc[]> {
  const client = new ec2.EC2Client({ region });
  const paginator = ec2.paginateDescribeVpcs({ client }, {});

  const vpcs: ec2.Vpc[] = [];

  for await (const page of paginator) {
    page.Vpcs && vpcs.push(...page.Vpcs);
  }

  return vpcs;
}

export async function describeSubnets(region: string): Promise<ec2.Subnet[]> {
  const client = new ec2.EC2Client({ region });
  const paginator = ec2.paginateDescribeSubnets({ client }, {});

  const subnets: ec2.Subnet[] = [];

  for await (const page of paginator) {
    page.Subnets && subnets.push(...page.Subnets);
  }

  return subnets;
}

export async function describeNatGateways(region: string): Promise<ec2.NatGateway[]> {
  const client = new ec2.EC2Client({ region });
  const paginator = ec2.paginateDescribeNatGateways({ client }, {});

  const natGateways: ec2.NatGateway[] = [];

  for await (const page of paginator) {
    page.NatGateways && natGateways.push(...page.NatGateways);
  }

  return natGateways;
}

export async function describeNetworkInterfaces(region: string): Promise<ec2.NetworkInterface[]> {
  const client = new ec2.EC2Client({ region });
  const paginator = ec2.paginateDescribeNetworkInterfaces({ client }, {});

  const networkInterfaces: ec2.NetworkInterface[] = [];

  for await (const page of paginator) {
    page.NetworkInterfaces && networkInterfaces.push(...page.NetworkInterfaces);
  }

  return networkInterfaces;
}
