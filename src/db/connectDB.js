const mongoose = require("mongoose");

let connectionURL = process.env.DB_CONNECTION_URL;
connectionURL = connectionURL.replace("<db_username>", process.env.DB_USERNAME);
connectionURL = connectionURL.replace("<db_password>", process.env.DB_PASSWORD);
// connectionURL = `${connectionURL}/${process.env.DB_NAME}?${process.env.DB_URL_QUERY}`;

const connectDB = async () => {
  await mongoose.connect(connectionURL, { dbName: process.env.DB_NAME });

  console.log("Database connected");
};

module.exports = connectDB;
