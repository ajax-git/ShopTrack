const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../db/index");
const router = express.Router();

router.post("/", async (req, res) => {
  const { login, password } = req.body;

  try {
    const query = "SELECT * FROM users WHERE email = ? OR name = ?";
    const [user] = await db.promise().query(query, [login, login]);

    if (user.length === 0) {
      return res
        .status(400)
        .json({ message: "Nie znaleziono takiego użytkownika." });
    }

    const isValidPassword = await bcrypt.compare(password, user[0].password);
    if (!isValidPassword) {
      return res
        .status(400)
        .json({ message: "Wprowadzone hasło jest nieprawidłowe." });
    }

    const token = jwt.sign({ id: user[0].id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Wystąpił błąd podczas logowania." });
  }
});

module.exports = router;
