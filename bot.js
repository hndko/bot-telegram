import TelegramBot from "node-telegram-bot-api";
import { TOKEN } from "./config.js";
import { saveUser } from "./features/helper.js";
import { autoReplies } from "./features/keywords.js";
import axios from "axios";

const bot = new TelegramBot(TOKEN, { polling: true });

const mainMenu = {
  reply_markup: {
    inline_keyboard: [
      [{ text: "Cek Cuaca 🌤️", callback_data: "weather" }],
      [{ text: "Info Bot ℹ️", callback_data: "info" }],
    ],
  },
};

// ✅ Log jika bot berhasil dijalankan
console.log("🤖 Bot berhasil dijalankan...");

bot.onText(/\/start/, async (msg) => {
  const user = await saveUser(msg.from);

  const welcomeMessage = `
  👋 <b>Halo, ${user.name}!</b> 🌟

  Selamat datang di <b>Mari Partner Bot</b>! 🤖☁️

  Gunakan menu di bawah untuk mulai menjelajah!
    `;

  bot.sendMessage(msg.chat.id, welcomeMessage, {
    parse_mode: "HTML",
    ...mainMenu,
  });
});

bot.on("callback_query", async (query) => {
  const chatId = query.message.chat.id;
  const data = query.data;

  await bot.sendMessage(
    chatId,
    "⏳ Mohon tunggu sebentar, kami sedang memuat informasi bot..."
  );

  if (data === "weather") {
    try {
      const res = await axios.get(
        "https://api.open-meteo.com/v1/forecast?latitude=-6.2&longitude=106.8&current_weather=true"
      );
      const weather = res.data.current_weather;
      await bot.sendMessage(
        chatId,
        `🌤️ Cuaca saat ini:\n\nSuhu: ${weather.temperature}°C\nAngin: ${weather.windspeed} km/jam`
      );
    } catch (err) {
      await bot.sendMessage(chatId, "❌ Gagal mengambil data cuaca.");
    }
  } else if (data === "info") {
    const infoMessage = `
  <b>🤖 Tentang Mari Partner Bot</b>

  Bot ini dibuat untuk membantu pengguna mengakses berbagai fitur seperti cuaca, info harian, dan lainnya secara interaktif melalui menu tombol.

  💡 Dikembangkan oleh <b>Tim Mari Partner</b> dengan ❤️ menggunakan <i>Node.js + Telegram API</i>.

  📬 Ingin request fitur baru atau membuat bot untuk kebutuhanmu?
  Hubungi kami melalui:
  📧 <b>Email:</b> support@maripartner.com
  🌐 <b>GitHub:</b> https://github.com/maripartner/telegram-bot

  Terima kasih telah menggunakan bot kami!
    `;

    await bot.sendMessage(chatId, infoMessage, {
      parse_mode: "HTML",
    });
  }

  // ✅ Tampilkan kembali menu utama
  await bot.sendMessage(chatId, "Silakan pilih menu:", mainMenu);
  await bot.answerCallbackQuery(query.id);
});

bot.on("message", async (msg) => {
  const text = msg.text?.toLowerCase();
  if (autoReplies[text]) {
    bot.sendMessage(msg.chat.id, autoReplies[text]);
  }
});
