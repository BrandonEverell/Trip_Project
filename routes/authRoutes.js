const passport = require("passport");
const Express = require('express');
const router = Express.Router();

  router.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"]
  })
);

router.get(
  "/auth/google/callback",
 passport.authenticate("google"),
 (req, res) => {
   res.redirect('/');
 }
);

  router.get('/auth/facebook',
    passport.authenticate('facebook'));

  router.get('/auth/facebook/callback',
    passport.authenticate('facebook', { failureRedirect: '/login' }),
    function(req, res) {
      // Successful authentication, redirect home.
      res.redirect('/');
    });



    router.get('/api/current_user', (req, res) => {
   res.send(req.user);
 })

    router.get("/api/logout", (req, res) => {
      req.logout();
      res.redirect('/');
    });

  module.exports = router;
