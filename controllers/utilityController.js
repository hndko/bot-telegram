const { mainMenu, backButton } = require("../keyboards/mainKeyboard");

class UtilityController {
  static async clearChat(ctx) {
    try {
      await ctx.answerCbQuery();

      // Store the message ID of this command
      const commandMessageId = ctx.message?.message_id;

      // Send confirmation message
      const confirmationMessage = await ctx.reply(
        "Are you sure you want to clear this chat? All messages from this bot will be deleted.",
        {
          reply_markup: {
            inline_keyboard: [
              [
                { text: "✅ Yes", callback_data: "confirm_clear" },
                { text: "❌ No", callback_data: "cancel_clear" },
              ],
            ],
          },
        }
      );

      // Store these IDs for later cleanup
      ctx.session.cleanupIds = {
        commandMessageId,
        confirmationMessageId: confirmationMessage.message_id,
      };
    } catch (error) {
      console.error("Error in clearChat:", error);
      await ctx.reply(
        "An error occurred while trying to clear the chat.",
        backButton
      );
    }
  }

  static async confirmClear(ctx) {
    try {
      await ctx.answerCbQuery();

      // Delete the confirmation message and original command first
      try {
        if (ctx.session?.cleanupIds?.confirmationMessageId) {
          await ctx.deleteMessage(ctx.session.cleanupIds.confirmationMessageId);
        }
        if (ctx.session?.cleanupIds?.commandMessageId) {
          await ctx.telegram.deleteMessage(
            ctx.chat.id,
            ctx.session.cleanupIds.commandMessageId
          );
        }
      } catch (e) {
        console.log("Could not delete initial messages:", e.message);
      }

      let messagesDeleted = 0;
      // Start from current message and go backwards
      let messageId = ctx.message?.message_id || 0;
      const deletionLimit = 50; // Limit to prevent API abuse

      while (messageId > 0 && messagesDeleted < deletionLimit) {
        try {
          await ctx.telegram.deleteMessage(ctx.chat.id, messageId);
          messagesDeleted++;
          // Small delay to avoid rate limiting
          await new Promise((resolve) => setTimeout(resolve, 200));
        } catch (err) {
          if (!err.message.includes("message to delete not found")) {
            console.error(`Couldn't delete message ${messageId}:`, err.message);
          }
        }
        messageId--;
      }

      // Send final confirmation (this will be the only remaining message)
      const resultMessage = await ctx.reply(
        `✅ Cleared ${messagesDeleted} bot messages from this chat.`,
        mainMenu
      );

      // Delete this result message after 5 seconds
      setTimeout(async () => {
        try {
          await ctx.telegram.deleteMessage(
            ctx.chat.id,
            resultMessage.message_id
          );
        } catch (e) {
          console.log("Could not auto-delete result message:", e.message);
        }
      }, 5000);
    } catch (error) {
      console.error("Error in confirmClear:", error);
      await ctx.reply("An error occurred while clearing the chat.", mainMenu);
    } finally {
      // Clear cleanup IDs
      if (ctx.session) delete ctx.session.cleanupIds;
    }
  }

  static async cancelClear(ctx) {
    try {
      await ctx.answerCbQuery();
      // Delete confirmation message
      if (ctx.session?.cleanupIds?.confirmationMessageId) {
        await ctx.deleteMessage(ctx.session.cleanupIds.confirmationMessageId);
      }
      // Delete original command message if possible
      if (ctx.session?.cleanupIds?.commandMessageId) {
        try {
          await ctx.telegram.deleteMessage(
            ctx.chat.id,
            ctx.session.cleanupIds.commandMessageId
          );
        } catch (e) {
          console.log("Could not delete command message:", e.message);
        }
      }
      await ctx.reply("Chat clearing canceled.", mainMenu);
    } catch (error) {
      console.error("Error in cancelClear:", error);
      await ctx.reply("An error occurred.", mainMenu);
    } finally {
      if (ctx.session) delete ctx.session.cleanupIds;
    }
  }
}

module.exports = UtilityController;
