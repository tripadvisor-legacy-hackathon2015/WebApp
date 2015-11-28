var latitude;
var longitude;
var map;

function getGeoLocation(){
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(setLocation);
    } else {
        alert("fuck you");
    }
}

function setLocation(position) {
    latitude = position.coords.latitude;
    longitude = position.coords.longitude;
}

function search() {
    var searchText = document.getElementById("search_box").value;
    var serverAddress= 'http://localhost:3000';

    alert();
    $.getJSON(serverAddress, {
        search: searchText,
        latitude: latitude,
        longitude: longitude
    }, function (data) {
        console.log(data);
        data = { name: "Test", pizza: "bacon", results: 25 }
        if (data.results && data.results.length > 0) {
            //var mySenators = '<p>build:</p>';
            alert(data.pizza);

            $.each(data.resuts, function (i, rep) {
                if ('pizza' == rep.chamber.toLowerCase()) {
                }
            });
        }
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
