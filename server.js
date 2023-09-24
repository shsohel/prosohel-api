const path = require("path");
const express = require("express");
const dotenv = require("dotenv");
const colors = require("colors");
const upload = require("express-fileupload");
const errorHandler = require("./middleware/error");
const morgan = require("morgan");

dotenv.config({ path: "./config/config.env" });

const cookieParser = require("cookie-parser");

const fileUpload = require("./routes/fileupload");
// const bootcamps = require('./routes/bootcamps');
// const courses = require('./routes/courses');
// const productCategory = require('./routes/productCategory');
// const productSubCategory = require('./routes/productSubCategory');
// const product = require('./routes/product');
// const attribute = require('./routes/attribute');
// const coupon = require('./routes/coupon');
const tag = require("./routes/tag");
const keyword = require("./routes/keyword");
const blog = require("./routes/blog");
const user = require("./routes/user");
const auth = require("./routes/auth");
const role = require("./routes/role");
const category = require("./routes/category");
const comment = require("./routes/comment");

// const brand = require('./routes/brand');
// const event = require('./routes/event');
// const shippingClass = require('./routes/shippingClass');
// const shipping = require('./routes/shipping');
const location = require("./routes/location");

const cors = require("cors");
const connectDB = require("./config/db");
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const xss = require("xss-clean");
const rateLimit = require("express-rate-limit");
const hpp = require("hpp");
//Custom Environment File Run

///Database Connection Run
connectDB();
const app = express();
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://next-e-dashboard.vercel.app",
      "http://127.0.0.1:5173",
    ],
    credentials: true,
  }),
);
app.use(cookieParser());

app.use(express.json());

///Middle Run when Development State
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

///File Upload
app.use(upload());
//Make static path to access publicly
app.use(express.static(path.join(__dirname, "public")));

// To Sanitize Data
app.use(mongoSanitize());

///use for Secure Header
app.use(helmet());

//Secure XSS
app.use(xss());

//Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
});

app.use(limiter);

///secure Http polution
app.use(hpp());
///Mount File Upload Route
app.use("/api/v1/fileupload", fileUpload);

///Mount Tag Route
app.use("/api/v1/auth", auth);

///Mount Tag Route
app.use("/api/v1/tag", tag);
///Mount keyword Route
app.use("/api/v1/keyword", keyword);

///User Route
app.use("/api/v1/user", user);
///role Route
app.use("/api/v1/role", role);
///Category Route
app.use("/api/v1/category", category);
///Blog Route
app.use("/api/v1/blog", blog);
///Comment Route
app.use("/api/v1/comment", comment);

///Location Route
app.use("/api/v1/location", location);

///Handle Error
app.use(errorHandler);

///Server Port
const PORT = process.env.PORT || 5000;

///Server Run Method
const server = app.listen(
  PORT,
  console.log(
    `Serer running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow,
  ),
);

//Handle unhandled promise rejection
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`.red);
  //Close server & exit process
  server.close(() => process.exit(1));
});
