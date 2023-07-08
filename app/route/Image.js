/**
 * Created by Ngo Le Hanh Dung on 2023-03-17.
 **/

// our components
const ImageCtrl = require('../controllers/ImageCtrl');

module.exports = function (app) {
    app.get('/images/:id', ImageCtrl.getOne);
    app.get('/images', ImageCtrl.getAll);
    app.post('/v1/auth/images', ImageCtrl.create);
    app.put('/v1/auth/images/:id', ImageCtrl.update);
    app.delete('/v1/auth/images/:id', ImageCtrl.delete);
}