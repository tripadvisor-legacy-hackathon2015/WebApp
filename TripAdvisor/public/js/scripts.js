var latitude;
var longitude;
var map;

$(document).ready(function () {
    
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
    var serverAddress= 'sample_search_doc.json';

    $.getJSON(serverAddress, {
        search: searchText,
        latitude: latitude,
        longitude: longitude
    }, function (data) {
            //alert(JSON.stringify(data));
            $.each(data, function (i, rep) {
                if (i == 1)
                    alert(JSON.stringify(rep));
            });
    });
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


