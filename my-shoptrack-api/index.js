const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
require("dotenv").config();

const listsRoutes = require("./src/routes/lists");
const usersRoutes = require("./src/routes/users");
const errorHandler = require("./src/middlewares/errorHandler");

const app = express();

//app.use(cors());
const allowedOrigins = ["https://ajax22.pl", "https://www.ajax22.pl"];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    optionsSuccessStatus: 200,
  })
);

app.use(helmet());
app.use(express.json());

app.use("/lists", listsRoutes);
app.use("/users", usersRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Shoptrack API works!" });
});

app.use(errorHandler);

//const PORT = process.env.PORT || 3000;
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
