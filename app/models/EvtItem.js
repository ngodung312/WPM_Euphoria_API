const Sequelize = require('sequelize');
const MySequelize = require('../utils/Sequelize');
const constant = require('../utils/Constant');

let EvtItem = MySequelize.define('tbl_event_items', {
    id: {
        field: "id",
        type: Sequelize.INTEGER(11),
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    itemTitle: {
        field: "item_title",
        type: Sequelize.TEXT('long'),
        allowNull: false,
    },
    itemDesc: {
        field: "item_desc",
        type: Sequelize.TEXT('long'),
        allowNull: true,
    },
    startTime: {
        field: "start_time",
        type: Sequelize.TIME,
        allowNull: false
    },
    endTime: {
        field: "end_time",
        type: Sequelize.TIME,
        allowNull: false
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
    tableName: 'tbl_event_items'
});

EvtItem.sync();

module.exports = EvtItem;