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
const WeddingPageInfo = Models.WeddingPageInfo;

module.exports = {
    getOne: function (accessUserId, accessUserRole, id, callback) {
        try {
            let attributes = ['id', 'infoLabel', 'infoValue', 'eventId', 'deleted', 'createdBy', 'createdAt', 'updatedBy', 'updatedAt'];
            WeddingPageInfo.findOne({
                where: { id: id },
                attributes: attributes
            }).then(result => {
                "use strict";
                // console.log(result);
                // console.log(attributes);
                if (result) {
                    return callback(null, null, 200, null, result);
                } else {
                    return callback(1, 'invalid_wedd_page_info', 403, null, null);
                }
            });
        } catch (error) {
            return callback(1, 'get_one_wedd_page_info_fail', 400, error, null);
        }
    },

    getAll: function (accessUserId, accessUserRole, eventId, callback) {
        try {
            let attributes = ['id', 'infoLabel', 'infoValue', 'eventId', 'deleted', 'createdBy', 'createdAt', 'updatedBy', 'updatedAt'];
            let where = {};
            where.deleted = Constant.DELETED.NO;
            if (eventId) where.eventId = eventId;

            WeddingPageInfo.findAndCountAll({
                attributes: attributes,
                where: where
            })
                .then((result) => {
                    // console.log(result);
                    return callback(null, null, 200, null, result);
                }).catch(function (error) {
                    console.log(error);
                    return callback(1, 'find_all_wedd_page_info_fail', 420, error, null);
                });
        } catch (error) {
            return callback(1, 'get_all_wedd_page_info_fail', 400, error, null);
        }
    },

    create: function (accessUserId, accessUserRole, weddPageData, callback) {
        try {
            if ( accessUserRole < Constant.USER_ROLE.EVENT_HOST ) {
                return callback(1, 'invalid_user_right', 403, null, null);
            }

            let queryObj = {};
            queryObj.infoLabel = weddPageData.infoLabel;
            queryObj.infoValue = weddPageData.infoValue;
            queryObj.eventId = weddPageData.eventId;
            queryObj.deleted = Constant.DELETED.NO;
            queryObj.createdBy = accessUserId;
            queryObj.createdAt = new Date();
            queryObj.updatedBy = accessUserId;
            queryObj.updatedAt = new Date();

            WeddingPageInfo.create(queryObj).then(result => {
                "use strict";
                return callback(null, null, 200, null, result);
            }).catch(function (error) {
                "use strict";
                return callback(1, 'create_wedd_page_info_fail', 420, error, null);
            });
        } catch (error) {
            return callback(1, 'create_wedd_page_info_fail', 400, error, null);
        }
    },

    creates: function (accessUserId, accessUserRole, weddPageItems, callback) {
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

            for (let i = 0; i < weddPageItems.length; i++) {
                const currItem = weddPageItems[i];
                let itemData = {
                    infoLabel: currItem.infoLabel,
                    infoValue: currItem.infoValue,
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

            WeddingPageInfo.bulkCreate(
                updatedObj,
                {
                    updateOnDuplicate: ["infoValue", "updatedAt", "updatedBy"],
                    // logging: console.log,
                },
            ).then(updatedRes => {
                "use strict";
                MySequelize.query(
                    "ALTER TABLE `tbl_wedding_page_infos` AUTO_INCREMENT = 1;"
                ).then(() => {
                    WeddingPageInfo.bulkCreate(newObj).then(createdRes => {
                        return callback(null, null, 200, null, [...updatedRes, ...createdRes]);
                    }).catch(error => {
                        "use strict";
                        return callback(1, 'creates_wedd_page_info_fail', 400, error, null);
                    })
                }).catch(error => {
                    "use strict";
                    return callback(1, 'creates_wedd_page_info_fail', 400, error, null);
                });
            }).catch(function (error) {
                "use strict";
                return callback(1, 'creates_wedd_page_info_fail', 420, error, null);
            });
        } catch (error) {
            return callback(1, 'creates_wedd_page_info_fail', 400, error, null);
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
            queryObj.infoLabel = updatedData.infoLabel;
            queryObj.infoValue = updatedData.infoValue;
            queryObj.eventId = updatedData.eventId;
            queryObj.updatedAt = new Date();
            queryObj.updatedBy = accessUserId;

            WeddingPageInfo.update(
                queryObj,
                { where: where }
            ).then(result => {
                "use strict";
                if ((result !== null) && (result.length > 0) && (result[0] > 0)) {
                    return callback(null, null, 200, null, eventId);
                } else {
                    return callback(1, 'update_wedd_page_info_fail', 400, '', null);
                }
            }).catch(function (error) {
                "use strict";
                return callback(1, 'update_wedd_page_info_fail', 420, error, null);
            });

        } catch (error) {
            console.log(error);
            return callback(1, 'update_wedd_page_info_fail', 400, error, null);
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

            WeddingPageInfo.findOne({ where: where }).then(currWeddingPageInfo => {
                "use strict";
                if (currWeddingPageInfo && currWeddingPageInfo.deleted === Constant.DELETED.YES) {
                    WeddingPageInfo.destroy({ where: where }).then(result => {
                        return callback(null, null, 200, null);
                    }).catch(function (error) {
                        return callback(1, 'remove_wedd_page_info_fail', 420, error);
                    });
                } else {
                    WeddingPageInfo.update(queryObj, { where: where }).then(result => {
                        "use strict";
                        return callback(null, null, 200, null);
                    }).catch(function (error) {
                        return callback(1, 'update_wedd_page_info_fail', 420, error);
                    })
                }
            }).catch(function (error) {
                "use strict";
                return callback(1, 'find_one_wedd_page_info_fail', 400, error, null);
            });
        } catch (error) {
            return callback(1, 'delete_wedd_page_info_fail', 400, error);
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

            WeddingPageInfo.update(queryObj, { where: where }).then(result => {
                "use strict";
                if (result && (result.length > 0) && result[0] > 0) {
                    return callback(null, null, 200, null);
                } else {
                    return callback(1, 'invalid_wedd_page_info_request', 404, null);
                }
            }).catch(function (error) {
                "use strict";
                return callback(1, 'update_wedd_page_info_fail', 420, error);
            });
        } catch (error) {
            return callback(1, 'deletes_wedd_page_info_fail', 400, error);
        }
    },
}