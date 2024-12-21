const mongoose = require("mongoose");

const DB = process.env.DBURL;

mongoose.connect(DB, {})
    .then(() => console.log("Database connection established"))
    .catch((err) => console.error("Database connection error:", err.message));