const router = require('express').Router();
const sequelize = require('../../config/connection');
const { Post, User, Comment, Vote, Stock } = require('../../models');
const withAuth = require('../../utils/auth');
const axios = require('axios');
const { response } = require('express');
require('dotenv').config();

router.get('/', (req, res) => {

    res.send('hello');

    let options = {
        url: `https://api.polygon.io/v2/aggs/ticker/TSLA/range/1/day/2020-06-01/2020-06-17`,
        method: 'GET',
        params: {
            apiKey: process.env.DB_Stocks
        }
    };

    //fetches stock from polygon.io using options
    axios(options)
        .then(response => {
            const data = response.data;
            //console.log(data);
            //const stockInfo = JSON.stringify(data);
            //const stockInfo = JSON.stringify(data);
            //console.log(stockInfo);
            console.log(data.results[0]);

            Stock.create({
                data: (data.results[0],data.results[1])
            })

            
        })
        .then(dbPostData => {
            console.log(dbPostData)
            return res.json(dbPostData)
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

module.exports = router;