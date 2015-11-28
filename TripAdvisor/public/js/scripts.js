var latitude;
var longitude;
var map;

$(document).ready(function () {
    $("#search_box").keyup(function (e) {
        if (e.keyCode == 13) {
            search();
        }
    });
    $(document).on("searchResponse", populateMap);
    $(document).on("searchResponse", populateList);
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
    // alert("search");
    $.getJSON(serverAddress, {
        searchText: searchText,
        lat: latitude,
        lon: longitude
    }, function (data) {
            //alert(JSON.stringify(data));
            alert("see results on console");
            $(document).trigger("searchResponse",data);
    });
}

function populateMap(event, data) {
	console.log(event);
	console.log(data);
}

function populateList(event, data) {
	//data:
	//size: number of items
	//result: array of items
}

function initMap() {
	var myLatLng = {lat: 45.3875812, lng: -75.6982142};
	map = new google.maps.Map(document.getElementById('map'), {
		center: myLatLng,
		zoom: 8
	});
	placeMarker(myLatLng,"You are here!");
}

function placeMarker(geoLocation, label) {
	var marker = new google.maps.Marker({
		position: geoLocation,
		title: label
	});
	marker.setMap(map);
}


