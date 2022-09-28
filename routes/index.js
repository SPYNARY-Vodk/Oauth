const client = require('../oauth');
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
  if (req.cookies['user-key']) {
    try {
      const keyValidity = client.checkValidity(req.cookies['user-key']);
      if (keyValidity.expired) {
        const newKey = await client.refreshToken(req.cookies['user-key']);
        res.cookie('user-key', newKey);
        res.redirect('/user');
      } else {
        res.redirect('/user');
      }
    } catch (err) {
      console.error(err);
      const { link, state } = client.auth;
      res.cookie('user-key', 'deleted', { maxAge: -1 });
      res.cookie('user-state', state);
      res.render('index', { title: 'Disco-OAuth Guide', link });
    }
  } else {
    const { link, state } = client.auth;
    res.cookie('user-state', state);
    res.render('index', { title: 'Disco-OAuth Guide', link });
  }
});

router.get('/login', async (req, res) => {
  if (req.query.state && req.query.code && req.cookies['user-state']) {
    if (req.query.state === req.cookies['user-state']) {
      const userKey = await client.getAccess(req.query.code).catch(console.error);
      res.cookie('user-state', 'deleted', { maxAge: -1 });
      res.cookie('user-key', userKey);
      res.redirect('/user');
    } else {
      res.send('States do not match. Nice try hackerman!');
    }
  } else {
    res.send('Invalid login request.');
  }
});

router.get('/logout', (req, res) => {
  res.cookie('user-key', 'deleted', { maxAge: -1 });
  res.redirect('/');
});

module.exports = router;