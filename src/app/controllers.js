(function(){
	'use strict';
    angular.module('App')
        .controller('SigninCtrl', ['$rootScope', '$scope', '$location', '$localStorage','$mdBottomSheet','$translate','$mdSidenav', 'Auth','MENU_PUBLICO','URLS', function ($rootScope, $scope, $location, $localStorage, $mdBottomSheet, $translate, $mdSidenav, Auth,  MENU_PUBLICO,URLS) {
           
            $scope.cargando = false;

    /**
     * @ngdoc method
     * @name App.SigninCtrl#successAuth
     * @methodOf App.SigninCtrl
     *
     * @description
     * Metodo para redireccionar al dashboard     
     */
function successAuth(res) {
    $scope.cargando = false;
    $rootScope.errorSignin = null;
    $location.path("dashboard");
}

    /**
     * @ngdoc method
     * @name App.SigninCtrl#signin
     * @methodOf App.SigninCtrl
     *
     * @description
     * Obtiene el token para hacer peticiones a la api     
     */
$scope.signin = function () {
  var email=$scope.email;
  $localStorage.cium.user_email=email;
    var formData = {
      email: $scope.email,
      password: $scope.password
    };
    $scope.cargando = true;    
    Auth.signin(formData, successAuth, function(){
      $scope.cargando = false;          
    });
};

    /**
     * @ngdoc method
     * @name App.SigninCtrl#logout
     * @methodOf App.SigninCtrl
     *
     * @description
     * Cierra la session y elimina el local storage     
     */
$scope.logout = function () {
    $scope.cargando = false;
    Auth.logout(function () {
  $location.path("signin");
    });
};

$scope.access_token = $localStorage.cium.access_token;
$scope.refresh_token = $localStorage.cium.refresh_token;
$scope.user_email = $localStorage.cium.user_email;

$scope.urlOlvidePassword= URLS.OAUTH_CLIENTE + "/#/recuperar-password";
$scope.urlOAuthInfo= URLS.OAUTH_CLIENTE + "/#/que-es";
$scope.urlObtenerOAuth= URLS.OAUTH_CLIENTE + "/#/signup";

$scope.menuSelected = '';

    /**
     * @ngdoc method
     * @name App.SigninCtrl#ir
     * @methodOf App.SigninCtrl
     *
     * @description
     * Redirecciona a la pagina solicitada     
     */
$scope.ir = function(path){
            $scope.menuSelected = path;
           $location.path(path).search({id: null});
        };

$scope.menuPublico = MENU_PUBLICO;
    /**
     * @ngdoc method
     * @name App.SigninCtrl#mostrarIdiomas
     * @methodOf App.SigninCtrl
     *
     * @description
     * Muestra la seleccion del idioma     
     */
$scope.mostrarIdiomas = function($event){    
    $mdBottomSheet.show({
templateUrl: 'src/app/views/idiomas.html',
controller: 'ListaIdiomasCtrl',
targetEvent: $event
    });
};
  
    /**
     * @ngdoc method
     * @name App.SigninCtrl#toggleMenu
     * @methodOf App.SigninCtrl
     *
     * @description
     * Muestra el menu lateral si la apliación se abre en un dispositivo     
     */
$scope.toggleMenu  = function  () {    
    $mdSidenav('left-publico').toggle();
};
  }])
        .controller('InicioCtrl', ['$rootScope', '$scope', '$location', '$localStorage','$mdBottomSheet','$translate','$mdSidenav','Auth','MENU_PUBLICO','URLS', function ($rootScope, $scope, $location, $localStorage, $mdBottomSheet, $translate, $mdSidenav, Auth,MENU_PUBLICO,URLS) {
            
            $scope.menuSelected = '';
            
            $scope.ir = function(path){
                $scope.menuSelected = path;
                $location.path(path);
            };
            
            $scope.menuPublico = MENU_PUBLICO;
            
            $scope.mostrarIdiomas = function($event){                
                $mdBottomSheet.show({
                  templateUrl: 'src/app/views/idiomas.html',
                  controller: 'ListaIdiomasCtrl',
                  targetEvent: $event
                });
            };
            
            $scope.toggleMenu  = function  () {  
                $mdSidenav('left-publico').toggle();
            };
        }])
        .controller('QueEsCtrl', ['$rootScope', '$scope', '$location', '$localStorage','$mdBottomSheet','$translate','$mdSidenav','Auth','MENU_PUBLICO','URLS', function ($rootScope, $scope, $location, $localStorage, $mdBottomSheet, $translate, $mdSidenav, Auth,MENU_PUBLICO,URLS) {
            
            $scope.menuSelected = '';
            
            $scope.ir = function(path){
                $scope.menuSelected = path;
                $location.path(path);
            };
            
            $scope.menuPublico = MENU_PUBLICO;
            
            $scope.mostrarIdiomas = function($event){                
                $mdBottomSheet.show({
                  templateUrl: 'src/app/views/idiomas.html',
                  controller: 'ListaIdiomasCtrl',
                  targetEvent: $event
                });
            };
            
            $scope.toggleMenu  = function  () {  
                $mdSidenav('left-publico').toggle();
            };
        }])
        .controller('ListaIdiomasCtrl',['$scope','$mdBottomSheet','$translate',function($scope, $mdBottomSheet, $translate){
            
            $scope.items = [
                { codigo: 'es' },
                { codigo: 'en' },
                { codigo: 'ctu-MX' },
              ];
              $scope.idiomaSeleccionado = $translate.use();
              
              $scope.cambiarIdioma = function($index) {
                var clickedItem = $scope.items[$index];
                $translate.use(clickedItem.codigo);
                $mdBottomSheet.hide(clickedItem);
              };
        }])
        .controller('SimplePageCtrl', ['$rootScope', '$scope', '$mdSidenav','$location','$mdBottomSheet','Auth','Menu','UsuarioData', function($rootScope, $scope,$mdSidenav,$location,$mdBottomSheet,Auth, Menu, UsuarioData){
            
            $scope.menuSelected = $location.path();
            $scope.menuIsOpen = false;
            $scope.menu = Menu.getMenu();
            $scope.loggedUser = UsuarioData.getDatosUsuario();
            
            $scope.menuCerrado = !UsuarioData.obtenerEstadoMenu();
            if(!$scope.menuCerrado){
              $scope.menuIsOpen = true;
            }

            $scope.toggleMenu  = function(isSm) {
              if(!$scope.menuCerrado && !isSm){
                $mdSidenav('left').close();
                $scope.menuIsOpen = false;
                $scope.menuCerrado = true;
              }else{
                $mdSidenav('left').toggle();
                $scope.menuIsOpen = $mdSidenav('left').isOpen();
              }
              UsuarioData.guardarEstadoMenu($scope.menuIsOpen);
            };
            
            $scope.mostrarIdiomas = function($event){    
                            
                $mdBottomSheet.show({
                  templateUrl: 'src/app/views/idiomas.html',
                  controller: 'ListaIdiomasCtrl',
                  targetEvent: $event
                });
            };
            
            $scope.logout = function () {
               Auth.logout(function () {
                   $location.path("signin");
               });
            };
            
            $scope.ir = function(path){                
                $scope.menuSelected = path;
                $location.path(path);
            };
    		
    				
    	}]);
})();