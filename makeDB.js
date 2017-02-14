var pgtools = require("pgtools");
var pgp = require("pg-promise")();
const config = {
  "database": "chat",
  "user": "coder65535",
  "password": "Brian1",
  "host": "localhost",
  "port": "5432"
};
pgtools.createdb(config, "chat").then(()=>{
  var db = pgp(config);
  return db.any("CREATE TABLE 'session' (\n'sid' varchar NOT NULL COLLATE 'default',\n'sess' json NOT NULL,\n'expire' timestamp(6) NOT NULL\n)\nWITH (OIDS=FALSE);\nALTER TABLE 'session' ADD CONSTRAINT 'session_pkey' PRIMARY KEY ('sid') NOT DEFERRABLE INITIALLY IMMEDIATE;").then(()=>{
    return db.any("CREATE TABLE 'user' ('username' varchar NOT NULL, 'password varchar NOT NULL')");
  });
}).catch(console.error);
