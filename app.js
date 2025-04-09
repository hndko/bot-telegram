const { Telegraf, session } = require("telegraf");
const { mainMenu } = require("./keyboards/mainKeyboard");
const AnimeController = require("./controllers/animeController");
const InfoController = require("./controllers/infoController");
const SholatController = require("./controllers/sholatController");
const { BOT_TOKEN } = require("./config/config");
const LocalSession = require("telegraf-session-local");

const bot = new Telegraf(BOT_TOKEN);

// Initialize session properly
const localSession = new LocalSession({
  database: "session_db.json", // File to store sessions
  property: "session", // Property name to use in ctx
  storage: LocalSession.storageFileAsync, // Storage method
  format: {
    serialize: (obj) => JSON.stringify(obj, null, 2),
    deserialize: (str) => JSON.parse(str),
  },
});

// Apply session middleware
bot.use(localSession.middleware());

// Add this to ensure session is properly initialized
bot.use((ctx, next) => {
  if (!ctx.session) {
    ctx.session = {};
  }
  return next();
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
    "🤖 Mari Partner Bot \n\n This bot is designed for learning how to create Telegram bots using Node.js.",
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

bot.command("sholat", async (ctx) => {
  const args = ctx.message.text.split(" ").slice(1);
  const kota = args.length > 0 ? args.join(" ") : "Jakarta";

  // Validate city against allowed list
  const { ALLOWED_CITIES } = require("./config/config");
  const normalizedKota = kota.toLowerCase();

  if (!ALLOWED_CITIES.some((c) => c.toLowerCase() === normalizedKota)) {
    return ctx.replyWithMarkdown(
      `Kota *${kota}* tidak tersedia.\n\nKota yang tersedia:\n${ALLOWED_CITIES.map(
        (c) => `- ${c}`
      ).join("\n")}`
    );
  }

  await SholatController.sendJadwalSholat({
    ...ctx,
    match: [null, kota],
  });
});

// Action handlers
bot.action("random_picture", AnimeController.sendRandomAnimeImage);
// bot.action("jadwal_sholat", SholatController.sendJadwalSholat);
bot.action("sholat_menu", SholatController.showSholatMenu);
bot.action("sholat_cari", SholatController.handleSholatInput);
bot.action(/^sholat_kota:(.+)$/, SholatController.sendJadwalSholat);
bot.action("bot_info", InfoController.sendBotInfo);
bot.action("main_menu", async (ctx) => {
  await ctx.answerCbQuery();
  const msg = ctx.update.callback_query.message;

  if (msg.text) {
    await ctx.editMessageText("Main Menu:", mainMenu);
  } else {
    await ctx.reply("Main Menu:", mainMenu);
  }
});

bot.on("text", async (ctx) => {
  // Check if we're expecting city input
  if (ctx.session?.waitingForSholatInput) {
    return SholatController.sendJadwalSholat(ctx);
  }

  // Ignore other text messages or provide help
  if (!ctx.message.text.startsWith("/")) {
    await ctx.reply("Gunakan menu atau perintah yang tersedia");
  }
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
