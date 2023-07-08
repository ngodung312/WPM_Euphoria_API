/**
 * Created by Ngo Le Hanh Dung on 2023-03-17.
 **/

// our components
const HallCtrl = require('../controllers/HallCtrl');

module.exports = function (app) {
    app.get('/v1/auth/halls/:id', HallCtrl.getOne);
    app.get('/v1/auth/halls', HallCtrl.getAll);
    app.post('/v1/auth/halls', HallCtrl.create);
    app.put('/v1/auth/halls/:id', HallCtrl.update);
    app.delete('/v1/auth/halls/:id', HallCtrl.delete);
}