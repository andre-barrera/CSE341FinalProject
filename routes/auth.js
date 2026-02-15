const express = require('express');
const router = express.Router();
const passport = require('../auth/passport');


router.get('/login', (req, res, next) => {
  if (req.user) {
    return res.send(`
      <h2>You are already logged in</h2>
      <p>Current user: <strong>${req.user.username}</strong></p>
      <a href="/api-docs">Go to Swagger API Docs</a><br><br>
      <a href="/auth/logout">Logout</a>
    `);
  }

  passport.authenticate('github')(req, res, next);
});


router.get(
  '/callback',
  passport.authenticate('github', {
    failureRedirect: '/'
  }),
  (req, res) => {
    res.send(`
      <h2>Login Successful!</h2>
      <p>Welcome <strong>${req.user.username}</strong></p>

      <a href="/api-docs">Go to Swagger API Docs</a><br><br>
      <a href="/auth/logout">Logout</a>
    `);
  }
);



router.get('/logout', (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.send(`
      <h2>You have been logged out</h2>
      <a href="/auth/login">Login again</a>
    `);
  });
});

module.exports = router;
