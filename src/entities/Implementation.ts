import { Implementation } from "./../../generated/schema";
import { Address, BigInt, Bytes, log } from "@graphprotocol/graph-ts";
import { createSignature } from "./Signature";

export function createImplementation(
  address: Address,
  instaImplementationAddress: Address,
  signatures: Array<Bytes>,
  createdAt: BigInt
): void {
  for (let i = 0; i < signatures.length; i++) {
    createSignature(signatures[i], address);
  }

  let dbImplementation = new Implementation(address.toHex());
  dbImplementation.totalSignatures = signatures.length;
  dbImplementation.instaImplementation = instaImplementationAddress.toHex();
  dbImplementation.createdAt = createdAt;
  dbImplementation.save();
}

export function deleteImplementation(
  address: Address,
  deletedAt: BigInt
): void {
  let dbImplementation = Implementation.load(address.toHex());
  if (!dbImplementation) {
    log.critical("Implementation doesn't exist at {}!", [address.toHex()]);
    return;
  }
  dbImplementation.deletedAt = deletedAt;
  dbImplementation.save();
}
