import { Bytes, BigInt, Address } from "@graphprotocol/graph-ts";
import { Connector, ConnectorList } from "../../generated/schema";
import {
  decreaseActiveConnectors,
  increaseActiveConnectors,
  increaseTotalConnectors
} from "./InstaConnector";

export function ensureConnectorList(
  connectorName: string,
  connectorNameHash: Bytes
): ConnectorList {
  let dbConnectorList = ConnectorList.load(connectorName);
  if (!dbConnectorList) {
    dbConnectorList = new ConnectorList(connectorName);
    dbConnectorList.name = connectorName;
    dbConnectorList.nameHash = connectorNameHash;
    dbConnectorList.latestVersion = BigInt.fromString("0");
    dbConnectorList.save();
  }
  return dbConnectorList as ConnectorList;
}

export function increaseConnectorLatestVersion(
  connectorName: string,
  connectorNameHash: Bytes
): BigInt {
  let dbConnectorList: ConnectorList = ensureConnectorList(
    connectorName,
    connectorNameHash
  );
  dbConnectorList.latestVersion = dbConnectorList.latestVersion.plus(
    BigInt.fromString("1")
  );
  dbConnectorList.save();
  return dbConnectorList.latestVersion;
}

export function upsertConnector(
  connectorName: string,
  connectorNameHash: Bytes,
  connectorAddress: Address,
  instaConnectorAddress: Address,
  createdAt: BigInt
): Array<string> {
  let connectorIds = new Array<string>();
  let version: BigInt = increaseConnectorLatestVersion(
    connectorName,
    connectorNameHash
  );

  let connectorId: string = connectorName + "-" + version.toString();
  let dbConnector = new Connector(connectorId);
  dbConnector.address = connectorAddress;
  dbConnector.instaConnector = instaConnectorAddress.toHex();
  dbConnector.version = version;
  dbConnector.createdAt = createdAt;
  dbConnector.connectorList = connectorName;
  dbConnector.save();
  connectorIds.push(connectorId);

  if (dbConnector.version != BigInt.fromString("1")) {
    let oldVersion: BigInt = version.minus(BigInt.fromString("1"));
    let oldConnectorId: string = connectorName + "-" + oldVersion.toString();
    let dbOldConnector = Connector.load(oldConnectorId);
    dbOldConnector.deletedAt = createdAt;
    dbOldConnector.save();
    connectorIds.push(oldConnectorId);
  } else {
    increaseActiveConnectors(instaConnectorAddress);
    increaseTotalConnectors(instaConnectorAddress);
  }

  return connectorIds;
}

export function deleteConnector(
  connectorName: string,
  connectorNameHash: Bytes,
  instaConnectorAddress: Address,
  deletedAt: BigInt
): string {
  let dbConnectorList: ConnectorList = ensureConnectorList(
    connectorName,
    connectorNameHash
  );
  let connectorId: string =
    connectorName + "-" + dbConnectorList.latestVersion.toString();
  let dbConnector = Connector.load(connectorId);
  dbConnector.deletedAt = deletedAt;
  dbConnector.save();

  decreaseActiveConnectors(instaConnectorAddress);

  return connectorId;
}
