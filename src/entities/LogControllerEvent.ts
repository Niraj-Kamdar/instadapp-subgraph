import { LogControllerEvent } from "./../../generated/schema";
import { LogController } from "./../../generated/templates/InstaConnector/InstaConnector";

export function createLogControllerEvent(
  event: LogController,
  chiefId: string
): void {
  let eventId: string =
    event.transaction.hash.toHex() + "-" + event.logIndex.toString();

  let dbEvent = new LogControllerEvent(eventId);
  dbEvent.chief = chiefId;
  dbEvent.timestamp = event.block.timestamp;
  dbEvent.save();
}
