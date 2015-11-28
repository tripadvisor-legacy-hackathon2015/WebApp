var express = require('express');
var router = express.Router();
var config = require('../config.js');
var request = require('request');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {
    title: config.appName,
    partials: {
      head:     'partials/head',
      main_search: 'partials/main-search',
      after_search: 'partials/after-search',
      mapView:  'partials/map-view',
      footer:   'partials/footer',
      scripts:  'partials/scripts'
    }
  });
});

router.get('/search', function(req, res, next) {
	//Get searchText, get geolocation
	var searchText = req.query.searchText;
	var latitude = req.query.lat;
	var longitude = req.query.lon;
	var maxDistance = "2km";
	var responseObjects, numObjects;
	console.log("Servicing Reqest: Text = "+searchText+" Lat = "+latitude+" Lon = "+longitude);

	var query = {
		"query" : {
			"filtered": {
				"query": {
					"multi_match": {
						"query": searchText,
						"type": "most_fields", 
						"fields": ["name^3", "reviews"]
					}
				},
				"filter": {
					"geo_distance": {
						"distance": maxDistance,
						"coordinates": {
							"lat": latitude,
							"lon": longitude
						}
					}

				}
			}
		},
		"highlight": {
			"fields": {
				"reviews": {},
				"name": {}
			}
		}
	};

	var query_request_options = {
		uri: 'http://159.203.23.61:9200/locationidx/location/_search',
		method: 'POST',
		json: true,
		body: query
	};

	request(query_request_options, function(error, response, body){
		console.log('Error: '+error);
		if (error != null) {
			console.log(error);
			res.writeHead(500, {'Content-Type': 'text/plain'});
			res.end("Server Error: "+error);
		} else {
			var numObjects = body.hits.total;
			var responseObjects = body.hits.hits;

			console.log('Num Objects Returned: '+numObjects);
			//console.log('Body: '+JSON.stringify(body));

			responseObjects = parse(responseObjects);
			res.writeHead(200, {'Content-Type': 'application/json'});
			res.end(JSON.stringify(responseObjects));
		}
	});
});

function parse(data) {
	//Add prioritization for rating
	return data;
}

module.exports = router;
