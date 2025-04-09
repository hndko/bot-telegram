const { Markup } = require("telegraf");
const ApiService = require("../services/apiService");
const {
  sholatMenu,
  sholatInputKeyboard,
  backButton,
} = require("../keyboards/mainKeyboard");

class SholatController {
  static async showSholatMenu(ctx) {
    // Only answer callback query if it's from a button
    if (ctx.callbackQuery) {
      await ctx.answerCbQuery();
    }
    await ctx.replyWithChatAction("typing");
    await ctx.reply("Pilih kota untuk jadwal sholat:", sholatMenu);
  }

  static async handleSholatInput(ctx) {
    // Only answer callback query if it's from a button
    if (ctx.callbackQuery) {
      await ctx.answerCbQuery();
    }
    await ctx.replyWithChatAction("typing");

    // Initialize session safely
    ctx.session = ctx.session || {};
    ctx.session.waitingForSholatInput = true;

    await ctx.reply(
      "Silakan ketik nama kota yang ingin Anda cari jadwal sholatnya:",
      sholatInputKeyboard
    );
  }

  static async sendJadwalSholat(ctx) {
    try {
      // Only answer callback query if it's from a button
      if (ctx.callbackQuery) {
        await ctx.answerCbQuery();
      }

      // Check session safely
      const session = ctx.session || {};

      if (session.waitingForSholatInput && ctx.message?.text) {
        const kota = ctx.message.text;
        delete session.waitingForSholatInput;
        return await SholatController.processJadwalSholat(ctx, kota);
      }

      const kota = ctx.match?.[1] || "Jakarta";
      await SholatController.processJadwalSholat(ctx, kota);
    } catch (error) {
      console.error("Error:", error);
      await ctx.reply(
        "Maaf, terjadi kesalahan. Silakan coba lagi.",
        sholatMenu
      );
    }
  }

  static async processJadwalSholat(ctx, kota) {
    try {
      await ctx.replyWithChatAction("typing");
      const jadwal = await ApiService.getJadwalSholat(kota);
      const formattedMessage = SholatController.formatJadwalMessage(
        jadwal,
        kota
      );

      await ctx.replyWithMarkdown(formattedMessage, {
        reply_markup: {
          inline_keyboard: [
            [{ text: "🔄 Kota Lain", callback_data: "sholat_menu" }],
            ...backButton.reply_markup.inline_keyboard,
          ],
        },
      });
    } catch (error) {
      console.error("Error processing prayer schedule:", error);
      await ctx.reply(
        `Maaf, tidak bisa mendapatkan jadwal sholat untuk ${kota}. Silakan coba dengan kota lain.`,
        sholatMenu
      );
    }
  }

  static formatJadwalMessage(jadwal, kota) {
    return `
🕌 *Jadwal Sholat untuk ${kota}*

📅 ${jadwal.tanggal}

⏰ Waktu Sholat:
├ Imsak: ${jadwal.imsak}
├ Subuh: ${jadwal.subuh}
├ Terbit: ${jadwal.terbit}
├ Dhuha: ${jadwal.dhuha}
├ Dzuhur: ${jadwal.dzuhur}
├ Ashar: ${jadwal.ashar}
├ Maghrib: ${jadwal.maghrib}
└ Isya: ${jadwal.isya}

_Semoga bermanfaat untuk ibadah Anda._
    `;
  }
}

module.exports = SholatController;
