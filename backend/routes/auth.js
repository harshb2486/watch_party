const express = require("express");
const router = express.Router();
const db = require("../config/db");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


// REGISTER
router.post("/register", async (req, res) => {
  const { username, password } = req.body;

  try {
    const hashed = await bcrypt.hash(password, 10);

    const sql = "INSERT INTO users (username, password) VALUES (?, ?)";

    db.run(sql, [username, hashed], function (err) {
      if (err) {
        console.log("REGISTER ERROR:", err);
        return res.json({ error: "User exists" });
      }

      res.json({ success: true });
    });

  } catch (err) {
    console.log("REGISTER CRASH:", err);
    res.status(500).json({ error: "Server error" });
  }
});


// LOGIN
router.post("/login", (req, res) => {
  const { username, password } = req.body;

  const sql = "SELECT * FROM users WHERE username = ?";

  db.get(sql, [username], async (err, user) => {
    if (err) {
      console.log("DB ERROR:", err);
      return res.status(500).json({ error: "DB error" });
    }

    if (!user) {
      return res.json({ error: "User not found" });
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.json({ error: "Wrong password" });
    }

    const token = jwt.sign(
      { id: user.id, username },
      "SECRET_KEY"
    );

    res.json({ token });
  });
});

module.exports = router;