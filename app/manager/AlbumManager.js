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
const Album = Models.Album;

module.exports = {
    getOne: function (accessUserId, accessUserRole, id, callback) {
        try {
            if ( accessUserRole < Constant.USER_ROLE.EVENT_HOST ) {
                return callback(1, 'invalid_user_right', 403, null, null);
            }

            let attributes = ['id', 'albumTitle', 'albumDesc', 'albumSize', 'eventId', 'deleted', 'createdBy', 'createdAt', 'updatedBy', 'updatedAt'];
            Album.findOne({
                where: { id: id },
                attributes: attributes
            }).then(result => {
                "use strict";
                // console.log(result);;
                // console.log(attributes);
                if (result) {
                    return callback(null, null, 200, null, result);
                } else {
                    return callback(1, 'invalid_album', 403, null, null);
                }
            });
        } catch (error) {
            return callback(1, 'get_one_album_fail', 400, error, null);
        }
    },

    getAll: function (accessUserId, accessUserRole, eventId, callback) {
        try {
            let attributes = ['id', 'albumTitle', 'albumDesc', 'albumSize', 'eventId', 'deleted', 'createdBy', 'createdAt', 'updatedBy', 'updatedAt'];
            let where = {};
            where.deleted = Constant.DELETED.NO;
            if (eventId) where.eventId = eventId;

            Album.findAndCountAll({
                attributes: attributes,
                where: where
            })
                .then((result) => {
                    // console.log(result);
                    return callback(null, null, 200, null, result);
                }).catch(function (error) {
                    console.log(error);
                    return callback(1, 'find_all_album_fail', 420, error, null);
                });
        } catch (error) {
            return callback(1, 'get_all_album_fail', 400, error, null);
        }
    },

    create: function (accessUserId, accessUserRole, albumData, callback) {
        try {
            if ( accessUserRole < Constant.USER_ROLE.EVENT_HOST ) {
                return callback(1, 'invalid_user_right', 403, null, null);
            }

            let queryObj = {
                albumTitle: albumData.albumTitle,
                albumDesc: albumData.albumDesc,
                albumSize: albumData.albumSize,
                eventId: albumData.eventId,
                deleted: Constant.DELETED.NO,
                deleted: Constant.DELETED.NO,
                createdBy: accessUserId,
                createdAt: new Date(),
                updatedBy: accessUserId,
                updatedAt: new Date(),
            };

            Album.create(queryObj).then(result => {
                "use strict";
                return callback(null, null, 200, null, result);
            }).catch(function (error) {
                "use strict";
                return callback(1, 'create_album_fail', 420, error, null);
            });
        } catch (error) {
            return callback(1, 'create_album_fail', 400, error, null);
        }
    },

    update: function (accessUserId, accessUserRole, albumId, updatedData, callback) {
        try {
            if ( accessUserRole < Constant.USER_ROLE.EVENT_HOST ) {
                return callback(1, 'invalid_user_right', 403, null, null);
            }

            let queryObj = {};
            let where = {};

            where.id = albumId;
            queryObj.albumTitle = updatedData.albumTitle;
            queryObj.albumDesc = updatedData.albumDesc;
            queryObj.albumSize = updatedData.albumSize;
            queryObj.eventId = updatedData.eventId;
            queryObj.updatedAt = new Date();
            queryObj.updatedBy = accessUserId;

            Album.update(
                queryObj,
                { where: where }
            ).then(result => {
                "use strict";
                if ((result !== null) && (result.length > 0) && (result[0] > 0)) {
                    return callback(null, null, 200, null, albumId);
                } else {
                    return callback(1, 'update_album_fail', 400, '', null);
                }
            }).catch(function (error) {
                "use strict";
                return callback(1, 'update_album_fail', 420, error, null);
            });

        } catch (error) {
            console.log(error);
            return callback(1, 'update_album_fail', 400, error, null);
        }
    },

    delete: function (accessUserId, accessUserRole, albumId, callback) {
        try {
            if ( accessUserRole < Constant.USER_ROLE.EVENT_HOST ) {
                return callback(1, 'invalid_user_right', 403, null);
            }

            let queryObj = {};
            let where = {};

            where = { id: albumId };
            queryObj = { deleted: Constant.DELETED.YES };

            Album.findOne({ where: where }).then(currAlbum => {
                "use strict";
                if (currAlbum && currAlbum.deleted === Constant.DELETED.YES) {
                    Album.destroy({ where: where }).then(result => {
                        return callback(null, null, 200, null);
                    }).catch(function (error) {
                        return callback(1, 'remove_album_fail', 420, error);
                    });
                } else {
                    Album.update(queryObj, { where: where }).then(result => {
                        "use strict";
                        return callback(null, null, 200, null);
                    }).catch(function (error) {
                        return callback(1, 'update_album_fail', 420, error);
                    })
                }
            }).catch(function (error) {
                "use strict";
                return callback(1, 'find_one_album_fail', 400, error, null);
            });
        } catch (error) {
            return callback(1, 'delete_album_fail', 400, error);
        }
    },

    deletes: function (accessUserId, accessUserRole, ids, callback) {
        try {
            if ( accessUserRole < Constant.USER_ROLE.EVENT_HOST ) {
                return callback(1, 'invalid_user_right', 403, null);
            }

            let idList = Pieces.safelyParseJSON(ids);
            let where = { id: idList };

            let queryObj = { 
                deleted: Constant.DELETED.YES,
                updatedBy: accessUserId,
                updatedAt: new Date()
            };

            Album.update(queryObj, { where: where }).then(result => {
                "use strict";
                if (result && (result.length > 0) && result[0] > 0) {
                    return callback(null, null, 200, null);
                } else {
                    return callback(1, 'invalid_album_request', 404, null);
                }
            }).catch(function (error) {
                "use strict";
                return callback(1, 'update_album_fail', 420, error);
            });
        } catch (error) {
            return callback(1, 'deletes_album_fail', 400, error);
        }
    },
}