import { LogAddImplementation } from "./../../generated/templates/InstaImplementations/InstaImplementations";
import { LogAddImplementationEvent } from "../../generated/schema";

export function createLogAddImplementation(event: LogAddImplementation): void {
  let eventId: string =
    event.transaction.hash.toHex() + "-" + event.logIndex.toString();

  let dbEvent = new LogAddImplementationEvent(eventId);
  dbEvent.implementation = event.params.implementation.toHex();
  dbEvent.timestamp = event.block.timestamp;
  dbEvent.save();
}
