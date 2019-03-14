
module.exports.createLibraryItem = behandlingID => {
  const obj = { behandlingID, count: 0, targetCount: 1 + Math.floor(Math.random() * 2) };
  global.nodeCache.set(behandlingID, obj);
};
module.exports.setLibraryItem = (behandlingID, count) => {
  const item = global.nodeCache.get(behandlingID);
  const newItem = { ...item, count };
  global.nodeCache.set(behandlingID, newItem);
};
module.exports.getLibraryItem = behandlingID => {
  return global.nodeCache.get(behandlingID);
};
module.exports.removeLibraryItem = behandlingID => {
  global.nodeCache.del(behandlingID);
};
