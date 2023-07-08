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
const EvtExpense = Models.EvtExpense;

module.exports = {
    getOne: function (accessUserId, accessUserRole, id, callback) {
        try {
            if ( accessUserRole < Constant.USER_ROLE.EVENT_HOST ) {
                return callback(1, 'invalid_user_right', 403, null, null);
            }

            let attributes = ['id', 'expenseCode', 'amount', 'eventId', 'deleted', 'createdBy', 'createdAt', 'updatedBy', 'updatedAt'];
            EvtExpense.findOne({
                where: { id: id },
                attributes: attributes
            }).then(result => {
                "use strict";
                // console.log(result);;
                // console.log(attributes);
                if (result) {
                    return callback(null, null, 200, null, result);
                } else {
                    return callback(1, 'invalid_evt_expense', 403, null, null);
                }
            });
        } catch (error) {
            return callback(1, 'get_one_evt_expense_fail', 400, error, null);
        }
    },

    getAll: function (accessUserId, accessUserRole, eventId, callback) {
        try {
            if ( accessUserRole < Constant.USER_ROLE.EVENT_HOST ) {
                return callback(1, 'invalid_user_right', 403, null, null);
            }

            let attributes = ['id', 'expenseCode', 'amount', 'eventId', 'deleted', 'createdBy', 'createdAt', 'updatedBy', 'updatedAt'];
            let where = {};
            where.deleted = Constant.DELETED.NO;
            if (eventId) where.eventId = eventId;

            EvtExpense.findAndCountAll({
                attributes: attributes,
                where: where
            })
                .then((result) => {
                    // console.log(result);
                    return callback(null, null, 200, null, result);
                }).catch(function (error) {
                    console.log(error);
                    return callback(1, 'find_all_evt_expense_fail', 420, error, null);
                });
        } catch (error) {
            return callback(1, 'get_all_evt_expense_fail', 400, error, null);
        }
    },

    create: function (accessUserId, accessUserRole, evtExpenseData, callback) {
        try {
            if ( accessUserRole < Constant.USER_ROLE.MANAGER ) {
                return callback(1, 'invalid_user_right', 403, null, null);
            }

            let queryObj = {};
            queryObj.expenseCode = evtExpenseData.expenseCode;
            queryObj.amount = evtExpenseData.amount;
            queryObj.eventId = evtExpenseData.eventId;
            queryObj.deleted = Constant.DELETED.NO;
            queryObj.createdBy = accessUserId;
            queryObj.createdAt = new Date();
            queryObj.updatedBy = accessUserId;
            queryObj.updatedAt = new Date();

            EvtExpense.create(queryObj).then(result => {
                "use strict";
                return callback(null, null, 200, null, result);
            }).catch(function (error) {
                "use strict";
                return callback(1, 'create_evt_expense_fail', 420, error, null);
            });
        } catch (error) {
            return callback(1, 'create_evt_expense_fail', 400, error, null);
        }
    },

    creates: function (accessUserId, accessUserRole, evtExpenses, callback) {
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
            for (let i = 0; i < evtExpenses.length; i++) {
                const currItem = evtExpenses[i];
                let itemData = {
                    expenseCode: currItem.expenseCode,
                    amount: currItem.amount,
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

            EvtExpense.bulkCreate(
                updatedObj,
                {
                    updateOnDuplicate: ["expenseCode", "amount", "updatedAt", "updatedBy"],
                    // logging: console.log,
                },
            ).then(updatedRes => {
                "use strict";
                MySequelize.query(
                    "ALTER TABLE `tbl_event_expenses` AUTO_INCREMENT = 1;"
                ).then(() => {
                    EvtExpense.bulkCreate(newObj).then(createdRes => {
                        return callback(null, null, 200, null, [...updatedRes, ...createdRes]);
                    }).catch(error => {
                        "use strict";
                        return callback(1, 'creates_evt_expense_fail', 400, error, null);
                    })
                }).catch(error => {
                    "use strict";
                    return callback(1, 'creates_evt_expense_fail', 400, error, null);
                });
            }).catch(function (error) {
                "use strict";
                return callback(1, 'creates_evt_expense_fail', 420, error, null);
            });
        } catch (error) {
            return callback(1, 'creates_evt_expense_fail', 400, error, null);
        }
    },

    update: function (accessUserId, accessUserRole, evtExpenseId, updatedData, callback) {
        try {
            if ( accessUserRole < Constant.USER_ROLE.MANAGER ) {
                return callback(1, 'invalid_user_right', 403, null, null);
            }

            let queryObj = {};
            let where = {};

            where.id = evtExpenseId;
            queryObj.expenseCode = updatedData.expenseCode;
            queryObj.amount = updatedData.amount;
            queryObj.eventId = updatedData.eventId;
            queryObj.updatedAt = new Date();
            queryObj.updatedBy = accessUserId;

            EvtExpense.update(
                queryObj,
                { where: where }
            ).then(result => {
                "use strict";
                if ((result !== null) && (result.length > 0) && (result[0] > 0)) {
                    return callback(null, null, 200, null, evtExpenseId);
                } else {
                    return callback(1, 'update_evt_expense_fail', 400, '', null);
                }
            }).catch(function (error) {
                "use strict";
                return callback(1, 'update_evt_expense_fail', 420, error, null);
            });

        } catch (error) {
            console.log(error);
            return callback(1, 'update_evt_expense_fail', 400, error, null);
        }
    },

    delete: function (accessUserId, accessUserRole, evtExpenseId, callback) {
        try {
            if ( accessUserRole < Constant.USER_ROLE.MANAGER ) {
                return callback(1, 'invalid_user_right', 403, null);
            }

            let queryObj = {};
            let where = {};

            where = { id: evtExpenseId };
            queryObj = { deleted: Constant.DELETED.YES };

            EvtExpense.findOne({ where: where }).then(currEvtExpense => {
                "use strict";
                if (currEvtExpense && currEvtExpense.deleted === Constant.DELETED.YES) {
                    EvtExpense.destroy({ where: where }).then(result => {
                        return callback(null, null, 200, null);
                    }).catch(function (error) {
                        return callback(1, 'remove_evt_expense_fail', 420, error);
                    });
                } else {
                    EvtExpense.update(queryObj, { where: where }).then(result => {
                        "use strict";
                        return callback(null, null, 200, null);
                    }).catch(function (error) {
                        return callback(1, 'update_evt_expense_fail', 420, error);
                    })
                }
            }).catch(function (error) {
                "use strict";
                return callback(1, 'find_one_evt_expense_fail', 400, error, null);
            });
        } catch (error) {
            return callback(1, 'delete_evt_expense_fail', 400, error);
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

            EvtExpense.update(queryObj, { where: where }).then(result => {
                "use strict";
                if (result && (result.length > 0) && result[0] > 0) {
                    return callback(null, null, 200, null);
                } else {
                    return callback(1, 'invalid_evt_expense_request', 404, null);
                }
            }).catch(function (error) {
                "use strict";
                return callback(1, 'update_evt_expense_fail', 420, error);
            });
        } catch (error) {
            return callback(1, 'deletes_evt_expense_fail', 400, error);
        }
    },
}