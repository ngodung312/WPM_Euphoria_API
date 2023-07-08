/**
 * Created by Ngo Le Hanh Dung on 2023-03-17.
 **/

// third party components
const JsonWebToken = require('jsonwebtoken');


// our components
const Config = require('../config/Global');
const RsvpGuestManager = require('../manager/RsvpGuestManager.js');
const Rest = require('../utils/Restware');

module.exports = {
    getOne: function (req, res) {
        let accessUserId = req.query.accessUserId || '';
        let accessUserRole = req.query.accessUserRole || '';
        const rsvpId = req.params.id || '';

        RsvpGuestManager.getOne(accessUserId, accessUserRole, rsvpId, function (errorCode, errorMessage, httpCode, errorDescription, result) {
            if (errorCode) {
                return Rest.sendError(res, errorCode, errorMessage, httpCode, errorDescription);
            }
            return Rest.sendSuccessOne(res, result, httpCode);
        })
    },

    getAll: function (req, res) {
        let accessUserId = req.query.accessUserId || '';
        let accessUserRole = req.query.accessUserRole || '';
        let eventId = (req.query && req.query.eventId) || (req.body && req.body.eventId) || '';

        RsvpGuestManager.getAll(accessUserId, accessUserRole, eventId, function (errorCode, errorMessage, httpCode, errorDescription, results) {
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

            RsvpGuestManager.creates(accessUserId, accessUserRole, data, function (errorCode, errorMessage, httpCode, errorDescription, results) {
                if (errorCode) {
                    return Rest.sendError(res, errorCode, errorMessage, httpCode, errorDescription);
                }
                return Rest.sendSuccessOne(res, results, httpCode);
            });
        } else {
            RsvpGuestManager.create(accessUserId, accessUserRole, data, function (errorCode, errorMessage, httpCode, errorDescription, qrCode) {
                if (errorCode) {
                    return Rest.sendError(res, errorCode, errorMessage, httpCode, errorDescription);
                }
                let resData = {};
                resData.id = qrCode.id;
                return Rest.sendSuccessOne(res, resData, httpCode);
            });
        }
    },

    update: function (req, res) {
        let accessUserId = req.body.accessUserId || '';
        let accessUserRole = req.body.accessUserRole || '';

        let rsvpId = req.params.id || '';

        if (rsvpId === 'deletes') {
            let ids = req.body.ids || '';
            RsvpGuestManager.deletes(accessUserId, accessUserRole, ids, function (errorCode, errorMessage, httpCode, errorDescription) {
                if (errorCode) {
                    return Rest.sendError(res, errorCode, errorMessage, httpCode, errorDescription);
                }
                return Rest.sendSuccessOne(res, null, httpCode);
            });
        } else {
            let data = req.body || '';
            RsvpGuestManager.update(accessUserId, accessUserRole, rsvpId, data, function (errorCode, errorMessage, httpCode, errorDescription, result) { // , accessUserRole
                if (errorCode) {
                    return Rest.sendError(res, errorCode, errorMessage, httpCode, errorDescription);
                }
                let resData = {};
                resData.id = rsvpId;
                return Rest.sendSuccessOne(res, resData, httpCode);
            });
        }
    },

    delete: function (req, res) {
        let accessUserId = req.body.accessUserId || '';
        let accessUserRole = req.body.accessUserRole || '';
        let rsvpId = req.params.id || '';

        RsvpGuestManager.delete(accessUserId, accessUserRole, rsvpId, function (errorCode, errorMessage, httpCode, errorDescription) {
            if (errorCode) {
                return Rest.sendError(res, errorCode, errorMessage, httpCode, errorDescription);
            }
            let resData = {};
            resData.id = rsvpId;
            return Rest.sendSuccessOne(res, resData, httpCode);
        });
    },
};
