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
const MenuItem = Models.MenuItem;

module.exports = {
    getOne: function (accessUserId, accessUserRole, id, callback) {
        try {
            if ( accessUserRole < Constant.USER_ROLE.EVENT_HOST ) {
                return callback(1, 'invalid_user_right', 403, null, null);
            }

            let attributes = ['id', 'dishId', 'dishType', 'menuId', 'deleted', 'createdBy', 'createdAt', 'updatedBy', 'updatedAt'];
            MenuItem.findOne({
                where: { id: id },
                attributes: attributes
            }).then(result => {
                "use strict";
                // console.log(result);;
                // console.log(attributes);
                if (result) {
                    return callback(null, null, 200, null, result);
                } else {
                    return callback(1, 'invalid_menu_item', 403, null, null);
                }
            });
        } catch (error) {
            return callback(1, 'get_one_menu_item_fail', 400, error, null);
        }
    },

    getAll: function (accessUserId, accessUserRole, menuId, callback) {
        try {
            if ( accessUserRole < Constant.USER_ROLE.EVENT_HOST ) {
                return callback(1, 'invalid_user_right', 403, null, null);
            }

            let attributes = ['id', 'dishId', 'dishType', 'menuId', 'deleted', 'createdBy', 'createdAt', 'updatedBy', 'updatedAt'];
            let where = {
                deleted: Constant.DELETED.NO
            };
            if (menuId) where.menuId = menuId;

            MenuItem.findAndCountAll({
                attributes: attributes,
                where: where
            })
                .then((result) => {
                    // // console.log(result);
                    return callback(null, null, 200, null, result);
                }).catch(function (error) {
                    console.log(error);
                    return callback(1, 'find_all_menu_item_fail', 420, error, null);
                });
        } catch (error) {
            return callback(1, 'get_all_menu_item_fail', 400, error, null);
        }
    },

    create: function (accessUserId, accessUserRole, menuItemData, callback) {
        try {
            if ( accessUserRole < Constant.USER_ROLE.MANAGER ) {
                return callback(1, 'invalid_user_right', 403, null, null);
            }

            let queryObj = {};
            queryObj.dishId = menuItemData.dishId;
            queryObj.dishType = menuItemData.dishType;
            queryObj.menuId = menuItemData.menuId;
            queryObj.deleted = Constant.DELETED.NO;
            queryObj.createdBy = accessUserId;
            queryObj.createdAt = new Date();
            queryObj.updatedBy = accessUserId;
            queryObj.updatedAt = new Date();

            MenuItem.create(queryObj).then(result => {
                "use strict";
                return callback(null, null, 200, null, result);
            }).catch(function (error) {
                "use strict";
                return callback(1, 'create_menu_item_fail', 420, error, null);
            });
        } catch (error) {
            return callback(1, 'create_menu_item_fail', 400, error, null);
        }
    },

    creates: function (accessUserId, accessUserRole, menuItems, callback) {
        try {
            if ( accessUserRole < Constant.USER_ROLE.MANAGER ) {
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

            for (let i = 0; i < menuItems.length; i++) {
                const currItem = menuItems[i];
                let itemData = {
                    dishId: currItem.dishId,
                    dishType: currItem.dishType,
                    menuId: currItem.menuId,
                    ...defaultVals
                }
                if (currItem.id) {
                    itemData.id = currItem.id;
                    updatedObj.push(itemData);
                } else {
                    newObj.push(itemData);
                }
            }

            MenuItem.bulkCreate(
                updatedObj,
                {
                    updateOnDuplicate: ["dishId", "dishType", "updatedAt", "updatedBy"],
                    // logging: console.log,
                },
            ).then(updatedRes => {
                "use strict";
                MySequelize.query(
                    "ALTER TABLE `tbl_menu_items` AUTO_INCREMENT = 1;"
                ).then(() => {
                    MenuItem.bulkCreate(newObj).then(createdRes => {
                        return callback(null, null, 200, null, [...updatedRes, ...createdRes]);
                    }).catch(error => {
                        "use strict";
                        return callback(1, 'creates_menu_item_fail', 400, error, null);
                    })
                }).catch(error => {
                    "use strict";
                    return callback(1, 'creates_menu_item_fail', 400, error, null);
                });
            }).catch(function (error) {
                "use strict";
                return callback(1, 'creates_menu_item_fail', 420, error, null);
            });
        } catch (error) {
            return callback(1, 'creates_menu_item_fail', 400, error, null);
        }
    },

    update: function (accessUserId, accessUserRole, menuItemId, updatedData, callback) {
        try {
            if ( accessUserRole < Constant.USER_ROLE.MANAGER ) {
                return callback(1, 'invalid_user_right', 403, null, null);
            }

            let queryObj = {};
            let where = {};

            where.id = menuItemId;
            queryObj.dishId = updatedData.dishId;
            queryObj.dishType = updatedData.dishType;
            queryObj.menuId = updatedData.menuId;
            queryObj.updatedAt = new Date();
            queryObj.updatedBy = accessUserId;

            MenuItem.update(
                queryObj,
                { where: where }
            ).then(result => {
                "use strict";
                if ((result !== null) && (result.length > 0) && (result[0] > 0)) {
                    return callback(null, null, 200, null, menuItemId);
                } else {
                    return callback(1, 'update_menu_item_fail', 400, '', null);
                }
            }).catch(function (error) {
                "use strict";
                return callback(1, 'update_menu_item_fail', 420, error, null);
            });

        } catch (error) {
            console.log(error);
            return callback(1, 'update_menu_item_fail', 400, error, null);
        }
    },

    delete: function (accessUserId, accessUserRole, menuItemId, callback) {
        try {
            if ( accessUserRole < Constant.USER_ROLE.MANAGER ) {
                return callback(1, 'invalid_user_right', 403, null);
            }

            let queryObj = {};
            let where = {};

            where = { id: menuItemId };
            queryObj = { deleted: Constant.DELETED.YES };

            MenuItem.findOne({ where: where }).then(currMenuItem => {
                "use strict";
                if (currMenuItem && currMenuItem.deleted === Constant.DELETED.YES) {
                    MenuItem.destroy({ where: where }).then(result => {
                        return callback(null, null, 200, null);
                    }).catch(function (error) {
                        return callback(1, 'remove_menu_item_fail', 420, error);
                    });
                } else {
                    MenuItem.update(queryObj, { where: where }).then(result => {
                        "use strict";
                        return callback(null, null, 200, null);
                    }).catch(function (error) {
                        return callback(1, 'update_menu_item_fail', 420, error);
                    })
                }
            }).catch(function (error) {
                "use strict";
                return callback(1, 'find_one_menu_item_fail', 400, error, null);
            });
        } catch (error) {
            return callback(1, 'delete_menu_item_fail', 400, error);
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

            MenuItem.update(queryObj, { where: where }).then(result => {
                "use strict";
                if (result && (result.length > 0) && result[0] > 0) {
                    return callback(null, null, 200, null);
                } else {
                    return callback(1, 'invalid_menu_item_request', 404, null);
                }
            }).catch(function (error) {
                "use strict";
                return callback(1, 'update_menu_item_fail', 420, error);
            });
        } catch (error) {
            return callback(1, 'deletes_menu_item_fail', 400, error);
        }
    },
}