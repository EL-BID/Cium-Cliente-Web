(function(){
	'use strict';
	var datoModule = angular.module('DatoModule', ['ngMaterial','ngRoute','ngStorage','ngCookies','ngMessages','pascalprecht.translate','http-auth-interceptor']);
	datoModule.config(['$mdThemingProvider','$mdIconProvider','$routeProvider','$httpProvider','$translateProvider',function($mdThemingProvider,$mdIconProvider,$routeProvider,$httpProvider,$translateProvider){
		
		$routeProvider
		.when('/datos/ver', {templateUrl: 'src/sistema/datos/views/ver.html',	controller: 'DatoCtrl'})	
	}]);
})();