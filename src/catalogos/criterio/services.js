/**
 * Service listaOpcion
 * 
 * @package    CIUM 
 * @subpackage Service
 * @author     Eliecer Ramirez Esquinca
 * @created    2015-07-20
 */
(function(){
	'use strict';
	/**
	 * Obtener los datos de la url solicitada, se utiliza para llenar los campos de tipo catalogo.
	 */
	angular.module('CriterioModule')
	.service('Criterios', function () 
	{
	    var criterios = []; 
	    return { 
	    	getCriterios: function () 
	    	{ 
	    		return criterios; 
	    	}, 
	    	setCriterios: function(value) 
	    	{ 
	    		criterios = value; 
	    	} 
	    };
	})
	
})();