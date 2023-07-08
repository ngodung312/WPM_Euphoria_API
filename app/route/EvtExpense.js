/**
 * Created by Ngo Le Hanh Dung on 2023-03-17.
 **/

// our components
const EvtExpenseCtrl = require('../controllers/EvtExpenseCtrl');

module.exports = function (app) {
    app.get('/v1/auth/evt-expenses/:id', EvtExpenseCtrl.getOne);
    app.get('/v1/auth/evt-expenses', EvtExpenseCtrl.getAll);
    app.post('/v1/auth/evt-expenses', EvtExpenseCtrl.create);
    app.put('/v1/auth/evt-expenses/:id', EvtExpenseCtrl.update);
    app.delete('/v1/auth/evt-expenses/:id', EvtExpenseCtrl.delete);
}