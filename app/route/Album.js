/**
 * Created by Ngo Le Hanh Dung on 2023-03-17.
 **/

// our components
const AlbumCtrl = require('../controllers/AlbumCtrl');

module.exports = function (app) {
    app.get('/v1/auth/albums/:id', AlbumCtrl.getOne);
    app.get('/v1/auth/albums', AlbumCtrl.getAll);
    app.post('/v1/auth/albums', AlbumCtrl.create);
    app.put('/v1/auth/albums/:id', AlbumCtrl.update);
    app.delete('/v1/auth/albums/:id', AlbumCtrl.delete);
}