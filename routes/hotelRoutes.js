const express = require("express");
const Hotel = require("../models/Hotel");
const router = express.Router();

// Get all hotels with optional location filter
router.get("/", async (req, res) => {
  try {
    const { location } = req.query;
    const query = location ? { location } : {};
    const hotels = await Hotel.find(query);
    res.json(hotels);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
