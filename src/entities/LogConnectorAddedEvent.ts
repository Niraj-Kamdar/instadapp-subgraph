import { LogConnectorAddedEvent } from "./../../generated/schema";
import { LogConnectorAdded } from "./../../generated/templates/InstaConnectors/InstaConnectors";

export function createLogConnectorAddedEvent(
  event: LogConnectorAdded,
  connectorId: string
): void {
  let eventId: string =
    event.transaction.hash.toHex() + "-" + event.logIndex.toString();

  let dbEvent = new LogConnectorAddedEvent(eventId);
  dbEvent.connector = connectorId;
  dbEvent.timestamp = event.block.timestamp;
  dbEvent.save();
}
