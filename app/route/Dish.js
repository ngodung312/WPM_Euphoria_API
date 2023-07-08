/**
 * Created by Ngo Le Hanh Dung on 2023-03-17.
 **/

// our components
const DishCtrl = require('../controllers/DishCtrl');

module.exports = function (app) {
    app.get('/v1/auth/dishes/:id', DishCtrl.getOne);
    app.get('/v1/auth/dishes', DishCtrl.getAll);
    app.post('/v1/auth/dishes', DishCtrl.create);
    app.put('/v1/auth/dishes/:id', DishCtrl.update);
    app.delete('/v1/auth/dishes/:id', DishCtrl.delete);
}