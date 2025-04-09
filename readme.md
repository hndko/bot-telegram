# Anime Picture & Prayer Time Bot 🤖🕌

A Telegram bot that provides random anime pictures and prayer time schedules for various cities in Indonesia.

## Features ✨

- 🎴 Get random anime pictures
- 🕌 Check prayer times for multiple cities
- 🔍 Search prayer times by city name
- 📅 Daily prayer schedules
- 🖼️ Interactive menu system

## Prerequisites 📋

- Node.js (v14 or higher)
- npm or yarn
- Telegram Bot Token from [@BotFather](https://t.me/BotFather)

## Installation ⚙️

1. Clone this repository:

```bash
git clone https://github.com/hndko/bot-telegram
cd bot-telegram
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file and add your credentials:

```env
BOT_TOKEN=your_telegram_bot_token
TITANZ_API_KEY=your_titanz_api_key
```

## Configuration ⚙️

Edit `config/config.js` to modify:

- API endpoints
- Default settings
- Available cities for prayer times

## Available Commands 💻

- `/start` - Start the bot
- `/menu` - Show main menu
- `/sholat [city]` - Get prayer times for a city (default: Jakarta)

## Keyboard Menu 🎹

Main menu provides quick access to:

- Random anime pictures
- Prayer time menu
- Bot information

## How It Works 🤔

1. Users interact with the bot through commands or inline buttons
2. For prayer times:
   - Select from predefined cities or
   - Search for any city by name
3. For anime pictures:
   - Get random images with one click

## Error Handling ⚠️

The bot handles:

- Invalid city names
- API timeouts
- Network errors
- Unexpected input

## Deployment 🚀

To run the bot:

```bash
npm start
or
node app.js
or
nodemon app.js
```

For production, consider using:

- PM2 process manager
- Docker container
- Serverless platform

## Contributing 🤝

Pull requests are welcome! For major changes, please open an issue first.

## License 📄

[MIT](https://choosealicense.com/licenses/mit/)

---

**Enjoy using the bot!** For any questions, please contact the maintainer.
