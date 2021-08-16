import { LogCastEvent } from "./../../generated/schema";
import { LogCast as LogCastV1 } from "./../../generated/templates/InstaAccountV1/InstaAccountV1";
import { LogCast as LogCastV2 } from "./../../generated/templates/InstaAccountV2/InstaAccountV2";
import { Address, BigInt, Bytes } from "@graphprotocol/graph-ts";
import { createLogSpell } from "./LogSpell";

export function createLogCastV2Event(event: LogCastV2): void {
  let eventId: string =
    event.transaction.hash.toHex() + "-" + event.logIndex.toString();
  let totalSpells: i32 = event.params.targets.length;
  let dbEvent = new LogCastEvent(eventId);
  dbEvent.account = event.address.toHex();
  dbEvent.origin = event.params.origin;
  dbEvent.sender = event.params.sender;
  dbEvent.value = event.params.value;
  dbEvent.totalSpells = BigInt.fromI32(totalSpells);
  dbEvent.timestamp = event.block.timestamp;
  dbEvent.save();

  let targetsNames: Array<string> = event.params.targetsNames;
  let targets: Array<Address> = event.params.targets;
  let eventNames: Array<string> = event.params.eventNames;
  let eventParams: Array<Bytes> = event.params.eventParams;

  for (let i = 0; i < totalSpells; i++) {
    createLogSpell(
      i,
      targetsNames[i],
      targets[i],
      eventNames[i],
      eventParams[i],
      eventId
    );
  }
}

export function createLogCastV1Event(event: LogCastV1): void {
  let eventId: string =
    event.transaction.hash.toHex() + "-" + event.logIndex.toString();
  let dbEvent = new LogCastEvent(eventId);
  dbEvent.account = event.address.toHex();
  dbEvent.origin = event.params.origin;
  dbEvent.sender = event.params.sender;
  dbEvent.value = event.params.value;
  dbEvent.timestamp = event.block.timestamp;
  dbEvent.save();
}
