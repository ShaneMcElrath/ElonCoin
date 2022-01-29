const router = require('express').Router();
const sequelize = require('../../config/connection');
const { Post, User, Comment, Vote, Stock } = require('../../models');
const withAuth = require('../../utils/auth');
const axios = require('axios');
const { response } = require('express');
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
        .then(response => {

            
            const data = response.data;
            console.log(data.values);
            //console.log(data);
            //const stockInfo = JSON.stringify(data);
           /*  let [stockj] = data.values;
            console.log(stockj); */
            let stockInfo = JSON.stringify(data.values);
            console.log(stockInfo);
            //console.log(data.results);

            return Stock.create({
                data: (stockInfo),
                post_id: req.query.post_id
            });

            
        })
        .then(dbPostData => {
            /* console.log(dbPostData); */
            return res.json(dbPostData);
        })
        .catch(err => {
            //console.log(err);
            res.status(500).json(err);
        });
});

module.exports = router;