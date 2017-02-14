var UsersCtrl = require('./../controllers/UsersCtrl.js');

module.exports = function(app) {
    app.get('/users', UsersCtrl.index);
    app.get('/users/:id', UsersCtrl.show);
    app.post('/users', UsersCtrl.create);
    app.put('/users/:id', UsersCtrl.update);
    app.delete('/users/:id', UsersCtrl.delete);
}
