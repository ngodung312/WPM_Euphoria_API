/**
 * Created by Ngo Le Hanh Dung on 2023-03-17.
 **/

// our components
const MenuItemCtrl = require('../controllers/MenuItemCtrl');

module.exports = function (app) {
    app.get('/v1/auth/menu-items/:id', MenuItemCtrl.getOne);
    app.get('/v1/auth/menu-items', MenuItemCtrl.getAll);
    app.post('/v1/auth/menu-items', MenuItemCtrl.create);
    app.put('/v1/auth/menu-items/:id', MenuItemCtrl.update);
    app.delete('/v1/auth/menu-items/:id', MenuItemCtrl.delete);
}