/**
 * Created by Ngo Le Hanh Dung on 2023-03-17.
 **/

// our components
const MapCtrl = require('../controllers/MapCtrl');

module.exports = function (app) {
    app.get('/v1/auth/maps/:id', MapCtrl.getOne);
    app.get('/v1/auth/maps', MapCtrl.getAll);
    app.post('/v1/auth/maps', MapCtrl.create);
    app.put('/v1/auth/maps/:id', MapCtrl.update);
    app.delete('/v1/auth/maps/:id', MapCtrl.delete);
}