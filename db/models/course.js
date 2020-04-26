const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    class Course extends Sequelize.Model {}
    Course.init({
        // Set custom primary key column
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
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
        // steps
        // (Array of objects that include 
        // stepNumber (Number),
        // title (String, required) and
        // description (String, required)
        // properties)
        // steps: {
        //     type: Sequelize.ARRAY(Sequelize.ABSTRACT),
        // },
        // reviews
        // (Array of ObjectId values, _id values from the reviews collection)
        // reviews: {
        //     type: Sequelize.ARRAY(Sequelize.ABSTRACT),
        // },
        createdAt: {
            type: Sequelize.DATE,
            allowNull: false,
        },
        updatedAt: {
            type: Sequelize.DATE,
            allowNull: false,
        },
        userId: {
            type: Sequelize.INTEGER,
            defaultValue: -1,
        },
    },
    { 
        sequelize 
    });

    // Within your Course model, define a BelongsTo association between 
    // your Course and User models (i.e. a "Course" belongs to a single "User"):
    Course.associate = (models) => {
        Course.belongsTo(models.User, { foreignKey: 'id' });
    };
    
    return Course;
};