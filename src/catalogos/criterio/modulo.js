/**
 * Modulo CriterioModule
 * 
 * @package    CIUM 
 * @subpackage Modulo
 * @author     Eliecer Ramirez Esquinca
 * @created    2015-07-20
 */
(function(){
	'use strict';
	/**
	 * Obtener las rutas para el modulo.
	 */
	var criterioModule = angular.module('CriterioModule', ['ngMaterial','ngRoute','ngStorage','ngCookies','ngMessages','pascalprecht.translate','http-auth-interceptor']);
	criterioModule.config(['$mdThemingProvider','$mdIconProvider','$routeProvider','$httpProvider','$translateProvider',function($mdThemingProvider,$mdIconProvider,$routeProvider,$httpProvider,$translateProvider){
		
		$routeProvider
		.when('/criterio', { templateUrl: 'src/catalogos/criterio/views/lista.html',	controller: 'CriterioCtrl'})
		.when('/criterio/nuevo', {templateUrl: 'src/catalogos/criterio/views/nuevo.html',	controller: 'CriterioCtrl'})
		.when('/criterio/modificar', {templateUrl: 'src/catalogos/criterio/views/modificar.html',	controller: 'CriterioCtrl'})
		.when('/criterio/ver', {templateUrl: 'src/catalogos/criterio/views/ver.html',	controller: 'CriterioCtrl'})
	}]);
})();