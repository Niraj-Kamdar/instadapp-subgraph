import { ethereum } from "@graphprotocol/graph-ts";
import { LogControllerEvent } from "./../../generated/schema";

export function createLogControllerEvent(
  event: ethereum.Event,
  chiefId: string
): void {
  let eventId: string =
    event.transaction.hash.toHex() + "-" + event.logIndex.toString();

  let dbEvent = new LogControllerEvent(eventId);
  dbEvent.chief = chiefId;
  dbEvent.timestamp = event.block.timestamp;
  dbEvent.save();
}
