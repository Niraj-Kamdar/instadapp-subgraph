import { Address, BigInt } from "@graphprotocol/graph-ts";
import { InstaConnectors as InstaConnectorsMapping } from "../../generated/templates";
import { InstaConnectors } from "../../generated/schema";

export function createInstaConnectors(
  address: Address,
  version: string,
  createdAt: BigInt
): void {
  InstaConnectorsMapping.create(address);

  let dbInstaConnectors = new InstaConnectors(address.toHex());
  dbInstaConnectors.totalChiefs = BigInt.fromString("0");
  dbInstaConnectors.totalActiveChiefs = BigInt.fromString("0");
  dbInstaConnectors.totalConnectors = BigInt.fromString("0");
  dbInstaConnectors.totalActiveConnectors = BigInt.fromString("0");
  dbInstaConnectors.version = version;
  dbInstaConnectors.createdAt = createdAt;
  dbInstaConnectors.save();
}
