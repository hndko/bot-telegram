const { Markup } = require("telegraf");
const ApiService = require("../services/apiService");
const {
  sholatMenu,
  sholatInputKeyboard,
  backButton,
} = require("../keyboards/mainKeyboard");

class SholatController {
  static async showSholatMenu(ctx) {
    await ctx.answerCbQuery();
    await ctx.replyWithChatAction("typing");
    await ctx.reply("Pilih kota untuk jadwal sholat:", sholatMenu);
  }

  static async handleSholatInput(ctx) {
    await ctx.answerCbQuery();
    await ctx.replyWithChatAction("typing");
    await ctx.reply(
      "Silakan ketik nama kota yang ingin Anda cari jadwal sholatnya:",
      sholatInputKeyboard
    );

    // Simpan state untuk menangkap input berikutnya
    ctx.session.waitingForSholatInput = true;
  }

  static async sendJadwalSholat(ctx) {
    try {
      await ctx.answerCbQuery();

      // Cek jika sedang menunggu input teks
      if (ctx.session.waitingForSholatInput && ctx.message?.text) {
        const kota = ctx.message.text;
        delete ctx.session.waitingForSholatInput;
        return await this.processJadwalSholat(ctx, kota);
      }

      // Handle callback query dengan format sholat_kota:Jakarta
      const kota = ctx.match[1] || "Jakarta";
      await this.processJadwalSholat(ctx, kota);
    } catch (error) {
      console.error("Error fetching prayer schedule:", error);
      await ctx.reply(
        "Maaf, terjadi kesalahan. Silakan coba lagi atau pilih kota lain.",
        sholatMenu
      );
    }
  }

  static async processJadwalSholat(ctx, kota) {
    try {
      await ctx.replyWithChatAction("typing");
      const jadwal = await ApiService.getJadwalSholat(kota);
      const formattedMessage = this.formatJadwalMessage(jadwal, kota);

      await ctx.replyWithMarkdown(formattedMessage, {
        reply_markup: {
          inline_keyboard: [
            [{ text: "🔄 Kota Lain", callback_data: "sholat_menu" }],
            ...backButton.reply_markup.inline_keyboard,
          ],
        },
      });
    } catch (error) {
      throw error;
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
