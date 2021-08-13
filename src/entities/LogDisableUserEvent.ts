import { LogDisableUser } from "./../../generated/templates/InstaAccount/InstaAccount";
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
