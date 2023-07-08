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
const EvtItem = Models.EvtItem;

module.exports = {
    getOne: function (accessUserId, accessUserRole, id, callback) {
        try {
            if ( accessUserRole < Constant.USER_ROLE.EVENT_HOST ) {
                return callback(1, 'invalid_user_right', 403, null, null);
            }

            let attributes = ['id', 'itemTitle', 'itemDesc', 'startTime', 'endTime', 'eventId', 'deleted', 'createdBy', 'createdAt', 'updatedBy', 'updatedAt'];
            EvtItem.findOne({
                where: { id: id },
                attributes: attributes
            }).then(result => {
                "use strict";
                // console.log(result);;
                // console.log(attributes);
                if (result) {
                    return callback(null, null, 200, null, result);
                } else {
                    return callback(1, 'invalid_evt_item', 403, null, null);
                }
            });
        } catch (error) {
            return callback(1, 'get_one_evt_item_fail', 400, error, null);
        }
    },

    getAll: function (accessUserId, accessUserRole, eventId, callback) {
        try {
            if ( accessUserRole < Constant.USER_ROLE.EVENT_HOST ) {
                return callback(1, 'invalid_user_right', 403, null, null);
            }

            let attributes = ['id', 'itemTitle', 'itemDesc', 'startTime', 'endTime', 'eventId', 'deleted', 'createdBy', 'createdAt', 'updatedBy', 'updatedAt'];
            let where = {};
            where.deleted = Constant.DELETED.NO;
            if (eventId) where.eventId = eventId;

            EvtItem.findAndCountAll({
                attributes: attributes,
                where: where
            })
                .then((result) => {
                    // console.log(result);
                    return callback(null, null, 200, null, result);
                }).catch(function (error) {
                    console.log(error);
                    return callback(1, 'find_all_evt_item_fail', 420, error, null);
                });
        } catch (error) {
            return callback(1, 'get_all_evt_item_fail', 400, error, null);
        }
    },

    create: function (accessUserId, accessUserRole, evtItemData, callback) {
        try {
            if ( accessUserRole < Constant.USER_ROLE.EVENT_HOST ) {
                return callback(1, 'invalid_user_right', 403, null, null);
            }

            let queryObj = {};
            queryObj.itemTitle = evtItemData.itemTitle;
            queryObj.itemDesc = evtItemData.itemDesc;
            queryObj.startTime = evtItemData.startTime;
            queryObj.endTime = evtItemData.endTime;
            queryObj.eventId = evtItemData.eventId;
            queryObj.deleted = Constant.DELETED.NO;
            queryObj.createdBy = accessUserId;
            queryObj.createdAt = new Date();
            queryObj.updatedBy = accessUserId;
            queryObj.updatedAt = new Date();

            EvtItem.create(queryObj).then(result => {
                "use strict";
                return callback(null, null, 200, null, result);
            }).catch(function (error) {
                "use strict";
                return callback(1, 'create_evt_item_fail', 420, error, null);
            });
        } catch (error) {
            return callback(1, 'create_evt_item_fail', 400, error, null);
        }
    },

    creates: function (accessUserId, accessUserRole, evtItems, callback) {
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

            for (let i = 0; i < evtItems.length; i++) {
                const currItem = evtItems[i];
                let itemData = {
                    itemTitle: currItem.itemTitle,
                    itemDesc: currItem.itemDesc,
                    startTime: currItem.startTime,
                    endTime: currItem.endTime,
                    eventId: currItem.eventId,
                    ...defaultVals
                }
                if (currItem.id) {
                    itemData.id = currItem.id;
                    updatedObj.push(itemData);
                } else {
                    newObj.push(itemData);
                }
            }

            EvtItem.bulkCreate(
                updatedObj,
                {
                    updateOnDuplicate: ["itemTitle", "itemDesc", "startTime", "endTime", "updatedAt", "updatedBy"],
                    // logging: console.log,
                },
            ).then(updatedRes => {
                "use strict";
                MySequelize.query(
                    "ALTER TABLE `tbl_event_items` AUTO_INCREMENT = 1;"
                ).then(() => {
                    EvtItem.bulkCreate(newObj).then(createdRes => {
                        return callback(null, null, 200, null, [...updatedRes, ...createdRes]);
                    }).catch(error => {
                        "use strict";
                        return callback(1, 'creates_evt_item_fail', 400, error, null);
                    })
                }).catch(error => {
                    "use strict";
                    return callback(1, 'creates_evt_item_fail', 400, error, null);
                });
            }).catch(function (error) {
                "use strict";
                return callback(1, 'creates_evt_item_fail', 420, error, null);
            });
        } catch (error) {
            return callback(1, 'creates_evt_item_fail', 400, error, null);
        }
    },

    update: function (accessUserId, accessUserRole, evtItemId, updatedData, callback) {
        try {
            if ( accessUserRole < Constant.USER_ROLE.EVENT_HOST ) {
                return callback(1, 'invalid_user_right', 403, null, null);
            }

            let queryObj = {};
            let where = {};

            where.id = evtItemId;
            queryObj.itemTitle = updatedData.itemTitle;
            queryObj.itemDesc = updatedData.itemDesc;
            queryObj.startTime = updatedData.startTime;
            queryObj.endTime = updatedData.endTime;
            queryObj.eventId = updatedData.eventId;
            queryObj.updatedAt = new Date();
            queryObj.updatedBy = accessUserId;

            EvtItem.update(
                queryObj,
                { where: where }
            ).then(result => {
                "use strict";
                if ((result !== null) && (result.length > 0) && (result[0] > 0)) {
                    return callback(null, null, 200, null, evtItemId);
                } else {
                    return callback(1, 'update_evt_item_fail', 400, '', null);
                }
            }).catch(function (error) {
                "use strict";
                return callback(1, 'update_evt_item_fail', 420, error, null);
            });

        } catch (error) {
            console.log(error);
            return callback(1, 'update_evt_item_fail', 400, error, null);
        }
    },

    delete: function (accessUserId, accessUserRole, evtItemId, callback) {
        try {
            if ( accessUserRole < Constant.USER_ROLE.EVENT_HOST ) {
                return callback(1, 'invalid_user_right', 403, null);
            }

            let queryObj = {};
            let where = {};

            where = { id: evtItemId };
            queryObj = { deleted: Constant.DELETED.YES };

            EvtItem.findOne({ where: where }).then(currEvtItem => {
                "use strict";
                if (currEvtItem && currEvtItem.deleted === Constant.DELETED.YES) {
                    EvtItem.destroy({ where: where }).then(result => {
                        return callback(null, null, 200, null);
                    }).catch(function (error) {
                        return callback(1, 'remove_evt_item_fail', 420, error);
                    });
                } else {
                    EvtItem.update(queryObj, { where: where }).then(result => {
                        "use strict";
                        return callback(null, null, 200, null);
                    }).catch(function (error) {
                        return callback(1, 'update_evt_item_fail', 420, error);
                    })
                }
            }).catch(function (error) {
                "use strict";
                return callback(1, 'find_one_evt_item_fail', 400, error, null);
            });
        } catch (error) {
            return callback(1, 'delete_evt_item_fail', 400, error);
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

            EvtItem.update(queryObj, { where: where }).then(result => {
                "use strict";
                if (result && (result.length > 0) && result[0] > 0) {
                    return callback(null, null, 200, null);
                } else {
                    return callback(1, 'invalid_evt_item_request', 404, null);
                }
            }).catch(function (error) {
                "use strict";
                return callback(1, 'update_evt_item_fail', 420, error);
            });
        } catch (error) {
            return callback(1, 'deletes_evt_item_fail', 400, error);
        }
    },
}