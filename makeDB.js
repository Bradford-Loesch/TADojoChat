var pgtools = require("pgtools");
var pgp = require("pg-promise")();
var config = {
  "user": "coder65535",
  "password": "Brian1",
  "host": "localhost",
  "port": "5432"
};
pgtools.dropdb(config, "chat").then(()=>{
  return pgtools.createdb(config, "chat").then(()=>{
    config.database = "chat";
    var db = pgp(config);
    return db.any("CREATE TABLE session (sid varchar NOT NULL, sess json NOT NULL, expire timestamp(6) NOT NULL) WITH (OIDS=FALSE); ALTER TABLE session ADD CONSTRAINT session_pkey PRIMARY KEY (sid) NOT DEFERRABLE INITIALLY IMMEDIATE;").then(()=>{
      return db.any("CREATE TABLE Users (id integer PRIMARY KEY NOT NULL, username varchar NOT NULL, password varchar NOT NULL);").then(()=>{
        console.log("done");
        process.exit(0);
        return null;//make linter happy
      }).catch((err)=>{
        console.error(err);
        console.error("in my create");
      });
    });
  });
}).catch(console.error);
