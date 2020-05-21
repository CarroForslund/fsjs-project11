const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    class User extends Sequelize.Model {}
    User.init({
        firstName: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: "",
            validate: {
                notEmpty: {
                    args: true,
                    msg: "First name is required.",
                },
            },
        },
        lastName: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: "",
            validate: {
                notEmpty: {
                    args: true,
                    msg: "Last name is required.",
                },
            },
        },
        emailAddress: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: {
                args: true,
                msg: "Email address already in use!",
            },
            isEmail: true,
            defaultValue: "",
            validate: {
                notEmpty: {
                    args: true,
                    msg: "Email address is required.",
                },
            },
        },
        password: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: "",
            validate: {
                notEmpty: {
                    args: true,
                    msg: "Password is required.",
                },
            },
        },
    }, { sequelize });

    // Within your User model, define a HasMany association between 
    // your User and Course models (i.e. a "User" has many "Courses"):
    User.associate = (models) => {
        User.hasMany(models.Course, { 
            as: 'user', //alias
            foreignKey: {
                fieldName: 'userId',
            },
        });
    };
    
    return User;
};