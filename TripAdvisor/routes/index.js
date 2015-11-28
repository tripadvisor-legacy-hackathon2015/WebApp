var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/search', function(req, res, next) {
	//Get searchText, get geolocation
	var searchText = req.query.searchText; //assigned to sushi
	var latitude = req.query.lat;
	var longitude = req.query.lon;
	console.log("Text: "+searchText+" Lat: "+latitude+" Lon: "+longitude);
});

module.exports = router;
