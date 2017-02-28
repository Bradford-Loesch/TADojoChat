var db = require("./db.js");

module.exports = {
  NONE:0,//users without any rank may post, but may not use some server commands.
  VOICE:1,//voices can make polls and broadcast messages(not implemented)
  DRIVER:2,//drivers can mute users and promote users to voice.
  MODERATOR:3,//moderators can ban users and promote users to driver. Moderators may not ban/mute other moderators or the owner.
  OWNER:4,//the owner can promote users to moderator, delete the room, and make other room-affecting changes. They may ban/mute moderators.
  MUTED:-1,//muted users may not speak, but may view the room. A few server commands are available.
  BANNED:-2,//banned users may not join the room. This overrides a locked room's "accept" list.
  checkPermission:function(user_id, room_id, level){
    return db.oneOrNone("SELECT permission_level FROM Room_Priviliges WHERE user_id=$1 AND room_id=$2",[user_id, room_id]).then(res=>{
      if (!res){
        res = {permission_level:0};
      }
      return res.permission_level>=level;
    });
  },
  changePermission:function(changer_id, changed_id, room_id, level){
    return this.checkPermission(changer_id, room_id, level+1).then(success=>{
      if (success){
        return db.any("INSERT INTO Room_Roles(user_id, room_id, permission_level) VALUES ");
      }
      return false;
    });
  }
};
