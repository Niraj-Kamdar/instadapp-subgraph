import { ZERO_ADDRESS } from "./../config";
import { Address, BigInt, log } from "@graphprotocol/graph-ts";
import { InstaIndex } from "../../generated/schema";
import { InstaIndex as InstaIndexContract } from "../../generated/InstaIndex/InstaIndex";
import { createInstaList } from "./InstaList";
import { createVersion } from "./Version";

export function ensureInstaIndex(
  instaIndexAddress: Address,
  createdAt: BigInt
): void {
  let dbInstaIndex = InstaIndex.load(instaIndexAddress.toHex());
  if(!dbInstaIndex){
    let contract = InstaIndexContract.bind(instaIndexAddress);
    let masterResult = contract.try_master();
    if (masterResult.reverted) {
      log.critical("master() call (address) reverted for {}!", [
        instaIndexAddress.toHex()
      ]);
    }
    let instaListResult = contract.try_list();
    if (instaListResult.reverted) {
      log.critical("list() call (address) reverted for {}!", [
        instaIndexAddress.toHex()
      ]);
    }
    let instaAccountResult = contract.try_account(BigInt.fromString("1"));
    if (instaAccountResult.reverted) {
      log.critical("accounts(1) call (address) reverted for {}!", [
        instaIndexAddress.toHex()
      ]);
    }
    let instaConnectorResult = contract.try_connectors(BigInt.fromString("1"));
    if (instaConnectorResult.reverted) {
      log.critical("connectors(1) call (address) reverted for {}!", [
        instaIndexAddress.toHex()
      ]);
    }
    createInstaIndex(
      instaIndexAddress,
      masterResult.value,
      instaListResult.value,
      instaAccountResult.value,
      instaConnectorResult.value,
      createdAt
    );
  }
}

export function createInstaIndex(
  instaIndexAddress: Address,
  masterAddress: Address,
  instaListAddress: Address,
  instaAccountAddress: Address,
  instaConnectorAddress: Address,
  createdAt: BigInt
): void {
  let dbInstaIndex = new InstaIndex(instaIndexAddress.toHex());
  dbInstaIndex.master = masterAddress;
  dbInstaIndex.newMaster = Address.fromString(ZERO_ADDRESS);

  createInstaList(instaListAddress, instaIndexAddress, createdAt);
  dbInstaIndex.instaList = instaListAddress.toHex();

  let latestVersion: string = "1";
  createVersion(
    latestVersion,
    instaIndexAddress,
    instaAccountAddress,
    instaConnectorAddress,
    Address.fromString(ZERO_ADDRESS),
    createdAt
  );
  dbInstaIndex.latestVersion = latestVersion;
  dbInstaIndex.createdAt = createdAt;

  dbInstaIndex.save();
}

export function updateNewMaster(
  address: Address,
  masterAddress: Address
): void {
  let instaIndex = InstaIndex.load(address.toHex());
  if (!instaIndex) {
    log.critical("InstaIndex doesn't exist at {}!", [address.toHex()]);
    return;
  }
  instaIndex.newMaster = masterAddress;
  instaIndex.save();
}

export function updateMaster(address: Address, masterAddress: Address): void {
  let instaIndex = InstaIndex.load(address.toHex());
  if (!instaIndex) {
    log.critical("InstaIndex doesn't exist at {}!", [address.toHex()]);
    return;
  }
  if (instaIndex.newMaster != masterAddress) {
    log.critical("InstaIndex newMaster isn't {}!", [masterAddress.toHex()]);
    return;
  }
  instaIndex.master = instaIndex.newMaster;
  instaIndex.newMaster = Address.fromString(ZERO_ADDRESS);
  instaIndex.save();
}

export function releaseLatestVersion(address: Address): string {
  let instaIndex = InstaIndex.load(address.toHex());
  if (!instaIndex) {
    log.critical("InstaIndex doesn't exist at {}!", [address.toHex()]);
    return "";
  }

  let latestVersion = BigInt.fromString(instaIndex.latestVersion).plus(
    BigInt.fromString("1")
  );
  instaIndex.latestVersion = latestVersion.toString();
  instaIndex.save();

  return instaIndex.latestVersion;
}

export function getInstaListAddress(address: Address): Address {
  let instaListAddress: Address = Address.fromString(ZERO_ADDRESS);
  let instaIndex = InstaIndex.load(address.toHex());
  if (!instaIndex) {
    log.critical("InstaIndex doesn't exist at {}!", [address.toHex()]);
    return instaListAddress;
  }
  return Address.fromString(instaIndex.instaList);
}
