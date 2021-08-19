import { ZERO_ADDRESS } from "./../config";
import { Address, BigInt } from "@graphprotocol/graph-ts";
import {
  SetBasicsCall,
  LogNewMaster,
  LogUpdateMaster,
  LogNewCheck,
  LogNewAccount,
  LogAccountCreated
} from "../../generated/InstaIndex/InstaIndex";
import { createAccount, upsertAccountOwner } from "../entities/Account";
import {
  createInstaIndex,
  ensureInstaIndex,
  getInstaListAddress,
  releaseLatestVersion,
  updateMaster,
  updateNewMaster
} from "../entities/InstaIndex";
import { increaseTotalAccounts } from "../entities/InstaList";
import { createLogNewAccount } from "../entities/LogNewAccountEvent";
import { createLogNewCheck } from "../entities/LogNewCheckEvent";
import { createLogNewMaster } from "../entities/LogNewMasterEvent";
import { createLogUpdateMaster } from "../entities/LogUpdateMasterEvent";
import { createVersion, updateCheckAddress } from "../entities/Version";
import { createLogAccountCreated } from "../entities/LogAccountCreatedEvent";

export function handleSetBasics(call: SetBasicsCall): void {
  createInstaIndex(
    call.to,
    call.inputs._master,
    call.inputs._list,
    call.inputs._account,
    call.inputs._connectors,
    call.block.timestamp
  );
}

export function handleNewMaster(event: LogNewMaster): void {
  ensureInstaIndex(event.address, event.block.timestamp);
  updateNewMaster(event.address, event.params.master);
  createLogNewMaster(event);
}

export function handleUpdateMaster(event: LogUpdateMaster): void {
  ensureInstaIndex(event.address, event.block.timestamp);
  updateMaster(event.address, event.params.master);
  createLogUpdateMaster(event);
}

export function handleNewCheck(event: LogNewCheck): void {
  ensureInstaIndex(event.address, event.block.timestamp);
  updateCheckAddress(
    event.params.accountVersion.toString(),
    event.params.check
  );
  createLogNewCheck(event);
}

export function handleNewAccount(event: LogNewAccount): void {
  ensureInstaIndex(event.address, event.block.timestamp);
  let version = releaseLatestVersion(event.address);
  if (version != "") {
    createVersion(
      version,
      event.address,
      event.params._newAccount,
      event.params._connectors,
      event.params._check,
      event.block.timestamp
    );
  }
  createLogNewAccount(event, version);
}

export function handleAccountCreated(event: LogAccountCreated): void {
  let instaListAddress: Address = getInstaListAddress(event.address);
  if (instaListAddress != Address.fromString(ZERO_ADDRESS)) {
    let totalAccounts: BigInt = increaseTotalAccounts(instaListAddress);
    if (totalAccounts != BigInt.fromString("-1")) {
      let accountNumber = totalAccounts.minus(BigInt.fromString("1"));
      createAccount(
        event.params.account,
        accountNumber,
        instaListAddress,
        event.block.timestamp
      );
      upsertAccountOwner(
        event.params.account,
        event.params.owner,
        event.block.timestamp
      );
    }
  }
  createLogAccountCreated(event);
}
