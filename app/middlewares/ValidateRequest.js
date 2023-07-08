/**
 * Created by Ngo Le Hanh Dung on 2023-03-17.
 **/

// third party components
const JsonWebToken = require('jsonwebtoken');

// our components
const Config = require('../config/Global');
const UserManager = require('../manager/UserManager');
const Rest = require('../utils/Restware');

module.exports = function (req, res, next) {
    if (req.method === 'OPTIONS') {
        next();
    }
    // console.log(req.body)
    let token = (req.body && req.body.access_token) || req.headers['access_token'] || (req.query && req.query.access_token);

    if (token) {
        try {
            JsonWebToken.verify(token, Config.jwtAuthKey, function(error, decoded) {
                if(error){
                    return Rest.sendError(res, 70, 'verify_token_fail', 400,  error);
                }

                UserManager.verifyUser(decoded.id, decoded.group, decoded.username, function (errorCode, errorMessage, httpCode, errorDescription, result) {
                    if (errorCode) {
                        return Rest.sendError(res, errorCode, errorMessage, httpCode, errorDescription);
                    }
                    if (req.method === 'GET') {
                        req.query.accessUserId = decoded.id;
                        req.query.accessUserRole = decoded.userRole;
                        req.query.accessUsername = decoded.username;
                    } else {
                        req.body.accessUserId = decoded.id;
                        req.body.accessUserRole = decoded.userRole;
                        req.body.accessUsername = decoded.username;
                    }
                    next();
                });
            });
        } catch (error) {
            return Rest.sendError(res, 4170, "system", 400, error);
        }
    } else {
        return Rest.sendError(res, 4178, "invalid_token", 400, null);
    }
};
