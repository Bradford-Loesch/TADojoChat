var express         = require("express"),
    static_loader   = require("utils"),
    q               = require("q"),
    socketIO        = require("socket.io"),
    session         = require("express-session"),
    pgSession       = require("connect-pg-simple")(session),
    pgp             = require("pg-promise")(),
    routes          = require("./server/config/routes.js"),
    bp              = require("body-parser"),
    app             = express();

app.use( express.static( path.join( root, 'client' )));
app.use( express.static( path.join( root, 'server' )));
app.use( express.static( path.join( root, 'node_modules' )));
app.use(bp.json());

var db = pgp({
  "database": "chat",
  "user": "coder65535",
  "password": "Brian1",
  "host": "localhost",
  "port": "5432"
});
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



var ioDelayed = q.defer();

routes(app, ioDelayed.promise, db);

static_loader.install(app);


// app.set("views", __dirname + "/client");
// app.set("view engine", "ejs");

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
  console.log("Listening on port 8000");
});

var io = socketIO.listen(server);
// var ioSession = require("io-session");
// io.use(ioSession(session));

ioDelayed.resolve(io);
