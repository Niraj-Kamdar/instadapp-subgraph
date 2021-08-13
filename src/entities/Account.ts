import { InstaAccount as InstaAccountContract } from "./../../generated/InstaIndex/InstaAccount";
import { InstaAccount as InstaAccountMapping } from "../../generated/templates";
import {
  Account,
  Owner,
  AccountOwnerList,
  AccountOwner,
  Version
} from "./../../generated/schema";
import { Address, BigInt, log } from "@graphprotocol/graph-ts";

export function createAccount(
  address: Address,
  accountNumber: BigInt,
  instaListAddress: Address,
  createdAt: BigInt
): void {
  let instaAccountContract = InstaAccountContract.bind(address);
  let accountVersionResult = instaAccountContract.try_version();
  if (accountVersionResult.reverted) {
    log.critical("version() call got reverted for account: {}!", [
      address.toHex()
    ]);
    return;
  }
  let accountVersion: BigInt = accountVersionResult.value;
  let dbVersion = Version.load(accountVersion.toString());
  if (!dbVersion) {
    log.critical("Version {} doesn't exist!", [accountVersion.toString()]);
    return;
  }

  InstaAccountMapping.create(address);

  let dbAccount = new Account(address.toHex());
  dbAccount.accountNumber = accountNumber;
  dbAccount.instaList = instaListAddress.toHex();
  dbAccount.version = dbVersion.id;
  dbAccount.createdAt = createdAt;
  dbAccount.save();
}

export function ensureOwner(address: Address): void {
  let dbOwner = Owner.load(address.toHex());
  if (dbOwner) return;

  dbOwner = new Owner(address.toHex());
  dbOwner.save();
}

export function ensureAccountOwnerList(
  accountAddress: Address,
  ownerAddress: Address
): AccountOwnerList {
  let accountOwnerListId = accountAddress.toHex() + "-" + ownerAddress.toHex();
  let dbAccountOwnerList = AccountOwnerList.load(accountOwnerListId);
  if (!dbAccountOwnerList) {
    dbAccountOwnerList = new AccountOwnerList(accountOwnerListId);
    dbAccountOwnerList.account = accountAddress.toHex();
    dbAccountOwnerList.owner = ownerAddress.toHex();
    dbAccountOwnerList.latestVersion = BigInt.fromString("0");
    dbAccountOwnerList.save();
  }
  return dbAccountOwnerList as AccountOwnerList;
}

export function increaseAccountOwnerLatestVersion(
  accountAddress: Address,
  ownerAddress: Address
): BigInt {
  let dbAccountOwnerList: AccountOwnerList = ensureAccountOwnerList(
    accountAddress,
    ownerAddress
  );
  dbAccountOwnerList.latestVersion = dbAccountOwnerList.latestVersion.plus(
    BigInt.fromString("1")
  );
  dbAccountOwnerList.save();
  return dbAccountOwnerList.latestVersion;
}

export function upsertAccountOwner(
  accountAddress: Address,
  ownerAddress: Address,
  createdAt: BigInt
): string {
  let version: BigInt = increaseAccountOwnerLatestVersion(
    accountAddress,
    ownerAddress
  );

  let accountOwnerListId = accountAddress.toHex() + "-" + ownerAddress.toHex();
  let accountOwnerId: string =
    accountAddress.toHex() +
    "-" +
    ownerAddress.toHex() +
    "-" +
    version.toString();
  let dbAccountOwner = new AccountOwner(accountOwnerId);
  dbAccountOwner.version = version;
  dbAccountOwner.createdAt = createdAt;
  dbAccountOwner.accountOwnerList = accountOwnerListId;
  dbAccountOwner.save();

  if (dbAccountOwner.version != BigInt.fromString("1")) {
    let oldVersion: BigInt = version.minus(BigInt.fromString("1"));
    let oldAccountOwnerId: string =
      accountAddress.toHex() +
      "-" +
      ownerAddress.toHex() +
      "-" +
      oldVersion.toString();
    let dbOldAccountOwner = AccountOwner.load(oldAccountOwnerId);
    dbOldAccountOwner.deletedAt = createdAt;
    dbOldAccountOwner.save();
  }
  return accountOwnerId;
}

export function deleteAccountOwner(
  accountAddress: Address,
  ownerAddress: Address,
  deletedAt: BigInt
): string {
  let dbAccountOwnerList: AccountOwnerList = ensureAccountOwnerList(
    accountAddress,
    ownerAddress
  );
  let accountOwnerId: string =
    accountAddress.toHex() +
    "-" +
    ownerAddress.toHex() +
    "-" +
    dbAccountOwnerList.latestVersion.toString();
  let dbAccountOwner = AccountOwner.load(accountOwnerId);
  dbAccountOwner.deletedAt = deletedAt;
  dbAccountOwner.save();
  return accountOwnerId;
}
