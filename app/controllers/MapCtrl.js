/**
 * Created by Ngo Le Hanh Dung on 2023-03-17.
 **/

// third party components
const JsonWebToken = require('jsonwebtoken');


// our components
const Config = require('../config/Global');
const MapManager = require('../manager/MapManager.js');
const Rest = require('../utils/Restware');

module.exports = {
    getOne: function (req, res) {
        let accessUserId = req.query.accessUserId || '';
        let accessUserRole = req.query.accessUserRole || '';
        const mapId = req.params.id || '';

        MapManager.getOne(accessUserId, accessUserRole, mapId, function (errorCode, errorMessage, httpCode, errorDescription, result) {
            if (errorCode) {
                return Rest.sendError(res, errorCode, errorMessage, httpCode, errorDescription);
            }
            return Rest.sendSuccessOne(res, result, httpCode);
        })
    },

    getAll: function (req, res) {
        let accessUserId = req.query.accessUserId || '';
        let accessUserRole = req.query.accessUserRole || '';
        let hallId = (req.query && req.query.hallId) || (req.body && req.body.hallId) || '';

        MapManager.getAll(accessUserId, accessUserRole, hallId, function (errorCode, errorMessage, httpCode, errorDescription, results) {
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

        MapManager.create(accessUserId, accessUserRole, data, function (errorCode, errorMessage, httpCode, errorDescription, map) {
            if (errorCode) {
                return Rest.sendError(res, errorCode, errorMessage, httpCode, errorDescription);
            }
            let resData = {};
            resData.id = map.id;
            return Rest.sendSuccessOne(res, resData, httpCode);
        });
    },

    update: function (req, res) {
        let accessUserId = req.body.accessUserId || '';
        let accessUserRole = req.body.accessUserRole || '';

        let mapId = req.params.id || '';

        if (mapId === 'deletes') {
            let ids = req.body.ids || '';
            MapManager.deletes(accessUserId, accessUserRole, ids, function (errorCode, errorMessage, httpCode, errorDescription) {
                if (errorCode) {
                    return Rest.sendError(res, errorCode, errorMessage, httpCode, errorDescription);
                }
                return Rest.sendSuccessOne(res, null, httpCode);
            });
        } else {
            let data = req.body || '';
            MapManager.update(accessUserId, accessUserRole, mapId, data, function (errorCode, errorMessage, httpCode, errorDescription, result) { // , accessUserRole
                if (errorCode) {
                    return Rest.sendError(res, errorCode, errorMessage, httpCode, errorDescription);
                }
                let resData = {};
                resData.id = mapId;
                return Rest.sendSuccessOne(res, resData, httpCode);
            });
        }
    },

    delete: function (req, res) {
        let accessUserId = req.body.accessUserId || '';
        let accessUserRole = req.body.accessUserRole || '';
        let mapId = req.params.id || '';

        MapManager.delete(accessUserId, accessUserRole, mapId, function (errorCode, errorMessage, httpCode, errorDescription) {
            if (errorCode) {
                return Rest.sendError(res, errorCode, errorMessage, httpCode, errorDescription);
            }
            let resData = {};
            resData.id = mapId;
            return Rest.sendSuccessOne(res, resData, httpCode);
        });
    },
};
