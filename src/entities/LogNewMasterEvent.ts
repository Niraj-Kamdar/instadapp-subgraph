import { LogNewMaster } from "../../generated/InstaIndex/InstaIndex";
import { LogNewMasterEvent } from "../../generated/schema";

export function createLogNewMaster(event: LogNewMaster): void {
  let eventId: string =
    event.transaction.hash.toHex() + "-" + event.logIndex.toString();

  let dbEvent = new LogNewMasterEvent(eventId);
  dbEvent.master = event.params.master;
  dbEvent.timestamp = event.block.timestamp;
  dbEvent.save();
}
