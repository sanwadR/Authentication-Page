const express = require("express");
const app = express();
require("./db/conn");
const router = require("./routes/router");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const port = 8009;

app.use(express.json());
app.use(cookieParser());
app.use(cors()); // use this because the frontend and backend are working on different ports

app.use(router);

app.get("/", (req, res) => {
  res.send("Welcome to the server!");
});

app.listen(port, () => {
  console.log(`Server started at port: ${port}`);
});
