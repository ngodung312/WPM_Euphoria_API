const Sequelize = require('sequelize');
const MySequelize = require('../utils/Sequelize');
const constant = require('../utils/Constant');

let Map = MySequelize.define('tbl_maps', {
    id: {
        field: "id",
        type: Sequelize.INTEGER(11),
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    mapTitle: {
        field: "map_title",
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: true
    },
    mapDesc: {
        field: "map_desc",
        type: Sequelize.TEXT('long'),
        allowNull: true,
    },
    mapUrl: {
        field: "map_url",
        type: Sequelize.TEXT('long'),
        allowNull: false,
    },
    hallId: {
        field: "hall_id",
        type: Sequelize.INTEGER(11),
        allowNull: false,
        references: {
            model: this.Hall,
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
    tableName: 'tbl_maps'
});

Map.sync();

module.exports = Map;