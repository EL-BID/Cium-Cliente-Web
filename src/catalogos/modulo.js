(function(){
/**
 * @ngdoc interface
 * @name Catalogos.interface:CrudModule
 * @description
 * Contiene la configuración de las rutas para los catalogos.
 */	
	var crudModule = angular.module('CrudModule', ['ngMaterial','ngRoute','ngStorage','ngCookies','ngMessages','pascalprecht.translate','http-auth-interceptor']);

	crudModule.config(['$mdThemingProvider','$mdIconProvider','$routeProvider','$httpProvider','$translateProvider','$mdThemingProvider',function($mdThemingProvider,$mdIconProvider,$routeProvider,$httpProvider,$translateProvider, $mdThemingProvider){
		
		$routeProvider			
		.when('/accion', { templateUrl: 'src/catalogos/accion/views/lista.html',	controller: 'CrudCtrl'})
		.when('/accion/nuevo', {templateUrl: 'src/catalogos/accion/views/nuevo.html',	controller: 'CrudCtrl'})
		.when('/accion/modificar', {templateUrl: 'src/catalogos/accion/views/modificar.html',	controller: 'CrudCtrl'})
		.when('/accion/ver', {templateUrl: 'src/catalogos/accion/views/ver.html',	controller: 'CrudCtrl'})
		
		.when('/alerta', { templateUrl: 'src/catalogos/alerta/views/lista.html',	controller: 'CrudCtrl'})
		.when('/alerta/nuevo', {templateUrl: 'src/catalogos/alerta/views/nuevo.html',	controller: 'CrudCtrl'})
		.when('/alerta/modificar', {templateUrl: 'src/catalogos/alerta/views/modificar.html',	controller: 'CrudCtrl'})
		.when('/alerta/ver', {templateUrl: 'src/catalogos/alerta/views/ver.html',	controller: 'CrudCtrl'})
		
		.when('/clues', { templateUrl: 'src/catalogos/clues/views/lista.html',	controller: 'CrudCtrl'})
		.when('/clues/ver', {templateUrl: 'src/catalogos/clues/views/ver.html',	controller: 'CrudCtrl'})
		
		.when('/cone', { templateUrl: 'src/catalogos/cone/views/lista.html',	controller: 'CrudCtrl'})
		.when('/cone/nuevo', {templateUrl: 'src/catalogos/cone/views/nuevo.html',	controller: 'CrudCtrl'})
		.when('/cone/modificar', {templateUrl: 'src/catalogos/cone/views/modificar.html',	controller: 'CrudCtrl'})
		.when('/cone/ver', {templateUrl: 'src/catalogos/cone/views/ver.html',	controller: 'CrudCtrl'})

		.when('/zona', { templateUrl: 'src/catalogos/zona/views/lista.html',	controller: 'CrudCtrl'})
		.when('/zona/nuevo', {templateUrl: 'src/catalogos/zona/views/nuevo.html',	controller: 'CrudCtrl'})
		.when('/zona/modificar', {templateUrl: 'src/catalogos/zona/views/modificar.html',	controller: 'CrudCtrl'})
		.when('/zona/ver', {templateUrl: 'src/catalogos/zona/views/ver.html',	controller: 'CrudCtrl'})
			
		.when('/lugar-verificacion', { templateUrl: 'src/catalogos/lugarVerificacion/views/lista.html',	controller: 'CrudCtrl'})
		.when('/lugar-verificacion/nuevo', {templateUrl: 'src/catalogos/lugarVerificacion/views/nuevo.html',	controller: 'CrudCtrl'})
		.when('/lugar-verificacion/modificar', {templateUrl: 'src/catalogos/lugarVerificacion/views/modificar.html',	controller: 'CrudCtrl'})
		.when('/lugar-verificacion/ver', {templateUrl: 'src/catalogos/lugarVerificacion/views/ver.html',	controller: 'CrudCtrl'})
		
		.when('/plazo-accion', { templateUrl: 'src/catalogos/plazoAccion/views/lista.html',	controller: 'CrudCtrl'})
		.when('/plazo-accion/nuevo', {templateUrl: 'src/catalogos/plazoAccion/views/nuevo.html',	controller: 'CrudCtrl'})
		.when('/plazo-accion/modificar', {templateUrl: 'src/catalogos/plazoAccion/views/modificar.html',	controller: 'CrudCtrl'})
		.when('/plazo-accion/ver', {templateUrl: 'src/catalogos/plazoAccion/views/ver.html',	controller: 'CrudCtrl'})

		.when('/versionApp', { templateUrl: 'src/catalogos/versionApp/views/lista.html',	controller: 'CrudCtrl'})
		.when('/versionApp/nuevo', {templateUrl: 'src/catalogos/versionApp/views/nuevo.html',	controller: 'VersionAppCtrl'})
		.when('/versionApp/modificar', {templateUrl: 'src/catalogos/versionApp/views/modificar.html',	controller: 'VersionAppCtrl'})
		.when('/versionApp/ver', {templateUrl: 'src/catalogos/versionApp/views/ver.html',	controller: 'CrudCtrl'})
	}]);
})();