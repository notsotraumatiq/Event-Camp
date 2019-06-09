const dbConnection = require("./data/mongoConnection");
//const data = require("./data/");
const user = require("./data/user");
const event = require("./data/registerevent");

const main = async () => {
  const db = await dbConnection();
  await db.dropDatabase();
  const phil = await user.addUser("Phill", "Barresi", "Phill","Barresi","1994-03-05","pbarresi@stevens.edu","5516893219");
  const id = phil._id;
  const firstEvent = await event.addEvent("Stevens Gala", "Event for all the graduating stevens", "New york","fun","1994-03-05","Phill");
  const secondEvent = await event.addEvent("Stevens Convocatin", "Event for all the graduating stevens", "New york","fun","1994-03-05","Phill");
  console.log("Done seeding database");
  await db.serverConfig.close();
};

main().catch(console.log);