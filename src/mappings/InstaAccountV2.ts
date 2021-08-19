import { LogCastMigrate } from './../../generated/templates/InstaAccountV2/InstaAccountV2';
import {
  LogCast,
  LogDisableUser,
  LogEnableUser
} from "../../generated/templates/InstaAccountV2/InstaAccountV2";
import { deleteAccountOwner, upsertAccountOwner } from "../entities/Account";
import { createLogCastV2Event } from "../entities/LogCastEvent";
import { createLogDisableUser } from "../entities/LogDisableUserEvent";
import { createLogEnableUser } from "../entities/LogEnableUserEvent";

export function handleEnableUser(event: LogEnableUser): void {
  let accountOwnerId: string = upsertAccountOwner(
    event.address,
    event.params.user,
    event.block.timestamp
  );
  createLogEnableUser(event, accountOwnerId);
}

export function handleDisableUser(event: LogDisableUser): void {
  let accountOwnerId: string = deleteAccountOwner(
    event.address,
    event.params.user,
    event.block.timestamp
  );
  createLogDisableUser(event, accountOwnerId);
}

export function handleCast(event: LogCast): void {
  createLogCastV2Event(event);
}

export function handleCastMigrate(event: LogCastMigrate): void {
  createLogCastV2Event(event as LogCast);
}