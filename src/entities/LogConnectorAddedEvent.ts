import { ethereum } from "@graphprotocol/graph-ts";
import { LogConnectorAddedEvent } from "./../../generated/schema";

export function createLogConnectorAddedEvent(
  event: ethereum.Event,
  connectorId: string
): void {
  let eventId: string =
    event.transaction.hash.toHex() + "-" + event.logIndex.toString();

  let dbEvent = new LogConnectorAddedEvent(eventId);
  dbEvent.connector = connectorId;
  dbEvent.timestamp = event.block.timestamp;
  dbEvent.save();
}
