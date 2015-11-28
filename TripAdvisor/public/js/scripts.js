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


function setMarkers(geoLocation, label) {
  // Adds markers to the map.

  // Marker sizes are expressed as a Size of X,Y where the origin of the image
  // (0,0) is located in the top left of the image.

  // Origins, anchor positions and coordinates of the marker increase in the X
  // direction to the right and in the Y direction down.
  var image = {
    url: 'images/TArating.png',
    // This marker is 20 pixels wide by 32 pixels high.
    size: new google.maps.Size(20, 32),
    // The origin for this image is (0, 0).
    origin: new google.maps.Point(0, 0),
    // The anchor for this image is the base of the flagpole at (0, 32).
    anchor: new google.maps.Point(0, 32)
  };

  for (var i = 0; i < response.size; i++) {
    if response[]
    var marker = new google.maps.Marker({
      position: geoLocation
      map: map,
      icon: image,
      title: label
    });
  }
}

