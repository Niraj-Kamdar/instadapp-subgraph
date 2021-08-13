import { LogSpell } from "./../../generated/schema";
import { Address, Bytes } from "@graphprotocol/graph-ts";

export function createLogSpell(
  index: i32,
  targetName: string,
  target: Address,
  eventName: string,
  eventParams: Bytes,
  castId: string
): void {
  let spellId = castId + "-" + index.toString();
  let dbSpell = new LogSpell(spellId);
  dbSpell.target = target;
  dbSpell.targetName = targetName;
  dbSpell.eventName = eventName;
  dbSpell.eventParams = eventParams;
  dbSpell.cast = castId;
  dbSpell.save();
}
