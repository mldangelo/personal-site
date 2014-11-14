var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Michael D\'Angelo' });
});

router.get('/resume', function(req, res) {
  res.render('resume', { title: 'Michael D\'Angelo' });
});

module.exports = router;
