/**
 * Created by Ngo Le Hanh Dung on 2023-03-17.
 **/

// third party components
const JsonWebToken = require('jsonwebtoken');


// our components
const Config = require('../config/Global');
const UserManager = require('../manager/UserManager.js');
const Rest = require('../utils/Restware');

module.exports = {
    getOne: function (req, res) {
        let accessUserId = req.query.accessUserId || '';
        let accessUserRole = req.query.accessUserRole || '';
        const id = req.params.id || '';

        UserManager.getOne(accessUserId, accessUserRole, id, function (errorCode, errorMessage, httpCode, errorDescription, result) {
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

        UserManager.getAll(accessUserId, accessUserRole, query, function (errorCode, errorMessage, httpCode, errorDescription, results) {
            if (errorCode) {
                return Rest.sendError(res, errorCode, errorMessage, httpCode, errorDescription);
            }
            return Rest.sendSuccessMany(res, results, httpCode);
        });
    },

    update: function (req, res) {
        let accessUserId = req.body.accessUserId || '';
        let accessUserRole = req.body.accessUserRole || '';

        let id = req.params.id || '';
        if (id === 'deletes') {
            let ids = req.body.ids || '';
            UserManager.deletes(accessUserId, accessUserRole, ids, function (errorCode, errorMessage, httpCode, errorDescription) {
                if (errorCode) {
                    return Rest.sendError(res, errorCode, errorMessage, httpCode, errorDescription);
                }
                return Rest.sendSuccessOne(res, null, httpCode);
            });
        } else {
            let data = req.body || '';
            UserManager.update(accessUserId, accessUserRole, id, data, function (errorCode, errorMessage, httpCode, errorDescription, result) { // , accessUserRole
                if (errorCode) {
                    return Rest.sendError(res, errorCode, errorMessage, httpCode, errorDescription);
                }
                let resData = {};
                resData.id = result;
                return Rest.sendSuccessOne(res, resData, httpCode);
            });
        }
    },

    delete: function (req, res) {
        let accessUserId = req.body.accessUserId || '';
        let accessUserRole = req.body.accessUserRole || '';
        let id = req.params.id || '';

        UserManager.delete(accessUserId, accessUserRole, id, function (errorCode, errorMessage, httpCode, errorDescription) {
            if (errorCode) {
                return Rest.sendError(res, errorCode, errorMessage, httpCode, errorDescription);
            }
            let resData = {};
            resData.id = id;
            return Rest.sendSuccessOne(res, resData, httpCode);
        });
    },

    login: function (req, res) {
        let username = req.body.username || '';
        let password = req.body.password || '';

        UserManager.authenticate(username, password, function (errorCode, errorMessage, httpCode, errorDescription, user) {
            if (errorCode) {
                return Rest.sendError(res, errorCode, errorMessage, httpCode, errorDescription);
            }
            JsonWebToken.sign({
                id: user.id, username: user.username, fullName: user.fullName, email: user.email,
                userRole: user.userRole
            }, Config.jwtAuthKey, { expiresIn: '25 days' }, function (error, token) {
                if (error) {
                    return Rest.sendError(res, 4000, 'create_token_fail', 400, error);
                } else {
                    return Rest.sendSuccessToken(res, token, user);
                }
            });
        });
    },

    register: function (req, res) {
        let data = req.body || '';

        UserManager.create(data, function (errorCode, errorMessage, httpCode, errorDescription, user) {
            if (errorCode) {
                return Rest.sendError(res, errorCode, errorMessage, httpCode, errorDescription);
            }
            JsonWebToken.sign({
                id: user.id, username: user.username, fullName: user.fullName, email: user.email,
                userRole: user.userRole
            }, Config.jwtAuthKey, { expiresIn: '25 days' }, function (error, token) {
                if (error) {
                    return Rest.sendError(res, 4000, 'create_token_fail', 400, error);
                } else {
                    return Rest.sendSuccessToken(res, token, user);
                }
            });
        })
    }
};
