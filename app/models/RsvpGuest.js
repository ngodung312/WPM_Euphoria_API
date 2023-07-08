const Sequelize = require('sequelize');
const MySequelize = require('../utils/Sequelize');
const constant = require('../utils/Constant');

let RsvpGuest = MySequelize.define('tbl_rsvp_guests', {
    id: {
        field: "id",
        type: Sequelize.INTEGER(11),
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    guestName: {
        field: "guest_name",
        type: Sequelize.STRING(64),
        allowNull: false,
        unique: true
    },
    guestEmail: {
        field: "guest_email",
        type: Sequelize.STRING(45),
        allowNull: false,
        unique: true
    },
    numGuests: {
        field: "num_guests",
        type: Sequelize.INTEGER(11),
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
    tableName: 'tbl_rsvp_guests'
});

RsvpGuest.sync();

module.exports = RsvpGuest;