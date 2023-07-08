const Sequelize = require('sequelize');
const MySequelize = require('../utils/Sequelize');
const constant = require('../utils/Constant');

let Dish = MySequelize.define('tbl_dishes', {
    id: {
        field: "id",
        type: Sequelize.INTEGER(11),
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    dishTitle: {
        field: "dish_title",
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: true
    },
    dishDesc: {
        field: "dish_desc",
        type: Sequelize.TEXT('long'),
        allowNull: true,
    },
    dishUrl: {
        field: "dish_url",
        type: Sequelize.TEXT('long'),
        allowNull: true,
    },
    dishPrice: {
        field: "dish_price",
        type: Sequelize.BIGINT(10),
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
    tableName: 'tbl_dishes'
});

Dish.sync();

module.exports = Dish;