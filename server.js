var express       = require("express"),
  static_loader   = require("utils"),
  socketIO        = require("socket.io"),
  session         = require("express-session"),
  pgSession       = require("connect-pg-simple")(session),
  pgp             = require("pg-promise")(),
  q               = require("q"),
  path            = require("path"),
  routes          = require("./server/config/routes.js"),
  commands        = require("./server/config/commands.js"),
  bp              = require("body-parser"),
  root            = __dirname,
  port            = process.env.PORT || 8000,
  app             = express(),
  db              = require("./server/config/db.js");

// app.use( express.static( path.join( root, "server" )));  Server-side files SHOULD NEVER be client-accessible!
// app.use( express.static( path.join( root, "node_modules" )));

var user_sockets = {};

app.use(bp.json());

var sess = session({
  store: new pgSession({
    pg: pgp.pg,
    conString: {
      database: "chat",
      user: "coder65535",
      password: "Brian1",
      host: "localhost",
      port: 5432
    }
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


var ioDeferred = q.defer();
routes(app, ioDeferred.promise);
commands.setup(user_sockets, ioDeferred);

static_loader.install(app);


var server = app.listen(port, function () {
  console.log( `server running on port ${ port }` );
});

var io = socketIO.listen(server);
io.use(sharedsession(sess));
io.sockets.on("connection", function(socket) {
  db.one("SELECT * FROM Users WHERE id=$1",[socket.handshake.session.user]).then(user=>{
    user_sockets[user.username] = socket;
    return null;
  }).catch(err=>{
    console.error(err);
  });

  // Join room on socket call and emit to other users

  // Receive messages from user and emit to all users
  socket.on("send_message", function(data){
    console.log("***********data**************");
    console.log(data);
    if (data.message[0] === "/"){
      var [command, ...args] = data.message.split(" ");
      command = command.substring(1);
      console.log("SERVER COMMAND: ",command+ ": "+args);
      if (commands[command] && command !== "setup"){
        var output = commands[command](args, socket, data);
        if (output){
          var res = {output:output, room:data.room};
          socket.emit("server_message",res); //call the command specified by "command" with the given args
        }
      } else {
        socket.emit("server_message",{output:command+"is not a command", room:data.room});
      }
    } else {
      db.one("INSERT INTO Message(room_id, poster_id, message) VALUES($1,$2,$3) returning message",[data.room, socket.handshake.session.user, data.message]).then(message=>{
        console.log("************newMessage*************");
        console.log(message);
        message.user = socket.handshake.session.user;
        message.room = data.room;
        console.log(message);
        io.to(data.room).emit("broadcast_message", message);
        console.log("**********sent message************");
        return null;
      }).catch(err=>{
        console.error(err);
        socket.emit("message_error", err);
      });
    }
  });
  socket.on("join_room", function(room){
    socket.join(room);
    db.any("INSERT INTO User_Rooms(user_id, room_id), VALUES ($1, $2)", [socket.handshake.session.user, room]).then(()=>{
      return db.one("SELECT * FROM Users WHERE id=$1", [socket.handshake.session.user]).then(user=>{
        console.log("********** session user id **************");
        socket.broadcast.to(room).emit("broadcast_user_disconnect", user.id);
        return null;
      });
    }).catch(console.error);
  });
  socket.on("leave_room", function(room){
    socket.leave(room);
    db.any("DELETE FROM User_Rooms WHERE user_id = $1 AND room_id = $2", [socket.handshake.session.user, room]).then(()=>{
      return db.one("SELECT * FROM Users WHERE id=$1", [socket.handshake.session.user]).then(user=>{
        console.log("********** session user id **************");
        socket.broadcast.to(room).emit("broadcast_user_connect", user);
        return null;
      });
    }).catch(console.error);
  });

  // Remove user when diconnection occurs
  socket.on("disconnect", function(){
    io.emit("broadcast_user_disconnect", socket.handshake.session.user);
    db.any("DELETE FROM User_Rooms WHERE user_id = $1", [socket.handshake.session.user]);
  });
});

// var ioSession = require("io-session");
// io.use(ioSession(session));

ioDeferred.resolve(io);
