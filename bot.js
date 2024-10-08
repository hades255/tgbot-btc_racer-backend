const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
const axios = require("axios");
// const morgan = require("morgan");

require("./routes/bot");
require("./helpers/cron");

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(bodyParser.json());

const raceRouter = require("./routes/race");
const userRouter = require("./routes/user");
const referralRouter = require("./routes/referral");
const { token } = require("./routes/bot");
//  todo
const dbURI =
  "mongodb+srv://chaolongpiao:chaolong1995@cluster0.inglvcw.mongodb.net/tg_bot";
// "mongodb://localhost:27017/example";
mongoose
  .connect(dbURI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

// app.use(morgan("combined"));

app.use((req, res, next) => {
  req.setTimeout(300000); // 5 minutes
  res.setTimeout(300000); // 5 minutes
  next();
});

app.use("/race", raceRouter);
app.use("/user", userRouter);
app.use("/referral", referralRouter);

app.use(
  express.static(path.join(__dirname, "../tgbot-btc_racer-frontend/build"))
);

app.use("/public", express.static(path.join(__dirname, "public")));

app.get("*", (req, res) => {
  res.sendFile(
    path.join(__dirname, "../tgbot-btc_racer-frontend/build", "index.html")
  );
});

app.get("/battle", (req, res) => {
  res.sendFile(
    path.join(__dirname, "../tgbot-btc_racer-frontend/build", "index.html")
  );
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
