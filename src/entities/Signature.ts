import { Signature } from "./../../generated/schema";
import { Address, Bytes } from "@graphprotocol/graph-ts";

export function createSignature(
  signature: Bytes,
  implementationAddress: Address
): void {
  let signatureId: string =
    implementationAddress.toHex() + "-" + signature.toHex();
  let dbSignature = new Signature(signatureId);
  dbSignature.implementation = implementationAddress.toHex();
  dbSignature.signature = signature;
  dbSignature.save();
}
