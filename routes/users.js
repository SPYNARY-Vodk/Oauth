const client = require('../oauth');
const express = require('express');
const router = express.Router();

const verify = async (req, res, next) => {
  if (req.cookies['user-key']) {
    try {
      const validity = client.checkValidity(req.cookies['user-key']);
      if (validity.expired) {
        const newKey = await client.refreshToken(req.cookies['user-key']);
        res.cookie('user-key', newKey);
      }
      next();
    } catch (err) {
      res.cookie('user-key', 'deleted', { maxAge: -1 });
      res.redirect('/');
    }
  } else res.redirect('/');
}

router.get('/', verify, async (req, res) => {
  const user = await client.users.fetch(req.cookies['user-key']);
  res.render('home', { title: 'Disco-OAuth User', user });
});

router.get('/guilds', verify, async (req, res) => {
  const guilds = await client.guilds.fetch(req.cookies['user-key'], true);
  res.render('guilds', { title: 'Disco-OAuth Guilds', guilds })
});

module.exports = router;
