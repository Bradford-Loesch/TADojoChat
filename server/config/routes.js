var UsersCtrl = require("../controllers/UsersCtrl.js");
var ChatCtrl = require("../controllers/ChatCtrl.js");

module.exports = function(app, ioPromise, db) {
  UsersCtrl.setDB(db);
  // Login and registration methods
  app.post("/register", UsersCtrl.register);
  app.post("/login", UsersCtrl.login);
  app.get("/logout", UsersCtrl.logout);
  app.get("/profile", UsersCtrl.getMe);
  app.get("/profile/:id", UsersCtrl.getUser);
  app.patch("/profile", UsersCtrl.changeMe);
  app.patch("/profile/:id", UsersCtrl.changeUser);
  app.delete("/profile", UsersCtrl.deleteMe);
  app.delete("/profile/:id", UsersCtrl.deleteUser);
  app.get("/avatar/:id", UsersCtrl.getAvatar);
  app.get("/rooms", ChatCtrl.listRooms);
  app.post("/rooms", ChatCtrl.makeRoom);
  app.get("/room/:name", ChatCtrl.getRoom);
  app.delete("/room/:name", ChatCtrl.deleteRoom);
};
