const Sequelize = require('sequelize');
const MySequelize = require('../utils/Sequelize');
const constant = require('../utils/Constant');

let Image = MySequelize.define('tbl_images', {
    id: {
        field: "id",
        type: Sequelize.INTEGER(11),
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    imageTitle: {
        field: "img_title",
        type: Sequelize.STRING(100),
        allowNull: false,
    },
    imageDesc: {
        field: "img_desc",
        type: Sequelize.TEXT('long'),
        allowNull: true,
    },
    imageSize: {
        field: "img_size",
        type: Sequelize.BIGINT(10),
        allowNull: false,
    },
    imageUrl: {
        field: "img_url",
        type: Sequelize.TEXT('long'),
        allowNull: true,
    },
    albumId: {
        field: "album_id",
        type: Sequelize.INTEGER(11),
        allowNull: false,
        references: {
            model: this.Album,
            key: 'id'
        }
    },
    deleted: {
        field: "deleted",
        type: Sequelize.TINYINT(1),
        allowNull: false, 
        default: constant.DELETED.NO
    },
    createdBy: {
        field: "created_by",
        type: Sequelize.INTEGER(11),
        allowNull: false,
        references: {
            model: this.User,
            key: 'id'
        }
    },
    createdAt: {
        field: "created_at",
        type: Sequelize.DATE,
        allowNull: false
    },
    updatedBy: {
        field: "updated_by",
        type: Sequelize.INTEGER(11),
        allowNull: false,
        references: {
            model: this.User,
            key: 'id'
        }
    },
    updatedAt: {
        field: "updated_at",
        type: Sequelize.DATE,
        allowNull: false
    }
}, {
    underscored: true,
    timestamps: false,
    updatedAt: false,
    createdAt: false,
    includeDeleted: true,
    paranoid: true,
    freezeTableName: true,
    tableName: 'tbl_images'
});

Image.sync();

module.exports = Image;