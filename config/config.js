require("dotenv").config();

module.exports = {
  BOT_TOKEN: process.env.BOT_TOKEN,
  API_URL: "https://api.nekosapi.com/v4/images/random?limit=1",
};
