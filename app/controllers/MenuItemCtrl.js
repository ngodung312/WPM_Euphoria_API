/**
 * Created by Ngo Le Hanh Dung on 2023-03-17.
 **/

// third party components
const JsonWebToken = require('jsonwebtoken');


// our components
const Config = require('../config/Global');
const MenuItemManager = require('../manager/MenuItemManager.js');
const Rest = require('../utils/Restware');

module.exports = {
    getOne: function (req, res) {
        let accessUserId = req.query.accessUserId || '';
        let accessUserRole = req.query.accessUserRole || '';
        const menuItemId = req.params.id || '';

        MenuItemManager.getOne(accessUserId, accessUserRole, menuItemId, function (errorCode, errorMessage, httpCode, errorDescription, result) {
            if (errorCode) {
                return Rest.sendError(res, errorCode, errorMessage, httpCode, errorDescription);
            }
            return Rest.sendSuccessOne(res, result, httpCode);
        })
    },

    getAll: function (req, res) {
        let accessUserId = req.query.accessUserId || '';
        let accessUserRole = req.query.accessUserRole || '';
        let menuId = (req.query && req.query.menuId) || (req.body && req.body.menuId) || '';

        MenuItemManager.getAll(accessUserId, accessUserRole, menuId, function (errorCode, errorMessage, httpCode, errorDescription, results) {
            if (errorCode) {
                return Rest.sendError(res, errorCode, errorMessage, httpCode, errorDescription);
            }
            return Rest.sendSuccessMany(res, results, httpCode);
        });
    },

    create: function (req, res) {
        let accessUserId = req.body.accessUserId || '';
        let accessUserRole = req.body.accessUserRole || '';
        let data = req.body || '';
        let createType = req.body.createType || '';

        if (createType === 'bulk') {
            let data = req.body.data || '';

            MenuItemManager.creates(accessUserId, accessUserRole, data, function (errorCode, errorMessage, httpCode, errorDescription, results) {
                if (errorCode) {
                    return Rest.sendError(res, errorCode, errorMessage, httpCode, errorDescription);
                }
                return Rest.sendSuccessOne(res, results, httpCode);
            });
        } else {
            MenuItemManager.create(accessUserId, accessUserRole, data, function (errorCode, errorMessage, httpCode, errorDescription, menuItem) {
                if (errorCode) {
                    return Rest.sendError(res, errorCode, errorMessage, httpCode, errorDescription);
                }
                let resData = {};
                resData.id = menuItem.id;
                return Rest.sendSuccessOne(res, resData, httpCode);
            });
        }
    },

    update: function (req, res) {
        let accessUserId = req.body.accessUserId || '';
        let accessUserRole = req.body.accessUserRole || '';

        let menuItemId = req.params.id || '';

        if (menuItemId === 'deletes') {
            let ids = req.body.ids || '';
            MenuItemManager.deletes(accessUserId, accessUserRole, ids, function (errorCode, errorMessage, httpCode, errorDescription) {
                if (errorCode) {
                    return Rest.sendError(res, errorCode, errorMessage, httpCode, errorDescription);
                }
                return Rest.sendSuccessOne(res, null, httpCode);
            });
        } else {
            let data = req.body || '';
            MenuItemManager.update(accessUserId, accessUserRole, menuItemId, data, function (errorCode, errorMessage, httpCode, errorDescription, result) { // , accessUserRole
                if (errorCode) {
                    return Rest.sendError(res, errorCode, errorMessage, httpCode, errorDescription);
                }
                let resData = {};
                resData.id = menuItemId;
                return Rest.sendSuccessOne(res, resData, httpCode);
            });
        }
    },

    delete: function (req, res) {
        let accessUserId = req.body.accessUserId || '';
        let accessUserRole = req.body.accessUserRole || '';
        let menuItemId = req.params.id || '';

        MenuItemManager.delete(accessUserId, accessUserRole, menuItemId, function (errorCode, errorMessage, httpCode, errorDescription) {
            if (errorCode) {
                return Rest.sendError(res, errorCode, errorMessage, httpCode, errorDescription);
            }
            let resData = {};
            resData.id = menuItemId;
            return Rest.sendSuccessOne(res, resData, httpCode);
        });
    },
};
