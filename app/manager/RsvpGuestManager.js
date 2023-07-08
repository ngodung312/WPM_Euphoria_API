/**
 * Created by Ngo Le Hanh Dung on 2023-03-17.
 **/

// third party components
const BCrypt = require('bcryptjs');
const Validator = require('validator');
const Sequelize = require('sequelize');
const MySequelize = require('../utils/Sequelize');

// our components
const Constant = require('../utils/Constant');
const Pieces = require('../utils/Pieces');

const Models = require('../models');
const RsvpGuest = Models.RsvpGuest;

module.exports = {
    getOne: function (accessUserId, accessUserRole, id, callback) {
        try {
            if ( accessUserRole < Constant.USER_ROLE.EVENT_HOST ) {
                return callback(1, 'invalid_user_right', 403, null, null);
            }

            let attributes = ['id', 'guestName', 'guestEmail', 'numGuests', 'eventId', 'deleted', 'createdBy', 'createdAt', 'updatedBy', 'updatedAt'];
            RsvpGuest.findOne({
                where: { id: id },
                attributes: attributes
            }).then(result => {
                "use strict";
                if (result) {
                    return callback(null, null, 200, null, result);
                } else {
                    return callback(1, 'invalid_rsvp_guest', 403, null, null);
                }
            });
        } catch (error) {
            return callback(1, 'get_one_rsvp_guest_fail', 400, error, null);
        }
    },

    getAll: function (accessUserId, accessUserRole, eventId, callback) {
        try {
            if ( accessUserRole < Constant.USER_ROLE.EVENT_HOST ) {
                return callback(1, 'invalid_user_right', 403, null, null);
            }
            
            let attributes = ['id', 'guestName', 'guestEmail', 'numGuests', 'eventId', 'deleted', 'createdBy', 'createdAt', 'updatedBy', 'updatedAt'];
            let where = {};
            where.deleted = Constant.DELETED.NO;
            if (eventId) where.eventId = eventId;

            RsvpGuest.findAndCountAll({
                attributes: attributes,
                where: where
            })
                .then((result) => {
                    // console.log(result);
                    return callback(null, null, 200, null, result);
                }).catch(function (error) {
                    console.log(error);
                    return callback(1, 'find_all_rsvp_guest_fail', 420, error, null);
                });
        } catch (error) {
            return callback(1, 'get_all_rsvp_guest_fail', 400, error, null);
        }
    },

    create: function (accessUserId, accessUserRole, rsvpData, callback) {
        try {
            let queryObj = {};
            queryObj.guestName = rsvpData.guestName;
            queryObj.guestEmail = rsvpData.guestEmail;
            queryObj.numGuests = rsvpData.numGuests;
            queryObj.eventId = rsvpData.eventId;
            queryObj.deleted = Constant.DELETED.NO;
            queryObj.createdBy = accessUserId || Constant.DEFAULT_USER;
            queryObj.createdAt = new Date();
            queryObj.updatedBy = accessUserId || Constant.DEFAULT_USER;
            queryObj.updatedAt = new Date();

            RsvpGuest.create(queryObj).then(result => {
                "use strict";
                return callback(null, null, 200, null, result);
            }).catch(function (error) {
                "use strict";
                return callback(1, 'create_rsvp_guest_fail', 420, error, null);
            });
        } catch (error) {
            return callback(1, 'create_rsvp_guest_fail', 400, error, null);
        }
    },

    creates: function (accessUserId, accessUserRole, rsvpItems, callback) {
        try {
            if ( accessUserRole < Constant.USER_ROLE.EVENT_HOST ) {
                return callback(1, 'invalid_user_right', 403, null, null);
            }

            let updatedObj = [];
            let newObj = [];

            let defaultVals = {
                deleted: Constant.DELETED.NO,
                createdBy: accessUserId,
                createdAt: new Date(),
                updatedBy: accessUserId,
                updatedAt: new Date(),
            }

            for (let i = 0; i < rsvpItems.length; i++) {
                const currItem = rsvpItems[i];
                let itemData = {
                    guestName: currItem.guestName,
                    guestEmail: currItem.guestEmail,
                    numGuests: currItem.numGuests,
                    eventId: currItem.eventId,
                    ...defaultVals,
                }
                if (currItem.id) {
                    itemData.id = currItem.id;
                    updatedObj.push(itemData);
                } else {
                    newObj.push(itemData);
                }
            }

            RsvpGuest.bulkCreate(
                updatedObj,
                {
                    updateOnDuplicate: ["guestName", "guestEmail", "numGuests", "updatedAt", "updatedBy"],
                    // logging: console.log,
                },
            ).then(updatedRes => {
                "use strict";
                MySequelize.query(
                    "ALTER TABLE `tbl_rsvp_guests` AUTO_INCREMENT = 1;"
                ).then(() => {
                    RsvpGuest.bulkCreate(newObj).then(createdRes => {
                        return callback(null, null, 200, null, [...updatedRes, ...createdRes]);
                    }).catch(error => {
                        "use strict";
                        return callback(1, 'creates_rsvp_guest_fail', 400, error, null);
                    })
                }).catch(error => {
                    "use strict";
                    return callback(1, 'creates_rsvp_guest_fail', 400, error, null);
                });
            }).catch(function (error) {
                "use strict";
                return callback(1, 'creates_rsvp_guest_fail', 420, error, null);
            });
        } catch (error) {
            return callback(1, 'creates_rsvp_guest_fail', 400, error, null);
        }
    },

    update: function (accessUserId, accessUserRole, eventId, updatedData, callback) {
        try {
            if ( accessUserRole < Constant.USER_ROLE.EVENT_HOST ) {
                return callback(1, 'invalid_user_right', 403, null, null);
            }

            let queryObj = {};
            let where = {};

            where.eventId = eventId;
            queryObj.guestName = updatedData.guestName;
            queryObj.guestEmail = updatedData.guestEmail;
            queryObj.numGuests = updatedData.numGuests;
            queryObj.eventId = updatedData.eventId;
            queryObj.updatedAt = new Date();
            queryObj.updatedBy = accessUserId;

            RsvpGuest.update(
                queryObj,
                { where: where }
            ).then(result => {
                "use strict";
                if ((result !== null) && (result.length > 0) && (result[0] > 0)) {
                    return callback(null, null, 200, null, eventId);
                } else {
                    return callback(1, 'update_rsvp_guest_fail', 400, '', null);
                }
            }).catch(function (error) {
                "use strict";
                return callback(1, 'update_rsvp_guest_fail', 420, error, null);
            });

        } catch (error) {
            console.log(error);
            return callback(1, 'update_rsvp_guest_fail', 400, error, null);
        }
    },

    delete: function (accessUserId, accessUserRole, eventId, callback) {
        try {
            if ( accessUserRole < Constant.USER_ROLE.EVENT_HOST ) {
                return callback(1, 'invalid_user_right', 403, null);
            }

            let queryObj = {};
            let where = {};

            where = { id: eventId };
            queryObj = { deleted: Constant.DELETED.YES };

            RsvpGuest.findOne({ where: where }).then(currRsvpGuest => {
                "use strict";
                if (currRsvpGuest && currRsvpGuest.deleted === Constant.DELETED.YES) {
                    RsvpGuest.destroy({ where: where }).then(result => {
                        return callback(null, null, 200, null);
                    }).catch(function (error) {
                        return callback(1, 'remove_rsvp_guest_fail', 420, error);
                    });
                } else {
                    RsvpGuest.update(queryObj, { where: where }).then(result => {
                        "use strict";
                        return callback(null, null, 200, null);
                    }).catch(function (error) {
                        return callback(1, 'update_rsvp_guest_fail', 420, error);
                    })
                }
            }).catch(function (error) {
                "use strict";
                return callback(1, 'find_one_rsvp_guest_fail', 400, error, null);
            });
        } catch (error) {
            return callback(1, 'delete_rsvp_guest_fail', 400, error);
        }
    },

    deletes: function (accessUserId, accessUserRole, ids, callback) {
        try {
            if ( accessUserRole < Constant.USER_ROLE.EVENT_HOST ) {
                return callback(1, 'invalid_user_right', 403, null);
            }

            let idList = Pieces.safelyParseJSON(ids);
            let where = { id: idList };

            let queryObj = {
                deleted: Constant.DELETED.YES,
                updatedBy: accessUserId,
                updatedAt: new Date()
            };

            RsvpGuest.update(queryObj, { where: where }).then(result => {
                "use strict";
                if (result && (result.length > 0) && result[0] > 0) {
                    return callback(null, null, 200, null);
                } else {
                    return callback(1, 'invalid_rsvp_guest_request', 404, null);
                }
            }).catch(function (error) {
                "use strict";
                return callback(1, 'update_rsvp_guest_fail', 420, error);
            });
        } catch (error) {
            return callback(1, 'deletes_rsvp_guest_fail', 400, error);
        }
    },
}