import { Address, BigInt, log } from "@graphprotocol/graph-ts";
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

export function increaseTotalChiefs(address: Address): BigInt {
  let totalChiefs: BigInt = BigInt.fromString("-1");
  let instaConnectors = InstaConnectors.load(address.toHex());
  if (!instaConnectors) {
    log.critical("InstaConnectors doesn't exist at {}!", [address.toHex()]);
    return totalChiefs;
  }
  instaConnectors.totalChiefs = instaConnectors.totalChiefs.plus(
    BigInt.fromString("1")
  );
  instaConnectors.save();
  return instaConnectors.totalChiefs;
}

export function increaseActiveChiefs(address: Address): BigInt {
  let activeChiefs: BigInt = BigInt.fromString("-1");
  let instaConnectors = InstaConnectors.load(address.toHex());
  if (!instaConnectors) {
    log.critical("InstaConnectors doesn't exist at {}!", [address.toHex()]);
    return activeChiefs;
  }
  instaConnectors.totalActiveChiefs = instaConnectors.totalActiveChiefs.plus(
    BigInt.fromString("1")
  );
  instaConnectors.save();
  return instaConnectors.totalActiveChiefs;
}

export function decreaseActiveChiefs(address: Address): BigInt {
  let activeChiefs: BigInt = BigInt.fromString("-1");
  let instaConnectors = InstaConnectors.load(address.toHex());
  if (!instaConnectors) {
    log.critical("InstaConnectors doesn't exist at {}!", [address.toHex()]);
    return activeChiefs;
  }
  instaConnectors.totalActiveChiefs = instaConnectors.totalActiveChiefs.minus(
    BigInt.fromString("1")
  );
  instaConnectors.save();
  return instaConnectors.totalActiveChiefs;
}

export function increaseTotalConnectors(address: Address): BigInt {
  let totalConnectors: BigInt = BigInt.fromString("-1");
  let instaConnectors = InstaConnectors.load(address.toHex());
  if (!instaConnectors) {
    log.critical("InstaConnectors doesn't exist at {}!", [address.toHex()]);
    return totalConnectors;
  }
  instaConnectors.totalConnectors = instaConnectors.totalConnectors.plus(
    BigInt.fromString("1")
  );
  instaConnectors.save();
  return instaConnectors.totalConnectors;
}

export function increaseActiveConnectors(address: Address): BigInt {
  let activeConnectors: BigInt = BigInt.fromString("-1");
  let instaConnectors = InstaConnectors.load(address.toHex());
  if (!instaConnectors) {
    log.critical("InstaConnectors doesn't exist at {}!", [address.toHex()]);
    return activeConnectors;
  }
  instaConnectors.totalActiveConnectors = instaConnectors.totalActiveConnectors.plus(
    BigInt.fromString("1")
  );
  instaConnectors.save();
  return instaConnectors.totalActiveConnectors;
}

export function decreaseActiveConnectors(address: Address): BigInt {
  let activeConnectors: BigInt = BigInt.fromString("-1");
  let instaConnectors = InstaConnectors.load(address.toHex());
  if (!instaConnectors) {
    log.critical("InstaConnectors doesn't exist at {}!", [address.toHex()]);
    return activeConnectors;
  }
  instaConnectors.totalActiveConnectors = instaConnectors.totalActiveConnectors.minus(
    BigInt.fromString("1")
  );
  instaConnectors.save();
  return instaConnectors.totalActiveConnectors;
}
