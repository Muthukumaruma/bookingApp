const express = require("express");
const Booking = require("../models/Booking");
const Hotel = require("../models/Hotel");
const router = express.Router();

// List bookings for a user (use a static user ID for simplicity)
router.get("/", async (req, res) => {
  const user = "user123"; // Example static user ID
  try {
    const bookings = await Booking.find({ user }).populate("hotel");
    res.render("bookings", { bookings });
  } catch (err) {
    res.status(500).send("Error fetching bookings");
  }
});

// Booking form
router.get("/new", async (req, res) => {
  const hotels = await Hotel.find({});
  res.render("form", { hotels });
});

// Create booking
router.post("/", async (req, res) => {
  const { user = "user123", hotelId, roomsBooked, checkIn, checkOut } = req.body;

  try {
    const hotel = await Hotel.findById(hotelId);
    if (hotel.roomsAvailable < roomsBooked) {
      return res.status(400).send("Not enough rooms available");
    }

    const booking = new Booking({ user, hotel: hotelId, roomsBooked, checkIn, checkOut });
    await booking.save();

    hotel.roomsAvailable -= roomsBooked;
    await hotel.save();

    res.redirect("/bookings");
  } catch (err) {
    res.status(500).send("Error creating booking");
  }
});

module.exports = router;
