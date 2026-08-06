// config/db.js
// This file is responsible for connecting our backend to MongoDB Atlas using Mongoose.

const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    // mongoose.connect() returns a Promise, so we use await to wait for it to finish
    const conn = await mongoose.connect(process.env.MONGO_URI);

    // If successful, conn.connection.host tells us which server we connected to
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    // If connection fails, log the error and stop the entire app.
    // There's no point running a server that has no database connection.
    console.error(`MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;