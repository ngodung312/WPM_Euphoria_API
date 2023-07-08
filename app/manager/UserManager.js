/**
 * Created by Ngo Le Hanh Dung on 2023-03-17.
 **/

// third party components
const BCrypt = require('bcryptjs');
const Validator = require('validator');
const Sequelize = require('sequelize');

// our components
const Constant = require('../utils/Constant');
const Pieces = require('../utils/Pieces');

const Models = require('../models');
const User = Models.User;

module.exports = {
    getOne: function (accessUserId, accessUserRole, id, callback) {
        try {
            if ( accessUserRole < Constant.USER_ROLE.EVENT_HOST ) {
                return callback(1, 'invalid_user_right', 403, null, null);
            }

            let attributes = ['id', 'username', 'email', 'fullName', 'phoneNumber', 'userRole', 'avatar',
                'createdBy', 'createdAt', 'updatedBy', 'updatedAt'];
            User.findOne({
                where: { id: id },
                attributes: attributes
            }).then(result => {
                "use strict";
                // console.log(result);;
                // console.log(attributes);
                if (result) {
                    return callback(null, null, 200, null, result);
                } else {
                    return callback(1, 'invalid_user', 403, null, null);
                }
            });
        } catch (error) {
            return callback(1, 'get_one_user_fail', 400, error, null);
        }
    },

    getAll: function (accessUserId, accessUserRole, query, callback) {
        try {
            if ( accessUserRole < Constant.USER_ROLE.EVENT_HOST ) {
                return callback(1, 'invalid_user_right', 403, null, null);
            }

            let attributes = ['id', 'username', 'email', 'fullName', 'phoneNumber', 'userRole', 'avatar',
                'createdBy', 'createdAt', 'updatedBy', 'updatedAt'];
            let where = {};
            where.deleted = Constant.DELETED.NO;

            User.findAndCountAll({
                attributes: attributes,
                where: where
            })
                .then((result) => {
                    // console.log(result);;
                    return callback(null, null, 200, null, result);
                }).catch(function (error) {
                    console.log(error);
                    return callback(1, 'find_all_user_fail', 420, error, null);
                });
        } catch (error) {
            return callback(1, 'get_all_user_fail', 400, error, null);
        }
    },

    create: function (userData, callback) {
        try {
            // if ( !Pieces.VariableBaseTypeChecking(userData.password, 'string') ) {
            //     return callback(1, 'invalid_user_password', 400,'password is not a string', null);
            // }

            let queryObj = {};
            queryObj.username = userData.username;
            queryObj.email = userData.email;
            queryObj.password = BCrypt.hashSync(userData.password, 10);
            queryObj.phoneNumber = userData.phoneNumber;
            queryObj.fullName = userData.fullName;
            queryObj.userRole = Constant.USER_ROLE.EVENT_HOST;
            queryObj.deleted = Constant.DELETED.NO;
            queryObj.createdBy = Constant.DEFAULT_USER;
            queryObj.createdAt = new Date();
            queryObj.updatedBy = Constant.DEFAULT_USER;
            queryObj.updatedAt = new Date();

            if (userData.activated === Constant.ACTIVATED.YES || userData.activated === Constant.ACTIVATED.NO) {
                queryObj.activated = userData.activated;
            } else {
                queryObj.activated = Constant.ACTIVATED.YES;
            }

            User.create(queryObj).then(result => {
                "use strict";
                return callback(null, null, 200, null, result);
            }).catch(function (error) {
                "use strict";
                return callback(1, 'create_user_fail', 420, error, null);
            });
        } catch (error) {
            return callback(1, 'create_user_fail', 400, error, null);
        }
    },

    update: function (accessUserId, accessUserRole, userId, updateData, callback) {
        try {
            if ( accessUserRole < Constant.USER_ROLE.EVENT_HOST ) {
                return callback(1, 'invalid_user_right', 403, null, null);
            }

            let queryObj = {};
            let where = {};

            where.id = userId;
            queryObj.username = updateData.username;
            queryObj.email = updateData.email;
            queryObj.fullName = updateData.fullName;
            queryObj.phoneNumber = updateData.phoneNumber;
            queryObj.avatar = updateData.avatar;
            queryObj.userRole = updateData.userRole;
            queryObj.updatedAt = new Date();
            queryObj.updatedBy = accessUserId;

            User.update(
                queryObj,
                { where: where }
            ).then(result => {
                "use strict";
                if ((result !== null) && (result.length > 0) && (result[0] > 0)) {
                    return callback(null, null, 200, null, userId);
                } else {
                    return callback(1, 'update_user_fail', 400, '', null);
                }
            }).catch(function (error) {
                "use strict";
                return callback(1, 'update_user_fail', 420, error, null);
            });

        } catch (error) {
            console.log(error);
            return callback(1, 'update_user_fail', 400, error, null);
        }
    },

    delete: function (accessUserId, accessUserRole, id, callback) {
        try {
            if ( accessUserRole < Constant.USER_ROLE.ADMIN ) {
                return callback(1, 'invalid_user_right', 403, null);
            }

            let queryObj = {};
            let where = {};

            where = { id: id };
            queryObj = { deleted: Constant.DELETED.YES };

            User.findOne({ where: where }).then(account => {
                "use strict";
                if (account && account.deleted === Constant.DELETED.YES) {
                    User.destroy({ where: where }).then(result => {
                        return callback(null, null, 200, null);
                    }).catch(function (error) {
                        return callback(1, 'remove_user_fail', 420, error);
                    });
                } else {
                    User.update(queryObj, { where: where }).then(result => {
                        "use strict";
                        return callback(null, null, 200, null);
                    }).catch(function (error) {
                        return callback(1, 'update_user_fail', 420, error);
                    })
                }
            }).catch(function (error) {
                "use strict";
                return callback(1, 'find_one_user_fail', 400, error, null);
            });
        } catch (error) {
            return callback(1, 'delete_user_fail', 400, error);
        }
    },

    deletes: function (accessUserId, accessUserRole, ids, callback) {
        try {
            if ( accessUserRole < Constant.USER_ROLE.ADMIN ) {
                return callback(1, 'invalid_user_right', 403, null);
            }

            // if (!Pieces.VariableBaseTypeChecking(ids, 'string')
            //     || !Validator.isJSON(ids)) {
            //     return callback(1, 'invalid_user_ids', 400, 'user id list is not a json array string');
            // }

            let idList = Pieces.safelyParseJSON(ids);
            let where = { id: idList };

            let queryObj = { 
                deleted: Constant.DELETED.YES,
                updatedBy: accessUserId,
                updatedAt: new Date()
            };

            User.update(queryObj, { where: where }).then(result => {
                "use strict";
                if (result && (result.length > 0) && result[0] > 0) {
                    return callback(null, null, 200, null);
                } else {
                    return callback(1, 'invalid_user_request', 404, null);
                }
            }).catch(function (error) {
                "use strict";
                return callback(1, 'update_user_fail', 420, error);
            });
        } catch (error) {
            return callback(1, 'deletes_user_fail', 400, error);
        }
    },

    verifyUser: function (accessUserId, accessUserRole, accessUsername, callback) {
        try {
            // if ( !(Pieces.VariableBaseTypeChecking(accessUserId,'string')
            //         && Validator.isInt(accessUserId) )
            //     && !Pieces.VariableBaseTypeChecking(accessUserId,'number') ){
            //     return callback(1, 'invalid_user_id', 400, 'user id is incorrect', null);
            // }

            let where = { id: accessUserId, username: accessUsername, activated: Constant.ACTIVATED.YES };
            let attributes = ['id', 'username', 'email', 'userRole', 'fullName', 'createdAt', 'createdBy', 'updatedAt', 'updatedBy'];

            User.findOne({
                where: where,
                attributes: attributes
            }).then(result => {
                "use strict";
                if (result) {
                    return callback(null, null, 200, null, result);
                } else {
                    return callback(1, 'invalid_user', 403, null, null);
                }
            }).catch(function (error) {
                "use strict";
                return callback(1, 'find_one_user_fail', 400, error, null);
            });
        } catch (error) {
            return callback(1, 'find_one_user_fail', 400, error, null);
        }
    },

    authenticate: function (username, password, callback) {
        try {
            // if (!Pieces.VariableBaseTypeChecking(username, 'string')) {
            //     return callback(1, 'invalid_user_login_name', 422, 'login name is not a string', null);
            // }

            let where = { username: username };
            let attributes = ['id', 'username', 'password', 'activated', 'deleted', 'fullName', 'email', 'phoneNumber', 'userRole', 'avatar'];

            User.findOne({
                where: where,
                attributes: attributes
            }).then(account => {
                "use strict";
                if (account) {
                    if (account.activated === Constant.ACTIVATED.NO) {
                        return callback(1, 'deactivated_user', 404, null, null);
                    } else {
                        BCrypt.compare(password, account.password, function (error, result) {
                            if (result === true) {
                                return callback(null, null, 200, null, account);
                            } else {
                                return callback(1, 'wrong_password', 422, null, null);
                            }
                        });
                    }
                } else {
                    return callback(1, 'invalid_user', 404, null, null);
                }
            }).catch(function (error) {
                "use strict";
                return callback(1, 'find_one_user_fail', 400, error, null);
            });
        } catch (error) {
            return callback(1, 'authenticate_user_fail', 400, error, null);
        }
    },
}