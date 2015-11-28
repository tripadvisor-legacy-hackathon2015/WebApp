var latitude;
var longitude;
var map;

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

function populateMap(event, data) {
    console.log(event);
    console.log(data);
}

function populateList(event, data) {
    
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




