var express = require('express');
var router = express.Router();
var elasticsearch = require('elasticsearch');
var config = require('../config.js');

/*var client = new elasticsearch.Client({
	host: config.__elasticsearch.host,
	log: 'trace'
});*/
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {
    title: config.appName,
    partials: {
      head:     'partials/head',
      mapView:  'partials/map-view',
      footer:   'partials/footer',
      scripts:  'partials/scripts'
    }
  });
});

router.get('/search', function(req, res, next) {
	//Get searchText, get geolocation
	var searchText = req.query.searchText; //assigned to sushi
	var latitude = req.query.lat;
	var longitude = req.query.lon;
	var responseObjects, numObjects;
	console.log("Servicing Reqest: Text = "+searchText+" Lat = "+latitude+" Lon = "+longitude);

	client.search({ //TODO prioritize by rating, add index and type, do something with trip_types and price_level
		index: 'INDEX',
  		type: 'TYPE',
		body: {
			filtered : {
				multi_match : {
					query: searchText,
					fields: [ "name^3", "reviews" ]
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
		numObjects = body.hits.total;
		responseObjects = body.hits.hits;
		responseObjects = parse(responseObjects);
		res.writeHead(200, {'Content-Type': 'application/json'});
		res.end(JSON.stringify(responseObjects));
	}, function (error) {
		console.trace(error.message);
		res.writeHead(500, {'Content-Type': 'text/plain'});
		res.end("Server Error: "+error.message);
	});
});

function parse(data) {
	return { message: "In Development" };
}

module.exports = router;
