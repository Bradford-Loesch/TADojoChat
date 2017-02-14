var UsersCtrl = require("./../controllers/UsersCtrl.js");

module.exports = function(app, ioPromise, db) {
  UsersCtrl.setDB(db);
  app.get("/register", UsersCtrl.register);
  app.get("/login", UsersCtrl.login);
  app.get("/logout", UsersCtrl.logout);
};
