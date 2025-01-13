const express = require("express");
const Booking = require("../models/Booking");
const Hotel = require("../models/Hotel");
const router = express.Router();

// Book a room
router.post("/", async (req, res) => {
  const { user, hotelId, roomsBooked, checkIn, checkOut } = req.body;

  try {
    const hotel = await Hotel.findById(hotelId);
    if (!hotel || hotel.roomsAvailable < roomsBooked) {
      return res.status(400).json({ message: "Not enough rooms available" });
    }

    const booking = new Booking({ user, hotel: hotelId, roomsBooked, checkIn, checkOut });
    await booking.save();

    hotel.roomsAvailable -= roomsBooked;
    await hotel.save();

    res.status(201).json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get user's bookings
router.get("/:user", async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.params.user }).populate("hotel");
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update booking
router.put("/:id", async (req, res) => {
  const { checkIn, checkOut } = req.body;
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    booking.checkIn = checkIn;
    booking.checkOut = checkOut;
    await booking.save();

    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Cancel booking
router.delete("/:id", async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    const hotel = await Hotel.findById(booking.hotel);
    hotel.roomsAvailable += booking.roomsBooked;
    await hotel.save();

    await booking.remove();
    res.json({ message: "Booking cancelled" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
