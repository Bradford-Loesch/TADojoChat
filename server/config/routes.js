var UsersCtrl = require("./../controllers/UsersCtrl.js");

module.exports = function(app, ioPromise, db) {
  UsersCtrl.setDB(db);
  // Login and registration methods
  app.post("/register", UsersCtrl.register);
  app.post("/login", UsersCtrl.login);
  app.get("/logout", UsersCtrl.logout);

  // Fetching/modifying users and user lists
  // Get all users
  app.get("/users", UsersCtrl.index);
  // Get a subset of users
  app.post("/users", UsersCtrl.subset);
  // Get one user
  app.get("/users/:id", UsersCtrl.show);
  // Update user account
  app.put("/users/:id", UsersCtrl.update);
  // Delete user account
  app.get("/users/delete/:id", UsersCtrl.delete);

};
