
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

var roomid = -1;
io.sockets.on('connection', function(socket) {

  // Join room on socket call and emit to other users
  socket.on('join_room', function(routeroom){
    roomid = routeroom
    socket.join(roomid);
    db.any("INSERT INTO User_Rooms(room_id, user_id) VALUES($1, $2)", [1, socket.handshake.session.user]).then(function(){
      console.log("********** session user id **************");
      socket.broadcast.to(roomid).emit('broadcast_user_connect', socket.handshake.session.user)
    }).catch(err=>{
      console.log(err);
    });
  })

  // Receive messages from user and emit to all users
  socket.on('send_message', function(data){
    console.log('***********data**************');
    console.log(data);
    db.one("INSERT INTO Message(room_id, poster_id, message) VALUES($1,$2,$3) returning message",[data.room, socket.handshake.session.user, data.message]).then(message=>{
      console.log('************newMessage*************');
      console.log(message);
      return db.one("SELECT username FROM Users WHERE id=$1",[socket.handshake.session.user]).then(user=>{
        console.log('**********sent message************');
        console.log(user)
        message.username = user.username;
        console.log(message);
        io.in(roomid).emit('broadcast_message', message);
      })
    })
  })
  // Remove user when diconnection occurs
  socket.on('disconnect', function(){
    io.emit('broadcast_user_disconnect', socket.handshake.session.user)
    db.any("DELETE FROM User_Rooms WHERE user_id = $1 AND room_id = $2", [socket.handshake.session.user, roomid])
  })
})
// var ioSession = require("io-session");
// io.use(ioSession(session));

ioDelayed.resolve(io);
