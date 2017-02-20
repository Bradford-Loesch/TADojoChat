

var db = null;

module.exports = {
  setDB:function(dbObj){
    db = db||dbObj;
  },

  listRooms:function(req, res){
    db.any("SELECT * FROM Room WHERE is_private = false").then(rooms=>{
      res.json({"rooms":rooms});
      return null;
    }).catch(err=>{
      console.error(err);
      res.json({err:err});
    });
  },

  makeRoom:function(req, res){
    db.any("INSERT INTO Room(name, owner_id, description) VALUES ($1, $2)",[req.body.name, req.session.user, req.body.description]).then(()=>{
      res.json({});
      return null;
    }).catch(err=>{
      console.error(err);
      res.json({err:err});
    });
  },

  getRoom:function(req, res){
    db.any("SELECT * FROM Message JOIN Room ON Room.id = Message.room_id JOIN Users ON Users.id = Message.poster_id WHERE Room.name=$1 ORDER BY created_at ASC",[req.params.name]).then(messages=>{
      return db.any("SELECT * from User_Rooms JOIN Room ON Room.id = room_id WHERE Room.name = $1",[req.params.name]).then(users=>{
        res.json({"users":users, "messages":messages});
        return null;
      });
    }).catch(err=>{
      console.error(err);
      res.json({err:err});
    });
  },
  
  deleteRoom:function(req, res){
    db.one("SELECT * FROM Room WHERE Room.name = $1",[req.params.name]).then(room=>{
      if (!req.session.is_admin && req.session.user !== room.owner_id){
        res.json({err:"Not an admin"});
        return null;
      }
      return db.any("DELETE FROM Room WHERE Room.id = $1", [room.id]).then(()=>{
        res.json({});
        return null;
      });
    }).catch(()=>{
      res.json({err:"Room not found"});
    });
  }
};
