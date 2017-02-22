var UsersCtrl = require("../controllers/UsersCtrl.js");
var ChatCtrl = require("../controllers/ChatCtrl.js");
var multer = require("multer")({dest: "temp/"});

module.exports = function(app, ioPromise, db) {
  UsersCtrl.setDB(db);
  ChatCtrl.setDB(db);
  // Login and registration methods
  app.post("/register", UsersCtrl.register);
  app.post("/login", UsersCtrl.login);
  app.get("/logout", UsersCtrl.logout);
  app.get("/profile", UsersCtrl.getMe);
  app.get("/profile/:id", UsersCtrl.getUser);
  app.post("/profile", multer.single("avatar"), UsersCtrl.changeMe);
  app.post("/profile/:id", multer.single("avatar"), UsersCtrl.changeUser);
  app.delete("/profile", UsersCtrl.deleteMe);
  app.delete("/profile/:id", UsersCtrl.deleteUser);
  app.get("/avatar/:id", UsersCtrl.getAvatar);
  app.get("/rooms", ChatCtrl.listRooms);
  app.post("/rooms", ChatCtrl.makeRoom);
  app.get("/room/:name", ChatCtrl.getRoom);
  app.delete("/room/:name", ChatCtrl.deleteRoom);
};
