const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./watchparty.db", (err) => {
  if (err) {
    console.log("❌ DB Error:", err);
  } else {
    console.log("✅ SQLite Connected");
  }
});

module.exports = db;