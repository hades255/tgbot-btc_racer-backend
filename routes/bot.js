const TelegramBot = require("node-telegram-bot-api");
const Referral = require("../models/Referral");
const User = require("../models/User");

//  ANOM Invaders
//  anom_invaders_bot
const token = "7200211488:AAGAlNg2aAr4C9WFt-E3xcLWHtSMp_dtgwI";
const bot = new TelegramBot(token, { polling: true });

// const serverurl = "https://srv587993.hstgr.cloud";
const serverurl = "https://efc2-172-86-113-74.ngrok-free.app";

bot.onText(/\/start(?: (.+))?/, async (msg, match) => {
  try {
    const chatId = msg.chat.id;
    const referralCode = match[1];
    const {
      username = "",
      last_name = "",
      first_name = "",
    } = await bot.getChat(chatId);
    bot.sendMessage(
      chatId,
      `👩‍🚀 Welcome to the ANOM Invaders!\nFire up your rockets and predict ETH's price in real-time!\n💧 Guess: PUMP or DUMP in the next 5 seconds?\n💎Collect Diamonds: Correct guesses earn diamonds and bonuses!\n👥 Invite Friends: Boost your score by inviting friends!`,
      {
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "GoApp",
                web_app: {
                  url: `${serverurl}?userId=${chatId}&username=${username}&name=${
                    first_name + " " + last_name
                  }&refer=${referralCode}`,
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
      const bonus =
        5000 + referrer.point / 10 > 10000 ? 10000 : referrer.point / 10;
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

module.exports = { saveReferralCode };
