(function(){
	'use strict'
	
	var app = angular.module('App', 
								[
									'ngMaterial',
									'ngRoute',
									'ngStorage',
									'ngCookies',
									'ngResource',
									'ngMessages',
									'pascalprecht.translate',
									'http-auth-interceptor',
									'md.data.table',									
									'ngAnimate', 
									'ngSanitize', 
									'flash', 
									'checklist-model',
									'angular.filter',
									'FBAngular',
									'tc.chartjs',
									'ngRadialGauge',
									'lfNgMdFileInput',
									'CrudModule',
									'CriterioModule',
									'IndicadorModule',
									'UsuarioModule',
									'RecursoModule',
									'CalidadModule',
									'DashboardModule',
									'DatoModule',
									'HallazgoModule',
									'FormularioModule',
									'DashboardModule',
									'UsuariosModule',
									'RolesModule']);
/**
 * @ngdoc service
 * @name App.service:config
 * @description
 * Contiene la configuración general del proyecto, precarga los iconos y el tema de material desing, ademas crea las rutas publicas.
 */ 
	app.config(['$mdDateLocaleProvider', '$mdThemingProvider','$mdIconProvider','$routeProvider','$httpProvider','$translateProvider',function($mdDateLocaleProvider, $mdThemingProvider,$mdIconProvider,$routeProvider,$httpProvider,$translateProvider){
		$mdDateLocaleProvider.months = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
		$mdDateLocaleProvider.shortMonths = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
		$mdDateLocaleProvider.days = ['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'];
		$mdDateLocaleProvider.shortDays = ['Dom','Lun','Mar','Mie','Jue','Vie','Sab'];
		// Can change week display to start on Monday.
		$mdDateLocaleProvider.firstDayOfWeek = 0;

		// Configuramos iconos
		$mdIconProvider
		  .defaultIconSet('assets/svg//mdi.svg')		  
		  
		  .icon("avatars", "assets/svg/avatars.svg", 48)
		  .icon("logo", "assets/svg/cium.svg", 48)
		  .icon("logo-white", "assets/svg/cium_white.svg", 48)
		  .icon("salud-id", "assets/svg/salud_id_white.svg", 48)
		  .icon("salud-id-alt", "assets/svg/salud_id_alt.svg", 48)
		  .icon("ssa", "assets/svg/secretaria_salud.svg", 128)
		  .icon("marca", "assets/svg/chiapas_nos_une.svg", 128)
		  .icon("escudo-chiapas-h", "assets/svg/escudo_chiapas_h.svg", 128)
		  
		  .icon("syringe-filled", "assets/svg/syringe_filled.svg", 128)
		  .icon("hearts-filled", "assets/svg/hearts_filled.svg", 128)
		  .icon("diabetes-filled", "assets/svg/diabetes_filled.svg", 128)
		  .icon("coronavirus-filled", "assets/svg/coronavirus_filled.svg", 128)
		  ;
		
		// Configuramos tema de material design
		$mdThemingProvider.theme('default')
	          	.primaryPalette('blue')
	          	.accentPalette('red');
	    $mdThemingProvider.theme('userInfoTheme')
	    		.primaryPalette('teal')
	    		.accentPalette('blue-grey')
	    		.backgroundPalette('blue-grey');
	    $mdThemingProvider.theme('dashboardTheme')
	        	.primaryPalette('deep-orange')
	        	.accentPalette('orange');
	    $mdThemingProvider.theme('altThemeg')
	    		.primaryPalette('green')
	    		.accentPalette('light-green');
	    $mdThemingProvider.theme('altTheme')
	    		.primaryPalette('grey',{'default':'200'})
	    		.accentPalette('orange');
			  
		// Configuramos las rutas
		
		$routeProvider.when('/',{
			templateUrl: 'src/app/views/inicio.html',
			controller: 'InicioCtrl',
		})
		.when('/que-es',{
			templateUrl: 'src/app/views/que-es.html',
			controller: 'QueEsCtrl',
		})
		.when('/signin',{
			templateUrl: 'src/app/views/signin.html',
			controller: 'SigninCtrl',
		})
		.when('/acceso-denegado',{
			templateUrl: 'src/app/views/forbidden.html',
			controller: 'SimplePageCtrl',
		})
		.when('/no-encontrado',{
			templateUrl: 'src/app/views/not-found.html',
			controller: 'SimplePageCtrl',
		})		
		.when('/acerca-de',{
			templateUrl: 'src/app/views/acerca-de.html',
			controller: 'SimplePageCtrl',
		})
		.when('/manual-usuario',{
			templateUrl: 'src/app/views/manual-usuario.html',
			controller: 'DashboardCtrl',
		})
		.when('/manual-web',{
			templateUrl: 'src/app/views/manual-web.html',
			controller: 'DashboardCtrl',
		})
		.otherwise({ redirectTo: '/dashboard' });
		
		$httpProvider.interceptors.push(['$q', '$location', '$localStorage', function ($q, $location, $localStorage) {
			if(angular.isUndefined($localStorage.cium))
			$localStorage.cium = {};
			
		   return {
					'request': function (config) {
						config.headers = config.headers || {};
						if ($localStorage.cium.access_token) {					   
							config.headers = {
									Authorization: 'Bearer ' + $localStorage.cium.access_token,
									"X-Usuario": $localStorage.cium.user_email
								};
						}
						return config;
					},
					'responseError': function (response) {				 
					if (response.status === 401 || response.status === 403) {
						if(response.data.status == 403)
							$location.path('acceso-denegado');
						else
							$location.path('signin');
					}
					return $q.reject(response);
				}
		   };
		   
		}]);
		
		$translateProvider.useStaticFilesLoader({
			prefix:'src/app/i18n/',
			suffix: '.json'
		});
		
		$translateProvider.useLocalStorage();
		$translateProvider.preferredLanguage('es');
		$translateProvider.useSanitizeValueStrategy('escaped');		
	}]);
	
	app.run(['$rootScope', '$window', '$location','$localStorage','$injector', '$mdToast', 'authService','Menu',
		function($rootScope, $window, $location, $localStorage, $injector, $mdToast, authService,Menu){
			$rootScope.online = navigator.onLine;
			
			$window.addEventListener("offline", function () {				
				$mdToast.show({
			        template: '<md-toast > <span flex ><md-icon md-svg-icon="wifi-off" style="color:#FFF"></md-icon> {{ "SIN_CONEXION" | translate}}</span> <md-button ng-click="closeToast()">X</md-button> </md-toast>',
			        hideDelay: 3000,
			        position: "bottom left",
			        controller: function ($scope) {
			        	$scope.closeToast = function() {
							$mdToast.hide();
					  	};
			        }
			    })						
				
			}, false);

			$rootScope.$on('event:auth-loginRequired', function() {
				
				if($localStorage.cium.access_token){
					var Auth = $injector.get('Auth');
		      		
						Auth.refreshToken({ refresh_token: $localStorage.cium.refresh_token },
						   function(res){
								$localStorage.cium.access_token = res.access_token;
						  		$localStorage.cium.refresh_token = res.refresh_token;
								authService.loginConfirmed();
						   }, function (e) {                  
						       
						   		$rootScope.error = "CONNECTION_REFUSED";
								Auth.logout(function () {
						       	$location.path("/");
						   });
						       
						});
				}else{
					
					// Dejamos que pase la peticion porque ni siquiera hay un access_token
					authService.loginConfirmed();
				}
				
		    });
		
		$rootScope.$on('$routeChangeStart',function(event, next, current){
			if($localStorage.cium.access_token){
				if(typeof next.$$route !== 'undefined'){					
					var path =  next.$$route.originalPath.split('/');
					// Aquí deberiamos comprobar permisos para acciones de "subrutas"
					
					if(!Menu.existePath("/"+path[1]) && "/"+path[1] != '/acerca-de' && "/"+path[1] != '/acceso-denegado' && "/"+path[1] != '/no-encontrado' && "/"+path[1] != '/manual-usuario' && "/"+path[1] != '/manual-web'  ){
						$location.path('/dashboard');
					}					
				}				
			}else{
				if(typeof next.$$route !== 'undefined'){
					if(next.$$route.originalPath != '/signin' && next.$$route.originalPath != '/que-es' && next.$$route.originalPath != '/'){
						$location.path('/');	
					}	
				}else{
					$location.path('/')
				}			
			}
		});
	}]);

})();