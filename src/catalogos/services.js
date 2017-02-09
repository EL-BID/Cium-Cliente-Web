(function(){
	'use strict';
/**
 * @ngdoc service
 * @name Catalogos.service:CrudDataApi
 * @description
 * Contiene los metodos para las peticiones a la api restfull.
 */ 	
	angular.module('CrudModule')
	   .factory('CrudDataApi', ['$http', 'URLS', function ($http, URLS) {
	 return {
		 
/**
* @ngdoc method
* @name Catalogos.CrudDataApi#lista
* @methodOf Catalogos.service:CrudDataApi
*
* @description
* Obtiene la lista de los recursos  
* @example
* CrudDataApi.lista(url, function (data) {},function (e) {} );
* @param {string} url direccion para hacer la peticion
* @param {object} success contiene el data de los resultados 
* @param {object} error contiene el error en caso de fallos
* @returns {json} con los resultados.   
*/		 
	     lista: function (url, success, error) { 
	   $http.get(URLS.BASE_API + url).success(success).error(error)
	     },

/**
* @ngdoc method
* @name Catalogos.CrudDataApi#ver
* @methodOf Catalogos.service:CrudDataApi
*
* @description
* Obtiene los datos de un recurso especificado 
* @example
* CrudDataApi.ver(url, id, function (data) {},function (e) {} );
* @param {string} url direccion para hacer la peticion
* @param {int} id identificador del recurso a recuperar la información
* @param {object} success contiene el data de los resultados 
* @param {object} error contiene el error en caso de fallos
* @returns {json} con los resultados.   
*/		 
			   ver: function (url, id, success, error) {
	   $http.get(URLS.BASE_API + url +'/' + id).success(success).error(error)
	     },
		 
/**
* @ngdoc method
* @name Catalogos.CrudDataApi#crear
* @methodOf Catalogos.service:CrudDataApi
*
* @description
* Envia a la api la peticion para insertar un dato al recurso 
* @example
* CrudDataApi.crear(url, data, function (data) {},function (e) {} );
* @param {string} url direccion para hacer la peticion
* @param {objet} data json con los datos a insertar
* @param {object} success contiene el data de los resultados 
* @param {object} error contiene el error en caso de fallos
* @returns {json} con los resultados.   
*/		 
			   crear: function (url, data, success, error) {
	   $http.post(URLS.BASE_API + url, data).success(success).error(error)
	     },
		 
		 
/**
* @ngdoc method
* @name Catalogos.CrudDataApi#editar
* @methodOf Catalogos.service:CrudDataApi
*
* @description
* Envia a la api la peticion para actualizar un dato especifico del recurso 
* @example
* CrudDataApi.editar(url, data, function (data) {},function (e) {} );
* @param {string} url direccion para hacer la peticion
* @param {int} id identificador del recurso a recuperar la información
* @param {objet} data json con los datos a insertar
* @param {object} success contiene el data de los resultados 
* @param {object} error contiene el error en caso de fallos
* @returns {json} con los resultados.   
*/	
		 
			   editar: function (url, id, data, success, error) {
	   $http.put(URLS.BASE_API + url +'/' + id, data).success(success).error(error)
	     },

/**
* @ngdoc method
* @name Catalogos.CrudDataApi#editar
* @methodOf Catalogos.service:CrudDataApi
*
* @description
* Elimina un dato del recurso especificado 
* @example
* CrudDataApi.eliminar(url, data, function (data) {},function (e) {} );
* @param {string} url direccion para hacer la peticion
* @param {int} id identificador del recurso a recuperar la información
* @param {object} success contiene el data de los resultados 
* @param {object} error contiene el error en caso de fallos
* @returns {json} con los resultados.   
*/	
		 
			   eliminar: function (url, id,  success, error) {
	   $http.delete(URLS.BASE_API + url +'/' + id).success(success).error(error)
	     }
	 };
	   }
	   ]);
})();