class ChatCleaner {
  static async deleteBotMessages(ctx) {
    const chatId = ctx.chat.id;
    let messagesDeleted = 0;
    let offset = 0;
    const limit = 100;

    try {
      while (true) {
        const messages = await ctx.telegram.getChatHistory(
          chatId,
          offset,
          0,
          limit
        );
        if (messages.length === 0) break;

        const botMessages = messages.filter(
          (msg) => msg.from && msg.from.id === ctx.botInfo.id
        );

        for (const msg of botMessages) {
          try {
            await ctx.telegram.deleteMessage(chatId, msg.message_id);
            messagesDeleted++;
          } catch (err) {
            console.error(
              `Couldn't delete message ${msg.message_id}:`,
              err.message
            );
          }
        }

        offset += limit;
      }

      return messagesDeleted;
    } catch (error) {
      console.error("Error in deleteBotMessages:", error);
      throw error;
    }
  }
}

module.exports = ChatCleaner;
