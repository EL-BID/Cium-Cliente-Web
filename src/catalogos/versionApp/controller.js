/**
* @ngdoc object
* @name Catalogos.CriterioCtrl
* @description
* Complemento del controlador CrudCtrl  para tareas especificas en criterios
*/
(function(){
	'use strict';
	angular.module('CrudModule')
	.controller('VersionAppCtrl',
	function($rootScope,   $translate,   $scope,   $mdDialog,   $mdMedia ,  $mdSidenav,  $location,  $mdBottomSheet,   UsuarioData,   Auth,  Menu,   $http,   $window,   $timeout,   $route,   flash,   errorFlash,   listaOpcion,   CrudDataApi,   URLS, TIPOS, UNIDAD_MEDIDA, OPERADOR_LOGICO, OPERADOR_ARITMETICO){
	
	// cambia de color el menu seleccionado
	// cambia de color el menu seleccionado
	$scope.menuSelected = $location.path();
    $scope.menuIsOpen = false;
    $scope.menu = Menu.getMenu();
    $scope.loggedUser = UsuarioData.getDatosUsuario();
    
    $scope.menuCerrado = !UsuarioData.obtenerEstadoMenu();
    if(!$scope.menuCerrado){
      $scope.menuIsOpen = true;
    }

    // muestra el menu para aquellos dispositivos que por su tamaño es oculto
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

	// inicia la inimación de cargando
	$scope.cargando = true;

	// inicializa el modulo ruta y url se le asigna el valor de la página actual
	$scope.ruta="";
    $scope.url=$location.url();

    
	// muestra el templete para cambiar el idioma
	$scope.mostrarIdiomas = function($event){  
	                  
	    $mdBottomSheet.show({
	      templateUrl: 'src/app/views/idiomas.html',
	      controller: 'ListaIdiomasCtrl',
	      targetEvent: $event	
	    });
	};

	// cierra la session para salir del sistema
	$scope.logout = function () {
	   Auth.logout(function () {
	       $location.path("signin");
	   });
	};

	// redirecciona a la página que se le pase como parametro
	$scope.ir = function(path){
	    $scope.menuSelected = path;
	   $location.path(path).search({id: null});
	};

	// evento para el boton nuevo, redirecciona a la vista nuevo
	$scope.nuevo = function()
	{
	    var uri=$scope.url.split('/');

	    uri="/"+uri[1]+"/nuevo";
	    $location.path(uri).search({id: null});
	}

	$scope.showSearch = false;
	$scope.listaTemp={};
	$scope.moduloName=angular.uppercase($location.path().split('/')[1]);
	$scope.mostrarSearch = function(t)
	{
		$scope.showSearch = ! $scope.showSearch;
		if(t==0)
		{
			$scope.listaTemp = $scope.datos;		
		}
		else
		{
			$scope.buscar='';
			$scope.datos = $scope.listaTemp;
		}
	}

   
    // inicializa las rutas para crear los href correspondientes en la vista actual
	$scope.index = function(ruta) 
	{
	  $scope.ruta=ruta;  
	  var uri=$scope.url;

	  if(uri.search("nuevo")==-1)
	  $scope.init();     
	};

	$scope.intento = 0;	
	//Ver. Muestra el detalle del id del recurso
	$scope.ver = function(ruta) 
	{
		$scope.ruta=ruta;
		
		var url=$scope.ruta;
		
		var id=$location.search().id;
		$scope.cargando = true;
		CrudDataApi.ver(url, id, function (data) {
			if(data.status  == '407')
				$window.location="acceso";

			if(data.status==200)
			{
				$scope.id=data.data.id;
				$scope.dato=data.data;										
			}
			else
	        {
	            errorFlash.error(data);
	        }
			$scope.cargando = false;
			},function (e) {
				if($scope.intento<1)
				{
					$scope.ver(ruta);
					$scope.intento++;
				}
				else errorFlash.error(e);
				$scope.cargando = false;
			}
		);  		
	};

	//Modificar. Actualiza el recurso con los datos que envia el usuario
	$scope.modificar = function(id) 
	{    
		var url=$scope.ruta;
		
		var json = $scope.dato;
		
		if(json)
		{
			$scope.cargando = true;
			CrudDataApi.editar(url, id, json, function (data) {
			if(data.status  == '407')
				$window.location="acceso";
		
			if(data.status==200)
			{
				
				flash('success', data.messages);
			}
			else
			{
				errorFlash.error(data);
			}
			$scope.cargando = false;
		},function (e) {
				errorFlash.error(e);
				$scope.cargando = false;
			});    
		}
	};
    
  
	// Guardar
	$scope.guardar = function(form) 
	{
		var url = $scope.ruta;
        
		var json = new FormData();
		angular.forEach($scope.dato,function(value, key){
			if(key == "path"){
				json.append(key, value[0].lfFile);
			}
			else
            	json.append(key, value);
        });
		if(json)
		{
			$scope.cargando = true;
			CrudDataApi.crear(url, json, function (data) {
				if(data.status  == '407')
					$window.location="acceso";

				if(data.status==201)
				{
					$scope.dato = angular.copy($scope.limpio);
					form.$setPristine();
					form.$setUntouched();   
					flash('success', data.messages);
					var uri=$scope.url.split('/');

					uri="/"+uri[1]+"/modificar";

					

					$location.path(uri).search({id: data.data.id});
				}
				else
				{
					errorFlash.error(data);
				}
				$scope.cargando = false;
			},function (e) {
				errorFlash.error(e);
				$scope.cargando = false;
			}); 
		}    
	};
	})
})();