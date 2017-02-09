(function() {
    'use strict';
    angular.module('DashboardModule')
        .factory('EvaluacionShow', ['$http', 'URLS', function($http, URLS) {
            return {

                ver: function(url, id, success, error) {
                    $http.get(URLS.BASE_API + url + '/' + id + '?dashboard=true').success(success).error(error)

                }
            };
        }])
        .service('EvaluacionId', function() {
            var id = null;

            return {
                getId: function() {
                    return id;
                },
                setId: function(val) {
                    id = val;
                }
            };
        });
})();
