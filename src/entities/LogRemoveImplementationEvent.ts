import { LogRemoveImplementation } from "./../../generated/templates/InstaImplementation/InstaImplementation";
import { LogRemoveImplementationEvent } from "../../generated/schema";

export function createLogRemoveImplementation(
  event: LogRemoveImplementation
): void {
  let eventId: string =
    event.transaction.hash.toHex() + "-" + event.logIndex.toString();

  let dbEvent = new LogRemoveImplementationEvent(eventId);
  dbEvent.implementation = event.params.implementation.toHex();
  dbEvent.timestamp = event.block.timestamp;
  dbEvent.save();
}
