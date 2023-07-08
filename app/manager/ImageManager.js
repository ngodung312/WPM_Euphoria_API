/**
 * Created by Ngo Le Hanh Dung on 2023-03-17.
 **/

// third party components
const BCrypt = require('bcryptjs');
const Validator = require('validator');
const Sequelize = require('sequelize');
const MySequelize = require('../utils/Sequelize');

// our components
const Constant = require('../utils/Constant');
const Pieces = require('../utils/Pieces');

const Models = require('../models');
const Image = Models.Image;

module.exports = {
    getOne: function (accessUserId, accessUserRole, id, callback) {
        try {
            let attributes = ['id', 'imageTitle', 'imageDesc', 'imageSize', 'imageUrl', 'albumId', 'deleted', 'createdBy', 'createdAt', 'updatedBy', 'updatedAt'];
            Image.findOne({
                where: { id: id },
                attributes: attributes
            }).then(result => {
                "use strict";
                // console.log(result);;
                // console.log(attributes);
                if (result) {
                    return callback(null, null, 200, null, result);
                } else {
                    return callback(1, 'invalid_image', 403, null, null);
                }
            });
        } catch (error) {
            return callback(1, 'get_one_image_fail', 400, error, null);
        }
    },

    getAll: function (accessUserId, accessUserRole, albumId, callback) {
        try {
            let attributes = ['id', 'imageTitle', 'imageDesc', 'imageSize', 'imageUrl', 'albumId', 'deleted', 'createdBy', 'createdAt', 'updatedBy', 'updatedAt'];
            let where = {};
            where.deleted = Constant.DELETED.NO;
            if (albumId) where.albumId = albumId;

            Image.findAndCountAll({
                attributes: attributes,
                where: where
            })
                .then((result) => {
                    // console.log(result);
                    return callback(null, null, 200, null, result);
                }).catch(function (error) {
                    console.log(error);
                    return callback(1, 'find_all_image_fail', 420, error, null);
                });
        } catch (error) {
            return callback(1, 'get_all_image_fail', 400, error, null);
        }
    },

    create: function (accessUserId, accessUserRole, imageData, callback) {
        try {
            if ( accessUserRole < Constant.USER_ROLE.EVENT_HOST ) {
                return callback(1, 'invalid_user_right', 403, null, null);
            }

            let queryObj = {};
            queryObj.imageTitle = imageData.imageTitle;
            queryObj.imageDesc = imageData.imageDesc;
            queryObj.imageSize = imageData.imageSize;
            queryObj.imageUrl = imageData.imageUrl;
            queryObj.albumId = imageData.albumId;
            queryObj.deleted = Constant.DELETED.NO;
            queryObj.createdBy = accessUserId;
            queryObj.createdAt = new Date();
            queryObj.updatedBy = accessUserId;
            queryObj.updatedAt = new Date();

            Image.create(queryObj).then(result => {
                "use strict";
                return callback(null, null, 200, null, result);
            }).catch(function (error) {
                "use strict";
                return callback(1, 'create_image_fail', 420, error, null);
            });
        } catch (error) {
            return callback(1, 'create_image_fail', 400, error, null);
        }
    },

    creates: function (accessUserId, accessUserRole, images, callback) {
        try {
            if ( accessUserRole < Constant.USER_ROLE.EVENT_HOST ) {
                return callback(1, 'invalid_user_right', 403, null, null);
            }

            let updatedObj = [];
            let newObj = [];

            let defaultVals = {
                deleted: Constant.DELETED.NO,
                createdBy: accessUserId,
                createdAt: new Date(),
                updatedBy: accessUserId,
                updatedAt: new Date(),
            }
            for (let i = 0; i < images.length; i++) {
                const currItem = images[i];
                let itemData = {
                    imageTitle: currItem.imageTitle,
                    imageDesc: currItem.imageDesc,
                    imageSize: currItem.imageSize,
                    imageUrl: currItem.imageUrl,
                    albumId: currItem.albumId,
                    ...defaultVals
                }
                if (currItem.id) {
                    itemData.id = currItem.id;
                    updatedObj.push(itemData);
                } else {
                    newObj.push(itemData);
                }
            }

            Image.bulkCreate(
                updatedObj,
                {
                    updateOnDuplicate: ["imageTitle", "imageDesc", "imageSize", "imageUrl", "updatedAt", "updatedBy"],
                    // logging: console.log,
                },
            ).then(updatedRes => {
                "use strict";
                MySequelize.query(
                    "ALTER TABLE `tbl_images` AUTO_INCREMENT = 1;"
                ).then(() => {
                    Image.bulkCreate(newObj).then(createdRes => {
                        return callback(null, null, 200, null, [...updatedRes, ...createdRes]);
                    }).catch(error => {
                        "use strict";
                        return callback(1, 'creates_image_fail', 400, error, null);
                    })
                }).catch(error => {
                    "use strict";
                    return callback(1, 'creates_image_fail', 400, error, null);
                });
            }).catch(function (error) {
                "use strict";
                return callback(1, 'creates_image_fail', 420, error, null);
            });
        } catch (error) {
            return callback(1, 'creates_image_fail', 400, error, null);
        }
    },

    update: function (accessUserId, accessUserRole, imageId, updatedData, callback) {
        try {
            if ( accessUserRole < Constant.USER_ROLE.EVENT_HOST ) {
                return callback(1, 'invalid_user_right', 403, null, null);
            }

            let queryObj = {};
            let where = {};

            where.id = imageId;
            queryObj.imageTitle = updatedData.imageTitle;
            queryObj.imageDesc = updatedData.imageDesc;
            queryObj.imageSize = updatedData.imageSize;
            queryObj.imageUrl = updatedData.imageUrl;
            queryObj.albumId = updatedData.albumId;
            queryObj.updatedAt = new Date();
            queryObj.updatedBy = accessUserId;

            Image.update(
                queryObj,
                { where: where }
            ).then(result => {
                "use strict";
                if ((result !== null) && (result.length > 0) && (result[0] > 0)) {
                    return callback(null, null, 200, null, imageId);
                } else {
                    return callback(1, 'update_image_fail', 400, '', null);
                }
            }).catch(function (error) {
                "use strict";
                return callback(1, 'update_image_fail', 420, error, null);
            });

        } catch (error) {
            console.log(error);
            return callback(1, 'update_image_fail', 400, error, null);
        }
    },

    delete: function (accessUserId, accessUserRole, imageId, callback) {
        try {
            if ( accessUserRole < Constant.USER_ROLE.EVENT_HOST ) {
                return callback(1, 'invalid_user_right', 403, null);
            }

            let queryObj = {};
            let where = {};

            where = { id: imageId };
            queryObj = { deleted: Constant.DELETED.YES };

            Image.findOne({ where: where }).then(currImage => {
                "use strict";
                if (currImage && currImage.deleted === Constant.DELETED.YES) {
                    Image.destroy({ where: where }).then(result => {
                        return callback(null, null, 200, null);
                    }).catch(function (error) {
                        return callback(1, 'remove_image_fail', 420, error);
                    });
                } else {
                    Image.update(queryObj, { where: where }).then(result => {
                        "use strict";
                        return callback(null, null, 200, null);
                    }).catch(function (error) {
                        return callback(1, 'update_image_fail', 420, error);
                    })
                }
            }).catch(function (error) {
                "use strict";
                return callback(1, 'find_one_image_fail', 400, error, null);
            });
        } catch (error) {
            return callback(1, 'delete_image_fail', 400, error);
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

            Image.update(queryObj, { where: where }).then(result => {
                "use strict";
                if (result && (result.length > 0) && result[0] > 0) {
                    return callback(null, null, 200, null);
                } else {
                    return callback(1, 'invalid_image_request', 404, null);
                }
            }).catch(function (error) {
                "use strict";
                return callback(1, 'update_image_fail', 420, error);
            });
        } catch (error) {
            return callback(1, 'deletes_image_fail', 400, error);
        }
    },
}