const TelegramBot = require("node-telegram-bot-api");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
// const path = require("path");
const axios = require("axios");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const raceRouter = require("./routes/race");

const token = "7067970345:AAFs9OaXzqCWMK4h85WAujH80d8C0_AFZSI";
const bot = new TelegramBot(token, { polling: true });

// const dbURI = "mongodb://localhost:27017/example";
const dbURI =
  "mongodb+srv://chaolongpiao:chaolong1995@cluster0.inglvcw.mongodb.net/tg_bot";
mongoose
  .connect(dbURI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

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

// Set up the bot commands
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(
    chatId,
    "Welcome! Click the button below to check the current BTC price.",
    {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "GoApp",
              web_app: {
                url: `https://d6bf-172-86-113-74.ngrok-free.app?userId=${chatId}`,
              },
            },
          ],
        ],
      },
    }
  );
});

// app.use(express.static(path.join(__dirname, '../frontend/build')));

// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
// });

app.use("/race", raceRouter);

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
