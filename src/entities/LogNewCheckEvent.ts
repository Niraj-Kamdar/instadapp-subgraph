import { LogNewCheck } from "../../generated/InstaIndex/InstaIndex";
import { LogNewCheckEvent } from "../../generated/schema";

export function createLogNewCheck(event: LogNewCheck): void {
  let eventId: string =
    event.transaction.hash.toHex() + "-" + event.logIndex.toString();

  let dbEvent = new LogNewCheckEvent(eventId);
  dbEvent.check = event.params.check;
  dbEvent.version = event.params.accountVersion;
  dbEvent.timestamp = event.block.timestamp;
  dbEvent.save();
}
