const express = require("express");
const db = require("../db");
const auth = require("../middleware/auth");

const router = express.Router();

router.post("/", auth, (req, res) => {
  const { name, category, price, quantity } = req.body;

  db.run(
    "INSERT INTO sweets (name, category, price, quantity) VALUES (?, ?, ?, ?)",
    [name, category, price, quantity],
    function () {
      res.json({ id: this.lastID });
    }
  );
});

router.get("/", auth, (req, res) => {
  db.all("SELECT * FROM sweets", [], (err, rows) => {
    res.json(rows);
  });
});

router.post("/:id/purchase", auth, (req, res) => {
  db.run(
    "UPDATE sweets SET quantity = quantity - 1 WHERE id = ? AND quantity > 0",
    [req.params.id],
    function () {
      res.json({ success: this.changes === 1 });
    }
  );
});

router.post("/:id/restock", auth, (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "Admin only" });
  }

  db.run(
    "UPDATE sweets SET quantity = quantity + 10 WHERE id = ?",
    [req.params.id],
    () => res.json({ message: "Restocked" })
  );
});

module.exports = router;
