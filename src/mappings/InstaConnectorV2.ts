import { upsertChief } from "../entities/Chief";
import { deleteConnector, upsertConnector } from "../entities/Connector";
import { createLogConnectorAddedEvent } from "../entities/LogConnectorAddedEvent";
import { createLogConnectorRemovedEvent } from "../entities/LogConnectorRemovedEvent";
import { createLogConnectorUpdatedEvent } from "../entities/LogConnectorUpdatedEvent";
import { createLogControllerEvent } from "../entities/LogControllerEvent";
import {
  LogController,
  LogConnectorAdded,
  LogConnectorRemoved,
  LogConnectorUpdated
} from "../../generated/templates/InstaConnectorV2/InstaConnectorV2";

export function handleController(event: LogController): void {
  let cheifId: string = upsertChief(
    event.params.addr,
    event.address,
    event.params.isChief,
    event.block.timestamp
  );
  createLogControllerEvent(event, cheifId);
}

export function handleConnectorAdded(event: LogConnectorAdded): void {
  let connectorIds: Array<string> = upsertConnector(
    event.params.connectorName,
    event.params.connectorNameHash,
    event.params.connector,
    event.address,
    event.block.timestamp
  );
  createLogConnectorAddedEvent(event, connectorIds[0]);
}

export function handleConnectorUpdated(event: LogConnectorUpdated): void {
  let connectorIds: Array<string> = upsertConnector(
    event.params.connectorName,
    event.params.connectorNameHash,
    event.params.newConnector,
    event.address,
    event.block.timestamp
  );
  createLogConnectorUpdatedEvent(event, connectorIds[0], connectorIds[1]);
}

export function handleConnectorRemoved(event: LogConnectorRemoved): void {
  let connectorId: string = deleteConnector(
    event.params.connectorName,
    event.params.connectorNameHash,
    event.address,
    event.block.timestamp
  );
  createLogConnectorRemovedEvent(event, connectorId);
}
