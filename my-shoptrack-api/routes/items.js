const express = require("express");
const db = require("../db");
const authenticateToken = require("../middleware/auth");
const router = express.Router();

router.delete("/:itemId", authenticateToken, (req, res) => {
  const { itemId } = req.params;
  const query = "DELETE FROM item WHERE id = ?";
  db.query(query, [itemId], (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Problem deleting the item" });
    }
    res.json({ message: "Item deleted successfully", itemId });
  });
});

router.patch("/:itemId/purchase", authenticateToken, (req, res) => {
  const { itemId } = req.params;
  const query = "UPDATE item SET is_purchased = TRUE WHERE id = ?";
  db.query(query, [itemId], (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Problem updating the item" });
    }
    res.json({ message: "Item marked as purchased", itemId });
  });
});

module.exports = router;
