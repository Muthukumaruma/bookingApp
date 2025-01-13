const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  user: { type: String, required: true }, // user identifier
  hotel: { type: mongoose.Schema.Types.ObjectId, ref: "Hotel", required: true },
  roomsBooked: { type: Number, required: true },
  checkIn: { type: Date, required: true },
  checkOut: { type: Date, required: true },
});

module.exports = mongoose.model("Booking", bookingSchema);
