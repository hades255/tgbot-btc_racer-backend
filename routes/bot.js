const TelegramBot = require("node-telegram-bot-api");

const token = "7067970345:AAFs9OaXzqCWMK4h85WAujH80d8C0_AFZSI";
const bot = new TelegramBot(token, { polling: true });
bot.onText(/\/start/, async (msg) => {
  const chatId = msg.chat.id;
  const {
    username = "",
    last_name = "",
    first_name = "",
  } = await bot.getChat(chatId);
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
                url: `https://a65b-172-86-113-74.ngrok-free.app?userId=${chatId}&username=${username}&name=${
                  first_name + " " + last_name
                }`,
              },
            },
          ],
        ],
      },
    }
  );
});
