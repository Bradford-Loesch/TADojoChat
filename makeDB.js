var pgtools = require("pgtools");
var pgp = require("pg-promise")();
var config = {
  "user": "coder65535",
  "password": "Brian1",
  "host": "localhost",
  "port": "5432"
};
pgtools.dropdb(config, "chat").then(()=>{
  console.log("hi");
  return pgtools.createdb(config, "chat").then(()=>{
    config.database = "chat";
    var db = pgp(config);
    return db.any("CREATE TABLE session (sid varchar NOT NULL, sess json NOT NULL, expire timestamp(6) NOT NULL) WITH (OIDS=FALSE); ALTER TABLE session ADD CONSTRAINT session_pkey PRIMARY KEY (sid) NOT DEFERRABLE INITIALLY IMMEDIATE;").then(()=>{//This is used to set up the "session" table.
      return db.any("CREATE TABLE Users (id SERIAL PRIMARY KEY, username varchar NOT NULL UNIQUE, password varchar NOT NULL, email varchar UNIQUE NOT NULL, is_admin boolean NOT NULL DEFAULT false, first_name varchar, last_name varchar, birthday date, location varchar, url varchar, skype varchar, description text, avatar varchar, created_at timestamp NOT NULL DEFAULT (now()), updated_at timestamp NOT NULL DEFAULT (now())); "
      +"INSERT INTO Users(id, username, password, email) VALUES (0, '[deleted]', 'notarealuser', 'notarealuser'); "
      +"CREATE TABLE Room (id SERIAL PRIMARY KEY, name varchar UNIQUE NOT NULL, owner_id integer NOT NULL REFERENCES Users ON UPDATE CASCADE ON DELETE CASCADE NOT NULL, is_private boolean NOT NULL DEFAULT false, is_locked boolean NOT NULL DEFAULT false, created_at timestamp NOT NULL DEFAULT (now()), updated_at timestamp NOT NULL DEFAULT (now())); "
      +"INSERT INTO Room(name, owner_id) VALUES ('Main', 0); "
      +"CREATE TABLE Room_Moderators (id SERIAL PRIMARY KEY, room_id integer REFERENCES Room ON UPDATE CASCADE ON DELETE CASCADE NOT NULL, admin_id integer REFERENCES Users ON UPDATE CASCADE ON DELETE CASCADE NOT NULL, created_at timestamp NOT NULL DEFAULT (now()), updated_at timestamp NOT NULL DEFAULT (now())); "
      +"CREATE TABLE Room_Permitted_Users (id SERIAL PRIMARY KEY, room_id integer REFERENCES Room ON UPDATE CASCADE ON DELETE CASCADE NOT NULL, user_id integer REFERENCES Users ON UPDATE CASCADE ON DELETE CASCADE NOT NULL, created_at timestamp NOT NULL DEFAULT (now()), updated_at timestamp NOT NULL DEFAULT (now())); "
      +"CREATE TABLE User_Rooms (id SERIAL PRIMARY KEY, room_id integer REFERENCES Room ON UPDATE CASCADE ON DELETE CASCADE NOT NULL, user_id integer REFERENCES Users ON UPDATE CASCADE ON DELETE CASCADE NOT NULL, created_at timestamp NOT NULL DEFAULT (now()), updated_at timestamp NOT NULL DEFAULT (now())); "
      +"CREATE TABLE Message (id SERIAL PRIMARY KEY, message text NOT NULL, room_id integer REFERENCES Room ON UPDATE CASCADE ON DELETE CASCADE NOT NULL, poster_id integer REFERENCES Users ON UPDATE CASCADE ON DELETE SET DEFAULT DEFAULT 0 NOT NULL, created_at timestamp NOT NULL DEFAULT (now()), updated_at timestamp NOT NULL DEFAULT (now())); "
      +"CREATE FUNCTION set_updated_at() RETURNS TRIGGER AS $set_updated_at$ BEGIN NEW.updated_at = NOW(); RETURN NEW; END; $set_updated_at$ LANGUAGE plpgsql;").then(()=>{
        return db.task(t=>{
          return t.map("SELECT p.tablename as name FROM pg_tables p WHERE p.schemaname = 'public' AND p.tablename <> 'session';",{},table=>{
            return t.any("CREATE TRIGGER ${name#}_updated_at BEFORE UPDATE ON ${name#} FOR EACH ROW EXECUTE PROCEDURE set_updated_at();",table);
          }).then(t.batch).then(()=>{
            console.log("done");
            process.exit(0);
            return null;
          });
        });
      });
    });
  });
}).catch(console.error);
