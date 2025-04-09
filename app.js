const { Telegraf } = require("telegraf");
const { mainMenu } = require("./keyboards/mainKeyboard");
const AnimeController = require("./controllers/animeController");
const InfoController = require("./controllers/infoController");
const UtilityController = require("./controllers/utilityController");
const userStore = require("./utils/userStore");
const { BOT_TOKEN } = require("./config/config");

const bot = new Telegraf(BOT_TOKEN);

bot.use(async (ctx, next) => {
  if (ctx.from) {
    await userStore.trackUser(ctx.from);
    await userStore.logRequest(ctx.from.id, ctx.updateType);
  }
  await next();
});

// Log when bot is successfully started
bot
  .launch()
  .then(() => {
    console.log("🤖 Bot is running successfully!");
    console.log("⚡ Ready to handle updates");
    console.log(`🆔 Bot ID: ${bot.botInfo.id}`);
    console.log(`👋 Bot username: @${bot.botInfo.username}`);
  })
  .catch((err) => {
    console.error("❌ Bot failed to start:", err);
    process.exit(1);
  });

// Start command
bot.start(async (ctx) => {
  console.log(
    `🚀 /start command received from ${ctx.from.username || ctx.from.id}`
  );
  await ctx.replyWithMarkdown(
    "🎴 *Welcome to Anime Picture Bot!*\n\nGet random anime pictures with a single tap!",
    mainMenu
  );
});

// Menu command
bot.command("menu", async (ctx) => {
  console.log(
    `📋 /menu command received from ${ctx.from.username || ctx.from.id}`
  );
  await ctx.reply("Main Menu:", mainMenu);
});

// Clear command
bot.command("clear", async (ctx) => {
  console.log(
    `🧹 /clear command received from ${ctx.from.username || ctx.from.id}`
  );
  await UtilityController.clearChat(ctx);
});

// Action handlers
bot.action("random_picture", AnimeController.sendRandomAnimeImage);
bot.action("bot_info", InfoController.sendBotInfo);
bot.action("clear_chat", UtilityController.clearChat);
bot.action("confirm_clear", UtilityController.confirmClear);
bot.action("cancel_clear", UtilityController.cancelClear);
bot.action("main_menu", async (ctx) => {
  await ctx.answerCbQuery();
  await ctx.editMessageText("Main Menu:", mainMenu);
});

// Error handling
bot.catch((err, ctx) => {
  console.error(`❌ Error for ${ctx.updateType}`, err);
  ctx.reply("An error occurred. Please try again later.");
});

// Enable graceful stop
process.once("SIGINT", () => {
  console.log("🛑 Received SIGINT. Shutting down gracefully...");
  bot.stop("SIGINT");
});
process.once("SIGTERM", () => {
  console.log("🛑 Received SIGTERM. Shutting down gracefully...");
  bot.stop("SIGTERM");
});
