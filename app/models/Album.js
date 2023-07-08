const Sequelize = require('sequelize');
const MySequelize = require('../utils/Sequelize');
const constant = require('../utils/Constant');

let Album = MySequelize.define('tbl_albums', {
    id: {
        field: "id",
        type: Sequelize.INTEGER(11),
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    albumTitle: {
        field: "album_title",
        type: Sequelize.STRING(100),
        allowNull: false,
    },
    albumDesc: {
        field: "album_desc",
        type: Sequelize.TEXT('long'),
        allowNull: true,
    },
    albumSize: {
        field: "album_size",
        type: Sequelize.BIGINT(10),
        allowNull: false,
    },
    eventId: {
        field: "event_id",
        type: Sequelize.INTEGER(11),
        allowNull: false,
        references: {
            model: this.Event,
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
    tableName: 'tbl_albums'
});

Album.sync();

module.exports = Album;