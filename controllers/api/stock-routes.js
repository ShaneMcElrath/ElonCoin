const router = require('express').Router();
const sequelize = require('../../config/connection');
const { Post, User, Comment, Vote, Stock } = require('../../models');
const withAuth = require('../../utils/auth');
const axios = require('axios');
const { response } = require('express');
const moment = require('moment');
require('dotenv').config();

router.get('/', (req, res) => {

    var options = {
        method: 'GET',
        url: 'https://twelve-data1.p.rapidapi.com/time_series',
        params: {symbol: 'TSLA', interval: '30min', outputsize: '13', format: 'json'},
        headers: {
          'x-rapidapi-host': 'twelve-data1.p.rapidapi.com',
          'x-rapidapi-key': process.env.DB_Stocks
        }
      };

    //fetches stock from polygon.io using options
    axios(options)
        .then(async (response) => {

            
            var data = response.data;

            var stockInfo = JSON.stringify(data.values);
            var date = moment().format('l');

            var [data, created] = await Stock.findOrCreate({
                where: { date: date},
                defaults: {
                data: (stockInfo)
                }
            });

            console.log(created);
            if (created) {
                console.log('hi');
                return data;
            }
            else {
                console.log(stockInfo);
                return Stock.update(
                    {
                        data: stockInfo
                    },
                    {
                        where: {
                            date: date
                        }
                    }
                );
            }      
        })
        .then((dbPostData) => {
            console.log('hi');
            console.log(dbPostData); 
            return res.json(dbPostData);
        })
        .catch(err => {
            //console.log(err);
            res.status(500).json(err);
        });
});

router.get('/created', (req, res) => {
    Stock.findOne({
        where: {date : req.query.created_at},
        attributes: [
            'data'
        ]
    })
        .then((createdAtDB) => {
            console.log(createdAtDB.dataValues.data);
            return res.send(createdAtDB.dataValues.data);
        })
        .catch((err) => {
            res.status(500).json(err);
        });
    
});

module.exports = router;