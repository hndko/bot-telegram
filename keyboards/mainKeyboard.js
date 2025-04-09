const { Markup } = require("telegraf");

const mainMenu = Markup.inlineKeyboard([
  [
    { text: "🎴 Random Anime", callback_data: "random_picture" },
    { text: "🕌 Jadwal Sholat", callback_data: "sholat_menu" }, // Diubah ke menu sholat
  ],
  [
    { text: "ℹ️ Bot Info", callback_data: "bot_info" },
    { text: "📊 Stats", callback_data: "stats" },
  ],
]).resize();

const backButton = Markup.inlineKeyboard([
  [Markup.button.callback("🔙 Back to Main Menu", "main_menu")],
]);

// Keyboard untuk menu jadwal sholat
const sholatMenu = Markup.inlineKeyboard([
  [
    { text: "Jakarta", callback_data: "sholat_kota:Jakarta" },
    { text: "Bandung", callback_data: "sholat_kota:Bandung" },
    { text: "Surabaya", callback_data: "sholat_kota:Surabaya" },
  ],
  [
    { text: "Medan", callback_data: "sholat_kota:Medan" },
    { text: "Makassar", callback_data: "sholat_kota:Makassar" },
  ],
  [
    { text: "🔍 Cari Kota Lain", callback_data: "sholat_cari" },
    { text: "🔙 Kembali", callback_data: "main_menu" },
  ],
]);

// Keyboard untuk input kota manual
const sholatInputKeyboard = Markup.inlineKeyboard([
  [Markup.button.callback("🔙 Batalkan", "sholat_menu")],
]);

module.exports = {
  mainMenu,
  backButton,
  sholatMenu,
  sholatInputKeyboard,
};
