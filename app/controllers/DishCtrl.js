/**
 * Created by Ngo Le Hanh Dung on 2023-03-17.
 **/

// third party components
const JsonWebToken = require('jsonwebtoken');


// our components
const Config = require('../config/Global');
const DishManager = require('../manager/DishManager.js');
const Rest = require('../utils/Restware');

module.exports = {
    getOne: function (req, res) {
        let accessUserId = req.query.accessUserId || '';
        let accessUserRole = req.query.accessUserRole || '';
        const dishId = req.params.id || '';

        DishManager.getOne(accessUserId, accessUserRole, dishId, function (errorCode, errorMessage, httpCode, errorDescription, result) {
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

        DishManager.getAll(accessUserId, accessUserRole, query, function (errorCode, errorMessage, httpCode, errorDescription, results) {
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

        DishManager.create(accessUserId, accessUserRole, data, function (errorCode, errorMessage, httpCode, errorDescription, dish) {
            if (errorCode) {
                return Rest.sendError(res, errorCode, errorMessage, httpCode, errorDescription);
            }
            let resData = {};
            resData.id = dish.id;
            return Rest.sendSuccessOne(res, resData, httpCode);
        });
    },

    update: function (req, res) {
        let accessUserId = req.body.accessUserId || '';
        let accessUserRole = req.body.accessUserRole || '';

        let dishId = req.params.id || '';

        if (dishId === 'deletes') {
            let ids = req.body.ids || '';
            DishManager.deletes(accessUserId, accessUserRole, ids, function (errorCode, errorMessage, httpCode, errorDescription) {
                if (errorCode) {
                    return Rest.sendError(res, errorCode, errorMessage, httpCode, errorDescription);
                }
                return Rest.sendSuccessOne(res, null, httpCode);
            });
        } else {
            let data = req.body || '';
            DishManager.update(accessUserId, accessUserRole, dishId, data, function (errorCode, errorMessage, httpCode, errorDescription, result) { // , accessUserRole
                if (errorCode) {
                    return Rest.sendError(res, errorCode, errorMessage, httpCode, errorDescription);
                }
                let resData = {};
                resData.id = dishId;
                return Rest.sendSuccessOne(res, resData, httpCode);
            });
        }
    },

    delete: function (req, res) {
        let accessUserId = req.body.accessUserId || '';
        let accessUserRole = req.body.accessUserRole || '';
        let dishId = req.params.id || '';

        DishManager.delete(accessUserId, accessUserRole, dishId, function (errorCode, errorMessage, httpCode, errorDescription) {
            if (errorCode) {
                return Rest.sendError(res, errorCode, errorMessage, httpCode, errorDescription);
            }
            let resData = {};
            resData.id = dishId;
            return Rest.sendSuccessOne(res, resData, httpCode);
        });
    },
};
