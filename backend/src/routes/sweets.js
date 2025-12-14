const express = require("express");
const db = require("../db");
const auth = require("../middleware/auth");

const router = express.Router();

/**
 * GET ALL SWEETS (Protected)
 */
router.get("/", auth, (req, res) => {
  db.all("SELECT * FROM sweets", [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

/**
 * SEARCH SWEETS (Protected)
 * ?name=
 * ?category=
 * ?minPrice=
 * ?maxPrice=
 */
router.get("/search", auth, (req, res) => {
  const { name, category, minPrice, maxPrice } = req.query;

  let query = "SELECT * FROM sweets WHERE 1=1";
  const params = [];

  if (name) {
    query += " AND name LIKE ?";
    params.push(`%${name}%`);
  }

  if (category) {
    query += " AND category LIKE ?";
    params.push(`%${category}%`);
  }

  if (minPrice) {
    query += " AND price >= ?";
    params.push(minPrice);
  }

  if (maxPrice) {
    query += " AND price <= ?";
    params.push(maxPrice);
  }

  db.all(query, params, (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

/**
 * ADD SWEET (Admin only)
 */
router.post("/", auth, (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "Admin only" });
  }

  const { name, category, price, quantity } = req.body;

  db.run(
    "INSERT INTO sweets (name, category, price, quantity) VALUES (?, ?, ?, ?)",
    [name, category, price, quantity],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ id: this.lastID });
    }
  );
});

/**
 * PURCHASE SWEET (Protected)
 */
router.post("/:id/purchase", auth, (req, res) => {
  db.run(
    "UPDATE sweets SET quantity = quantity - 1 WHERE id = ? AND quantity > 0",
    [req.params.id],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ success: this.changes === 1 });
    }
  );
});

/**
 * RESTOCK SWEET (Admin only)
 */
router.post("/:id/restock", auth, (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "Admin only" });
  }

  db.run(
    "UPDATE sweets SET quantity = quantity + 10 WHERE id = ?",
    [req.params.id],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ message: "Restocked" });
    }
  );
});

/**
 * UPDATE SWEET (Admin only)
 */
router.put("/:id", auth, (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "Admin only" });
  }

  const { name, category, price, quantity } = req.body;

  db.run(
    `UPDATE sweets
     SET name = COALESCE(?, name),
         category = COALESCE(?, category),
         price = COALESCE(?, price),
         quantity = COALESCE(?, quantity)
     WHERE id = ?`,
    [name, category, price, quantity, req.params.id],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ message: "Sweet updated" });
    }
  );
});

/**
 * DELETE SWEET (Admin only)
 */
router.delete("/:id", auth, (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "Admin only" });
  }

  db.run(
    "DELETE FROM sweets WHERE id = ?",
    [req.params.id],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ message: "Sweet deleted" });
    }
  );
});

module.exports = router;
