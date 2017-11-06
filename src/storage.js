import localforage from "localforage";

localforage.setDriver([
  localforage.INDEXEDDB,
  localforage.WEBSQL,
  localforage.LOCALSTORAGE
]);

const store = localforage.createInstance({ name: "oh-spella" });
export default store;
