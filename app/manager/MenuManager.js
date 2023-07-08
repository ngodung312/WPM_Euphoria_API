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
const Menu = Models.Menu;

module.exports = {
    getOne: function (accessUserId, accessUserRole, id, callback) {
        try {
            if ( accessUserRole < Constant.USER_ROLE.EVENT_HOST ) {
                return callback(1, 'invalid_user_right', 403, null, null);
            }

            let attributes = ['id', 'menuTitle', 'menuDesc', 'menuPrice', 'deleted', 'createdBy', 'createdAt', 'updatedBy', 'updatedAt'];
            Menu.findOne({
                where: { id: id },
                attributes: attributes
            }).then(result => {
                "use strict";
                // console.log(result);;
                // console.log(attributes);
                if (result) {
                    return callback(null, null, 200, null, result);
                } else {
                    return callback(1, 'invalid_menu', 403, null, null);
                }
            });
        } catch (error) {
            return callback(1, 'get_one_menu_fail', 400, error, null);
        }
    },

    getAll: function (accessUserId, accessUserRole, query, callback) {
        try {
            if ( accessUserRole < Constant.USER_ROLE.EVENT_HOST ) {
                return callback(1, 'invalid_user_right', 403, null, null);
            }

            let attributes = ['id', 'menuTitle', 'menuDesc', 'menuPrice', 'deleted', 'createdBy', 'createdAt', 'updatedBy', 'updatedAt'];
            let where = {};
            where.deleted = Constant.DELETED.NO;

            Menu.findAndCountAll({
                attributes: attributes,
                where: where
            })
                .then((result) => {
                    // console.log(result);
                    return callback(null, null, 200, null, result);
                }).catch(function (error) {
                    console.log(error);
                    return callback(1, 'find_all_menu_fail', 420, error, null);
                });
        } catch (error) {
            return callback(1, 'get_all_menu_fail', 400, error, null);
        }
    },

    create: function (accessUserId, accessUserRole, menuData, callback) {
        try {
            if ( accessUserRole < Constant.USER_ROLE.MANAGER ) {
                return callback(1, 'invalid_user_right', 403, null, null);
            }

            let queryObj = {};
            queryObj.menuTitle = menuData.menuTitle;
            queryObj.menuDesc = menuData.menuDesc;
            queryObj.menuPrice = menuData.menuPrice;
            queryObj.deleted = Constant.DELETED.NO;
            queryObj.createdBy = accessUserId;
            queryObj.createdAt = new Date();
            queryObj.updatedBy = accessUserId;
            queryObj.updatedAt = new Date();

            Menu.create(queryObj).then(result => {
                "use strict";
                return callback(null, null, 200, null, result);
            }).catch(function (error) {
                "use strict";
                return callback(1, 'create_menu_fail', 420, error, null);
            });
        } catch (error) {
            return callback(1, 'create_menu_fail', 400, error, null);
        }
    },

    update: function (accessUserId, accessUserRole, menuId, updatedData, callback) {
        try {
            if ( accessUserRole < Constant.USER_ROLE.MANAGER ) {
                return callback(1, 'invalid_user_right', 403, null, null);
            }

            let queryObj = {};
            let where = {};

            where.id = menuId;
            queryObj.menuTitle = updatedData.menuTitle;
            queryObj.menuDesc = updatedData.menuDesc;
            queryObj.menuPrice = updatedData.menuPrice;
            queryObj.updatedAt = new Date();
            queryObj.updatedBy = accessUserId;

            Menu.update(
                queryObj,
                { where: where }
            ).then(result => {
                "use strict";
                if ((result !== null) && (result.length > 0) && (result[0] > 0)) {
                    return callback(null, null, 200, null, menuId);
                } else {
                    return callback(1, 'update_menu_fail', 400, '', null);
                }
            }).catch(function (error) {
                "use strict";
                return callback(1, 'update_menu_fail', 420, error, null);
            });

        } catch (error) {
            console.log(error);
            return callback(1, 'update_menu_fail', 400, error, null);
        }
    },

    delete: function (accessUserId, accessUserRole, menuId, callback) {
        try {
            if ( accessUserRole < Constant.USER_ROLE.MANAGER ) {
                return callback(1, 'invalid_user_right', 403, null);
            }

            let queryObj = {};
            let where = {};

            where = { id: menuId };
            queryObj = { deleted: Constant.DELETED.YES };

            Menu.findOne({ where: where }).then(currMenu => {
                "use strict";
                if (currMenu && currMenu.deleted === Constant.DELETED.YES) {
                    Menu.destroy({ where: where }).then(result => {
                        return callback(null, null, 200, null);
                    }).catch(function (error) {
                        return callback(1, 'remove_menu_fail', 420, error);
                    });
                } else {
                    Menu.update(queryObj, { where: where }).then(result => {
                        "use strict";
                        return callback(null, null, 200, null);
                    }).catch(function (error) {
                        return callback(1, 'update_menu_fail', 420, error);
                    })
                }
            }).catch(function (error) {
                "use strict";
                return callback(1, 'find_one_menu_fail', 400, error, null);
            });
        } catch (error) {
            return callback(1, 'delete_menu_fail', 400, error);
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

            Menu.update(queryObj, { where: where }).then(result => {
                "use strict";
                if (result && (result.length > 0) && result[0] > 0) {
                    return callback(null, null, 200, null);
                } else {
                    return callback(1, 'invalid_menu_request', 404, null);
                }
            }).catch(function (error) {
                "use strict";
                return callback(1, 'update_menu_fail', 420, error);
            });
        } catch (error) {
            return callback(1, 'deletes_menu_fail', 400, error);
        }
    },
}