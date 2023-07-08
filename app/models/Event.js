const Sequelize = require('sequelize');
const MySequelize = require('../utils/Sequelize');
const constant = require('../utils/Constant');

let Event = MySequelize.define('tbl_events', {
    id: {
        field: "id",
        type: Sequelize.INTEGER(11),
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    eventTitle: {
        field: "event_title",
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: true
    },
    eventDate: {
        field: "event_date",
        type: Sequelize.DATEONLY,
        allowNull: false
    },
    hostId: {
        field: "host_id",
        type: Sequelize.INTEGER(11),
        allowNull: false,
        references: {
            model: this.User,
            key: 'id'
        }
    },
    managerId: {
        field: "manager_id",
        type: Sequelize.INTEGER(11),
        allowNull: false,
        references: {
            model: this.User,
            key: 'id'
        }
    },
    mapId: {
        field: "map_id",
        type: Sequelize.INTEGER(11),
        allowNull: false,
        references: {
            model: this.Map,
            key: 'id'
        }
    },
    menuId: {
        field: "menu_id",
        type: Sequelize.INTEGER(11),
        allowNull: false,
        references: {
            model: this.Menu,
            key: 'id'
        }
    },
    numTables: {
        field: "num_tables",
        type: Sequelize.INTEGER(11),
        allowNull: false,
    },
    numEstGuests: {
        field: "num_est_guests",
        type: Sequelize.INTEGER(11),
        allowNull: false,
    },
    numActGuests: {
        field: "num_act_guests",
        type: Sequelize.INTEGER(11),
        allowNull: false,
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
    tableName: 'tbl_events'
});

Event.sync();

module.exports = Event;