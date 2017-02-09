(function(){
	'use strict';
	angular.module('DatoModule')
	.factory('infoUsuario', ['$http', '$rootScope', '$localStorage', 'errorFlash', 'URLS', function ($http, $rootScope, $localStorage, errorFlash, URLS) {	
	{ 
		if(!angular.isUndefined($localStorage.cium.perfil))		
			return $localStorage.cium.perfil.data;
		else return {};
	}
	}])
	
})();