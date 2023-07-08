/**
 * Created by Ngo Le Hanh Dung on 2023-03-17.
 **/

// our components
const EvtItemCtrl = require('../controllers/EvtItemCtrl');

module.exports = function (app) {
    app.get('/v1/auth/evt-items/:id', EvtItemCtrl.getOne);
    app.get('/v1/auth/evt-items', EvtItemCtrl.getAll);
    app.post('/v1/auth/evt-items', EvtItemCtrl.create);
    app.put('/v1/auth/evt-items/:id', EvtItemCtrl.update);
    app.delete('/v1/auth/evt-items/:id', EvtItemCtrl.delete);
}