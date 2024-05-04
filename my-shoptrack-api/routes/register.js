const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../db/index");
const router = express.Router();

router.post("/", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingUserQuery = "SELECT * FROM users WHERE email = ?";
    const [existingUser] = await db.promise().query(existingUserQuery, [email]);

    if (existingUser.length > 0) {
      return res
        .status(400)
        .json({ message: "Użytkownik o tym adresie e-mail już istnieje." });
    }

    const existingNameQuery = "SELECT * FROM users WHERE name = ?";
    const [existingName] = await db.promise().query(existingNameQuery, [name]);

    if (existingName.length > 0) {
      return res
        .status(400)
        .json({ message: "Nazwa użytkownika jest już zajęta." });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const insertUserQuery =
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";
    const result = await db
      .promise()
      .query(insertUserQuery, [name, email, hashedPassword]);

    res.status(201).json({ message: "Użytkownik został pomyślnie utworzony." });
  } catch (error) {
    res.status(500).json({
      message: "Wystąpił błąd podczas rejestracji użytkownika.",
      error: error.message,
    });
  }
});

module.exports = router;
