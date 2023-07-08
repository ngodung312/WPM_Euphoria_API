/**
 * Created by Ngo Le Hanh Dung on 2023-03-17.
 **/

// third party components
const JsonWebToken = require('jsonwebtoken');


// our components
const Config = require('../config/Global');
const HallManager = require('../manager/HallManager.js');
const Rest = require('../utils/Restware');

module.exports = {
    getOne: function (req, res) {
        let accessUserId = req.query.accessUserId || '';
        let accessUserRole = req.query.accessUserRole || '';
        const hallId = req.params.id || '';

        HallManager.getOne(accessUserId, accessUserRole, hallId, function (errorCode, errorMessage, httpCode, errorDescription, result) {
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

        HallManager.getAll(accessUserId, accessUserRole, query, function (errorCode, errorMessage, httpCode, errorDescription, results) {
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

        HallManager.create(accessUserId, accessUserRole, data, function (errorCode, errorMessage, httpCode, errorDescription, hall) {
            if (errorCode) {
                return Rest.sendError(res, errorCode, errorMessage, httpCode, errorDescription);
            }
            let resData = {};
            resData.id = hall.id;
            return Rest.sendSuccessOne(res, resData, httpCode);
        });
    },

    update: function (req, res) {
        let accessUserId = req.body.accessUserId || '';
        let accessUserRole = req.body.accessUserRole || '';

        let hallId = req.params.id || '';

        if (hallId === 'deletes') {
            let ids = req.body.ids || '';
            HallManager.deletes(accessUserId, accessUserRole, ids, function (errorCode, errorMessage, httpCode, errorDescription) {
                if (errorCode) {
                    return Rest.sendError(res, errorCode, errorMessage, httpCode, errorDescription);
                }
                return Rest.sendSuccessOne(res, null, httpCode);
            });
        } else {
            let data = req.body || '';
            HallManager.update(accessUserId, accessUserRole, hallId, data, function (errorCode, errorMessage, httpCode, errorDescription, result) { // , accessUserRole
                if (errorCode) {
                    return Rest.sendError(res, errorCode, errorMessage, httpCode, errorDescription);
                }
                let resData = {};
                resData.id = hallId;
                return Rest.sendSuccessOne(res, resData, httpCode);
            });
        }
    },

    delete: function (req, res) {
        let accessUserId = req.body.accessUserId || '';
        let accessUserRole = req.body.accessUserRole || '';
        let hallId = req.params.id || '';

        HallManager.delete(accessUserId, accessUserRole, hallId, function (errorCode, errorMessage, httpCode, errorDescription) {
            if (errorCode) {
                return Rest.sendError(res, errorCode, errorMessage, httpCode, errorDescription);
            }
            let resData = {};
            resData.id = hallId;
            return Rest.sendSuccessOne(res, resData, httpCode);
        });
    },
};
