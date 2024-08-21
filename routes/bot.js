const TelegramBot = require("node-telegram-bot-api");
const Referral = require("../models/Referral");
const User = require("../models/User");

const token = "7067970345:AAFs9OaXzqCWMK4h85WAujH80d8C0_AFZSI";
const bot = new TelegramBot(token, { polling: true });

bot.onText(/\/start(?: (.+))?/, async (msg, match) => {
  try {
    console.log(msg);
    const chatId = msg.chat.id;
    const referralCode = match[1];
    let reftext = "Welcome! No referral code found.";
    let bonus = 0;
    if (referralCode) {
      reftext = `Referral Code: ${referralCode}`;
      bonus = await saveReferralCode(chatId, referralCode);
    }
    const {
      username = "",
      last_name = "",
      first_name = "",
    } = await bot.getChat(chatId);
    console.log(
      `https://efc2-172-86-113-74.ngrok-free.app?userId=${chatId}&username=${username}&name=${
        first_name + " " + last_name
      }${referralCode ? "&refer=" + referralCode : ""}${
        bonus ? "&bonus=" + bonus : ""
      }`
    );
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
                  url: `https://efc2-172-86-113-74.ngrok-free.app?userId=${chatId}&username=${username}&name=${
                    first_name + " " + last_name
                  }${referralCode ? "&refer=" + referralCode : ""}${
                    bonus ? "&bonus=" + bonus : ""
                  }`,
                },
              },
            ],
          ],
        },
      }
    );
  } catch (error) {
    console.log(error);
  }
});

const saveReferralCode = async (userId, referralCode) => {
  try {
    const referrer = await User.findOne({ chatId: referralCode });
    if (referrer) {
      const oldref = await Referral.findOne({
        code: referralCode,
        userId,
      });
      if (oldref) return null;
      const user = await User.findOne({ chatId: userId });
      const bonus =
        5000 + referrer.point / 10 > 10000 ? 10000 : referrer.point / 10;
      user.point = user.point + bonus;
      await user.save();
      await new Referral({
        code: referralCode,
        userId,
        bonus,
        timestamp: new Date(),
      }).save();
      return bonus;
    }
    return null;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
