const Express = require('express');
const router = Express.Router();
// const router = Express.router();

router.get('/', (req, res) => {
  res.render('welcome')
});

router.get('/about', (req, res) => {
  res.render('about')
});

module.exports = router;
