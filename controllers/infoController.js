const { backButton } = require("../keyboards/mainKeyboard");

class InfoController {
  static async sendBotInfo(ctx) {
    await ctx.answerCbQuery();
    await ctx.replyWithChatAction("typing");

    const botInfo = `
🤖 *Anime Picture Bot*

This bot provides random anime pictures from the Nekos API.

*Commands:*
- /start - Start the bot
- /menu - Show main menu

*Features:*
- Get random anime pictures
- Simple and intuitive interface

*Developer:* You can add your info here
    `;

    await ctx.replyWithMarkdown(botInfo, backButton);
  }
}

module.exports = InfoController;
