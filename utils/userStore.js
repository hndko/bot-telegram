const fs = require("fs");
const path = "./data/users.json";

if (!fs.existsSync("./data")) fs.mkdirSync("./data");
if (!fs.existsSync(path))
  fs.writeFileSync(path, JSON.stringify({ users: {} }, null, 2));

class UserStore {
  static _read() {
    return JSON.parse(fs.readFileSync(path));
  }

  static _write(data) {
    fs.writeFileSync(path, JSON.stringify(data, null, 2));
  }

  static async trackUser(user) {
    const db = this._read();
    if (!db.users[user.id]) {
      db.users[user.id] = {
        username: user.username || "",
        blocked: false,
        requestLogs: [],
      };
      this._write(db);
    }
  }

  static async logRequest(userId, type) {
    const db = this._read();
    if (db.users[userId]) {
      db.users[userId].requestLogs.push({
        type,
        timestamp: new Date().toISOString(),
      });
      this._write(db);
    }
  }

  static getStats() {
    const db = this._read();
    const now = new Date();
    const daily = {};
    const weekly = {};

    for (const userId in db.users) {
      const logs = db.users[userId].requestLogs || [];
      logs.forEach((log) => {
        const date = new Date(log.timestamp);
        const day = date.toISOString().split("T")[0];

        // Daily count
        daily[day] = (daily[day] || 0) + 1;

        // Weekly count
        const weekKey = `${date.getFullYear()}-W${getWeekNumber(date)}`;
        weekly[weekKey] = (weekly[weekKey] || 0) + 1;
      });
    }

    return { daily, weekly };
  }

  static listUsers() {
    const db = this._read();
    return db.users;
  }

  static blockUser(userId) {
    const db = this._read();
    if (db.users[userId]) {
      db.users[userId].blocked = true;
      this._write(db);
    }
  }

  static unblockUser(userId) {
    const db = this._read();
    if (db.users[userId]) {
      db.users[userId].blocked = false;
      this._write(db);
    }
  }

  static isBlocked(userId) {
    const db = this._read();
    return db.users[userId]?.blocked || false;
  }
}

function getWeekNumber(d) {
  d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
  return weekNo;
}

module.exports = UserStore;
