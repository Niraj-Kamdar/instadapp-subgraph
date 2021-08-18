import { upsertChief } from "../entities/Chief";
import {
  IConnector,
  getIConnector,
  upsertConnector,
  deleteConnector
} from "../entities/Connector";
import { ensureInstaConnector } from "../entities/InstaConnector";
import { createLogConnectorAddedEvent } from "../entities/LogConnectorAddedEvent";
import { createLogConnectorRemovedEvent } from "../entities/LogConnectorRemovedEvent";
import { createLogConnectorUpdatedEvent } from "../entities/LogConnectorUpdatedEvent";
import { createLogControllerEvent } from "../entities/LogControllerEvent";
import {
  LogAddController,
  LogRemoveController,
  LogEnable,
  LogDisable,
  LogEnableStatic
} from "./../../generated/InstaConnectorV1/InstaConnectorV1";

export function handleAddController(event: LogAddController): void {
  ensureInstaConnector(event.address, event.block.timestamp);
  let cheifId: string = upsertChief(
    event.params.addr,
    event.address,
    true,
    event.block.timestamp
  );
  createLogControllerEvent(event, cheifId);
}

export function handleRemoveController(event: LogRemoveController): void {
  ensureInstaConnector(event.address, event.block.timestamp);
  let cheifId: string = upsertChief(
    event.params.addr,
    event.address,
    false,
    event.block.timestamp
  );
  createLogControllerEvent(event, cheifId);
}

export function handleEnableConnector(event: LogEnable): void {
  ensureInstaConnector(event.address, event.block.timestamp);
  let connector: IConnector = getIConnector(event.params.connector);
  let connectorIds: Array<string> = upsertConnector(
    connector.name,
    connector.nameHash,
    connector.address,
    event.address,
    event.block.timestamp
  );
  if (connectorIds.length == 1) {
    createLogConnectorAddedEvent(event, connectorIds[0]);
  } else {
    createLogConnectorUpdatedEvent(event, connectorIds[0], connectorIds[1]);
  }
}

export function handleDisableConnector(event: LogDisable): void {
  ensureInstaConnector(event.address, event.block.timestamp);
  let connector: IConnector = getIConnector(event.params.connector);
  let connectorId: string = deleteConnector(
    connector.name,
    connector.nameHash,
    event.address,
    event.block.timestamp
  );
  createLogConnectorRemovedEvent(event, connectorId);
}

export function handleEnableStaticConnector(event: LogEnableStatic): void {
  ensureInstaConnector(event.address, event.block.timestamp);
  let connector: IConnector = getIConnector(event.params.connector);
  let connectorIds: Array<string> = upsertConnector(
    connector.name,
    connector.nameHash,
    connector.address,
    event.address,
    event.block.timestamp,
    true
  );
  if (connectorIds.length == 1) {
    createLogConnectorAddedEvent(event, connectorIds[0]);
  } else {
    createLogConnectorUpdatedEvent(event, connectorIds[0], connectorIds[1]);
  }
}
