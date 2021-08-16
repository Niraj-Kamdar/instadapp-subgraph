import { InstaImplementation as InstaImplementationMapping } from "./../../generated/templates";
import { Proxy } from "./../../generated/InstaIndex/Proxy";
import { InstaAccount } from "../../generated/schema";
import { Address, BigInt } from "@graphprotocol/graph-ts";
import { createInstaImplementation } from "./InstaImplementation";

export function createInstaAccount(
  address: Address,
  version: string,
  createdAt: BigInt
): void {
  let dbInstaAccount = new InstaAccount(address.toHex());

  // If V2 then start indexing for implementations event
  let proxy = Proxy.bind(address);
  let implementationsResult = proxy.try_implementations();
  if (!implementationsResult.reverted) {
    createInstaImplementation(implementationsResult.value, address, createdAt);
    InstaImplementationMapping.create(implementationsResult.value);
    dbInstaAccount.instaImplementation = implementationsResult.value.toHex();
  }
  dbInstaAccount.version = version;
  dbInstaAccount.createdAt = createdAt;
  dbInstaAccount.save();
}
