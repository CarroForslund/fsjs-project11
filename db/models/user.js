const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    class User extends Sequelize.Model {}
    User.init({
        // Set custom primary key column
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        firstName: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: "",
        },
        lastName: {
            type: Sequelize.STRING,
            allowNull: false,
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
    },
    { 
        sequelize 
    });
    
    return User;
};