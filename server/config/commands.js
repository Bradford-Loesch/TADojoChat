var user_sockets;
var io;
var db = require("./db.js");

module.exports = {
  setup:function(_user_sockets, ioPromise){

    user_sockets = _user_sockets;
    ioPromise.then((_io=>{
      io = _io;
      return null;
    })).catch(console.error);
  },
  whisper:function(args, data, socket){
    var [user, ...message] = args;
    message = message.join(" ");
    if (user in user_sockets){
      db.one("SELECT username FROM Users WHERE id=$1", [socket.handshake.session.user]).then(user=>{
        io.sockets.connected[user_sockets[user.username]].emit("server_message", "Whisper from "+user.name+": "+message);
        return null;
      }).catch(console.error);
    } else {
      return "No such user";
    }
  },
  w:function(args, data, socket){
    return this.whisper(args, data, socket);
  },
  poll:function(args, data, socket){

    var [question, answers] = args.join(" ").split(",");
    for (let i in answers){
      answers[i] = answers[i].trim();
    }
    question = question.trim();
    io.to(data.room).emit("poll", {question:question, answers:answers});
  }

};
