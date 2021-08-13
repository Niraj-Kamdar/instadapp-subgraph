import { InstaImplementations as InstaImplementationsMapping } from "./../../generated/templates";
import { Proxy } from "./../../generated/InstaIndex/Proxy";
import { InstaAccount } from "../../generated/schema";
import { Address, BigInt } from "@graphprotocol/graph-ts";
import { createInstaImplementations } from "./InstaImplementations";

export function createInstaAccount(
  address: Address,
  version: string,
  createdAt: BigInt
): void {
  // If V2 then start indexing for implementations event
  let proxy = Proxy.bind(address);
  let implementationsResult = proxy.try_implementations();
  if (!implementationsResult.reverted) {
    createInstaImplementations(implementationsResult.value, address, createdAt);
    InstaImplementationsMapping.create(implementationsResult.value);
  }
  let dbInstaAccount = new InstaAccount(address.toHex());
  dbInstaAccount.version = version;
  dbInstaAccount.createdAt = createdAt;
  dbInstaAccount.save();
}
