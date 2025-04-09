import { db } from "../database/db.js";
import { ADMINS } from "../config.js";

export async function saveUser(tgUser) {
  await db.read();
  let user = db.data.users.find((u) => u.id === tgUser.id);
  if (!user) {
    user = {
      id: tgUser.id,
      name: tgUser.first_name,
      role: ADMINS.includes(tgUser.id) ? "admin" : "user",
    };
    db.data.users.push(user);
    await db.write();
  }
  return user;
}

export async function getUser(id) {
  await db.read();
  return db.data.users.find((u) => u.id === id);
}
