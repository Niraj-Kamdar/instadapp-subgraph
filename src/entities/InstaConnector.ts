import { Address, BigInt, log } from "@graphprotocol/graph-ts";
import { InstaConnectorV2 as InstaConnectorV2Mapping } from "../../generated/templates";
import { InstaConnectorV1 as InstaConnectorV1Mapping } from "../../generated/templates";
import { InstaConnector } from "../../generated/schema";

export function createInstaConnector(
  address: Address,
  version: string,
  createdAt: BigInt
): void {
  if (version == "1") {
    InstaConnectorV1Mapping.create(address);
  } else {
    InstaConnectorV2Mapping.create(address);
  }

  let dbInstaConnector = new InstaConnector(address.toHex());
  dbInstaConnector.totalChiefs = BigInt.fromString("0");
  dbInstaConnector.totalActiveChiefs = BigInt.fromString("0");
  dbInstaConnector.totalConnectors = BigInt.fromString("0");
  dbInstaConnector.totalActiveConnectors = BigInt.fromString("0");
  dbInstaConnector.version = version;
  dbInstaConnector.createdAt = createdAt;
  dbInstaConnector.save();
}

export function increaseTotalChiefs(address: Address): BigInt {
  let totalChiefs: BigInt = BigInt.fromString("-1");
  let dbInstaConnector = InstaConnector.load(address.toHex());
  if (!dbInstaConnector) {
    log.critical("InstaConnector doesn't exist at {}!", [address.toHex()]);
    return totalChiefs;
  }
  dbInstaConnector.totalChiefs = dbInstaConnector.totalChiefs.plus(
    BigInt.fromString("1")
  );
  dbInstaConnector.save();
  return dbInstaConnector.totalChiefs;
}

export function increaseActiveChiefs(address: Address): BigInt {
  let activeChiefs: BigInt = BigInt.fromString("-1");
  let dbInstaConnector = InstaConnector.load(address.toHex());
  if (!dbInstaConnector) {
    log.critical("InstaConnector doesn't exist at {}!", [address.toHex()]);
    return activeChiefs;
  }
  dbInstaConnector.totalActiveChiefs = dbInstaConnector.totalActiveChiefs.plus(
    BigInt.fromString("1")
  );
  dbInstaConnector.save();
  return dbInstaConnector.totalActiveChiefs;
}

export function decreaseActiveChiefs(address: Address): BigInt {
  let activeChiefs: BigInt = BigInt.fromString("-1");
  let dbInstaConnector = InstaConnector.load(address.toHex());
  if (!dbInstaConnector) {
    log.critical("InstaConnector doesn't exist at {}!", [address.toHex()]);
    return activeChiefs;
  }
  dbInstaConnector.totalActiveChiefs = dbInstaConnector.totalActiveChiefs.minus(
    BigInt.fromString("1")
  );
  dbInstaConnector.save();
  return dbInstaConnector.totalActiveChiefs;
}

export function increaseTotalConnectors(address: Address): BigInt {
  let totalConnectors: BigInt = BigInt.fromString("-1");
  let dbInstaConnector = InstaConnector.load(address.toHex());
  if (!dbInstaConnector) {
    log.critical("InstaConnector doesn't exist at {}!", [address.toHex()]);
    return totalConnectors;
  }
  dbInstaConnector.totalConnectors = dbInstaConnector.totalConnectors.plus(
    BigInt.fromString("1")
  );
  dbInstaConnector.save();
  return dbInstaConnector.totalConnectors;
}

export function increaseActiveConnectors(address: Address): BigInt {
  let activeConnectors: BigInt = BigInt.fromString("-1");
  let dbInstaConnector = InstaConnector.load(address.toHex());
  if (!dbInstaConnector) {
    log.critical("InstaConnector doesn't exist at {}!", [address.toHex()]);
    return activeConnectors;
  }
  dbInstaConnector.totalActiveConnectors = dbInstaConnector.totalActiveConnectors.plus(
    BigInt.fromString("1")
  );
  dbInstaConnector.save();
  return dbInstaConnector.totalActiveConnectors;
}

export function decreaseActiveConnectors(address: Address): BigInt {
  let activeConnectors: BigInt = BigInt.fromString("-1");
  let dbInstaConnector = InstaConnector.load(address.toHex());
  if (!dbInstaConnector) {
    log.critical("InstaConnector doesn't exist at {}!", [address.toHex()]);
    return activeConnectors;
  }
  dbInstaConnector.totalActiveConnectors = dbInstaConnector.totalActiveConnectors.minus(
    BigInt.fromString("1")
  );
  dbInstaConnector.save();
  return dbInstaConnector.totalActiveConnectors;
}
