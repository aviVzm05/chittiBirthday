var express = require('express');
const path = require('path');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  // res.render('index', { title: 'Shraddha\'s Birthday Countdown' });
  res.sendFile(path.join(__dirname,'../public','index.html'),function(err){
    if(err) {
      console.log(`Error details are ${err}`);
    }
  })
}); 

module.exports = router;
