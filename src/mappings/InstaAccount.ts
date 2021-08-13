import {
  LogCast,
  LogDisableUser,
  LogEnableUser
} from "./../../generated/templates/InstaAccount/InstaAccount";
import { deleteAccountOwner, upsertAccountOwner } from "../entities/Account";
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

export function handleCast(event: LogCast): void {}
