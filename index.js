const express = require("express");
const app = express(); // create express app
const path = require("path");

//cors
const cors = require("cors");
app.use(cors());

// configure path
app.use(express.static(__dirname));

// add home route
app.get("/", (req, res) => {
    res.sendFile("index.html");
});


// start express server on port 5000
app.listen(5000, () => {
    console.log("server started on port 5000");
});