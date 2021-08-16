import { LogEnable } from "./../../generated/templates/InstaAccountV1/InstaAccountV1";
import { LogEnableUser } from "./../../generated/templates/InstaAccountV2/InstaAccountV2";
import { LogEnableUserEvent } from "../../generated/schema";

export function createLogEnableUser(
  event: LogEnableUser,
  accountOwnerId: string
): void {
  let eventId: string =
    event.transaction.hash.toHex() + "-" + event.logIndex.toString();

  let dbEvent = new LogEnableUserEvent(eventId);
  dbEvent.accountOwner = accountOwnerId;
  dbEvent.timestamp = event.block.timestamp;
  dbEvent.save();
}

export function createLogEnable(
  event: LogEnable,
  accountOwnerId: string
): void {
  let eventId: string =
    event.transaction.hash.toHex() + "-" + event.logIndex.toString();

  let dbEvent = new LogEnableUserEvent(eventId);
  dbEvent.accountOwner = accountOwnerId;
  dbEvent.timestamp = event.block.timestamp;
  dbEvent.save();
}
