import { InstaAccount as InstaAccountContract } from "./../../generated/InstaIndex/InstaAccount";
import { LogAccountCreated } from "../../generated/InstaIndex/InstaIndex";
import { LogAccountCreatedEvent, Version } from "../../generated/schema";
import { log, BigInt } from "@graphprotocol/graph-ts";

export function createLogAccountCreated(event: LogAccountCreated): void {
  let eventId: string =
    event.transaction.hash.toHex() + "-" + event.logIndex.toString();

  let instaAccountContract = InstaAccountContract.bind(event.params.account);
  let accountVersionResult = instaAccountContract.try_version();
  if (accountVersionResult.reverted) {
    log.critical("version() call got reverted for account: {}!", [
      event.params.account.toHex()
    ]);
    return;
  }
  let accountVersion: BigInt = accountVersionResult.value;
  let dbVersion = Version.load(accountVersion.toString());
  if (!dbVersion) {
    log.critical("Version {} doesn't exist!", [accountVersion.toString()]);
    return;
  }

  let dbEvent = new LogAccountCreatedEvent(eventId);
  dbEvent.account = event.params.account;
  dbEvent.owner = event.params.owner;
  dbEvent.origin = event.params.origin;
  dbEvent.sender = event.params.sender;
  dbEvent.version = dbVersion.id;
  dbEvent.timestamp = event.block.timestamp;
  dbEvent.save();
}
