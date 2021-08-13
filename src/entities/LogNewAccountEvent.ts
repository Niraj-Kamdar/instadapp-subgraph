import { LogNewAccount } from "../../generated/InstaIndex/InstaIndex";
import { LogNewAccountEvent } from "../../generated/schema";

export function createLogNewAccount(
  event: LogNewAccount,
  version: string
): void {
  let eventId: string =
    event.transaction.hash.toHex() + "-" + event.logIndex.toString();

  let dbEvent = new LogNewAccountEvent(eventId);
  dbEvent.version = version;
  dbEvent.timestamp = event.block.timestamp;
  dbEvent.save();
}
