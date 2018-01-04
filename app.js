var express = require("express");
var cors = require("cors");
var bodyParser = require("body-parser");
var path = require("path");
var fakeMessages = require("./server/example/example-data.js");

var app = express();

//body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//cors middleware
app.use(cors());

//our own logger middleware
app.use((req, res, next) => {
  console.log("we received " + req.method + ", from " + req.url);
  console.log(req.body);
  next();
});

//serve up static files
app.use(express.static("client"));

//routes
app.get("/classes/messages", (req, res) => {
  res.send(fakeMessages.fakeMessages);
});

app.post("/classes/messages", (req, res) => {
  req.body.objectId = fakeMessages.fakeMessages.results.length + 1;
  fakeMessages.fakeMessages.results.push(req.body);
  res.send();
});

app.listen(3000);
console.log("server listening on port 3000...");
