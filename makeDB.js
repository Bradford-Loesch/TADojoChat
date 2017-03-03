var pgtools = require("pgtools");
var pgp = require("pg-promise")();
var config = {
  "user": "coder65535",
  "password": "Brian1",
  "host": "localhost",
  "port": "5432"
};

function makeDB(){
  return pgtools.createdb(config, "chat").then(()=>{
    config.database = "chat";
    var db = pgp(config);
    return db.any("CREATE TABLE session (sid varchar NOT NULL, sess json NOT NULL, expire timestamp(6) NOT NULL) WITH (OIDS=FALSE); ALTER TABLE session ADD CONSTRAINT session_pkey PRIMARY KEY (sid) NOT DEFERRABLE INITIALLY IMMEDIATE;").then(()=>{//This is used to set up the "session" table.
      return db.any("CREATE TABLE Users (id SERIAL PRIMARY KEY, username varchar NOT NULL UNIQUE, password varchar NOT NULL, email varchar UNIQUE NOT NULL, is_admin boolean NOT NULL DEFAULT false, first_name varchar, last_name varchar, birthday date, location varchar, url varchar, skype varchar, description text, avatar varchar, created_at timestamp NOT NULL DEFAULT (now()), updated_at timestamp NOT NULL DEFAULT (now())); "
      +"INSERT INTO Users(id, username, password, email) VALUES (0, '[deleted]', 'notarealuser', 'notarealuser'); "
      +"CREATE TABLE Room (id SERIAL PRIMARY KEY, name varchar UNIQUE NOT NULL, description text NOT NULL, owner_id integer NOT NULL REFERENCES Users ON UPDATE CASCADE ON DELETE CASCADE NOT NULL, is_private boolean NOT NULL DEFAULT false, is_locked boolean NOT NULL DEFAULT false, created_at timestamp NOT NULL DEFAULT (now()), updated_at timestamp NOT NULL DEFAULT (now())); "
      +"INSERT INTO Room(name, owner_id, description) VALUES ('Main', 0, 'For general chatting'); "
      +"CREATE TABLE Room_Roles (id SERIAL PRIMARY KEY, room_id integer REFERENCES Room ON UPDATE CASCADE ON DELETE CASCADE NOT NULL, user_id integer REFERENCES Users ON UPDATE CASCADE ON DELETE CASCADE NOT NULL, permission_level integer NOT NULL DEFAULT 0, created_at timestamp NOT NULL DEFAULT (now()), updated_at timestamp NOT NULL DEFAULT (now())); "
      +"CREATE VIEW Room_Priviliges AS SELECT room_id, user_id, permission_level FROM room_roles UNION (SELECT id AS room_id, owner_id AS user_id, 4 AS permission_level FROM room); "
      +"CREATE TABLE Room_Permitted_Users (id SERIAL PRIMARY KEY, room_id integer REFERENCES Room ON UPDATE CASCADE ON DELETE CASCADE NOT NULL, user_id integer REFERENCES Users ON UPDATE CASCADE ON DELETE CASCADE NOT NULL, created_at timestamp NOT NULL DEFAULT (now()), updated_at timestamp NOT NULL DEFAULT (now())); "
      +"CREATE TABLE User_Rooms (id SERIAL PRIMARY KEY, room_id integer REFERENCES Room ON UPDATE CASCADE ON DELETE CASCADE NOT NULL, user_id integer REFERENCES Users ON UPDATE CASCADE ON DELETE CASCADE NOT NULL, created_at timestamp NOT NULL DEFAULT (now()), updated_at timestamp NOT NULL DEFAULT (now())); "
      +"CREATE TABLE Message (id SERIAL PRIMARY KEY, message text NOT NULL, room_id integer REFERENCES Room ON UPDATE CASCADE ON DELETE CASCADE NOT NULL, poster_id integer REFERENCES Users ON UPDATE CASCADE ON DELETE SET DEFAULT DEFAULT 0 NOT NULL, created_at timestamp NOT NULL DEFAULT (now()), updated_at timestamp NOT NULL DEFAULT (now())); "
      +"CREATE TABLE Poll_Question (id SERIAL PRIMARY KEY, question varchar NOT NULL, open boolean NOT NULL DEFAULT true, room_id integer REFERENCES Room ON UPDATE CASCADE ON DELETE CASCADE NOT NULL, created_at timestamp NOT NULL DEFAULT (now()), updated_at timestamp NOT NULL DEFAULT (now())); "
      +"CREATE TABLE Poll_Answer (id SERIAL PRIMARY KEY, answer varchar NOT NULL, question_id integer REFERENCES Poll_Question ON UPDATE CASCADE ON DELETE CASCADE NOT NULL, number integer DEFAULT 0 NOT NULL, created_at timestamp NOT NULL DEFAULT (now()), updated_at timestamp NOT NULL DEFAULT (now())); "
      +"CREATE FUNCTION set_answer_number() RETURNS TRIGGER AS $set_answer_number$ BEGIN NEW.number = (SELECT Count(*) FROM Poll_Answer WHERE Poll_Answer.question_id=NEW.question_id)+1; RETURN NEW; END; $set_answer_number$ LANGUAGE plpgsql; "
      +"CREATE TRIGGER set_answer_number BEFORE INSERT ON Poll_Answer FOR EACH ROW EXECUTE PROCEDURE set_answer_number(); "
      +"CREATE TABLE Poll_Vote (id SERIAL PRIMARY KEY, user_id integer REFERENCES Users ON UPDATE CASCADE ON DELETE CASCADE NOT NULL, answer_id integer REFERENCES Poll_Answer ON UPDATE CASCADE ON DELETE CASCADE NOT NULL, created_at timestamp NOT NULL DEFAULT (now()), updated_at timestamp NOT NULL DEFAULT (now())); "
      +"CREATE FUNCTION clear_previous_vote() RETURNS TRIGGER AS $clear_previous_vote$ BEGIN DELETE FROM Poll_Vote WHERE user_id=NEW.user_id AND answer_id IN (SELECT id FROM Poll_Answer WHERE question_id IN (SELECT question_id FROM Poll_Answer WHERE id=NEW.answer_id)); RETURN NEW; END; $clear_previous_vote$ LANGUAGE plpgsql; "
      +"CREATE TRIGGER One_Vote_Per_Poll BEFORE INSERT ON Poll_Vote FOR EACH ROW EXECUTE PROCEDURE clear_previous_vote(); "
      +"CREATE VIEW Poll AS SELECT Poll_Question.id AS qid, Poll_Question.question AS question, Poll_Question.open AS open, Poll_Question.room_id AS room_id, Poll_question.created_at AS date, Poll_Answer.id AS answer_id, Poll_Answer.number AS answer_number, Poll_Answer.answer as answer, Count(Poll_Vote.id) as votes FROM Poll_Question JOIN Poll_Answer ON Poll_Answer.question_id=Poll_Question.id LEFT OUTER JOIN Poll_Vote on Poll_Vote.answer_id=Poll_Answer.id GROUP BY qid, question, open, room_id, Poll_Answer.id, answer_number, answer, date; "
      +"CREATE FUNCTION set_updated_at() RETURNS TRIGGER AS $set_updated_at$ BEGIN NEW.updated_at = NOW(); RETURN NEW; END; $set_updated_at$ LANGUAGE plpgsql;").then(()=>{
        return db.task(t=>{
          return t.map("SELECT p.tablename AS name FROM pg_tables p WHERE p.schemaname = 'public' AND p.tablename <> 'session';",{},table=>{
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
}

pgtools.dropdb(config, "chat").then(makeDB,makeDB).catch(err=>{
  console.error(err);
});
