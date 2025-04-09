const ApiService = require("../services/apiService");
const { backButton } = require("../keyboards/mainKeyboard");

class AnimeController {
  static async sendRandomAnimeImage(ctx) {
    try {
      await ctx.answerCbQuery();
      await ctx.replyWithChatAction("upload_photo");

      const imageUrl = await ApiService.getRandomAnimeImage();
      await ctx.replyWithPhoto(imageUrl, {
        caption: "Here is your random anime picture! 🎴",
        ...backButton,
      });
    } catch (error) {
      console.error("Error sending anime image:", error);
      await ctx.reply(
        "Sorry, I couldn't fetch an anime picture right now. 😢",
        backButton
      );
    }
  }
}

module.exports = AnimeController;
