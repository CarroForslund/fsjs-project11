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
            defaultValue: "",
        },
        password: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: "",
        },
        createdAt: {
            type: Sequelize.DATE,
            allowNull: false,
        },
        updatedAt: {
            type: Sequelize.DATE,
            allowNull: false,
        },
    }, { sequelize });

    // Within your User model, define a HasMany association between 
    // your User and Course models (i.e. a "User" has many "Courses"):
    User.associate = (models) => {
        User.hasMany(models.Course, { 
            as: 'user', //alias
            foreignKey: {
                fieldName: 'userId',
                field: 'userId',
            },
        });
    };
    
    return User;
};