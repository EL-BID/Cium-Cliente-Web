(function() {
    'use strict';
    var dashboardModule = angular.module('DashboardModule', ['ngMaterial', 'ngRoute', 'ngStorage', 'ngCookies', 'ngMessages', 'pascalprecht.translate', 'http-auth-interceptor']);
    dashboardModule.config(['$mdThemingProvider', '$mdIconProvider', '$routeProvider', '$httpProvider', '$translateProvider', function($mdThemingProvider, $mdIconProvider, $routeProvider, $httpProvider, $translateProvider) {

        $routeProvider
            .when('/dashboard', {
                templateUrl: 'src/dashboard/views/lista.html',
                controller: 'DashboardCtrl'
            })
            .when('/dashboard/dash', {
                templateUrl: 'src/dashboard/views/dashboard.html',
                controller: 'DashboardCtrl'
            })

            .when('/dashboard/indicador-recurso', {
                templateUrl: 'src/dashboard/views/dashboard/indicador-recurso.html',
                controller: 'DashboardCtrl'
            })
            .when('/dashboard/indicador-calidad', {
                templateUrl: 'src/dashboard/views/dashboard/indicador-calidad.html',
                controller: 'DashboardCtrl'
            })
            .when('/dashboard/top-recurso', {
                templateUrl: 'src/dashboard/views/dashboard/top-recurso.html',
                controller: 'DashboardCtrl'
            })
            .when('/dashboard/top-calidad', {
                templateUrl: 'src/dashboard/views/dashboard/top-calidad.html',
                controller: 'DashboardCtrl'
            })
            .when('/dashboard/gauge-recurso', {
                templateUrl: 'src/dashboard/views/dashboard/gauge-recurso.html',
                controller: 'DashboardCtrl'
            })
            .when('/dashboard/gauge-calidad', {
                templateUrl: 'src/dashboard/views/dashboard/gauge-calidad.html',
                controller: 'DashboardCtrl'
            })
            .when('/dashboard/cobertura-recurso', {
                templateUrl: 'src/dashboard/views/dashboard/cobertura-recurso.html',
                controller: 'DashboardCtrl'
            })
            .when('/dashboard/cobertura-calidad', {
                templateUrl: 'src/dashboard/views/dashboard/cobertura-calidad.html',
                controller: 'DashboardCtrl'
            })
            .when('/dashboard/criterio-recurso', {
                templateUrl: 'src/dashboard/views/dashboard/criterio-recurso.html',
                controller: 'DashboardCtrl'
            })
            .when('/dashboard/criterio-calidad', {
                templateUrl: 'src/dashboard/views/dashboard/criterio-calidad.html',
                controller: 'DashboardCtrl'
            })
    }]);
})();
