require("dotenv").config();
const ejsLayouts = require('express-ejs-layouts');
const express = require("express");
const bodyParser = require("body-parser");
const connectDB = require("./config/db");
const path = require("path");

const hotelRoutes = require("./routes/hotelRoutes");
const bookingRoutes = require("./routes/bookingRoutes");

const app = express();
connectDB();



// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.use(ejsLayouts);

// Set EJS as the view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Routes
app.use("/api/hotels", hotelRoutes);
app.use("/api/bookings", bookingRoutes);

// Frontend routes
app.get("/", (req, res) => res.redirect("/hotels"));
app.use("/hotels", require("./routes/hotelRoutesUI"));
app.use("/bookings", require("./routes/bookingRoutesUI"));

module.exports = app;
