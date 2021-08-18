import { Implementation as ImplementationContract } from "../../generated/InstaIndex/Implementation";
import {
  InstaAccount,
  InstaConnectorProxy,
  InstaImplementation,
  Version
} from "./../../generated/schema";
import { Address, BigInt, log } from "@graphprotocol/graph-ts";
import { InstaConnector } from "../../generated/schema";
import { ZERO_ADDRESS } from "../config";

let zeroAddress: Address = Address.fromString(ZERO_ADDRESS);

export function createInstaConnectorProxy(
  address: Address,
  version: string,
  createdAt: BigInt
): void {
  let dbInstaConnectorProxy = new InstaConnectorProxy(address.toHex());
  if (version == "1") {
    ensureInstaConnector(address, createdAt, version, address);
    dbInstaConnectorProxy.implementation = address.toHex();
  } else {
    let dbVersion = Version.load(version);
    let dbInstaAccount = InstaAccount.load(dbVersion.instaAccount);
    let dbInstaImplementation = InstaImplementation.load(
      dbInstaAccount.instaImplementation
    );
    let contract = ImplementationContract.bind(
      Address.fromString(dbInstaImplementation.id)
    );
    let connectorsM1Result = contract.try_connectorsM1();
    if (connectorsM1Result.reverted) {
      log.critical("connectorsM1() call failed at {}", [address.toHex()]);
    }
    dbInstaConnectorProxy.implementation = connectorsM1Result.value.toHex();
    ensureInstaConnector(
      connectorsM1Result.value,
      createdAt,
      dbVersion.id,
      Address.fromString(dbVersion.instaConnectorProxy)
    );
  }
  dbInstaConnectorProxy.createdAt = createdAt;
  dbInstaConnectorProxy.save();
}

export function ensureInstaConnector(
  address: Address,
  createdAt: BigInt,
  version: string = "0",
  proxyAddress: Address = zeroAddress
): void {
  let dbInstaConnector = InstaConnector.load(address.toHex());
  if (!dbInstaConnector) {
    dbInstaConnector = new InstaConnector(address.toHex());
    dbInstaConnector.totalChiefs = BigInt.fromString("0");
    dbInstaConnector.totalActiveChiefs = BigInt.fromString("0");
    dbInstaConnector.totalConnectors = BigInt.fromString("0");
    dbInstaConnector.totalActiveConnectors = BigInt.fromString("0");
    dbInstaConnector.createdAt = createdAt;
  }
  if (proxyAddress != zeroAddress) {
    dbInstaConnector.instaConnectorProxy = proxyAddress.toHex();
  }
  if (version != "0") {
    dbInstaConnector.version = version;
  }
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
