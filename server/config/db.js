var pgp = require("pgp");
var cn = {
  database: "chat",
  user: "coder65535",
  password: "Brian1",
  host: "localhost",
  port: 5432
};

var db = pgp(cn);

module.exports = db;
