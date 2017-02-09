(function(){
	'use strict';
	var calidadModule = angular.module('CalidadModule', ['ngMaterial','ngRoute','ngStorage','ngCookies','ngMessages','pascalprecht.translate','http-auth-interceptor']);
	calidadModule.config(['$mdThemingProvider','$mdIconProvider','$routeProvider','$httpProvider','$translateProvider',function($mdThemingProvider,$mdIconProvider,$routeProvider,$httpProvider,$translateProvider){
		
		$routeProvider
		.when('/evaluacion-calidad', { templateUrl: 'src/transaccion/evaluacionCalidad/views/lista.html',	controller: 'CalidadCtrl'})
		.when('/evaluacion-calidad/Criterios', {templateUrl: 'src/transaccion/evaluacionCalidad/views/Criterios.html',	controller: 'CalidadCtrl'})
		.when('/evaluacion-calidad/nuevo', {templateUrl: 'src/transaccion/evaluacionCalidad/views/nuevo.html',	controller: 'CalidadCtrl'})
		.when('/evaluacion-calidad/modificar', {templateUrl: 'src/transaccion/evaluacionCalidad/views/modificar.html',	controller: 'CalidadCtrl'})
		.when('/evaluacion-calidad/ver', {templateUrl: 'src/transaccion/evaluacionCalidad/views/ver.html',	controller: 'CalidadCtrl'})
		.when('/evaluacion-calidad/evaluacionImpresa', {templateUrl: 'src/transaccion/evaluacionCalidad/views/evaluacionImpresa.html',	controller: 'CalidadCtrl'})
	}]);
})();