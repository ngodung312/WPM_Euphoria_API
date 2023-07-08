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
const RestaurantInfo = Models.RestaurantInfo;

module.exports = {
    getOne: function (accessUserId, accessUserRole, id, callback) {
        try {
            let attributes = ['id', 'infoLabel', 'infoValue', 'deleted', 'createdBy', 'createdAt', 'updatedBy', 'updatedAt'];
            RestaurantInfo.findOne({
                where: { id: id },
                attributes: attributes
            }).then(result => {
                "use strict";
                // console.log(result);;
                // console.log(attributes);
                if (result) {
                    return callback(null, null, 200, null, result);
                } else {
                    return callback(1, 'invalid_restaurant_info', 403, null, null);
                }
            });
        } catch (error) {
            return callback(1, 'get_one_restaurant_info_fail', 400, error, null);
        }
    },

    getAll: function (accessUserId, accessUserRole, query, callback) {
        try {
            let attributes = ['id', 'infoLabel', 'infoValue', 'deleted', 'createdBy', 'createdAt', 'updatedBy', 'updatedAt'];
            let where = {};
            where.deleted = Constant.DELETED.NO;

            RestaurantInfo.findAndCountAll({
                attributes: attributes,
                where: where
            })
                .then((result) => {
                    // console.log(result);
                    return callback(null, null, 200, null, result);
                }).catch(function (error) {
                    console.log(error);
                    return callback(1, 'find_all_restaurant_info_fail', 420, error, null);
                });
        } catch (error) {
            return callback(1, 'get_all_restaurant_info_fail', 400, error, null);
        }
    },

    create: function (accessUserId, accessUserRole, restaurantInfoData, callback) {
        try {
            if ( accessUserRole < Constant.USER_ROLE.MANAGER ) {
                return callback(1, 'invalid_user_right', 403, null, null);
            }
            
            let queryObj = {};
            queryObj.infoLabel = restaurantInfoData.infoLabel;
            queryObj.infoValue = restaurantInfoData.infoValue;
            queryObj.deleted = Constant.DELETED.NO;
            queryObj.createdBy = accessUserId;
            queryObj.createdAt = new Date();
            queryObj.updatedBy = accessUserId;
            queryObj.updatedAt = new Date();

            RestaurantInfo.create(queryObj).then(result => {
                "use strict";
                return callback(null, null, 200, null, result);
            }).catch(function (error) {
                "use strict";
                return callback(1, 'create_restaurant_info_fail', 420, error, null);
            });
        } catch (error) {
            return callback(1, 'create_restaurant_info_fail', 400, error, null);
        }
    },

    update: function (accessUserId, accessUserRole, restaurantInfoId, updatedData, callback) {
        try {
            if ( accessUserRole < Constant.USER_ROLE.MANAGER ) {
                return callback(1, 'invalid_user_right', 403, null, null);
            }
            
            let queryObj = {};
            let where = {};

            where.id = restaurantInfoId;
            queryObj.infoLabel = updatedData.infoLabel;
            queryObj.infoValue = updatedData.infoValue;
            queryObj.eventId = updatedData.eventId;
            queryObj.updatedAt = new Date();
            queryObj.updatedBy = accessUserId;

            RestaurantInfo.update(
                queryObj,
                { where: where }
            ).then(result => {
                "use strict";
                if ((result !== null) && (result.length > 0) && (result[0] > 0)) {
                    return callback(null, null, 200, null, restaurantInfoId);
                } else {
                    return callback(1, 'update_restaurant_info_fail', 400, '', null);
                }
            }).catch(function (error) {
                "use strict";
                return callback(1, 'update_restaurant_info_fail', 420, error, null);
            });

        } catch (error) {
            console.log(error);
            return callback(1, 'update_restaurant_info_fail', 400, error, null);
        }
    },

    delete: function (accessUserId, accessUserRole, restaurantInfoId, callback) {
        try {
            if ( accessUserRole < Constant.USER_ROLE.MANAGER ) {
                return callback(1, 'invalid_user_right', 403, null);
            }
            
            let queryObj = {};
            let where = {};

            where = { id: restaurantInfoId };
            queryObj = { deleted: Constant.DELETED.YES };

            RestaurantInfo.findOne({ where: where }).then(currRestaurantInfo => {
                "use strict";
                if (currRestaurantInfo && currRestaurantInfo.deleted === Constant.DELETED.YES) {
                    RestaurantInfo.destroy({ where: where }).then(result => {
                        return callback(null, null, 200, null);
                    }).catch(function (error) {
                        return callback(1, 'remove_restaurant_info_fail', 420, error);
                    });
                } else {
                    RestaurantInfo.update(queryObj, { where: where }).then(result => {
                        "use strict";
                        return callback(null, null, 200, null);
                    }).catch(function (error) {
                        return callback(1, 'update_restaurant_info_fail', 420, error);
                    })
                }
            }).catch(function (error) {
                "use strict";
                return callback(1, 'find_one_restaurant_info_fail', 400, error, null);
            });
        } catch (error) {
            return callback(1, 'delete_restaurant_info_fail', 400, error);
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

            RestaurantInfo.update(queryObj, { where: where }).then(result => {
                "use strict";
                if (result && (result.length > 0) && result[0] > 0) {
                    return callback(null, null, 200, null);
                } else {
                    return callback(1, 'invalid_restaurant_info_request', 404, null);
                }
            }).catch(function (error) {
                "use strict";
                return callback(1, 'update_restaurant_info_fail', 420, error);
            });
        } catch (error) {
            return callback(1, 'deletes_restaurant_info_fail', 400, error);
        }
    },
}