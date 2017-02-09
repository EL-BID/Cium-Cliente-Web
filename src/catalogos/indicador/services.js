/**
 * Service stringToNumber
 * 
 * @package    CIUM 
 * @subpackage Service
 * @author     Eliecer Ramirez Esquinca
 * @created    2015-07-20
 */
(function(){
	'use strict';
	/**
	 * Convertir cadenas a numeros en las vistas.
	 */
	angular.module('IndicadorModule')
	.directive('stringToNumber', function() {
		return {
			require: 'ngModel',
			link: function(scope, element, attrs, ngModel) {
				ngModel.$parsers.push(function(value) {
	  			return '' + value;
				});
				ngModel.$formatters.push(function(value) {
					return parseFloat(value, 10);
				});
			}
	  	};
	})
})();