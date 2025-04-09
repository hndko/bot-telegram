require("dotenv").config();

module.exports = {
  BOT_TOKEN: process.env.BOT_TOKEN,
  TITANZ_API_KEY: process.env.TITANZ_API_KEY,
  API_URL: "https://api.nekosapi.com/v4/images/random?limit=1",
  SHOLAT_API_URL:
    process.env.SHOLAT_API_URL ||
    "https://api.titanzstore.id/api/jadwal-sholat",
  ALLOWED_CITIES: ["Jakarta", "Bandung", "Surabaya", "Medan", "Makassar"], // Add more as needed
};
