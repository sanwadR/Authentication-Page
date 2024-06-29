const mongoose = require("mongoose");

const DB =
  "mongodb+srv://sanwad:sanwad@cluster0.gyrhkek.mongodb.net/Authusers?retryWrites=true&w=majority&appName=Cluster0";

mongoose
  .connect(DB, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  .then(() => console.log("Database connected"))
  .catch((error) => {
    console.log(error);
  });
