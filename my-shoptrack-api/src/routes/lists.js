const express = require("express");
const router = express.Router();
const db = require("../../db");
const authenticateToken = require("../middlewares/authenticateToken");

// Pobieranie wszystkich list zakupów użytkownika
router.get("/", authenticateToken, (req, res) => {
  const userId = req.user.id;
  db.query("SELECT * FROM list WHERE user_id = ?", [userId], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Dodawanie nowej listy zakupów
router.post("/", authenticateToken, (req, res) => {
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
      if (err) return res.status(500).json({ error: err.message });
      res
        .status(201)
        .json({ id: result.insertId, title, deadline, notes, userId });
    }
  );
});

// Usuwanie listy zakupów wraz z jej elementami
router.delete("/:listId", authenticateToken, (req, res) => {
  const { listId } = req.params;
  db.query("DELETE FROM item WHERE list_id = ?", [listId], (err, result) => {
    if (err)
      return res.status(500).json({ error: "Problem deleting list items" });
    db.query("DELETE FROM list WHERE id = ?", [listId], (err, result) => {
      if (err)
        return res.status(500).json({ error: "Problem deleting the list" });
      res.json({
        message: "List and associated items deleted successfully",
        listId,
      });
    });
  });
});

// Przypinanie listy
router.patch("/:listId/pin", authenticateToken, (req, res) => {
  const { listId } = req.params;
  db.query(
    "UPDATE list SET pinned = TRUE WHERE id = ?",
    [listId],
    (err, result) => {
      if (err)
        return res.status(500).json({ error: "Problem pinning the list" });
      res.json({ message: "List pinned successfully", listId });
    }
  );
});

// Odpinanie listy
router.patch("/:listId/unpin", authenticateToken, (req, res) => {
  const { listId } = req.params;
  db.query(
    "UPDATE list SET pinned = FALSE WHERE id = ?",
    [listId],
    (err, result) => {
      if (err)
        return res.status(500).json({ error: "Problem unpinning the list" });
      res.json({ message: "List unpinned successfully", listId });
    }
  );
});

// Dodawanie elementów do listy
router.post("/:listId/items", authenticateToken, (req, res) => {
  const { listId } = req.params;
  const { name, quantity } = req.body;
  const query = `
    INSERT INTO item (list_id, name, quantity, is_purchased, created_at, updated_at)
    VALUES (?, ?, ?, FALSE, NOW(), NOW())
  `;
  db.query(query, [listId, name, quantity], (err, result) => {
    if (err) return res.status(500).json({ error: "Problem adding list item" });
    res
      .status(201)
      .json({ id: result.insertId, list_id: listId, name, quantity });
  });
});

// Pobieranie elementów określonej listy
router.get("/:listId/items", authenticateToken, (req, res) => {
  const { listId } = req.params;
  db.query("SELECT * FROM item WHERE list_id = ?", [listId], (err, result) => {
    if (err)
      return res.status(500).json({ error: "Problem fetching list items" });
    res.json(result);
  });
});

// Usuwanie określonego elementu z listy
router.delete("/items/:itemId", authenticateToken, (req, res) => {
  const { itemId } = req.params;
  db.query("DELETE FROM item WHERE id = ?", [itemId], (err, result) => {
    if (err)
      return res.status(500).json({ error: "Problem deleting the item" });
    res.json({ message: "Item deleted successfully", itemId });
  });
});

// Oznaczanie elementu jako kupionego
router.patch("/items/:itemId/purchase", authenticateToken, (req, res) => {
  const { itemId } = req.params;
  db.query(
    "UPDATE item SET is_purchased = TRUE WHERE id = ?",
    [itemId],
    (err, result) => {
      if (err)
        return res.status(500).json({ error: "Problem updating the item" });
      res.json({ message: "Item marked as purchased", itemId });
    }
  );
});

module.exports = router;
