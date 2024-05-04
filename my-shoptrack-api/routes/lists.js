const express = require("express");
const router = express.Router();
const db = require("../db/index");
const authenticateToken = require("../middleware/auth");

router.get("/", authenticateToken, (req, res) => {
  const userId = req.user.id;

  const query = "SELECT * FROM list WHERE user_id = ?";

  db.query(query, [userId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

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
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res
        .status(201)
        .json({ id: result.insertId, title, deadline, notes, userId });
    }
  );
});

module.exports = router;

router.get("/:listId/items", authenticateToken, (req, res) => {
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

router.post("/:listId/items", authenticateToken, (req, res) => {
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

router.delete("/:listId", authenticateToken, (req, res) => {
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

router.patch("/:listId/pin", authenticateToken, (req, res) => {
  const { listId } = req.params;
  const query = "UPDATE list SET pinned = TRUE WHERE id = ?";
  db.query(query, [listId], (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Problem pinning the list" });
    }
    res.json({ message: "List pinned successfully", listId });
  });
});

router.patch("/:listId/unpin", authenticateToken, (req, res) => {
  const { listId } = req.params;
  const query = "UPDATE list SET pinned = FALSE WHERE id = ?";
  db.query(query, [listId], (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Problem unpinning the list" });
    }
    res.json({ message: "List unpinned successfully", listId });
  });
});
