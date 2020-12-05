var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index', { title: 'Express Template' });
});

router.get('/page2', (req, res, next) => {
  res.render('page2', { title: 'Express Template' });
});


module.exports = router;
