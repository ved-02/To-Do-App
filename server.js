const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
require("dotenv").config();
const rootRoute = require("./routes/rootRoute");
const accountRoute = require("./routes/accountRoute");

const app = express();
const PORT = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.use(express.static(__dirname+"/public"));
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// DB
dbConnect().catch(err => console.log(err));
async function dbConnect() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Database connected");
}

app.use("/", rootRoute);
app.use("/account", accountRoute);


app.listen(PORT, () => {
    console.log(`app listening on port ${PORT}`);
});