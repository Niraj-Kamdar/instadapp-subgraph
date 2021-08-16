import { LogConnectorRemovedEvent } from "./../../generated/schema";
import { LogConnectorRemoved } from "./../../generated/templates/InstaConnectors/InstaConnectors";

export function createLogConnectorRemovedEvent(
  event: LogConnectorRemoved,
  connectorId: string
): void {
  let eventId: string =
    event.transaction.hash.toHex() + "-" + event.logIndex.toString();

  let dbEvent = new LogConnectorRemovedEvent(eventId);
  dbEvent.connector = connectorId;
  dbEvent.timestamp = event.block.timestamp;
  dbEvent.save();
}
