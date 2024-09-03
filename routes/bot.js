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

const saveReferralCode = async (userId, referralCode, user) => {
  try {
    const referrer = await User.findOne({ chatId: referralCode });
    if (referrer) {
      const oldref = await Referral.findOne({
        code: referralCode,
        userId,
      });
      if (oldref) return null;
      let bonuscase = true;
      let bonuscase5k = false;
      const sendRef = await Referral.findOne({
        userId: referralCode,
        code: userId,
      });
      if (sendRef) bonuscase = false;
      if (bonuscase) {
        const oldrefCounts = await Referral.countDocuments({
          code: referralCode,
        });
        if (oldrefCounts < 5) bonuscase5k = true;
      }
      let bonus = 0;
      if (bonuscase) {
        const point = user ? user.point : 1000;
        bonus =
          (bonuscase5k ? 5000 : 0) +
          (point / 10 > 10000 ? 10000 : Math.round(point / 10));
      }
      await new Referral({
        code: referralCode,
        userId,
        bonus,
        status: bonuscase5k,
      }).save();
      return bonuscase ? (user ? 0 : 1000) : 0;
    }
    return null;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const checkBonusStatus = async (userId) => {
  try {
    const refers = await Referral.find({ code: userId });

    let newBonus = 0;
    refers.forEach(async (refer) => {
      try {
        const referrer = await User.findOne({ chatId: refer.userId });
        if (referrer) {
          const bonus = (refer.status ? 5000 : 0) + referrer.point;
          newBonus += bonus - (refer.read ? refer.bonus : 0);
          await Referral.updateOne(
            { code: userId, userId: refer.userId },
            { bonus, read: true }
          );
        }
      } catch (error) {
        console.log(error);
      }
    });
    return newBonus;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

module.exports = { saveReferralCode, checkBonusStatus, token };
