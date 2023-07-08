/**
 * Created by Ngo Le Hanh Dung on 2023-03-17.
 **/

// our components
const WeddingPageInfoCtrl = require('../controllers/WeddingPageInfoCtrl');

module.exports = function (app) {
    app.get('/wedding-pages/:id', WeddingPageInfoCtrl.getOne);
    app.get('/wedding-pages', WeddingPageInfoCtrl.getAll);
    app.post('/v1/auth/wedding-pages', WeddingPageInfoCtrl.create);
    app.put('/v1/auth/wedding-pages/:id', WeddingPageInfoCtrl.update);
    app.delete('/v1/auth/wedding-pages/:id', WeddingPageInfoCtrl.delete);
}