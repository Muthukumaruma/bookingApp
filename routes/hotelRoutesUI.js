const express = require("express");
const Hotel = require("../models/Hotel");
const router = express.Router();

// List all hotels
router.get("/", async (req, res) => {
  try {
    const { location } = req.query;
    const query = location ? { location } : {};
    const hotels = await Hotel.find(query);
    res.render("hotels", { hotels });
  } catch (err) {
    res.status(500).send("Error fetching hotels");
  }
});

module.exports = router;
