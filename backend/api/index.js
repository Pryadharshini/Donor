const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI);

app.use("/api/donors", require("../routes/donorRoutes"));
app.use("/api/requests", require("../routes/requestRoutes"));
app.use("/api/donations", require("../routes/donationRoutes"));
app.use("/api/admin", require("../routes/adminRoutes"));

module.exports = app;