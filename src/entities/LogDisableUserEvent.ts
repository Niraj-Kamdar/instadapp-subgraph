import { LogDisable } from "./../../generated/templates/InstaAccountV1/InstaAccountV1";
import { LogDisableUser } from "./../../generated/templates/InstaAccountV2/InstaAccountV2";
import { LogDisableUserEvent } from "../../generated/schema";

export function createLogDisableUser(
  event: LogDisableUser,
  accountOwnerId: string
): void {
  let eventId: string =
    event.transaction.hash.toHex() + "-" + event.logIndex.toString();

  let dbEvent = new LogDisableUserEvent(eventId);
  dbEvent.accountOwner = accountOwnerId;
  dbEvent.timestamp = event.block.timestamp;
  dbEvent.save();
}

export function createLogDisable(
  event: LogDisable,
  accountOwnerId: string
): void {
  let eventId: string =
    event.transaction.hash.toHex() + "-" + event.logIndex.toString();

  let dbEvent = new LogDisableUserEvent(eventId);
  dbEvent.accountOwner = accountOwnerId;
  dbEvent.timestamp = event.block.timestamp;
  dbEvent.save();
}
