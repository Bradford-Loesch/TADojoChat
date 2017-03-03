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
    if (!message || message.length === 0){
      return "Usage: /whisper <user> <message> \nMessage may contain spaces.\nSends a \"whisper\" message to the given user. Other users will not see the message.";
    }
    message = message.join(" ");
    if (user in user_sockets){
      db.one("SELECT username FROM Users WHERE id=$1", [socket.handshake.session.user]).then(sender=>{
        io.sockets.connected[user_sockets[user.username]].emit("server_message", {output:"Whisper from "+sender.name+": "+message, room:null});
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
    var [question, ...answers] = args.join(" ").split("#");
    for (let i in answers){
      answers[i] = answers[i].trim();
    }
    question = question.trim();
    if (!answers || answers.length <= 1){
      return "Usage: /poll <question>*<answer>*<answer>[*<answer>[...]]";
    }
    db.tx(t=>{
      return t.oneOrNone("SELECT * FROM Poll_Question WHERE room_id = $1 AND open = true",[data.room]).then(active=>{
        console.log(active)
        if (active){
          socket.emit("server_message",{output:"There is already an active poll.", room:data.room});
          return null;
        }
        return t.one("INSERT INTO Poll_Question(question, room_id) VALUES ($1, $2) RETURNING id",[question,data.room]).then(res=>{
          console.log(res.id);
          var queries = [];
          for (let answer of answers){
            queries.push(t.any("INSERT INTO Poll_Answer(answer, question_id) VALUES ($1, $2)",[answer, res.id]));
          }
          return t.batch(queries);
        });
      });
    }).then(()=>{
      io.to(data.room).emit("poll", {question:question, answers:answers});
      return null;
    }).catch(err=>{
      console.error(err);
    });
  },
  p:function(args, data, socket){
    return this.poll(args, data, socket);
  },
  vote:function(args, data, socket){
    var [id, ...bad] = args;
    if (!id || bad || id < 1){
      return "Usage: /vote <id>\nid is the id of the answer you wish to vote for.\nIf you vote for another answer, your first vote will be removed.";
    }
    db.oneOrNone("SELECT * FROM Poll_Question WHERE room_id = $1 AND open = true",[data.room]).then(active=>{
      if (!active){
        socket.emit("server_message",{output:"There is no active poll.", room:data.room});
        return null;
      }
      return db.oneOrNone("SELECT * FROM Poll_Answer WHERE question_id=$1 AND number = $2",[active.id, id]).then(ans=>{
        if (!ans){
          socket.emit("server_message",{output:"That is not a valid answer.", room:data.room});
          return null;
        }
        return db.any("INSERT INTO Poll_Vote(user_id, answer_id) VALUES ($1, $2)",[socket.handshake.session.user, ans.id]).then(()=>{
          return db.any("SELECT * FROM Poll WHERE room_id=$1 AND open=true;").then(answers=>{
            io.to(data.room).emit("poll_update",answers);
            return null;
          });
        });
      });
    }).catch(console.error);
  },
  v:function(args, data, socket){
    return this.vote(args, data, socket);
  },
  closepoll:function(args, data, socket){
    db.oneOrNone("SELECT * FROM Poll_Question WHERE room_id = $1 AND open = true",[data.room]).then(active=>{
      if (!active){
        socket.emit("server_message",{output:"There is no active poll.", room:data.room});
        return null;
      }
      return db.any("UPDATE Poll_Question SET open=false WHERE id=$1",[active.id]);
    }).catch(console.error);
  }
};
