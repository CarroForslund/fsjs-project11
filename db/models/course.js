const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    class Course extends Sequelize.Model {}
    Course.init({
        title: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: "",
        },
        description: {
            type: Sequelize.TEXT,
            allowNull: false,
            defaultValue: "",
        },
        estimatedTime: {
            type: Sequelize.STRING,
        },
        materialsNeeded: {
            type: Sequelize.STRING,
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

    // Within your Course model, define a BelongsTo association between 
    // your Course and User models (i.e. a "Course" belongs to a single "User"):
    Course.associate = (models) => {
        Course.belongsTo(models.User, { 
            as: 'user',
            foreignKey: {
                fieldName: 'userId',
                field: 'userId',
            },
            type: Sequelize.INTEGER,
            defaultValue: -1,
            allowNull: false,
        });
    };
     
    return Course;
};