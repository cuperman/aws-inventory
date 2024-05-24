import { GlobalResourceMap } from "./resources";

export async function printMarkdown(resourceMap: GlobalResourceMap) {
  for (const [region, resources] of Object.entries(resourceMap)) {
    console.log(`# ${region}`);
    console.log("");
    console.log("```mermaid");
    console.log("flowchart LR;");

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
          console.log(`    ${subnet.VpcId} --- ${subnet.SubnetId}`);
        }
      });
    }

    if (resources.networkInterfaces) {
      resources.networkInterfaces.forEach((networkInterface) => {
        if (networkInterface) {
          // entity
          if (networkInterface.Description && networkInterface.Association?.PublicIp) {
            console.log(
              `    ${networkInterface.NetworkInterfaceId}["${networkInterface.Description}\n${networkInterface.NetworkInterfaceId}\n${networkInterface.Association.PublicIp}"]`
            );
          } else if (networkInterface.Description) {
            console.log(
              `    ${networkInterface.NetworkInterfaceId}["${networkInterface.Description}\n${networkInterface.NetworkInterfaceId}"]`
            );
          } else if (networkInterface.Association?.PublicIp) {
            console.log(
              `    ${networkInterface.NetworkInterfaceId}["${networkInterface.NetworkInterfaceId}\n${networkInterface.Association?.PublicIp}"]`
            );
          }

          // relationships
          console.log(`     ${networkInterface.SubnetId} --- ${networkInterface.NetworkInterfaceId}`);
          if (networkInterface.Attachment?.InstanceId) {
            console.log(`     ${networkInterface.NetworkInterfaceId} --- ${networkInterface.Attachment.InstanceId}`);
          }
        }
      });
    }

    if (resources.natGateways) {
      resources.natGateways.forEach((natGateway) => {
        if (natGateway) {
          console.log(`    ${natGateway.NatGatewayId}`);

          if (natGateway.NatGatewayAddresses?.length) {
            natGateway.NatGatewayAddresses.forEach((address) => {
              console.log(`    ${address.NetworkInterfaceId} --- ${natGateway.NatGatewayId}`);
            });
          }
        }
      });
    }

    if (resources.instances) {
      resources.instances.forEach((instance) => {
        const nameTag = instance.Tags?.find((tag) => tag.Key === "Name")?.Value;

        if (nameTag) {
          console.log(`    ${instance.InstanceId}["${nameTag}\n${instance.InstanceId}\n${instance.InstanceType}"]`);
        }
      });
    }

    if (resources.vpcEndpoints) {
      resources.vpcEndpoints?.forEach((vpcEndpoint) => {
        if (vpcEndpoint && vpcEndpoint.NetworkInterfaceIds?.length) {
          vpcEndpoint.NetworkInterfaceIds.forEach((networkInterfaceId) => {
            console.log(`    ${networkInterfaceId} --- ${vpcEndpoint.VpcEndpointId}`);
          });
        }
      });
    }

    console.log("```");
    console.log("");
  }
}
