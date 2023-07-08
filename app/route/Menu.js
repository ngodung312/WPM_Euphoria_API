/**
 * Created by Ngo Le Hanh Dung on 2023-03-17.
 **/

// our components
const MenuCtrl = require('../controllers/MenuCtrl');

module.exports = function (app) {
    app.get('/v1/auth/menus/:id', MenuCtrl.getOne);
    app.get('/v1/auth/menus', MenuCtrl.getAll);
    app.post('/v1/auth/menus', MenuCtrl.create);
    app.put('/v1/auth/menus/:id', MenuCtrl.update);
    app.delete('/v1/auth/menus/:id', MenuCtrl.delete);
}