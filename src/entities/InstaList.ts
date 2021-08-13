import { Address, BigInt, log } from "@graphprotocol/graph-ts";
import { InstaList } from "../../generated/schema";

export function createInstaList(
  instaListAddress: Address,
  instaIndexAddress: Address,
  createdAt: BigInt
): void {
  let dbInstaList = new InstaList(instaListAddress.toHex());
  dbInstaList.instaIndex = instaIndexAddress.toHex();
  dbInstaList.totalAccounts = BigInt.fromString("0");
  dbInstaList.createdAt = createdAt;
  dbInstaList.save();
}

export function increaseTotalAccounts(address: Address): BigInt {
  let totalAccounts: BigInt = BigInt.fromString("-1");
  let instaList = InstaList.load(address.toHex());
  if (!instaList) {
    log.critical("InstaList doesn't exist at {}!", [address.toHex()]);
    return totalAccounts;
  }
  instaList.totalAccounts = instaList.totalAccounts.plus(
    BigInt.fromString("1")
  );
  instaList.save();
  return instaList.totalAccounts;
}
