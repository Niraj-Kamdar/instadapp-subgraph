import { ethereum } from "@graphprotocol/graph-ts";
import { LogConnectorRemovedEvent } from "./../../generated/schema";

export function createLogConnectorRemovedEvent(
  event: ethereum.Event,
  connectorId: string
): void {
  let eventId: string =
    event.transaction.hash.toHex() + "-" + event.logIndex.toString();

  let dbEvent = new LogConnectorRemovedEvent(eventId);
  dbEvent.connector = connectorId;
  dbEvent.timestamp = event.block.timestamp;
  dbEvent.save();
}
