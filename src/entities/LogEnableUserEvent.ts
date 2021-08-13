import { LogEnableUser } from "./../../generated/templates/InstaAccount/InstaAccount";
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
