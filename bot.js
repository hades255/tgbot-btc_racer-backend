const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
const axios = require("axios");
const morgan = require("morgan");
const https = require("https");
const fs = require("fs");

require("./routes/bot");
require("./helpers/cron");

const options = {
  key: fs.readFileSync("/etc/letsencrypt/live/srv587993.hstgr.cloud/privkey.pem"),
  cert: fs.readFileSync("/etc/letsencrypt/live/srv587993.hstgr.cloud/fullchain.pem"),
};

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(bodyParser.json());

const raceRouter = require("./routes/race");
const userRouter = require("./routes/user");
const referralRouter = require("./routes/referral");
//  todo
const dbURI =
  "mongodb+srv://chaolongpiao:chaolong1995@cluster0.inglvcw.mongodb.net/tg_bot";
// "mongodb://localhost:27017/example";
mongoose
  .connect(dbURI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

app.use(morgan("combined"));

app.get("/btc-price", async (req, res) => {
  try {
    const response = await axios.get(
      "https://api.coindesk.com/v1/bpi/currentprice/BTC.json"
    );
    const btcPrice = response.data.bpi.USD.rate;
    res.send(`<h1>Current BTC Price: $${btcPrice}</h1>`);
  } catch (error) {
    res.send("Error fetching BTC price");
  }
});

app.use("/race", raceRouter);
app.use("/user", userRouter);
app.use("/referral", referralRouter);

app.use(
  express.static(path.join(__dirname, "../tgbot-btc_racer-frontend/build"))
);

app.get("*", (req, res) => {
  res.sendFile(
    path.join(__dirname, "../tgbot-btc_racer-frontend/build", "index.html")
  );
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// https.createServer(options, app).listen(port, () => {
//   console.log(`HTTPS Server running at https://localhost:${port}/`);
// });
