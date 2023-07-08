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
const Map = Models.Map;

module.exports = {
    getOne: function (accessUserId, accessUserRole, id, callback) {
        try {
            if ( accessUserRole < Constant.USER_ROLE.EVENT_HOST ) {
                return callback(1, 'invalid_user_right', 403, null, null);
            }

            let attributes = ['id', 'mapTitle', 'mapDesc', 'mapUrl', 'hallId', 'deleted', 'createdBy', 'createdAt', 'updatedBy', 'updatedAt'];
            Map.findOne({
                where: { id: id },
                attributes: attributes
            }).then(result => {
                "use strict";
                // console.log(result);;
                // console.log(attributes);
                if (result) {
                    return callback(null, null, 200, null, result);
                } else {
                    return callback(1, 'invalid_map', 403, null, null);
                }
            });
        } catch (error) {
            return callback(1, 'get_one_map_fail', 400, error, null);
        }
    },

    getAll: function (accessUserId, accessUserRole, hallId, callback) {
        try {
            if ( accessUserRole < Constant.USER_ROLE.EVENT_HOST ) {
                return callback(1, 'invalid_user_right', 403, null, null);
            }

            let attributes = ['id', 'mapTitle', 'mapDesc', 'mapUrl', 'hallId', 'deleted', 'createdBy', 'createdAt', 'updatedBy', 'updatedAt'];
            let where = {};
            where.deleted = Constant.DELETED.NO;
            if (hallId) where.hallId = hallId;

            Map.findAndCountAll({
                attributes: attributes,
                where: where
            })
                .then((result) => {
                    // console.log(result);
                    return callback(null, null, 200, null, result);
                }).catch(function (error) {
                    console.log(error);
                    return callback(1, 'find_all_map_fail', 420, error, null);
                });
        } catch (error) {
            return callback(1, 'get_all_map_fail', 400, error, null);
        }
    },

    create: function (accessUserId, accessUserRole, mapData, callback) {
        try {
            if ( accessUserRole < Constant.USER_ROLE.MANAGER ) {
                return callback(1, 'invalid_user_right', 403, null, null);
            }

            let queryObj = {};
            queryObj.mapTitle = mapData.mapTitle;
            queryObj.mapDesc = mapData.mapDesc;
            queryObj.mapUrl = mapData.mapUrl;
            queryObj.hallId = mapData.hallId;
            queryObj.deleted = Constant.DELETED.NO;
            queryObj.createdBy = accessUserId;
            queryObj.createdAt = new Date();
            queryObj.updatedBy = accessUserId;
            queryObj.updatedAt = new Date();

            Map.create(queryObj).then(result => {
                "use strict";
                return callback(null, null, 200, null, result);
            }).catch(function (error) {
                "use strict";
                return callback(1, 'create_map_fail', 420, error, null);
            });
        } catch (error) {
            return callback(1, 'create_map_fail', 400, error, null);
        }
    },

    update: function (accessUserId, accessUserRole, mapId, updatedData, callback) {
        try {
            if ( accessUserRole < Constant.USER_ROLE.MANAGER ) {
                return callback(1, 'invalid_user_right', 403, null, null);
            }

            let queryObj = {};
            let where = {};

            where.id = mapId;
            queryObj.mapTitle = updatedData.mapTitle;
            queryObj.mapDesc = updatedData.mapDesc;
            queryObj.mapUrl = updatedData.mapUrl;
            queryObj.hallId = updatedData.hallId;
            queryObj.updatedAt = new Date();
            queryObj.updatedBy = accessUserId;

            Map.update(
                queryObj,
                { where: where }
            ).then(result => {
                "use strict";
                if ((result !== null) && (result.length > 0) && (result[0] > 0)) {
                    return callback(null, null, 200, null, mapId);
                } else {
                    return callback(1, 'update_map_fail', 400, '', null);
                }
            }).catch(function (error) {
                "use strict";
                return callback(1, 'update_map_fail', 420, error, null);
            });

        } catch (error) {
            console.log(error);
            return callback(1, 'update_map_fail', 400, error, null);
        }
    },

    delete: function (accessUserId, accessUserRole, mapId, callback) {
        try {
            if ( accessUserRole < Constant.USER_ROLE.MANAGER ) {
                return callback(1, 'invalid_user_right', 403, null);
            }

            let queryObj = {};
            let where = {};

            where = { id: mapId };
            queryObj = { deleted: Constant.DELETED.YES };

            Map.findOne({ where: where }).then(currMap => {
                "use strict";
                if (currMap && currMap.deleted === Constant.DELETED.YES) {
                    Map.destroy({ where: where }).then(result => {
                        return callback(null, null, 200, null);
                    }).catch(function (error) {
                        return callback(1, 'remove_map_fail', 420, error);
                    });
                } else {
                    Map.update(queryObj, { where: where }).then(result => {
                        "use strict";
                        return callback(null, null, 200, null);
                    }).catch(function (error) {
                        return callback(1, 'update_map_fail', 420, error);
                    })
                }
            }).catch(function (error) {
                "use strict";
                return callback(1, 'find_one_map_fail', 400, error, null);
            });
        } catch (error) {
            return callback(1, 'delete_map_fail', 400, error);
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

            Map.update(queryObj, { where: where }).then(result => {
                "use strict";
                if (result && (result.length > 0) && result[0] > 0) {
                    return callback(null, null, 200, null);
                } else {
                    return callback(1, 'invalid_map_request', 404, null);
                }
            }).catch(function (error) {
                "use strict";
                return callback(1, 'update_map_fail', 420, error);
            });
        } catch (error) {
            return callback(1, 'deletes_map_fail', 400, error);
        }
    },
}