/**
 *  This is the entry-point to the server.
 *  Everything starts here.
 *
 *  dotenv - allows env variables to be accessed in node.js environment
 *
 */

// allow access to env variables throughout the environment
import * as dotenv from "dotenv";
dotenv.config();
import config from "./config";
import app from "./server";

app.listen(config.port, () => {
  console.log(`hello on http://localhost:${config.port}`);
});
