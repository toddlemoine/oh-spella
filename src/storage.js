import localforage from "localforage";

const drivers = [
  localforage.INDEXEDDB,
  localforage.WEBSQL,
  localforage.LOCALSTORAGE
];

localforage.setDriver(drivers);

export default localforage;
