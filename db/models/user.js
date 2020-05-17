const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    class User extends Sequelize.Model {}
    User.init({
        firstName: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: "",
        },
        lastName: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true,
            defaultValue: "",
        },
        emailAddress: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true,
            isEmail: true,
            defaultValue: "",
        },
        password: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: "",
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