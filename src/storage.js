import localforage from "localforage";

const drivers = [
  localforage.INDEXEDDB,
  localforage.WEBSQL,
  localforage.LOCALSTORAGE
];

// export const sessionStore = localforage
export default localforage.setDriver(drivers);
