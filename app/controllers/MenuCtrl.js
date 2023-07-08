/**
 * Created by Ngo Le Hanh Dung on 2023-03-17.
 **/

// third party components
const JsonWebToken = require('jsonwebtoken');


// our components
const Config = require('../config/Global');
const MenuManager = require('../manager/MenuManager.js');
const Rest = require('../utils/Restware');

module.exports = {
    getOne: function (req, res) {
        let accessUserId = req.query.accessUserId || '';
        let accessUserRole = req.query.accessUserRole || '';
        const menuId = req.params.id || '';

        MenuManager.getOne(accessUserId, accessUserRole, menuId, function (errorCode, errorMessage, httpCode, errorDescription, result) {
            if (errorCode) {
                return Rest.sendError(res, errorCode, errorMessage, httpCode, errorDescription);
            }
            return Rest.sendSuccessOne(res, result, httpCode);
        })
    },

    getAll: function (req, res) {
        let accessUserId = req.query.accessUserId || '';
        let accessUserRole = req.query.accessUserRole || '';
        let query = req.query || '';

        MenuManager.getAll(accessUserId, accessUserRole, query, function (errorCode, errorMessage, httpCode, errorDescription, results) {
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

        MenuManager.create(accessUserId, accessUserRole, data, function (errorCode, errorMessage, httpCode, errorDescription, menu) {
            if (errorCode) {
                return Rest.sendError(res, errorCode, errorMessage, httpCode, errorDescription);
            }
            let resData = {};
            resData.id = menu.id;
            return Rest.sendSuccessOne(res, resData, httpCode);
        });
    },

    update: function (req, res) {
        let accessUserId = req.body.accessUserId || '';
        let accessUserRole = req.body.accessUserRole || '';

        let menuId = req.params.id || '';

        if (menuId === 'deletes') {
            let ids = req.body.ids || '';
            MenuManager.deletes(accessUserId, accessUserRole, ids, function (errorCode, errorMessage, httpCode, errorDescription) {
                if (errorCode) {
                    return Rest.sendError(res, errorCode, errorMessage, httpCode, errorDescription);
                }
                return Rest.sendSuccessOne(res, null, httpCode);
            });
        } else {
            let data = req.body || '';
            MenuManager.update(accessUserId, accessUserRole, menuId, data, function (errorCode, errorMessage, httpCode, errorDescription, result) { // , accessUserRole
                if (errorCode) {
                    return Rest.sendError(res, errorCode, errorMessage, httpCode, errorDescription);
                }
                let resData = {};
                resData.id = menuId;
                return Rest.sendSuccessOne(res, resData, httpCode);
            });
        }
    },

    delete: function (req, res) {
        let accessUserId = req.body.accessUserId || '';
        let accessUserRole = req.body.accessUserRole || '';
        let menuId = req.params.id || '';

        MenuManager.delete(accessUserId, accessUserRole, menuId, function (errorCode, errorMessage, httpCode, errorDescription) {
            if (errorCode) {
                return Rest.sendError(res, errorCode, errorMessage, httpCode, errorDescription);
            }
            let resData = {};
            resData.id = menuId;
            return Rest.sendSuccessOne(res, resData, httpCode);
        });
    },
};
