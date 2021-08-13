import { LogSetDefaultImplementation } from "./../../generated/templates/InstaImplementations/InstaImplementations";
import { LogSetDefaultImplementationEvent } from "../../generated/schema";

export function createLogSetDefaultImplementation(
  event: LogSetDefaultImplementation
): void {
  let eventId: string =
    event.transaction.hash.toHex() + "-" + event.logIndex.toString();

  let dbEvent = new LogSetDefaultImplementationEvent(eventId);
  dbEvent.newImplementation = event.params.newImplementation;
  dbEvent.oldImplementation = event.params.oldImplementation;
  dbEvent.timestamp = event.block.timestamp;
  dbEvent.save();
}
