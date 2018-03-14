(function () {
	/**
	 * @ngdoc interface
	 * @name formulario.interface:FormularioModule
	 * @description
	 * Contiene la configuración de las rutas para los formulario.
	 */
	var formModule = angular.module('FormularioModule', ['ngMaterial', 'ngRoute', 'ngStorage', 'ngCookies', 'ngMessages', 'pascalprecht.translate', 'http-auth-interceptor']);

	formModule.config(['$mdThemingProvider', '$mdIconProvider', '$routeProvider', '$httpProvider', '$translateProvider', '$mdThemingProvider', function ($mdThemingProvider, $mdIconProvider, $routeProvider, $httpProvider, $translateProvider, $mdThemingProvider) {

		$routeProvider


			.when('/formulario-dashboard', { templateUrl: 'src/formulario/formulario-dashboard/views/lista.html', controller: 'CrudCtrl' })

			.when('/formulario-indicador', { templateUrl: 'src/formulario/formulario-indicador/views/lista.html', controller: 'CrudCtrl' })
			.when('/formulario-indicador/nuevo', { templateUrl: 'src/formulario/formulario-indicador/views/nuevo.html', controller: 'CrudCtrl' })
			.when('/formulario-indicador/modificar', { templateUrl: 'src/formulario/formulario-indicador/views/modificar.html', controller: 'CrudCtrl' })
			.when('/formulario-indicador/ver', { templateUrl: 'src/formulario/formulario-indicador/views/ver.html', controller: 'CrudCtrl' })

			.when('/formulario-captura', { templateUrl: 'src/formulario/formulario-captura/views/lista.html', controller: 'CrudCtrl' })
			.when('/formulario-captura/nuevo', { templateUrl: 'src/formulario/formulario-captura/views/nuevo.html', controller: 'CrudCtrl' })
			.when('/formulario-captura/modificar', { templateUrl: 'src/formulario/formulario-captura/views/modificar.html', controller: 'CrudCtrl' })
			.when('/formulario-captura/ver', { templateUrl: 'src/formulario/formulario-captura/views/ver.html', controller: 'CrudCtrl' })

	}]);
})();