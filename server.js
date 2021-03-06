const path = require("path");

const express = require("express");

const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");

const app = express();

app.use(express.json());
app.use(cors());
app.use("/uploads", express.static(path.join("uploads")));

//ROUTES
app.use("/", authRoutes);
app.use("/", productRoutes);

// Database Connection
const PORT = process.env.PORT || process.env.API_PORT;
const CONNECTION_URL = process.env.MONGO_URI;

mongoose
  .connect(CONNECTION_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(PORT, () => {
      console.log("server run at: ", PORT);
    });
  })
  .catch((err) => console.log(err));
