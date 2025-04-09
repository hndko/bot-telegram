const { backButton } = require("../keyboards/mainKeyboard");

class InfoController {
  static async sendBotInfo(ctx) {
    await ctx.answerCbQuery();
    await ctx.replyWithChatAction("typing");

    const botInfo = `
  🤖 *Mari Partner Bot*

  This bot is designed for learning how to create Telegram bots using Node.js.

  *Commands:*
  - /start - Start the bot
  - /menu - Show main menu

  *Features:*
  - Learn how to build Telegram bots
  - Simple and intuitive interface

  *Developer:* hndko
    `;

    await ctx.replyWithMarkdown(botInfo, backButton);
  }
}

module.exports = InfoController;
