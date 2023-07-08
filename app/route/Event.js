/**
 * Created by Ngo Le Hanh Dung on 2023-03-17.
 **/

// our components
const EventCtrl = require('../controllers/EventCtrl');

module.exports = function (app) {
    app.get('/v1/auth/events/:id', EventCtrl.getOne);
    app.get('/v1/auth/events', EventCtrl.getAll);
    app.post('/v1/auth/events', EventCtrl.create);
    app.put('/v1/auth/events/:id', EventCtrl.update);
    app.delete('/v1/auth/events/:id', EventCtrl.delete);
}