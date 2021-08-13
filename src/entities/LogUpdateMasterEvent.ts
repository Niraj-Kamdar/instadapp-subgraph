import { LogUpdateMaster } from "../../generated/InstaIndex/InstaIndex";
import { LogUpdateMasterEvent } from "../../generated/schema";

export function createLogUpdateMaster(event: LogUpdateMaster): void {
  let eventId: string =
    event.transaction.hash.toHex() + "-" + event.logIndex.toString();

  let dbEvent = new LogUpdateMasterEvent(eventId);
  dbEvent.master = event.params.master;
  dbEvent.timestamp = event.block.timestamp;
  dbEvent.save();
}
