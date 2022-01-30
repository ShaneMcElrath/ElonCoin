const { Model, DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');
const sequelize = require('../config/connection');
const moment = require('moment');

// create our Stock model
class Stock extends Model {

}

// create fields/columns for Stock model
Stock.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        
        data: {
            type: DataTypes.JSON,
            allowNull: false
        },

        date: {
            type: DataTypes.STRING,
            defaultValue: moment().format('l'),
            allowNull: false
        },

        post_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'post',
                key: 'id'
            }
        },

    },
    {
        sequelize,
        freezeTableName: true,
        underscored: true,
        modelName: 'stock'
    }
);

module.exports = Stock;
