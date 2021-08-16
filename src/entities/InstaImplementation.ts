import { InstaImplementation } from "./../../generated/schema";
import { Address, BigInt, log } from "@graphprotocol/graph-ts";

export function createInstaImplementation(
  address: Address,
  accountAddress: Address,
  createdAt: BigInt
): void {
  let dbInstaImplementation = new InstaImplementation(address.toHex());
  dbInstaImplementation.instaAccount = accountAddress.toHex();
  dbInstaImplementation.createdAt = createdAt;
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
