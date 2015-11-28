var express = require('express');
var router = express.Router();
var elasticsearch = require('elasticsearch');
var client = new elasticsearch.Client({
	host: '159.203.23.61:9200',
	log: 'trace'
});

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

	client.search({
		index: 'INDEX', //TODO: THIS
  		type: 'TYPE', //TODO: THIS
		body: {
			filtered : {
				multi_match : {
					query: searchText,
					fields: [ "name^3", "reviews" ] //TODO prioritize by ranking
  				},
				filter : {
					geo_distance : {
						distance : "50km",
							position : {
								lat : latitude,
								lon : longitude
							}
						}
					}
				}
			}
	}).then(function (body) {
		var hits = body.hits.hits;
	}, function (error) {
		console.trace(error.message);
	});

	client.ping({
		// ping usually has a 3000ms timeout 
		requestTimeout: Infinity,

		// undocumented params are appended to the query string 
		hello: "elasticsearch!"
	}, function (error) {
  		if (error) {
			console.trace('elasticsearch cluster is down!');
		} else {
			console.log('All is well');
		}
	});
});

module.exports = router;
