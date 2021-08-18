import { Version } from "./../../generated/schema";
import { Address, BigInt, log } from "@graphprotocol/graph-ts";
import { createInstaAccount } from "./InstaAccount";
import { createInstaConnectorProxy } from "./InstaConnector";

export function updateCheckAddress(
  version: string,
  checkAddress: Address
): void {
  let dbVersion = Version.load(version);
  if (!dbVersion) {
    log.critical("Version {} doesn't exists!", [version]);
    return;
  }
  dbVersion.check = checkAddress;
  dbVersion.save();
}

export function createVersion(
  version: string,
  instaIndexAddress: Address,
  instaAccountAddress: Address,
  instaConnectorAddress: Address,
  checkAddress: Address,
  createdAt: BigInt
): void {
  createInstaAccount(instaAccountAddress, version, createdAt);
  createInstaConnectorProxy(instaConnectorAddress, version, createdAt);

  let dbVersion = new Version(version);
  dbVersion.instaAccount = instaAccountAddress.toHex();
  dbVersion.instaConnectorProxy = instaConnectorAddress.toHex();
  dbVersion.check = checkAddress;
  dbVersion.instaIndex = instaIndexAddress.toHex();
  dbVersion.createdAt = createdAt;
  dbVersion.save();
}
