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
            allowNull: true,
        },
        materialsNeeded: {
            type: Sequelize.STRING,
            allowNull: true,
        }
    }, { sequelize });

    // Within your Course model, define a BelongsTo association between 
    // your Course and User models (i.e. a "Course" belongs to a single "User"):
    Course.associate = (models) => {
        Course.belongsTo(models.User, { 
            as: 'user',
            foreignKey: {
                fieldName: 'userId',
                // allowNull: false,
                // type: Sequelize.INTEGER,
                // defaultValue: -1,
            },
            
        });
    };
     
    return Course;
};