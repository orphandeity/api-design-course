/**
 *  Express Server
 *
 *  initialize express server and
 *  setup with middleware options
 *
 *  designate protected path for database interactions
 *  and public paths for auth
 *
 */

import express from "express";
import router from "./router";
import morgan from "morgan";
import cors from "cors";
import { protect } from "./modules/auth";
import { createNewUser, signin } from "./handlers/user";

const app = express();

app.use(cors());
app.use(morgan("dev")); // console.log status
app.use(express.json()); // json from client
app.use(express.urlencoded({ extended: true })); // query params

app.use((req, res, next) => {
  console.log("who's that knockin' at my door?");
  next();
});

app.get("/", (req, res, next) => {
  res.json({ message: "hello" });
});

app.use("/api", protect, router);

app.post("/user", createNewUser);
app.post("/signin", signin);

/**
 *  Error Handler
 */
app.use((err, req, res, next) => {
  if (err.type === "auth") {
    res.status(401).json({ message: "unauthorized" });
  } else if (err.type === "input") {
    res.status(400).json({ message: "invalid input" });
  } else {
    res.status(500).json({ message: "oops, that's on us." });
  }
});

export default app;
