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
const Hall = Models.Hall;

module.exports = {
    getOne: function (accessUserId, accessUserRole, id, callback) {
        try {
            if ( accessUserRole < Constant.USER_ROLE.EVENT_HOST ) {
                return callback(1, 'invalid_user_right', 403, null, null);
            }

            let attributes = ['id', 'hallTitle', 'hallDesc', 'hallUrl', 'numTables', 'deleted', 'createdBy', 'createdAt', 'updatedBy', 'updatedAt'];
            Hall.findOne({
                where: { id: id },
                attributes: attributes
            }).then(result => {
                "use strict";
                // console.log(result);;
                // console.log(attributes);
                if (result) {
                    return callback(null, null, 200, null, result);
                } else {
                    return callback(1, 'invalid_hall', 403, null, null);
                }
            });
        } catch (error) {
            return callback(1, 'get_one_hall_fail', 400, error, null);
        }
    },

    getAll: function (accessUserId, accessUserRole, query, callback) {
        try {
            if ( accessUserRole < Constant.USER_ROLE.EVENT_HOST ) {
                return callback(1, 'invalid_user_right', 403, null, null);
            }

            let attributes = ['id', 'hallTitle', 'hallDesc', 'hallUrl', 'numTables', 'deleted', 'createdBy', 'createdAt', 'updatedBy', 'updatedAt'];
            let where = {};
            where.deleted = Constant.DELETED.NO;

            Hall.findAndCountAll({
                attributes: attributes,
                where: where
            })
                .then((result) => {
                    // console.log(result);
                    return callback(null, null, 200, null, result);
                }).catch(function (error) {
                    console.log(error);
                    return callback(1, 'find_all_hall_fail', 420, error, null);
                });
        } catch (error) {
            return callback(1, 'get_all_hall_fail', 400, error, null);
        }
    },

    create: function (accessUserId, accessUserRole, hallData, callback) {
        try {
            if ( accessUserRole < Constant.USER_ROLE.MANAGER ) {
                return callback(1, 'invalid_user_right', 403, null, null);
            }

            let queryObj = {};
            queryObj.hallTitle = hallData.hallTitle;
            queryObj.hallDesc = hallData.hallDesc;
            queryObj.hallUrl = hallData.hallUrl;
            queryObj.numTables = hallData.numTables;
            queryObj.deleted = Constant.DELETED.NO;
            queryObj.createdBy = accessUserId;
            queryObj.createdAt = new Date();
            queryObj.updatedBy = accessUserId;
            queryObj.updatedAt = new Date();

            Hall.create(queryObj).then(result => {
                "use strict";
                return callback(null, null, 200, null, result);
            }).catch(function (error) {
                "use strict";
                return callback(1, 'create_hall_fail', 420, error, null);
            });
        } catch (error) {
            return callback(1, 'create_hall_fail', 400, error, null);
        }
    },

    update: function (accessUserId, accessUserRole, hallId, updatedData, callback) {
        try {
            if ( accessUserRole < Constant.USER_ROLE.MANAGER ) {
                return callback(1, 'invalid_user_right', 403, null, null);
            }

            let queryObj = {};
            let where = {};

            where.id = hallId;
            queryObj.hallTitle = updatedData.hallTitle;
            queryObj.hallDesc = updatedData.hallDesc;
            queryObj.hallUrl = updatedData.hallUrl;
            queryObj.numTables = updatedData.numTables;
            queryObj.updatedAt = new Date();
            queryObj.updatedBy = accessUserId;

            Hall.update(
                queryObj,
                { where: where }
            ).then(result => {
                "use strict";
                if ((result !== null) && (result.length > 0) && (result[0] > 0)) {
                    return callback(null, null, 200, null, hallId);
                } else {
                    return callback(1, 'update_hall_fail', 400, '', null);
                }
            }).catch(function (error) {
                "use strict";
                return callback(1, 'update_hall_fail', 420, error, null);
            });

        } catch (error) {
            console.log(error);
            return callback(1, 'update_hall_fail', 400, error, null);
        }
    },

    delete: function (accessUserId, accessUserRole, hallId, callback) {
        try {
            if ( accessUserRole < Constant.USER_ROLE.MANAGER ) {
                return callback(1, 'invalid_user_right', 403, null);
            }

            let queryObj = {};
            let where = {};

            where = { id: hallId };
            queryObj = { deleted: Constant.DELETED.YES };

            Hall.findOne({ where: where }).then(currHall => {
                "use strict";
                if (currHall && currHall.deleted === Constant.DELETED.YES) {
                    Hall.destroy({ where: where }).then(result => {
                        return callback(null, null, 200, null);
                    }).catch(function (error) {
                        return callback(1, 'remove_hall_fail', 420, error);
                    });
                } else {
                    Hall.update(queryObj, { where: where }).then(result => {
                        "use strict";
                        return callback(null, null, 200, null);
                    }).catch(function (error) {
                        return callback(1, 'update_hall_fail', 420, error);
                    })
                }
            }).catch(function (error) {
                "use strict";
                return callback(1, 'find_one_hall_fail', 400, error, null);
            });
        } catch (error) {
            return callback(1, 'delete_hall_fail', 400, error);
        }
    },

    deletes: function (accessUserId, accessUserRole, ids, callback) {
        try {
            if ( accessUserRole < Constant.USER_ROLE.MANAGER ) {
                return callback(1, 'invalid_user_right', 403, null);
            }

            let idList = Pieces.safelyParseJSON(ids);
            let where = { id: idList };

            let queryObj = { 
                deleted: Constant.DELETED.YES,
                updatedBy: accessUserId,
                updatedAt: new Date()
            };

            Hall.update(queryObj, { where: where }).then(result => {
                "use strict";
                if (result && (result.length > 0) && result[0] > 0) {
                    return callback(null, null, 200, null);
                } else {
                    return callback(1, 'invalid_hall_request', 404, null);
                }
            }).catch(function (error) {
                "use strict";
                return callback(1, 'update_hall_fail', 420, error);
            });
        } catch (error) {
            return callback(1, 'deletes_hall_fail', 400, error);
        }
    },
}