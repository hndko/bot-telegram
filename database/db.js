import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";

const adapter = new JSONFile("./assets/database.json");
export const db = new Low(adapter);

await db.read();
db.data ||= { users: [] };
await db.write();
