var latitude;
var longitude;
var map;
var map_loaded;
var markerArray;
var infoWindowArray;

var star_array = ['img/star1.png', 
                  'img/star2.png', 
                  'img/star3.png', 
                  'img/star4.png', 
                  'img/star5.png'];


var angularApp = angular.module('angularApp', [], function ($interpolateProvider) {
    $interpolateProvider.startSymbol('<%');
    $interpolateProvider.endSymbol('%>');
});

angularApp.controller('MainController', ['$scope', function($scope) {
    angular.element(document).ready(function () {
        $(document).on('searchResponse', populateResults);
        $(document).on('conceptexpansionResponse', populateConceptexpansionResults)
    });
    function populateResults (event, data) {
			for (var i = 0; i<data.result.length; i++) {
				data.result[i].address = data.result[i].address.substr(0,data.result[i].address.indexOf(","));
				data.result[i]['distance'] = distance(
					latitude,
					parseFloat(data.result[i].coordinates.lat),
					longitude,
					parseFloat(data.result[i].coordinates.lon)
					);
			}
			$scope.restaurants = data.result;
			$scope.$apply();
    }
    function populateConceptexpansionResults(event, data){
			for (var i = 0; i<data.result.length; i++) {
				data.result[i].address = data.result[i].address.substr(0,data.result[i].address.indexOf(","));
				data.result[i]['distance'] = distance(
					latitude,
					parseFloat(data.result[i].coordinates.lat),
					longitude,
					parseFloat(data.result[i].coordinates.lon)
					);
			}
			$scope.conceptexpansionrestaurants = data.result;
			$scope.$apply();
    }
    

}]);

$(document).ready(function () {
    $("#search_box").keyup(function (e) {
        if (e.keyCode == 13) {
            search();
        }
    });
           	$("#main_page").show();
   	$("#search_results").hide();

    // var injector = angular.injector(['ng', 'angularApp']);
    // var $controller = injector.get('$controller');
    // var AngularCtrl = $controller('MainController');

    $(document).on("searchResponse", populateMap);
    $(document).on("searchResponse", populateList);
	  getGeoLocation();
    markerArray = new Array();
    infoWindowArray = new Array();
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
	$("#main_page").hide();
   	$("#search_results").show();

    var searchText = document.getElementById("search_box").value;
    var serverAddress= '/search';
    var opts ={
        searchText: searchText,
        lat: latitude,
        lon: longitude
    }

    $.getJSON(serverAddress,opts , function (data) {
        $(document).trigger("searchResponse",data);
    });
<<<<<<< Updated upstream
    $.getJSON('/conceptexpansion',
             opts,
             function(data){
$(document).trigger("conceptexpansionResponse",data)
             })
=======

>>>>>>> Stashed changes
}

function conceptexpansionResponse(){}
function clearMap() {
	for (var i=0; i<markerArray.length; i++) {
		markerArray[i].setMap(null);
        infoWindowArray[i].close();
	}
	markerArray = new Array();
    infoWindowArray = new Array();
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

		var tempMarker = placeMarker(
      data.result[i].coordinates,
      data.result[i].name,
      data.result[i].address,
      data.result[i].rating,
      data.result[i].photo_url,
      i);

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

function placeMarker(geoLocation, label, address, rating, photoUrl) {

	var location = {
		lat: parseFloat(geoLocation.lat),
		lng: parseFloat(geoLocation.lon)
	};

  var rating = Math.ceil(rating);

  var image = {
    url: star_array[rating - 1],
    // This marker is 20 pixels wide by 32 pixels high.
    size: new google.maps.Size(24, 24),
    // The origin for this image is (0, 0).
    origin: new google.maps.Point(0, 0),
    // The anchor for this image is the base of the flagpole at (0, 32).
    anchor: new google.maps.Point(12, 12)
  };
  console.log("PlaceMarker...", image);
  
	var marker = new google.maps.Marker({
		position: location,
		title: label,
    icon: image,
    animation: google.maps.Animation.DROP

	});

    // Show restaurant name and adddress on hover
    var pictureUrl = (photoUrl) ? '<img src="' + photoUrl + '">' : '';
    var contentString = '<div><h2>'+ label + '</h2></div>' +
        '<div><p>' + address + '</p></div>' + 
        '<div>' + pictureUrl;
    var infoWindow = new google.maps.InfoWindow({
        content: contentString
    });
    infoWindowArray.push(infoWindow);

    marker.addListener('click', function () {
        for (var i = 0; i < markerArray.length; i++) {
            markerArray[i].setAnimation(null);
            infoWindowArray[i].close();
        };
        marker.setAnimation(google.maps.Animation.BOUNCE);
        infoWindow.open(map, marker);
    });
    // marker.addListener('mouseout', function () {
    //     marker.setAnimation(null);
    //     infoWindow.close();
    // })

	marker.setMap(map);
	return marker;
}

Number.prototype.toRad = function() {
   return this * Math.PI / 180;
}

function distance(lat1, lat2, lon1, lon2) {
	var R = 6371; // km
	//has a problem with the .toRad() method below.
	var x1 = lat2-lat1;
	var dLat = x1.toRad();
	var x2 = lon2-lon1;
	var dLon = x2.toRad();
	var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
	                Math.cos(lat1.toRad()) * Math.cos(lat2.toRad()) *
	                Math.sin(dLon/2) * Math.sin(dLon/2);
	var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
	var d = Math.round(10 * R * c) / 10;
	return d;
}
