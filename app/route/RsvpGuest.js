/**
 * Created by Ngo Le Hanh Dung on 2023-03-17.
 **/

// our components
const RsvpGuestCtrl = require('../controllers/RsvpGuestCtrl');

module.exports = function (app) {
    app.get('/v1/auth/rsvp-guests/:id', RsvpGuestCtrl.getOne);
    app.get('/v1/auth/rsvp-guests', RsvpGuestCtrl.getAll);
    app.post('/rsvp-guests', RsvpGuestCtrl.create);
    app.put('/v1/auth/rsvp-guests/:id', RsvpGuestCtrl.update);
    app.delete('/v1/auth/rsvp-guests/:id', RsvpGuestCtrl.delete);
}