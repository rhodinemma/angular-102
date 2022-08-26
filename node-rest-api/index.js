const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const createError = require('http-errors');

mongoose
  .connect(
    "mongodb+srv://rhodzeey:12345@cluster0.tpb0e.mongodb.net/angularfirst?retryWrites=true&w=majority"
  )
  .then((x) => {
    console.log(`Connect to MongoDB! DatabaseName: "${x.connections[0].name}"`);
  })
  .catch((err) => {
    console.error("Failed to connect to database");
  });

const bookRoute = require("./routes/book.routes");
const app = express();
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);

app.use(cors());

// static directory path
app.use(express.static(path.join(__dirname, "/")));

// API root
app.use("/api", bookRoute);

// Running the API
const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log("Listening on port " + port);
});

// 404 handler
app.use((req, res, next) => {
  next(createError(404));
});

// Base route
app.get("/", (req, res) => {
  res.send("invalid endpoint");
});
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "/src/index.html"));
});

// Error handler
app.use(function (err, req, res, next) {
  console.error(err.message);
  if (!err.statusCode) err.statusCode = 500;
  res.status(err.statusCode).send(err.message);
});
