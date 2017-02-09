(function (root, factory) {
    if (typeof module !== 'undefined' && module.exports) {
        // CommonJS
        module.exports = factory(root, require('angular'));
    } else if (typeof define === 'function' && define.amd) {
        // AMD
        define(['angular'], function (react, angular) {
            return (root.angularFlash = factory(root, angular));
        });
    } else {
        // Global Variables
        root.angularFlash = factory(root, root.angular);
    }
}(this, function (window, angular) {
  return angular.module('flash', [])
    .factory('flash', ['$rootScope', '$timeout', '$mdToast', function($rootScope, $timeout, $mdToast) {
   
      var messages = [];
	  var ver=false;
	  var verHtml=false;
	 

      var emit = function() {		  
	    var template=''; var toast=[];
		angular.forEach(messages, function(m, k) {
		  var color= m.level == 'success' ? '#7BE15E' : m.level == 'danger' ? '#FF3C3C' : m.level== 'info' ? '#3198FF' : '#FFFF1C';
		  var icon = m.level == 'success' ? 'check'   : m.level == 'danger' ? 'close'   : m.level== 'information-outline' ? 'info' : 'alert';
		  var posicion = m.x+" "+m.y;
		  var tiempo   = m.t;
		  var template='<md-toast style="margin-top:60px">' +
				'<span flex ><md-icon md-svg-icon="'+icon+'" style="color: '+color+'"></md-icon>&nbsp; '+m.text+'.</span>'+
				'<md-button ng-click="closeToast()">X</md-button>'+
			'</md-toast>';
			
				
				toast[k]={
				  controller: 'ToastCtrl',
				  template: template,
				  hideDelay: tiempo,
				  position: posicion
				};
				
			
		});$mdToast.show(toast[0]).then(function() {
			   $mdToast.show(toast[1]);
			});
						
      };

      //$rootScope.$on('$locationChangeSuccess', emit);

      var asMessage = function(level, text) {
        if (!text) {
          text = level;
          level = 'success';
        }
        return { level: level, text: text };
      };

      var asArrayOfMessages = function(level, text, x, y, t) {		  
        if (level instanceof Array) return level.map(function(message) {
			
          return message.text ? message : asMessage(message);
        });
        return text ? [{ level: level, text: text, x: x, y: y, t: t }] : [asMessage(level)];
		
      };
	 
      var flash = function(level, text, x, y, t) {
		
	  	if(angular.isUndefined(x))
			x="right";
		if(angular.isUndefined(y))
			y="top";
		if(angular.isUndefined(t))
			t="4000";
		
        emit(messages = asArrayOfMessages(level, text, x, y, t));
		
      };
	  
	  ['error', 'danger', 'warning', 'info', 'success'].forEach(function (level) {
		 
		flash[level] = function (text) { flash(level, text); };
	  });
	  
	  
      return flash;
    }])

}));

angular.module('flash').controller('ToastCtrl', function($scope, $mdToast) {
  $scope.closeToast = function() {
	  $mdToast.hide();
  };
});