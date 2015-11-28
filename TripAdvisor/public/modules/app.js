//actual declaration of the angular app
var app = angular.module('angularApp', [], function ($interpolateProvider) {
	$interpolateProvider.startSymbol('<%');
    $interpolateProvider.endSymbol('%>');
});

app.controller('MainController', ['$scope', function($scope) {
	$scope.restaurants = [
		{
			name: 'La Botega',
			coordinates: {
				lat: 45,
				lon: 33
			}
		},
		{
			name: 'Tim Hortons',
			coordinates: {
				lat: 30,
				lon: 30
			}
		},
		{
			name: 'avarra Restaurant',
			coordinates: {
				lat: 12.52,
				lon: 72
			}
		}
	];
}]);