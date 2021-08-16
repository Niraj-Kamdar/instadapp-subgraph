import {
  LogCast,
  LogDisable,
  LogEnable
} from "../../generated/templates/InstaAccountV1/InstaAccountV1";
import { deleteAccountOwner, upsertAccountOwner } from "../entities/Account";
import { createLogCastV1Event } from "../entities/LogCastEvent";
import { createLogDisable } from "../entities/LogDisableUserEvent";
import { createLogEnable } from "../entities/LogEnableUserEvent";

export function handleEnable(event: LogEnable): void {
  let accountOwnerId: string = upsertAccountOwner(
    event.address,
    event.params.user,
    event.block.timestamp
  );
  createLogEnable(event, accountOwnerId);
}

export function handleDisable(event: LogDisable): void {
  let accountOwnerId: string = deleteAccountOwner(
    event.address,
    event.params.user,
    event.block.timestamp
  );
  createLogDisable(event, accountOwnerId);
}

export function handleCast(event: LogCast): void {
  createLogCastV1Event(event);
}
