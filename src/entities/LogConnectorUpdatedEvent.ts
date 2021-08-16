import { LogConnectorUpdatedEvent } from "./../../generated/schema";
import { LogConnectorUpdated } from "./../../generated/templates/InstaConnector/InstaConnector";

export function createLogConnectorUpdatedEvent(
  event: LogConnectorUpdated,
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
