const router = require('express').Router();
const sequelize = require('../../config/connection');
const { Post, User, Comment, Vote, Stock } = require('../../models');
const withAuth = require('../../utils/auth');
const axios = require('axios');
const { response } = require('express');
require('dotenv').config();

router.get('/', (req, res) => {

    let options = {
        url: `https://api.polygon.io/v2/aggs/ticker/TSLA/range/30/minute/2021-07-22/2021-07-22?adjusted=true&sort=asc&limit=1000`,
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
            const stockInfo = JSON.stringify(data.results);
            //console.log(stockInfo);
            //console.log(data.results);

            return Stock.create({
                data: (stockInfo),
                post_id: req.query.post_id
            });

            
        })
        .then(dbPostData => {
            console.log(dbPostData);
            return res.json(dbPostData);
        })
        .catch(err => {
            //console.log(err);
            res.status(500).json(err);
        });
});

module.exports = router;