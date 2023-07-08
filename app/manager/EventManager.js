/**
 * Created by Ngo Le Hanh Dung on 2023-03-17.
 **/

// third party components
const BCrypt = require('bcryptjs');
const Validator = require('validator');
const Sequelize = require('sequelize');

// our components
const Constant = require('../utils/Constant');
const Pieces = require('../utils/Pieces');

const Models = require('../models');
const Event = Models.Event;

module.exports = {
    getOne: function (accessUserId, accessUserRole, id, callback) {
        try {
            if (accessUserRole < Constant.USER_ROLE.EVENT_HOST) {
                return callback(1, 'invalid_user_right', 403, null, null);
            }

            let attributes = ['id', 'eventTitle', 'eventDate', 'hostId', 'managerId', 'mapId', 'menuId', 'numTables', 'numEstGuests', 'numActGuests', 'deleted', 'createdBy', 'createdAt', 'updatedBy', 'updatedAt'];
            Event.findOne({
                where: { id: id },
                attributes: attributes
            }).then(result => {
                "use strict";
                if (result) {
                    if (accessUserRole < Constant.USER_ROLE.MANAGER & result.toJSON().hostId !== accessUserId) {
                        return callback(1, 'invalid_user_right', 403, null, null);
                    }
                    return callback(null, null, 200, null, result);
                } else {
                    return callback(1, 'invalid_event', 403, null, null);
                }
            });
        } catch (error) {
            return callback(1, 'get_one_event_fail', 400, error, null);
        }
    },

    getAll: function (accessUserId, accessUserRole, query, callback) {
        try {
            if (accessUserRole < Constant.USER_ROLE.EVENT_HOST) {
                return callback(1, 'invalid_user_right', 403, null, null);
            }

            let attributes = ['id', 'eventTitle', 'eventDate', 'hostId', 'managerId', 'mapId', 'menuId', 'numTables', 'numEstGuests', 'numActGuests', 'deleted', 'createdBy', 'createdAt', 'updatedBy', 'updatedAt'];
            let where = {};
            where.deleted = Constant.DELETED.NO;

            if (accessUserRole < Constant.USER_ROLE.MANAGER) {
                where.hostId = accessUserId;
            }

            Event.findAndCountAll({
                attributes: attributes,
                where: where
            })
                .then((result) => {
                    // console.log(result);
                    return callback(null, null, 200, null, result);
                }).catch(function (error) {
                    console.log(error);
                    return callback(1, 'find_all_event_fail', 420, error, null);
                });
        } catch (error) {
            return callback(1, 'get_all_event_fail', 400, error, null);
        }
    },

    create: function (accessUserId, accessUserRole, eventData, callback) {
        try {
            if (accessUserRole < Constant.USER_ROLE.MANAGER) {
                return callback(1, 'invalid_user_right', 403, null, null);
            }

            let queryObj = {};
            queryObj.eventTitle = eventData.eventTitle;
            queryObj.eventDate = eventData.eventDate;
            queryObj.hostId = eventData.hostId;
            queryObj.managerId = eventData.managerId;
            queryObj.mapId = eventData.mapId;
            queryObj.menuId = eventData.menuId;
            queryObj.numTables = eventData.numTables;
            queryObj.numEstGuests = eventData.numEstGuests;
            queryObj.numActGuests = eventData.numActGuests;
            queryObj.deleted = Constant.DELETED.NO;
            queryObj.createdBy = accessUserId;
            queryObj.createdAt = new Date();
            queryObj.updatedBy = accessUserId;
            queryObj.updatedAt = new Date();

            Event.create(queryObj).then(result => {
                "use strict";
                return callback(null, null, 200, null, result);
            }).catch(function (error) {
                "use strict";
                return callback(1, 'create_event_fail', 420, error, null);
            });
        } catch (error) {
            return callback(1, 'create_event_fail', 400, error, null);
        }
    },

    update: function (accessUserId, accessUserRole, eventId, updatedData, callback) {
        try {
            if ((accessUserRole < Constant.USER_ROLE.ADMIN
                & accessUserId !== parseInt(updatedData.hostId) & accessUserId !== parseInt(updatedData.managerId)
            ) || accessUserRole < Constant.USER_ROLE.EVENT_HOST) {
                return callback(1, 'invalid_user_right', 403, null, null);
            }

            let queryObj = {};
            let where = {};

            where.id = eventId;
            queryObj.eventTitle = updatedData.eventTitle;
            queryObj.eventDate = updatedData.eventDate;
            queryObj.hostId = updatedData.hostId;
            queryObj.managerId = updatedData.managerId;
            queryObj.mapId = updatedData.mapId;
            queryObj.menuId = updatedData.menuId;
            queryObj.numTables = updatedData.numTables;
            queryObj.numEstGuests = updatedData.numEstGuests;
            queryObj.numActGuests = updatedData.numActGuests;
            queryObj.updatedAt = new Date();
            queryObj.updatedBy = accessUserId;

            Event.update(
                queryObj,
                { where: where }
            ).then(result => {
                "use strict";
                if ((result !== null) && (result.length > 0) && (result[0] > 0)) {
                    return callback(null, null, 200, null, eventId);
                } else {
                    return callback(1, 'update_event_fail', 400, '', null);
                }
            }).catch(function (error) {
                "use strict";
                return callback(1, 'update_event_fail', 420, error, null);
            });

        } catch (error) {
            console.log(error);
            return callback(1, 'update_event_fail', 400, error, null);
        }
    },

    delete: function (accessUserId, accessUserRole, eventId, managerId, callback) {
        try {
            if ((accessUserRole < Constant.USER_ROLE.ADMIN & accessUserId !== parseInt(managerId)
            ) || accessUserRole < Constant.USER_ROLE.MANAGER) {
                return callback(1, 'invalid_user_right', 403, null);
            }

            let queryObj = {};
            let where = {};

            where = { id: eventId };
            queryObj = { deleted: Constant.DELETED.YES };

            Event.findOne({ where: where }).then(currEvent => {
                "use strict";
                if (currEvent && currEvent.deleted === Constant.DELETED.YES) {
                    Event.destroy({ where: where }).then(result => {
                        return callback(null, null, 200, null);
                    }).catch(function (error) {
                        return callback(1, 'remove_event_fail', 420, error);
                    });
                } else {
                    Event.update(queryObj, { where: where }).then(result => {
                        "use strict";
                        return callback(null, null, 200, null);
                    }).catch(function (error) {
                        return callback(1, 'update_event_fail', 420, error);
                    })
                }
            }).catch(function (error) {
                "use strict";
                return callback(1, 'find_one_event_fail', 400, error, null);
            });
        } catch (error) {
            return callback(1, 'delete_event_fail', 400, error);
        }
    },

    deletes: function (accessUserId, accessUserRole, ids, callback) {
        try {
            if (accessUserRole < Constant.USER_ROLE.ADMIN) {
                return callback(1, 'invalid_user_right', 403, null);
            }

            let idList = Pieces.safelyParseJSON(ids);
            let where = { id: idList };

            let queryObj = {
                deleted: Constant.DELETED.YES,
                updatedBy: accessUserId,
                updatedAt: new Date()
            };

            Event.update(queryObj, { where: where }).then(result => {
                "use strict";
                if (result && (result.length > 0) && result[0] > 0) {
                    return callback(null, null, 200, null);
                } else {
                    return callback(1, 'invalid_event_request', 404, null);
                }
            }).catch(function (error) {
                "use strict";
                return callback(1, 'update_event_fail', 420, error);
            });
        } catch (error) {
            return callback(1, 'deletes_event_fail', 400, error);
        }
    },
}