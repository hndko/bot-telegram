const { Markup } = require("telegraf");

const mainMenu = Markup.inlineKeyboard([
  [Markup.button.callback("🎴 Random Anime Picture", "random_picture")],
  [Markup.button.callback("ℹ️ Bot Info", "bot_info")],
  [Markup.button.callback("🗑️ Clear Chat", "clear_chat")],
]);

const backButton = Markup.inlineKeyboard([
  [Markup.button.callback("🔙 Back to Main Menu", "main_menu")],
]);

module.exports = {
  mainMenu,
  backButton,
};
