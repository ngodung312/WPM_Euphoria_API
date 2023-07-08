const Sequelize = require('sequelize');
const MySequelize = require('../utils/Sequelize');
const constant = require('../utils/Constant');

let QRCode = MySequelize.define('tbl_wedding_page_infos', {
    id: {
        field: "id",
        type: Sequelize.INTEGER(11),
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    infoLabel: {
        field: "info_label",
        type: Sequelize.STRING(100),
        allowNull: false,
    },
    infoValue: {
        field: "info_value",
        type: Sequelize.TEXT(),
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
    tableName: 'tbl_wedding_page_infos'
});

QRCode.sync();

module.exports = QRCode;