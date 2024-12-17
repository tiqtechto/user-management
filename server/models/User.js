const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const User = sequelize.define('User', {
    firstName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            len: [3, 50],
            is: /^[a-zA-Z',.-]+( [a-zA-Z',.-]+)*$/i,
        },
    },
    lastName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            len: [3, 50],
            is: /^[a-zA-Z',.-]+( [a-zA-Z',.-]+)*$/i,
        },
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true,
            len: [6, 60],
        },
    },
    role: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            len: [3, 20],
            is: /^[a-zA-Z',.-]+( [a-zA-Z',.-]+)*$/i,
        },
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            len: [6, 60],
            is: /^(?=.*[!@#$%^&*()_\-+=\[\]{};':"\\|,.<>\/?])(?=.*[0-9]).*$/,
        },
    },
    resetPassword: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: null
    },
    image: {
        type: DataTypes.JSON,
        allowNull: true,
    },
    token: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    verified: {
        type: DataTypes.ENUM('0', '1'),
        defaultValue: '1',
    },
    loggedin: {
        type: DataTypes.ENUM('0', '1'),
        defaultValue: '0',
    },
    createdBy: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'Users', // Self-referencing
            key: 'id',
        },
    },
    deletedAt: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null
    }
}, {
    timestamps: true,
    paranoid: true,
    deletedAt: 'deletedAt'
});

module.exports = User;
