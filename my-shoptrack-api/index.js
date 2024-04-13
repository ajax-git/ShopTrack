const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

const db = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "shoptrack",
  password: process.env.DB_PASS || "123",
  database: process.env.DB_NAME || "shoptrack",
});

app.get("/", (req, res) => {
  res.json({ message: "Shoptrack API works!" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`The server runs on the port ${PORT}`);
});

// Middleware do weryfikacji tokenu JWT
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

app.get("/", (req, res) => {
  res.json({ message: "Shoptrack API works!" });
});

// POST endpoint - dodaje nową listę zakupów i przypisuje ją do zalogowanego użytkownika
app.post("/lists", authenticateToken, (req, res) => {
  const { title, deadline, notes } = req.body;
  const userId = req.user.id;

  const query = `
    INSERT INTO list (title, deadline, notes, user_id, created_at, updated_at)
    VALUES (?, ?, ?, ?, NOW(), NOW())
  `;

  db.query(
    query,
    [title, deadline || null, notes || "", userId],
    (err, result) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res
        .status(201)
        .json({ id: result.insertId, title, deadline, notes, userId });
    }
  );
});

// GET endpoint - zwraca listę wszystkich list zakupów dla zalogowanego użytkownika
app.get("/lists", authenticateToken, (req, res) => {
  const userId = req.user.id;

  const query = "SELECT * FROM list WHERE user_id = ?";

  db.query(query, [userId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// GET endpoint - zwraca wszystkie elementy należące do określonej listy zakupów
app.get("/lists/:listId/items", authenticateToken, (req, res) => {
  const { listId } = req.params;
  const userId = req.user.id;

  const listOwnerQuery = "SELECT * FROM list WHERE id = ? AND user_id = ?";
  db.query(listOwnerQuery, [listId, userId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (results.length === 0) {
      return res.status(403).json({
        error: "You do not have permission to view this list's items.",
      });
    }

    const query = "SELECT * FROM item WHERE list_id = ?";
    db.query(query, [listId], (err, result) => {
      if (err) {
        return res.status(500).json({ error: "Problem fetching list items" });
      }
      res.json(result);
    });
  });
});

// POST endpoint - dodaje nowy element do określonej listy zakupów
app.post("/lists/:listId/items", authenticateToken, (req, res) => {
  const { listId } = req.params;
  const { name, quantity } = req.body;
  if (!name || !quantity) {
    return res.status(400).json({ error: "Name and quantity are required" });
  }
  const query =
    "INSERT INTO item (list_id, name, quantity, is_purchased, created_at, updated_at) VALUES (?, ?, ?, FALSE, NOW(), NOW())";
  db.query(query, [listId, name, quantity], (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Problem adding list item" });
    }
    res
      .status(201)
      .json({ id: result.insertId, list_id: listId, name, quantity });
  });
});

// DELETE endpoint - usuwa określony element z listy zakupów
app.delete("/items/:itemId", authenticateToken, (req, res) => {
  const { itemId } = req.params;
  const query = "DELETE FROM item WHERE id = ?";
  db.query(query, [itemId], (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Problem deleting the item" });
    }
    res.json({ message: "Item deleted successfully", itemId });
  });
});

// PATCH endpoint - oznacza określony element jako kupiony
app.patch("/items/:itemId/purchase", authenticateToken, (req, res) => {
  const { itemId } = req.params;
  const query = "UPDATE item SET is_purchased = TRUE WHERE id = ?";
  db.query(query, [itemId], (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Problem updating the item" });
    }
    res.json({ message: "Item marked as purchased", itemId });
  });
});

// DELETE endpoint - usuwa określoną listę zakupów wraz z jej elementami
app.delete("/lists/:listId", authenticateToken, (req, res) => {
  const { listId } = req.params;
  const deleteItemsQuery = "DELETE FROM item WHERE list_id = ?";
  db.query(deleteItemsQuery, [listId], (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Problem deleting list items" });
    }
    const deleteListQuery = "DELETE FROM list WHERE id = ?";
    db.query(deleteListQuery, [listId], (err, result) => {
      if (err) {
        return res.status(500).json({ error: "Problem deleting the list" });
      }
      res.json({
        message: "List and associated items deleted successfully",
        listId,
      });
    });
  });
});

// PATCH endpoint - przypina określoną listę zakupów
app.patch("/lists/:listId/pin", authenticateToken, (req, res) => {
  const { listId } = req.params;
  const query = "UPDATE list SET pinned = TRUE WHERE id = ?";
  db.query(query, [listId], (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Problem pinning the list" });
    }
    res.json({ message: "List pinned successfully", listId });
  });
});

// PATCH endpoint - odpina określoną listę zakupów
app.patch("/lists/:listId/unpin", authenticateToken, (req, res) => {
  const { listId } = req.params;
  const query = "UPDATE list SET pinned = FALSE WHERE id = ?";
  db.query(query, [listId], (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Problem unpinning the list" });
    }
    res.json({ message: "List unpinned successfully", listId });
  });
});

// Endpoint rejestracji
app.post("/register", async (req, res) => {
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

// ENDPOINT logowania
app.post("/login", async (req, res) => {
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
