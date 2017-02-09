(function(){
	'use strict';
	var RecursoModule = angular.module('RecursoModule', ['ngMaterial','ngRoute','ngStorage','ngCookies','ngMessages','pascalprecht.translate','http-auth-interceptor']);
	RecursoModule.config(['$mdThemingProvider','$mdIconProvider','$routeProvider','$httpProvider','$translateProvider',function($mdThemingProvider,$mdIconProvider,$routeProvider,$httpProvider,$translateProvider){
		
		$routeProvider
		.when('/evaluacion-recurso', { templateUrl: 'src/transaccion/evaluacionRecurso/views/lista.html',	controller: 'RecursoCtrl'})
		.when('/evaluacion-recurso/Criterios', {templateUrl: 'src/transaccion/evaluacionRecurso/views/Criterios.html',	controller: 'RecursoCtrl'})
		.when('/evaluacion-recurso/nuevo', {templateUrl: 'src/transaccion/evaluacionRecurso/views/nuevo.html',	controller: 'RecursoCtrl'})
		.when('/evaluacion-recurso/modificar', {templateUrl: 'src/transaccion/evaluacionRecurso/views/modificar.html',	controller: 'RecursoCtrl'})
		.when('/evaluacion-recurso/ver', {templateUrl: 'src/transaccion/evaluacionRecurso/views/ver.html',	controller: 'RecursoCtrl'})
		.when('/evaluacion-recurso/evaluacionImpresa', {templateUrl: 'src/transaccion/evaluacionRecurso/views/evaluacionImpresa.html',	controller: 'RecursoCtrl'})
	}]);
})();