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
const Dish = Models.Dish;

module.exports = {
    getOne: function (accessUserId, accessUserRole, id, callback) {
        try {
            if ( accessUserRole < Constant.USER_ROLE.EVENT_HOST ) {
                return callback(1, 'invalid_user_right', 403, null, null);
            }

            let attributes = ['id', 'dishTitle', 'dishDesc', 'dishUrl', 'dishPrice', 'deleted', 'createdBy', 'createdAt', 'updatedBy', 'updatedAt'];
            Dish.findOne({
                where: { id: id },
                attributes: attributes
            }).then(result => {
                "use strict";
                // console.log(result);;
                // console.log(attributes);
                if (result) {
                    return callback(null, null, 200, null, result);
                } else {
                    return callback(1, 'invalid_dish', 403, null, null);
                }
            });
        } catch (error) {
            return callback(1, 'get_one_dish_fail', 400, error, null);
        }
    },

    getAll: function (accessUserId, accessUserRole, query, callback) {
        try {
            if ( accessUserRole < Constant.USER_ROLE.EVENT_HOST ) {
                return callback(1, 'invalid_user_right', 403, null, null);
            }

            let attributes = ['id', 'dishTitle', 'dishDesc', 'dishUrl', 'dishPrice', 'deleted', 'createdBy', 'createdAt', 'updatedBy', 'updatedAt'];
            let where = {};
            where.deleted = Constant.DELETED.NO;

            Dish.findAndCountAll({
                attributes: attributes,
                where: where
            })
                .then((result) => {
                    // console.log(result);
                    return callback(null, null, 200, null, result);
                }).catch(function (error) {
                    console.log(error);
                    return callback(1, 'find_all_dish_fail', 420, error, null);
                });
        } catch (error) {
            return callback(1, 'get_all_dish_fail', 400, error, null);
        }
    },

    create: function (accessUserId, accessUserRole, dishData, callback) {
        try {
            if ( accessUserRole < Constant.USER_ROLE.MANAGER ) {
                return callback(1, 'invalid_user_right', 403, null, null);
            }

            let queryObj = {};
            queryObj.dishTitle = dishData.dishTitle;
            queryObj.dishDesc = dishData.dishDesc;
            queryObj.dishUrl = dishData.dishUrl;
            queryObj.dishPrice = dishData.dishPrice;
            queryObj.deleted = Constant.DELETED.NO;
            queryObj.createdBy = accessUserId;
            queryObj.createdAt = new Date();
            queryObj.updatedBy = accessUserId;
            queryObj.updatedAt = new Date();

            Dish.create(queryObj).then(result => {
                "use strict";
                return callback(null, null, 200, null, result);
            }).catch(function (error) {
                "use strict";
                return callback(1, 'create_dish_fail', 420, error, null);
            });
        } catch (error) {
            return callback(1, 'create_dish_fail', 400, error, null);
        }
    },

    update: function (accessUserId, accessUserRole, dishId, updatedData, callback) {
        try {
            if ( accessUserRole < Constant.USER_ROLE.MANAGER ) {
                return callback(1, 'invalid_user_right', 403, null, null);
            }

            let queryObj = {};
            let where = {};

            where.id = dishId;
            queryObj.dishTitle = updatedData.dishTitle;
            queryObj.dishDesc = updatedData.dishDesc;
            queryObj.dishUrl = updatedData.dishUrl;
            queryObj.dishPrice = updatedData.dishPrice;
            queryObj.updatedAt = new Date();
            queryObj.updatedBy = accessUserId;

            Dish.update(
                queryObj,
                { where: where }
            ).then(result => {
                "use strict";
                if ((result !== null) && (result.length > 0) && (result[0] > 0)) {
                    return callback(null, null, 200, null, dishId);
                } else {
                    return callback(1, 'update_dish_fail', 400, '', null);
                }
            }).catch(function (error) {
                "use strict";
                return callback(1, 'update_dish_fail', 420, error, null);
            });

        } catch (error) {
            console.log(error);
            return callback(1, 'update_dish_fail', 400, error, null);
        }
    },

    delete: function (accessUserId, accessUserRole, dishId, callback) {
        try {
            if ( accessUserRole < Constant.USER_ROLE.MANAGER ) {
                return callback(1, 'invalid_user_right', 403, null);
            }

            let queryObj = {};
            let where = {};

            where = { id: dishId };
            queryObj = { deleted: Constant.DELETED.YES };

            Dish.findOne({ where: where }).then(currDish => {
                "use strict";
                if (currDish && currDish.deleted === Constant.DELETED.YES) {
                    Dish.destroy({ where: where }).then(result => {
                        return callback(null, null, 200, null);
                    }).catch(function (error) {
                        return callback(1, 'remove_dish_fail', 420, error);
                    });
                } else {
                    Dish.update(queryObj, { where: where }).then(result => {
                        "use strict";
                        return callback(null, null, 200, null);
                    }).catch(function (error) {
                        return callback(1, 'update_dish_fail', 420, error);
                    })
                }
            }).catch(function (error) {
                "use strict";
                return callback(1, 'find_one_dish_fail', 400, error, null);
            });
        } catch (error) {
            return callback(1, 'delete_dish_fail', 400, error);
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

            Dish.update(queryObj, { where: where }).then(result => {
                "use strict";
                if (result && (result.length > 0) && result[0] > 0) {
                    return callback(null, null, 200, null);
                } else {
                    return callback(1, 'invalid_dish_request', 404, null);
                }
            }).catch(function (error) {
                "use strict";
                return callback(1, 'update_dish_fail', 420, error);
            });
        } catch (error) {
            return callback(1, 'deletes_dish_fail', 400, error);
        }
    },
}