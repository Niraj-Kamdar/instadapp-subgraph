import { Chief } from "./../../generated/schema";
import { Address, BigInt } from "@graphprotocol/graph-ts";
import { ChiefList } from "../../generated/schema";
import {
  decreaseActiveChiefs,
  increaseActiveChiefs,
  increaseTotalChiefs
} from "./InstaConnectors";

export function ensureChiefList(cheifAddress: Address): ChiefList {
  let chiefListId = cheifAddress.toHex();
  let dbChiefList = ChiefList.load(chiefListId);
  if (!dbChiefList) {
    dbChiefList = new ChiefList(chiefListId);
    dbChiefList.latestVersion = BigInt.fromString("0");
    dbChiefList.save();
  }
  return dbChiefList as ChiefList;
}

export function increaseChiefLatestVersion(chiefAddress: Address): BigInt {
  let dbChiefList: ChiefList = ensureChiefList(chiefAddress);
  dbChiefList.latestVersion = dbChiefList.latestVersion.plus(
    BigInt.fromString("1")
  );
  dbChiefList.save();
  return dbChiefList.latestVersion;
}

export function upsertChief(
  chiefAddress: Address,
  instaConnectorsAddress: Address,
  isChief: boolean,
  createdAt: BigInt
): string {
  let version: BigInt = increaseChiefLatestVersion(chiefAddress);

  let chiefListId = chiefAddress.toHex();
  let chiefId: string = chiefListId + "-" + version.toString();
  let dbChief = new Chief(chiefId);
  dbChief.address = chiefAddress;
  dbChief.isActive = isChief;
  dbChief.instaConnectors = instaConnectorsAddress.toHex();
  dbChief.version = version;
  dbChief.createdAt = createdAt;
  dbChief.chiefList = chiefListId;
  dbChief.save();

  if (dbChief.version != BigInt.fromString("1")) {
    let oldVersion: BigInt = version.minus(BigInt.fromString("1"));
    let oldChiefId: string = chiefListId + "-" + oldVersion.toString();
    let dbOldChief = Chief.load(oldChiefId);
    dbOldChief.deletedAt = createdAt;
    dbOldChief.save();
  } else {
    increaseTotalChiefs(instaConnectorsAddress);
  }

  if (isChief) {
    increaseActiveChiefs(instaConnectorsAddress);
  } else {
    decreaseActiveChiefs(instaConnectorsAddress);
  }

  return chiefId;
}
