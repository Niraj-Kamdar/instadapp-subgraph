import { ethereum } from "@graphprotocol/graph-ts";
import { LogConnectorUpdatedEvent } from "./../../generated/schema";

export function createLogConnectorUpdatedEvent(
  event: ethereum.Event,
  newConnectorId: string,
  oldConnectorId: string
): void {
  let eventId: string =
    event.transaction.hash.toHex() + "-" + event.logIndex.toString();

  let dbEvent = new LogConnectorUpdatedEvent(eventId);
  dbEvent.newConnector = newConnectorId;
  dbEvent.oldConnector = oldConnectorId;
  dbEvent.timestamp = event.block.timestamp;
  dbEvent.save();
}
