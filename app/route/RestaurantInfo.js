/**
 * Created by Ngo Le Hanh Dung on 2023-03-17.
 **/

// our components
const RestaurantInfoCtrl = require('../controllers/RestaurantInfoCtrl');

module.exports = function (app) {
    app.get('/restaurant-infos/:id', RestaurantInfoCtrl.getOne);
    app.get('/restaurant-infos', RestaurantInfoCtrl.getAll);
    app.post('/v1/auth/restaurant-infos', RestaurantInfoCtrl.create);
    app.put('/v1/auth/restaurant-infos/:id', RestaurantInfoCtrl.update);
    app.delete('/v1/auth/restaurant-infos/:id', RestaurantInfoCtrl.delete);
}