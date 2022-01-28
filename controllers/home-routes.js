const router = require('express').Router();
const sequelize = require('../config/connection');
const { Post, User, Comment, Vote, Stock } = require('../models');
const axios = require('axios');
require('dotenv').config();

// get all posts for homepage
router.get('/', (req, res) => {
  console.log('======================');
  Post.findAll({
    attributes: [
      'id',
      'post_url',
      'title',
      'created_at',
      [sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'), 'vote_count']
    ],
    include: [
      {
        model: Comment,
        attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
        include: {
          model: User,
          attributes: ['username']
        }
      },
      {
        model: User,
        attributes: ['username']
      }
    ]
  })
    .then(dbPostData => {
      const posts = dbPostData.map(post => post.get({ plain: true }));

      res.render('homepage', {
        posts,
        loggedIn: req.session.loggedIn
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

// get single post
router.get('/post/:id', (req, res) => {
  Post.findOne({
    where: {
      id: req.params.id
    },
    attributes: [
      'id',
      'post_url',
      'title',
      'created_at',
      [sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'), 'vote_count']
    ],
    include: [
      {
        model: Comment,
        attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
        include: {
          model: User,
          attributes: ['username']
        }
      },
      {
        model: User,
        attributes: ['username']
      },
      {
        model: Stock,
        attributes: ['data']
      }
    ]
  })
    .then(dbPostData => {
      if (!dbPostData) {
        res.status(404).json({ message: 'No post found with this id' });
        return;
      }

      const post = dbPostData.get({ plain: true });

      res.render('single-post', {
        post,
        loggedIn: req.session.loggedIn
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.get('/login', (req, res) => {
  if (req.session.loggedIn) {
    res.redirect('/');
    return;
  }

  res.render('login');
});


//localhost:3001/twitter
/* router.get("/twitter", (req, res) => {

  let options = {
    url: 'https://api.twitter.com/2/users/44196397/tweets',
    method: 'GET',
    params: {
      max_results: '5'
    },
    headers: {
      Authorization: `Bearer ${process.env.DB_Twitter}`,
      cookie: 'guest_id_marketing=v1%253A164314130670391939; guest_id_ads=v1%253A164314130670391939; personalization_id=%22v1_miJD3PLKTUfq5vx2k8n8eQ%3D%3D%22; guest_id=v1%253A164314130670391939; '
    }
  };

  axios(options)
    .then(response => {
      const { data } = response.data;

      console.log(data);

      res.render('twitter', {
        tweets: data
      });
    })
    .catch(err => console.error('error:' + err));
}); */

module.exports = router;
