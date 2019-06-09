const dbConnection = require("./mongoConnection");

const getCollectionFn = collection => {
  let _col = undefined;

  return async () => {
    if (!_col) {
      const db = await dbConnection();
      _col = await db.collection(collection);
    }

    return _col;
  };
};

/* Now, you can list your collections here: */
module.exports = {
  events: getCollectionFn("events"),
  users: getCollectionFn("users"),
  comments: getCollectionFn("comments"),
  rsvps:getCollectionFn("rsvps"),
  brownies:getCollectionFn("brownies")
};