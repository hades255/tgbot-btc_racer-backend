const TelegramBot = require("node-telegram-bot-api");
const Referral = require("../models/Referral");

const token = "7067970345:AAFs9OaXzqCWMK4h85WAujH80d8C0_AFZSI";
const bot = new TelegramBot(token, { polling: true });
bot.onText(/\/start(?: (.+))?/, async (msg, match) => {
  const chatId = msg.chat.id;
  const referralCode = match[1];
  let reftext = "Welcome! No referral code found.";
  if (referralCode) {
    reftext = `Referral Code: ${referralCode}`;
    saveReferralCode(chatId, referralCode);
  }
  const {
    username = "",
    last_name = "",
    first_name = "",
  } = await bot.getChat(chatId);
  bot.sendMessage(
    chatId,
    `${reftext}\nWelcome! Click the button below to start app.`,
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

const saveReferralCode = (userId, referralCode) => {
  new Referral({
    code: referralCode,
    userId: userId,
    timestamp: new Date(),
  })
    .save()
    .then(() => console.log("Referral Saved"))
    .catch((err) => console.error(err));
};
