import merge from "lodash.merge";

/**
 *  set NODE_ENV to whatever it was before, OR
 *  if it doesn't exist set it to "development"
 */
process.env.NODE_ENV = process.env.NODE_ENV || "development";

//  location of current environment
const stage = process.env.STAGE || "local";

let envConfig;

if (stage === "production") {
  envConfig = require("./prod").default;
} else if (stage === "testing") {
  envConfig = require("./testing").default;
} else {
  envConfig = require("./local").default;
}

export default merge(
  {
    stage,
    env: process.env.NODE_ENV,
    port: 3001,
    secrets: {
      jwt: process.env.JWT_SECRET,
      dbUrl: process.env.DATABASE_URL,
    },
  },
  envConfig
);
