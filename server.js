var express = require("express");
var app = express();

var q = require("q");

var socketIO = require("socket.io");

app.use(require("body-parser").json());

var pgp = require("pg-promise")();
var db = pgp({
  "database": "chat",
  "user": "coder65535",
  "password": "Brian1",
  "host": "localhost",
  "port": "5432"
});
var session = require("express-session");
var pgSession = require("connect-pg-simple")(session);
app.use(session({
  store: new pgSession({
    pg:pgp.pg,
    conString:{
      "database": "chat",
      "user": "coder65535",
      "password": "Brian1",
      "host": "localhost",
      "port": "5432"
    }
  }),
  saveUninitialized:true,
  secret:"SecretPassForSessionData",
  resave:"keep"
}));

var static_loader = require("utils");


var ioDelayed = q.defer();

var routes = require("./server/config/routes.js");
routes(app, ioDelayed.promise, db);

static_loader.install(app);

app.set("views", __dirname + "/client");
app.set("view engine", "ejs");

// NOTE: Begin static page routing block
app.get("/", function(req, res){
  if (req.session.user){
    res.redirect("/trading/");
    return;
  }
  static_loader.serve_static(res, "index.html");
});
// NOTE: End static page routing block

var server = app.listen(8000, function () {
  console.log("Listening");
});

var io = socketIO.listen(server);
// var ioSession = require("io-session");
// io.use(ioSession(session));

ioDelayed.resolve(io);
