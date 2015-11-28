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
      result_item: 'partials/result-item',
      scripts:  'partials/scripts'
    }
  });
});

router.get('/search', function(req, res, next) {
	//Get searchText, get geolocation
	var searchText = req.query.searchText;
	var latitude = req.query.lat;
	var longitude = req.query.lon;
	var maxDistance = "2km"; //TODO: Less hardcoded
	var responseObjects;
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
		if (error != null) {
			console.log(error);
			res.writeHead(500, {'Content-Type': 'text/plain'});
			res.end("Server Error: "+error);
		} else {
			//console.log('Body: '+JSON.stringify(body));
			var responseObjects = body.hits.hits;
			res.writeHead(200, {'Content-Type': 'application/json'});
			res.end(JSON.stringify(parse(responseObjects)));
		}
	});
});

function parse(data) {
	//Add prioritization for rating
	var response = {
		size: 0,
		result: []
	};
	response.size = data.length;
	//console.log('Num Objects Returned: '+data.length);
	for (var i = 0; i<data.length; i++) {
        var result_obj = data[i]._source;
        
        // Do we have any highlights? Copy them to response.
        var result_highlights = [];
        if (data[i].highlight) {
            var highlights = data[i].highlight;
            if (highlights.name) {
                result_highlights = result_highlights.concat(highlights.name);
            }
            if (highlights.reviews) {
                result_highlights = result_highlights.concat(highlights.reviews);
            }
            // strip all the embedded newlines
            result_highlights = result_highlights.map(function(s){return s.replace(/\n/g, " ")});
        }
        result_obj['highlights'] = result_highlights;
		response.result.push(data[i]._source);
	}
	return response;
}

module.exports = router;
