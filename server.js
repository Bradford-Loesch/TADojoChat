
var express       = require("express"),
  static_loader   = require("utils"),
  q               = require("q"),
  socketIO        = require("socket.io"),
  session         = require("express-session"),
  pgSession       = require("connect-pg-simple")(session),
  pgp             = require("pg-promise")(),
  path            = require("path"),
  routes          = require("./server/config/routes.js"),
  bp              = require("body-parser"),
  root            = __dirname,
  port            = process.env.PORT || 8000,
  app             = express();

// app.use( express.static( path.join( root, "server" )));  Server-side files SHOULD NEVER be client-accessible!
// app.use( express.static( path.join( root, "node_modules" )));

app.use(bp.json());

var cn = {
  database: "chat",
  user: "coder65535",
  password: "Brian1",
  host: "localhost",
  port: 5432
};

var db = pgp(cn);

var sess = session({
  store: new pgSession({
    pg: pgp.pg,
    conString: cn
  }),
  saveUninitialized:true,
  secret:"SecretPassForSessionData",
  resave:"keep"
});

app.use(sess);

// var sharedsession = require("express-socket.io-session");


app.get("/", function(req, res){
  req.session.user = 0;
  static_loader.serve_file(res, "index.html","../client/");
});

app.use( express.static( path.join( root, "client" )));

var ioDelayed = q.defer();

routes(app, ioDelayed.promise, db);

static_loader.install(app);


var server = app.listen(port, function () {
  console.log( `server running on port ${ port }` );
});

var io = socketIO.listen(server);
// io.use(sharedsession(sess));
// io.use(sharedsession(sess));
io.sockets.on("connection", function(socket) {
  console.log("sockets working");
  socket.on("send_message", function(data){
    io.emit("broadcast_message", data);
    db.any("INSERT INTO Message(room_id, poster_id, message) VALUES($1,$2,$3)",[1,socket.handshake.session.user,data.message.content]);
  });
  socket.on("disconnect", function(){
    console.log("logged off");
  });
});
// var ioSession = require("io-session");
// io.use(ioSession(session));

ioDelayed.resolve(io);
