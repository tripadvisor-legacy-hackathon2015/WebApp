//actual declaration of the angular app
var app = angular.module('angularApp', [], function ($interpolateProvider) {
	$interpolateProvider.startSymbol('<%');
    $interpolateProvider.endSymbol('%>');
});

app.controller('MainController', ['$scope', function($scope) {
	$scope.restaurants = [
		{
			name: 'La Botega',
			address: '20 Crescent Road',
			web_url: 'www.google.com',
			rating: 4,
			coordinates: {
				lat: 45,
				lon: 33
			}
		},
		{
			name: 'Tim Hortons',
			address: '20 Crescent Road',
			web_url: 'www.google.com',
			rating: 4,
			coordinates: {
				lat: 30,
				lon: 30
			}
		},
		{
			name: 'Avarra Restaurant',
			address: '20 Crescent Road',
			web_url: 'www.google.com',
			rating: 4,
			coordinates: {
				lat: 12.52,
				lon: 72
			}
		},
		{
			name: 'La Botega',
			address: '20 Crescent Road',
			web_url: 'www.google.com',
			rating: 4,
			coordinates: {
				lat: 45,
				lon: 33
			}
		},
		{
			name: 'Tim Hortons',
			address: '20 Crescent Road',
			web_url: 'www.google.com',
			rating: 4,
			coordinates: {
				lat: 30,
				lon: 30
			}
		},
		{
			name: 'avarra Restaurant',
			address: '20 Crescent Road',
			web_url: 'www.google.com',
			rating: 4,
			coordinates: {
				lat: 12.52,
				lon: 72
			}
		},
		{
			name: 'avarra Restaurant',
			address: '20 Crescent Road',
			web_url: 'www.google.com',
			rating: 4,
			coordinates: {
				lat: 12.52,
				lon: 72
			}
		}
	];
}]);