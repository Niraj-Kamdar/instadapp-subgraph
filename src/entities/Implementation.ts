import {
  Implementation,
  InstaAccount,
  InstaConnector,
  InstaConnectorProxy,
  InstaImplementation,
  Version
} from "./../../generated/schema";
import { Implementation as ImplementationContract } from "./../../generated/templates/InstaImplementation/Implementation";
import { Address, BigInt, Bytes, log } from "@graphprotocol/graph-ts";
import { createSignature } from "./Signature";
import { createInstaConnectorV2 } from "./InstaConnector";

export function getVersion(instaImplementationAddress: Address): Version {
  let dbInstaImplementation = InstaImplementation.load(
    instaImplementationAddress.toHex()
  );
  if (!dbInstaImplementation) {
    log.critical("InstaImplementation doesn't exist at {}", [
      instaImplementationAddress.toHex()
    ]);
  }
  let instaAccountId: string = dbInstaImplementation.instaAccount;
  let dbInstaAccount = InstaAccount.load(instaAccountId);
  if (!dbInstaAccount) {
    log.critical("InstaAccount doesn't exist at {}", [instaAccountId]);
  }

  let dbVersion = Version.load(dbInstaAccount.version);
  if (!dbInstaAccount) {
    log.critical("Version doesn't exist at {}", [dbInstaAccount.version]);
  }
  return dbVersion as Version;
}

export function createImplementation(
  address: Address,
  instaImplementationAddress: Address,
  signatures: Array<Bytes>,
  createdAt: BigInt
): void {
  for (let i = 0; i < signatures.length; i++) {
    createSignature(signatures[i], address);
  }

  let contract = ImplementationContract.bind(address);
  let connectorsM1Result = contract.try_connectorsM1();
  if (connectorsM1Result.reverted) {
    log.critical("connectorsM1() call failed at {}", [address.toHex()]);
  }
  let dbInstaConnector = InstaConnector.load(connectorsM1Result.value.toHex());
  if (!dbInstaConnector) {
    let dbVersion: Version = getVersion(instaImplementationAddress);
    let dbInstaConnectorProxy = InstaConnectorProxy.load(
      dbVersion.instaConnectorProxy
    );
    if (!dbInstaConnectorProxy) {
      log.critical("InstaConnectorProxy doesn't exists at {}", [
        dbVersion.instaConnectorProxy
      ]);
    }
    dbInstaConnectorProxy.implementation = connectorsM1Result.value.toHex();
    dbInstaConnectorProxy.save();
    createInstaConnectorV2(
      Address.fromString(dbVersion.instaConnectorProxy),
      connectorsM1Result.value,
      dbVersion.id,
      createdAt
    );
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
