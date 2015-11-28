var latitude;
var longitude;

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
            data = {name:"Test", pizza:"bacon", results:25}
						if (data.results && data.results.length > 0) {
							//var mySenators = '<p>build:</p>';
              alert(data.pizza);

							$.each(data.resuts, function(i, rep) {
								if ('pizza' == rep.chamber.toLowerCase()) {
                }


						});

				});
}
