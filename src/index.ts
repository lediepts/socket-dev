/**
 * 1. db connect
 * 1.5 db init
 * 2. socket create
 * 3. server run
 */
import "dotenv/config";
import { resetDB } from "./database";
import "./socketIO";
import server from "./server";
import initDatabase from "./initDatabase";
import database from "./database";
(async () => {
  try {
    // await resetDB();
    await database.sync();
    await initDatabase();
    server.run();
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
})();
