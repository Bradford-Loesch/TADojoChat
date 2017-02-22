var bcrypt = require("bcrypt");
var fs = require("fs");
var static_loader = require("utils.js");
var q = require("q");

var db = null;

module.exports = {
  setDB:function(dbObj){
    db = db||dbObj;
  },
  register: function(req, res){
    var data = req.body;
    var errors = [];
    if (data.password !== data.passconf){
      errors.push("Password does not match confirmation");
    }
    if (!data.password){
      errors.push("Invalid password");
    }
    if (!data.email || !data.email.match(/^(?=[A-Z0-9][A-Z0-9@._%+-]{5,253}$)[A-Z0-9._%+-]{1,64}@(?:(?=[A-Z0-9-]{1,63}\.)[A-Z0-9]+(?:-[A-Z0-9]+)*\.){1,8}[A-Z]{2,63}$/i)){
      errors.push("Invalid email");
    }
    if (!data.username || data.username.toLowerCase() === "anonymous" || data.username.toLowerCase() === "[deleted]" || !data.username.match(/^[ -~]+$/)){//space to tilde enforces printable ascii
      errors.push("Invalid username");
      res.json({success:false, err:{header:"Error in register:",items:errors}});
    } else {
      db.oneOrNone("SELECT * FROM Users WHERE username=$1",[data.username]).then(function(user){
        if (user){
          errors.push("User already exists");
        }
        return db.oneOrNone("SELECT * FROM Users WHERE email=$1",[data.email]).then(function(email){
          if (email){
            errors.push("Email already exists");
            res.json({success:false, err:{header:"Error in register:",items:errors}});
            return null;
          }
          return bcrypt.hash(data.password,14).then((pass)=>db.one("INSERT INTO Users(email, username, password, created_at, updated_at) VALUES($1,$2,$3, NOW(), NOW()) RETURNING id",[data.email, data.username, pass]))
          .then((user)=>{
            console.log("new user ",user);
            req.session.user = user.id;
            res.json({success:true});
            return null;
          });
        });

      }).catch((err)=>{
        res.json({success:false, err:{header:"Error in register:",items:[err.message||err]}});
      });
    }
  },
  login: function(req, res){
    var data = req.body;
    console.log(data);
    db.oneOrNone("SELECT * FROM Users WHERE username=$1",[data.username]).then(function(user){
      if (!user){
        throw "User not found";
      }
      return Promise.all([user, bcrypt.compare(req.body.password, user.password)]);
    }).then(function(result){
      var valid = result[1];
      if (valid){
        req.session.user = result[0].id;
        req.session.admin = result[0].is_admin;
        res.json({success:true});
      } else {
        throw "Bad password";
      }
      return null;
    }).catch(function(err){
      console.log(err)
      res.json({success:false, err:{header:"Error in login.",items:[err.message||err]}});
    });
  },
  logout:function(req, res){
    delete req.session.user;
    delete req.session.is_admin;
    res.redirect("/");
  },
  getUsers:function(req, res){
    db.many("SELECT * FROM Users").then(users=>{
      res.json(users);
      return null;
    }).catch(err=>{
      console.error(err);
      res.json(err);
    });
  },
  getMe:function(req, res){
    db.one("SELECT * FROM Users WHERE id=$1",[req.session.user]).then(user=>{
        res.json(user);
      }).catch(err=>{
      console.log('-----------------')
      console.log(req.session)
      console.error(err);
      res.json({err:err});
    });
  },
  getUser:function(req, res){
    db.one("SELECT * FROM Users WHERE id=$1",[req.params.id]).then(user=>{
        res.json(user);
      }).catch(err=>{
      console.error(err);
      res.json({err:err});
    });
  },
  changeMe:function(req, res){
    var data = req.body;
    db.one("SELECT * FROM Users WHERE id=$1",[req.session.user]).then(user=>{
      var operations = [user];
      if (data.password) {
        operations.push(bcrypt.hashpw(data.password,14));
      } else {
        operations.push(null);
        delete data.password; //It might be empty, so remove it.
      }
      if (req.file){
        operations.push(q.denodefy(fs.rename)(req.file.path, "../../client/avatars/"+user.username+"/"+req.file.filename));
        data.avatar = "../../client/avatars/"+user.username+"/"+req.file.filename;
      }
      return Promise.all(operations);
    }).then(delayed=>{
      var [user, pass, avatar] = delayed;
      if (pass){
        user.password = pass;
      }
      if (avatar){
        user.avatar = avatar;
      }
      for (let key in data){
        user[key]=data[key];
      }
      return db.any("UPDATE Users SET password=${password}, email=${email}, first_name=${first_name}, last_name=${last_name}, birthday=${birthday}, location=${location}, url=${url}, skype=${skype}, description=${description}, avatar=${avatar} WHERE id=${id}",user).then(()=>{
        res.json({});
        return null;
      });
    }).catch(err=>{
      console.error(err);
      res.json({err:err});
    });
  },
  changeUser:function(req, res){
    if (!req.session.is_admin && req.session.id !== req.params.id){
      res.json({err:"Not an admin"});
      return;
    }
    var data = req.body;
    db.one("SELECT * FROM Users WHERE id=$1",[req.params.id]).then(user=>{
      var operations = [user];
      if (data.password) {
        operations.push(bcrypt.hashpw(data.password,14));
      } else {
        operations.push(null);
        delete data.password; //It might be empty, so remove it.
      }
      if (req.file){
        operations.push((q.denodefy(fs.rename)(req.file.path, "../../client/avatars/"+user.username+"/"+req.file.filename)).then(()=>1));//give an actual value so that it's in the .then
        operations.push(q.denodefy(fs.unlink),user.avatar);
        data.avatar = "../client/avatars/"+user.username+"/"+req.file.filename;
      }
      return Promise.all(operations);
    }).then(delayed=>{
      var [user, pass, avatar] = delayed;
      if (pass){
        user.password = pass;
      }
      if (avatar){
        user.avatar = data.avatar;
      }
      for (let key in data){
        user[key]=data[key];
      }
      return db.any("UPDATE Users SET password=${password}, email=${email}, first_name=${first_name}, last_name=${last_name}, birthday=${birthday}, location=${location}, url=${url}, skype=${skype}, description=${description}, avatar=${avatar} WHERE id=${id}",user).then(()=>{
        res.json({});
        return null;
      });
    }).catch(err=>{
      console.error(err);
      res.json({err:err});
    });
  },
  deleteMe:function(req, res){
    db.any("DELETE FROM Users WHERE id=$1", req.session.user).then(()=>{
        res.json({});
      }).catch(err=>{
      console.error(err);
      res.json({err:err});
    });
  },
  deleteUser:function(req, res){
    if (!req.session.is_admin && req.session.user !== req.params.id){
      res.json({err:"Not an admin"});
      return;
    }
    db.any("DELETE FROM Users WHERE id=$1", req.params.id).then(()=>{
        res.json({});
      }).catch(err=>{
      console.error(err);
      res.json({err:err});
    });
  },
  getAvatar:function(req, res){
    db.oneOrNone("SELECT * FROM Users WHERE id=$1",[req.params.id]).then(function(user){
      if (!user || !user.avatar){
        throw "";//Throw to reach the .catch, which serves up the "anonymous" avatar for users without one or unknown users.
      }
      return q.denodefy(fs.stat)(user.avatar).then(()=>{
        static_loader.serve_file(res, user.avatar, "");
        return null;
      }).catch(err=>{
        if (!err.code === "ENOENT"){ // ENOENT is the "file does not exist" error, so it simply means the user has no avatar, and shouldn't be logged. Any other error should be logged.
          console.error(err);
        }
        throw "";//Throw to reach the .catch, which serves up the "anonymous" avatar for users without one or unknown users.
      });
    }).catch(()=>{
      static_loader.serve_file(res, "anonymous.jpg", "../client/avatars");
    });
  }
};
