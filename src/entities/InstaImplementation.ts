import { ZERO_ADDRESS } from "./../config";
import { InstaImplementation } from "./../../generated/schema";
import { Address, BigInt, log } from "@graphprotocol/graph-ts";

let zeroAddress: Address = Address.fromString(ZERO_ADDRESS);

export function ensureInstaImplementation(
  address: Address,
  createdAt: BigInt,
  accountAddress: Address = zeroAddress
): void {
  let dbInstaImplementation = InstaImplementation.load(address.toHex());
  if (!dbInstaImplementation) {
    dbInstaImplementation = new InstaImplementation(address.toHex());
    dbInstaImplementation.createdAt = createdAt;
  }
  if (accountAddress != zeroAddress) {
    dbInstaImplementation.instaAccount = accountAddress.toHex();
  }
  dbInstaImplementation.save();
}

export function updateDefaultImplementation(
  address: Address,
  defaultImplementationAddress: Address
): void {
  let dbInstaImplementation = InstaImplementation.load(address.toHex());
  if (!dbInstaImplementation) {
    log.critical("InstaImplementation doesn't exist at {}!", [address.toHex()]);
    return;
  }
  dbInstaImplementation.defaultImplementation = defaultImplementationAddress;
  dbInstaImplementation.save();
}
