import { InstaImplementations } from "./../../generated/schema";
import { Address, BigInt, log } from "@graphprotocol/graph-ts";

export function createInstaImplementations(
  address: Address,
  accountAddress: Address,
  createdAt: BigInt
): void {
  let dbInstaImplementations = new InstaImplementations(address.toHex());
  dbInstaImplementations.instaAccount = accountAddress.toHex();
  dbInstaImplementations.createdAt = createdAt;
  dbInstaImplementations.save();
}

export function updateDefaultImplementation(
  address: Address,
  defaultImplementationAddress: Address
): void {
  let dbInstaImplementations = InstaImplementations.load(address.toHex());
  if (!dbInstaImplementations) {
    log.critical("InstaImplementations doesn't exist at {}!", [
      address.toHex()
    ]);
    return;
  }
  dbInstaImplementations.defaultImplementation = defaultImplementationAddress;
  dbInstaImplementations.save();
}
