const mongoose = require("mongoose");

const mysql = require("mysql");
const db = mysql.createConnection({
  host: "localhost",
  user: "ziggasa",
  password: "123456",
  database: "ziggasa",
});

const mysqlConnect = () => {
  db.connect(function (err) {
    if (err) {
      console.error("error connecting: " + err.stack);
      return;
    }

    console.log(`"connected as id " + ${db.threadId}`.bgBlue);
  });
};

const connectDB = async () => {
  mongoose.set("strictQuery", true);
  const conn = await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log(`MongoDB connected :${conn.connection.host}`.underline.bgRed);
};

module.exports = { connectDB, mysqlConnect, db };
