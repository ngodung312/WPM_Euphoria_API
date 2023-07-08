const Sequelize = require('sequelize');
const MySequelize = require('../utils/Sequelize');
const constant = require('../utils/Constant');

let User = MySequelize.define('tbl_users', {
    id: {
        field: "id",
        type: Sequelize.INTEGER(11),
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    username: {
        field: "username",
        type: Sequelize.STRING(64),
        allowNull: false,
        unique: true
    },
    email: {
        field: "email",
        type: Sequelize.STRING(45),
        allowNull: false,
        unique: true
    },
    password: {
        field: "password",
        type: Sequelize.STRING(255),
        allowNull: false
    },
    fullName: {
        field: "full_name",
        type: Sequelize.STRING(45),
        allowNull: false
    },
    avatar: {
        field: "avatar",
        type: Sequelize.STRING(100),
        allowNull: true
    },
    phoneNumber: {
        field: "phone_number",
        type: Sequelize.STRING(45),
        allowNull: false,
        unique: true
    },
    userRole: {
        field: "user_role",
        type: Sequelize.TINYINT(1),
        allowNull: false,
        default: constant.USER_ROLE.EVENT_HOST
    },
    activated: {
        field: "activated",
        type: Sequelize.TINYINT(1),
        allowNull: false, 
        default: constant.ACTIVATED.YES
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
    tableName: 'tbl_users'
});

User.sync();

module.exports = User;