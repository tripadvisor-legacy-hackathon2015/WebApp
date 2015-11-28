var latitude;
var longitude;
var map;
var markerArray;

$(document).ready(function () {
    $("#search_box").keyup(function (e) {
        if (e.keyCode == 13) {
            search();
        }
    });
    $(document).on("searchResponse", populateMap);
    $(document).on("searchResponse", populateList);
    markerArray = new Array();
});

function getGeoLocation(){
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(setLocation);
    } else {
        alert("fuck you - ♥ Daniel");
    }
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

function clearMap() {
	for (var i=0; i<markerArray.length; i++) {
		markerArray[i].setMap(null);
	}
	markerArray = new Array();
}

function populateMap(event, data) {
	console.log(event);
	console.log(data);
	clearMap();
	for (var i = 0; i<data.size; i++) {
		var tempMarker = placeMarker(data.result[i].coordinates,data.result[i].name);
		markerArray.push(tempMarker);
	}
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
	//placeMarker(myLatLng,"You are here!");
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


