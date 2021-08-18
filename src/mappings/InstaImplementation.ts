import {
  createImplementation,
  deleteImplementation
} from "../entities/Implementation";
import {
  ensureInstaImplementation,
  updateDefaultImplementation
} from "../entities/InstaImplementation";
import { createLogAddImplementation } from "../entities/LogAddImplementationEvent";
import { createLogRemoveImplementation } from "../entities/LogRemoveImplementationEvent";
import { createLogSetDefaultImplementation } from "../entities/LogSetDefaultImplementationEvent";
import {
  LogSetDefaultImplementation,
  LogAddImplementation,
  LogRemoveImplementation
} from "../../generated/InstaImplementation/InstaImplementation";

export function handleSetDefaultImplementation(
  event: LogSetDefaultImplementation
): void {
  ensureInstaImplementation(event.address, event.block.timestamp);
  updateDefaultImplementation(event.address, event.params.newImplementation);
  createLogSetDefaultImplementation(event);
}

export function handleAddImplementation(event: LogAddImplementation): void {
  ensureInstaImplementation(event.address, event.block.timestamp);
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
  ensureInstaImplementation(event.address, event.block.timestamp);
  deleteImplementation(event.params.implementation, event.block.timestamp);
  createLogRemoveImplementation(event);
}
