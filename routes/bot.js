const TelegramBot = require("node-telegram-bot-api");
const Referral = require("../models/Referral");
const User = require("../models/User");

//  ANOM Invaders
//  anom_invaders_bot
const token = "7200211488:AAGAlNg2aAr4C9WFt-E3xcLWHtSMp_dtgwI";
// const token = "7287598746:AAG42o46fTwoO4EGiHSzyKpnch9mvG0dFZE";
const bot = new TelegramBot(token, { polling: true });

const serverurl = "https://anomgaming.online";
// const serverurl = "https://360f-172-86-113-74.ngrok-free.app";

const imageUrl = `https://i.imgur.com/0uT7tcH.png`;

bot.onText(/\/start(?: (.+))?/, async (msg, match) => {
  try {
    const chatId = msg.chat.id;
    const referralCode = match[1];

    const inlineKeyboard = {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "Launch & Battle 🚀",
              web_app: {
                url: `${serverurl}?refer=${referralCode || ""}`,
              },
            },
          ],
          [
            {
              text: "Follow the Latest News 🔈",
              url: "https://t.me/anom_invaders_announcements",
            },
          ],
          [
            {
              text: "User Guide 📗",
              url: "https://docs.alphanomics.io/help/overview/account-plans-and-access/anom-invaders",
            },
          ],
        ],
      },
    };

    await bot.sendPhoto(chatId, imageUrl, {
      caption: `👩‍🚀 *Welcome to the ANOM Invaders!*\nFire up your rockets and predict ETH's price in real-time!\n💧 *Guess*: PUMP or DUMP in the next 5 seconds?\n💎*Collect Diamonds*: Correct guesses earn diamonds and bonuses!\n👥 *Invite Friends*: Boost your score by inviting friends!`,
      ...inlineKeyboard,
      parse_mode: "Markdown",
    });
  } catch (error) {
    console.log(error);
  }
});

bot.on("callback_query", async (query) => {
  try {
    const chatId = query.message.chat.id;
    const {
      username = "",
      last_name = "",
      first_name = "",
    } = await bot.getChat(chatId);

    // Construct the URL with the required format
    const webAppUrl = `${serverurl}?userId=${chatId}&username=${username}&name=${
      first_name + " " + last_name
    }&refer=`;

    // Send the constructed URL to the user
    bot.sendMessage(chatId, `Opening the web app with URL: ${webAppUrl}`);
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
      let bonuscase = true;
      const sendRef = await Referral.findOne({
        userId: referralCode,
        code: userId,
      });
      if (sendRef) bonuscase = false;
      if (bonuscase) {
        const oldrefCounts = await Referral.countDocuments({
          code: referralCode,
        });
        if (oldrefCounts > 5) bonuscase = false;
      }
      let bonus = 0;
      if (bonuscase) {
        bonus = 5000;
        // +(referrer.point / 10 > 10000
        //   ? 10000
        //   : Math.round(referrer.point / 10));
      }
      await new Referral({
        code: referralCode,
        userId,
        bonus,
      }).save();
      return null;
    }
    return null;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const checkBonusStatus = async (userId) => {
  try {
    const bonusSum = await Referral.aggregate([
      {
        $match: {
          code: userId,
          status: false,
        },
      },
      {
        $group: {
          _id: null,
          totalBonus: { $sum: "$bonus" },
        },
      },
    ]);

    await Referral.updateMany(
      { code: userId, status: false },
      { $set: { status: true } }
    );
    return bonusSum.length > 0 ? bonusSum[0].totalBonus : 0;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

module.exports = { saveReferralCode, checkBonusStatus, token };
