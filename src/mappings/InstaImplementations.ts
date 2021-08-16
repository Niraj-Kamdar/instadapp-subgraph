import {
  createImplementation,
  deleteImplementation
} from "../entities/Implementation";
import { updateDefaultImplementation } from "../entities/InstaImplementations";
import { createLogAddImplementation } from "../entities/LogAddImplementationEvent";
import { createLogRemoveImplementation } from "../entities/LogRemoveImplementationEvent";
import { createLogSetDefaultImplementation } from "../entities/LogSetDefaultImplementationEvent";
import {
  LogSetDefaultImplementation,
  LogAddImplementation,
  LogRemoveImplementation
} from "./../../generated/templates/InstaImplementations/InstaImplementations";

export function handleSetDefaultImplementation(
  event: LogSetDefaultImplementation
): void {
  updateDefaultImplementation(event.address, event.params.newImplementation);
  createLogSetDefaultImplementation(event);
}

export function handleAddImplementation(event: LogAddImplementation): void {
  createImplementation(
    event.params.implementation,
    event.address,
    event.params.sigs,
    event.block.timestamp
  );
  createLogAddImplementation(event);
}

export function handleRemoveImplementation(
  event: LogRemoveImplementation
): void {
  deleteImplementation(event.params.implementation, event.block.timestamp);
  createLogRemoveImplementation(event);
}
