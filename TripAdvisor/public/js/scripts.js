var latitude;
var longitude;
var map;
var map_loaded;
var markerArray;

var angularApp = angular.module('angularApp', [], function ($interpolateProvider) {
    $interpolateProvider.startSymbol('<%');
    $interpolateProvider.endSymbol('%>');
});

angularApp.controller('MainController', ['$scope', function($scope) {
    angular.element(document).ready(function () {
        $(document).on('searchResponse', populateResults);
    });

    function populateResults (event, data) {
        $scope.restaurants = data.result;
        $scope.$apply();
    }
}]);

$(document).ready(function () {
    $("#search_box").keyup(function (e) {
        if (e.keyCode == 13) {
            search();
        }
    });

    // var injector = angular.injector(['ng', 'angularApp']);
    // var $controller = injector.get('$controller');
    // var AngularCtrl = $controller('MainController');

    $(document).on("searchResponse", populateMap);
    $(document).on("searchResponse", populateList);
	  getGeoLocation();
    markerArray = new Array();
});

function getGeoLocation(){
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(setLocation,getLocationFromIP);
    } else {
        getLocationFromIP();
    }
}

function getLocationFromIP(){
    $.getJSON("http://freegeoip.net/json/", function (data) {
        longitude = data.longitude;
        latitude = data.latitude;
        console.log("longitude: " + longitude + " latitude: " + latitude);
    });
}

function setLocation(position) {
    latitude = position.coords.latitude;
    longitude = position.coords.longitude;
}

function search() {
    var searchText = document.getElementById("search_box").value;
    var serverAddress= '/search';
    $.getJSON(serverAddress, {
        searchText: searchText,
        lat: latitude,
        lon: longitude
    }, function (data) {
        $(document).trigger("searchResponse",data);
    });
}

function clearMap() {
	for (var i=0; i<markerArray.length; i++) {
		markerArray[i].setMap(null);
	}
	markerArray = new Array();
}

function populateMap(event, data) {
	//console.log(event);
	//console.log(data);
	clearMap();
	var latlngbounds = new google.maps.LatLngBounds();
	if (latitude == null || longitude == null) {console.log("position not set");}
	var myLocation = new google.maps.LatLng(latitude,longitude);
	latlngbounds.extend(myLocation);
	for (var i = 0; i<data.size; i++) {
		var location = new google.maps.LatLng(
			parseFloat(data.result[i].coordinates.lat),
			parseFloat(data.result[i].coordinates.lon));
		latlngbounds.extend(location);
		var tempMarker = placeMarker(data.result[i].coordinates,data.result[i].name);
		markerArray.push(tempMarker);
	}
	map.fitBounds(latlngbounds);
}

function populateList(event, data) {
    
}

function initMap() {
	var myLatLng = new google.maps.LatLng(45.3875812,-75.6960202);
	map = new google.maps.Map(document.getElementById('map'), {
		center: myLatLng,
		zoom: 11
	});
	placeMarker(myLatLng, "You Are Here");
}

function placeMarker(geoLocation, label) {
	var location = {
		lat: parseFloat(geoLocation.lat),
		lng: parseFloat(geoLocation.lon)
	}
	var marker = new google.maps.Marker({
		position: location,
		title: label
	});

	marker.setMap(map);
	return marker;
}

// function tempSetMarkers(geoLocation, label) {
//   // Adds markers to the map.
// 
//   // Marker sizes are expressed as a Size of X,Y where the origin of the image
//   // (0,0) is located in the top left of the image.
// 
//   // Origins, anchor positions and coordinates of the marker increase in the X
//   // direction to the right and in the Y direction down.
//   var image = {
//     url: 'images/TArating.png',
//     // This marker is 20 pixels wide by 32 pixels high.
//     size: new google.maps.Size(20, 32),
//     // The origin for this image is (0, 0).
//     origin: new google.maps.Point(0, 0),
//     // The anchor for this image is the base of the flagpole at (0, 32).
//     anchor: new google.maps.Point(0, 32)
//   };
// 
//   for (var i = 0; i < response.size; i++) {
//     if response[]
//     var marker = new google.maps.Marker({
//       position: geoLocation
//       map: map,
//       icon: image,
//       title: label
//     });
//   }
// }
