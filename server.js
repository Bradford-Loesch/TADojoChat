
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
})

app.use(sess);

var sharedsession = require("express-socket.io-session");


app.get("/", function(req, res){
  req.session.user = 0;
  static_loader.serve_file(res, "index.html","../client/")
})

app.use( express.static( path.join( root, "client" )));

var ioDelayed = q.defer();

routes(app, ioDelayed.promise, db);

static_loader.install(app);


var server = app.listen(port, function () {
  console.log( `server running on port ${ port }` );
});

var io = socketIO.listen(server);
io.use(sharedsession(sess));
io.sockets.on('connection', function(socket) {
  // Emit to all users that a new user has joined
  db.any("INSERT INTO User_Rooms(room_id, user_id) VALUES($1, $2)", [1, socket.handshake.session.user]).then(function(){
    console.log("********** session user id **************");
    io.emit('broadcast_user_connect', socket.handshake.session.user)
  }).catch(err=>{
    console.error(err);
  });

  // Receive messages from user and emit to all users
  socket.on('send_message', function(data){
    console.log('***********data**************');
    console.log(data);
    db.any("INSERT INTO Message(room_id, poster_id, message) VALUES($1,$2,$3)",[data.room, socket.handshake.session.user, data.message]).then(newMessage=>{
      console.log('************newMessage*************');
      console.log(newMessage);
      db.any("SELECT username FROM Users JOIN Message ON Users.id = Message.poster_id WHERE Message.id=$1",[newMessage.id])
    }).then(user=>{
      console.log('**********sent message************');
      console.log(message);
      io.emit('broadcast_message', message);
    })
  })
  // Remove user when diconnection occurs
  socket.on('disconnect', function(){
    io.emit('broadcast_user_disconnect', socket.handshake.session.user)
    db.any("DELETE FROM User_Rooms WHERE user_id = $1", [socket.handshake.session.user])
  })
})
// var ioSession = require("io-session");
// io.use(ioSession(session));

ioDelayed.resolve(io);
