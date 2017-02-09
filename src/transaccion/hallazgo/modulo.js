(function(){
	'use strict';
	var hallazgoModule = angular.module('HallazgoModule', ['ngMaterial','ngRoute','ngStorage','ngCookies','ngMessages','pascalprecht.translate','http-auth-interceptor']);
	hallazgoModule.config(['$mdThemingProvider','$mdIconProvider','$routeProvider','$httpProvider','$translateProvider',function($mdThemingProvider,$mdIconProvider,$routeProvider,$httpProvider,$translateProvider){
		
		$routeProvider
		.when('/hallazgo', { templateUrl: 'src/transaccion/hallazgo/views/lista.html',	controller: 'HallazgoCtrl'})
		.when('/hallazgo/ver', {templateUrl: 'src/transaccion/hallazgo/views/ver.html',	controller: 'HallazgoCtrl'})
		.when('/hallazgo/indicadores', {templateUrl: 'src/transaccion/hallazgo/views/indicadores.html',	controller: 'HallazgoCtrl'})
		.when('/hallazgo/evaluaciones', {templateUrl: 'src/transaccion/hallazgo/views/evaluaciones.html',	controller: 'HallazgoCtrl'})	
	}]);
})();