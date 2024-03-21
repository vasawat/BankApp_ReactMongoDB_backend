const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

app.use(bodyParser.json());
app.use(
  cors({
    origin: "https://bankappvasawat.netlify.app",
    credentials: true,
  })
);

require("dotenv").config({ path: "./.env" });
const DB_url = process.env.MONGO_URL;

mongoose.connect(DB_url);
const db = mongoose.connection;
db.once("open", () => {
  console.log("DB connected");
});

const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");

app.use("/auth", authRoutes);
app.use("/user", userRoutes);

console.log();

app.listen("5000", () => {
  console.log("Listening on port 5000");
});
