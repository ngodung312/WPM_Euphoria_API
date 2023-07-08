const Sequelize = require('sequelize');
const MySequelize = require('../utils/Sequelize');
const constant = require('../utils/Constant');

let MenuItem = MySequelize.define('tbl_menu_items', {
    id: {
        field: "id",
        type: Sequelize.INTEGER(11),
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    dishId: {
        field: "dish_id",
        type: Sequelize.INTEGER(11),
        allowNull: false,
        references: {
            model: this.Dish,
            key: 'id'
        }
    },
    dishType: {
        field: "dish_type",
        type: Sequelize.STRING(45),
        allowNull: false,
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
    tableName: 'tbl_menu_items'
});

MenuItem.sync();

module.exports = MenuItem;