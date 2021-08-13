import { LogCastEvent } from "./../../generated/schema";
import { LogCast } from "./../../generated/templates/InstaAccount/InstaAccount";
import { BigInt } from "@graphprotocol/graph-ts";
import { createLogSpell } from "./LogSpell";

export function createLogCastEvent(event: LogCast): void {
  let eventId: string =
    event.transaction.hash.toHex() + "-" + event.logIndex.toString();
  let totalSpells: i32 = event.params.targets.length;
  let dbEvent = new LogCastEvent(eventId);
  dbEvent.origin = event.params.origin;
  dbEvent.sender = event.params.sender;
  dbEvent.value = event.params.value;
  dbEvent.totalSpells = BigInt.fromI32(totalSpells);
  dbEvent.timestamp = event.block.timestamp;
  dbEvent.save();

  for (let i = 0; i < totalSpells; i++) {
    createLogSpell(
      i,
      event.params.targetsNames[i],
      event.params.targets[i],
      event.params.eventNames[i],
      event.params.eventParams[i],
      eventId
    );
  }
}
