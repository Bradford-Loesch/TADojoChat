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

var sharedsession = require("express-socket.io-session");


app.get("/", function(req, res){
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
io.use(sharedsession(sess));

var currentUsers = {};
io.sockets.on("connection", function(socket) {
  // Function to translate socket ids to user ids
  getUserIds = function(room) {
    var roomUserIds = [];
    var roomUserSockets = io.sockets.adapter.rooms[room];
    console.log("******************");
    console.log(room);
    console.log(roomUserSockets);
    if (typeof(roomUserSockets) === "undefined") {
      // pass
    } else {
      for (var socket in roomUserSockets.sockets) {
        // console.log(socket);
        roomUserIds.push(currentUsers[socket]);
      }
    }
    return roomUserIds;
  }

  // Receive messages from user and emit to all users
  socket.on("send_message", function(data){
    db.one("INSERT INTO Message(room_id, poster_id, message) VALUES($1,$2,$3) returning Message.id",[data.room, socket.handshake.session.user, data.message]).then(newmessage=>{
      return db.one("SELECT Message.message, Message.created_at, Message.updated_at, Message.poster_id, Users.username FROM Message JOIN Users ON Users.id = Message.poster_id WHERE Message.id = $1", [newmessage.id]).then(message=>{
        io.to(data.room).emit("broadcast_message", message);
        return null;
      }).catch(err=>{
        console.error(err);
        socket.emit("message_error", err);
      });
    });
  });

  // Join room on socket call and emit to other users
  socket.on("join_room", function(room){
    // Add user to list of currentUsers, join room
    if (!(socket.id in currentUsers)){
      currentUsers[socket.id] = socket.handshake.session.user;
    }
    socket.join(room);

    // Check to see if user currently in room list
    db.any("SELECT * from User_Rooms WHERE user_id=$1 and room_id=$2", [socket.handshake.session.user, room]).then(rooms=>{
      if (rooms.length > 0) {
        // console.log("*************roomUsers***********");
        // console.log(currentUsers);
        // console.log(roomUsers);
        data = {
          'id': socket.handshake.session.user,
          'currentUsers': getUserIds(room)
        }
        io.to(room).emit("broadcast_user_connect", data);
      } else {
        db.any("INSERT INTO User_Rooms(user_id, room_id) VALUES ($1, $2)", [socket.handshake.session.user, room]).then(()=>{
          return db.one("SELECT * FROM Users WHERE id=$1", [socket.handshake.session.user]).then(user=>{
            data = {
              'id': socket.handshake.session.user,
              'currentUsers': getUserIds(room),
              'newuser': user
            }
            io.to(room).emit("broadcast_user_connect", data);
            return null;
          });
        }).catch(console.error);
      }
    });
  });

  // Leave room and emit to others
  socket.on("leave_room", function(room){
    socket.leave(room);
    // Remove user from database
    db.any("DELETE FROM User_Rooms WHERE user_id = $1 AND room_id = $2", [socket.handshake.session.user, room]).then(()=>{
      return db.one("SELECT * FROM Users WHERE id=$1", [socket.handshake.session.user]).then(user=>{
        data = {
          'user': user,
          'currentUsers': getUserIds(room)
        }
        socket.broadcast.to(room).emit("broadcast_user_disconnect", data);
        return null;
      });
    }).catch(console.error);
  });

  // Exit from room and update list of current users
  socket.on("disconnect_room", function(room){
    socket.leave(room);
    var currentUsers = getUserIds(room);
    data = {
      'currentUsers': getUserIds(room)
    }
    socket.broadcast.to(room).emit("broadcast_user_disconnect", data);
    return null;
  })

  // Remove user when diconnection occurs
  socket.on("disconnect", function(){
    delete currentUsers[socket.id];
  });
});

// var ioSession = require("io-session");
// io.use(ioSession(session));

ioDelayed.resolve(io);
