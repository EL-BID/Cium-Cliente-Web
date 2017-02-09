/**
* @ngdoc object
* @name Sistema.UsuarioCtrl
* @description
* Complemento del controlador CrudCtrl  para tareas especificas en Usuario
*/
(function(){
	'use strict';
	angular.module('UsuarioModule')
	.controller('UsuarioCtrl',
	       ['$rootScope', '$translate', '$scope', '$localStorage', '$mdSidenav','$location','$mdBottomSheet','Auth','Menu', '$http', '$window', '$timeout', '$route', 'flash', 'errorFlash', 'sisGrupo', 'listaOpcion', 'URLS', 'CrudDataApi', 
	function($rootScope,   $translate,   $scope,   $localStorage,   $mdSidenav,  $location,  $mdBottomSheet,  Auth,  Menu,   $http,   $window,   $timeout,   $route,   flash,   errorFlash,   sisGrupo, listaOpcion, URLS,   CrudDataApi){
		
	
	// cambia de color el menu seleccionado
	$scope.menuSelected = "/"+$location.path().split('/')[1];
	// carga el menu correspondiente para el usuario
	$scope.menu = Menu.getMenu();
	$scope.fecha_actual = new Date();

	// inicia la inimación de cargando
	$scope.cargando = true;

	// inicializa el modulo ruta y url se le asigna el valor de la página actual
	$scope.ruta="";
    $scope.url=$location.url();

    $scope.permisoModificar = $localStorage.cium.menu.indexOf("UsuarioController.update")>=0 ? true : false;
    $scope.permisoEliminar  = $localStorage.cium.menu.indexOf("UsuarioController.destroy")>=0 ? true : false;
    $scope.permisoVer       = $localStorage.cium.menu.indexOf("UsuarioController.show")>=0 ? true : false;
    $scope.permisoAgregar   = $localStorage.cium.menu.indexOf("UsuarioController.store")>=0 ? true : false;

    // cambia los textos del paginado de cada grid
    $scope.paginationLabel = {
      text: $translate.instant('ROWSPERPAGE'),
      of: $translate.instant('DE')
    };

	// Inicializa el campo para busquedas disponibles para cada grid
	$scope.BuscarPor=
	[
		{id:"nombres", nombre:$translate.instant('NOMBRE')},
		{id:"apellidoPaterno", nombre:$translate.instant('APELLIDO_PATERNO')},
		{id:"apellidoMaterno", nombre:$translate.instant('APELLIDO_MATERNO')},
		{id:"cargo", nombre:$translate.instant('CARGO')},
		{id:"email", nombre:$translate.instant('EMAIL')},
		{id:'creadoAl', nombre:$translate.instant('CREADO')},
		{id:'modificadoAl', nombre:$translate.instant('MODIFICADO')}
	];
	    
	// inicia configuración para los data table (grid)
    $scope.selected = [];

    // incializa el modelo para el filtro, ordenamiento y paginación
	$scope.query = {
		filter: '',
		order: 'id',
		limit: 25,
		page: 1
	};

	// Evento para incializar el ordenamiento segun la columna clickeada
	$scope.onOrderChange = function (order) {
		$scope.query.order=order;
		$scope.cargando = true;
		$scope.init(); 
	};

	// Evento para el control del paginado.
	$scope.onPaginationChange = function (page, limit) {
		$scope.paginacion = 
		{
			pag: (page-1)*limit,
			lim: limit,
			paginas:0
		};
		$scope.cargando = true;
		$scope.init();
	};

    //fin data
    $scope.paginacion = 
    {
        pag: 1,
        lim: 25,
        paginas:0
    };
	$scope.datos = [];

	
	$scope.dato = {};
	$scope.permissions=[];
	$scope.modulos=[];
	$scope.grupos=[];
	$scope.acciones=[];
		
	// muestra el menu para aquellos dispositivos que por su tamaño es oculto
	$scope.toggleMenu  = function  () {
	    $mdSidenav('left').toggle();
	};

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
		//usuario
/**
* @ngdoc method
* @name Sistema.UsuarioCtrl#getJurisdiccion
* @methodOf Sistema.UsuarioCtrl
*
* @description
* Obtiene la lista de jurisdicciones
*/			
		$scope.Jurisdiccion = {};
		$scope.Clues = {};
		$scope.getJurisdiccion=function()
		{		
			$http.get(URLS.BASE_API+'/jurisdiccion')
			.success(function(data, status, headers, config) 
			{
				if(data.status  == '407')
					$window.location="acceso";
					
				if(data.status==200)
				{
					$scope.Jurisdiccion = data.data;				
				}
				else
            {
                errorFlash.error(data);
            }
			})
			.error(function(data, status, headers, config) 
			{
				errorFlash.error(data);
			});
		};
		
		$scope.dato.jurisdiccion='';

		
		$scope.cargarClues=function(jurisdiccion)
		{
			$scope.dato.jurisdiccion = jurisdiccion;
			$scope.getClues();
		}

/**
* @ngdoc method
* @name Sistema.UsuarioCtrl#getClues
* @methodOf Sistema.UsuarioCtrl
*
* @description
* Obtiene la lista de clues filtrado o no por jurisdiccion
*/			
		$scope.getClues=function()
		{
			var juris = $scope.dato.jurisdiccion;
			$http.get(URLS.BASE_API+'/Clues?jurisdiccion='+juris)
			.success(function(data, status, headers, config) 
			{
				if(data.status  == '407')
					$window.location="acceso";
					
				if(data.status==200)
				{
					$scope.Clues = data.data.map( function (repo) {
						repo.value = repo.nombre.toLowerCase();
						return repo;
					});
				  	$scope.repos=$scope.Clues;	
				}
				else
            {
                errorFlash.error(data);
            }
			})
			.error(function(data, status, headers, config) 
			{
				errorFlash.error(data);
			});				
		};
/**
* @ngdoc method
* @name Sistema.UsuarioCtrl#CluesChange
* @methodOf Sistema.UsuarioCtrl
*
* @description
* Carga los datos de la ficha para clues
* @param {string} value codigo de la clues
*/			
		$scope.CluesChange = function(value) 
		{ 		
	  		$http.get(URLS.BASE_API+'/Clues/'+value,{valor:''})
			.success(function(data, status, headers, config) 
			{
				if(data.status  == '407')
					$window.location="acceso";
			
				if(data.status==200)
				{
					$scope.dato.idCone = data.data.cone_clues.idCone;
					$scope.dato.nivelCone = data.data.cone.cone.nombre;
	
					$scope.dato.nombre = data.data.nombre;
					$scope.dato.clues = data.data.clues;
					$scope.dato.jurisdiccion = data.data.jurisdiccion;
					$scope.dato.municipio = data.data.municipio;
					$scope.dato.localidad = data.data.localidad;
					$scope.dato.domicilio = data.data.domicilio;
					$scope.dato.codigoPostal = data.data.codigoPostal;					
					$scope.dato.tipoUnidad = data.data.tipoUnidad;
					$scope.dato.tipologia = data.data.tipologia;
				}
				else
            {
                errorFlash.error(data);
            }
	
			})
			.error(function(data, status, headers, config) 
			{
				errorFlash.error(data);
			});
		}; 
		
		//autocomplete
		
	
		// ******************************
		// Internal methods
		// ******************************
		/**
		 * Search for repos... use $timeout to simulate
		 * remote dataservice call.
		 */

/**
* @ngdoc method
* @name Sistema.UsuarioCtrl#querySearch
* @methodOf Sistema.UsuarioCtrl
*
* @description
* Carga los datos para el autocomplete
* @param {string} query valor para hacer la busqueda
*/			 
		$scope.querySearch = function (query) {
			var juris = $scope.dato.jurisdiccion;
			return $http.get(URLS.BASE_API + '/Clues',{ params:{jurisdiccion: juris, termino: query}})
			.then(function(res)
			{
	            return res.data.data;                            
	        });
		}
		
/**
* @ngdoc method
* @name Sistema.UsuarioCtrl#selectedItemChange
* @methodOf Sistema.UsuarioCtrl
*
* @description
* Evento para cuando se selecciona un elemento del autocomplete
* @param {objet} item objeto del elemento
*/			
		$scope.selectedItemChange = function(item) {
			if(!angular.isUndefined(item))
			{
				if(angular.isUndefined(item.clues))
					$scope.CluesUsuario(item.jurisdiccion);
				else
					$scope.CluesUsuario(item.clues);
			}
		}
		/**
		 * Create filter function for a query string
		 */
		function createFilterFor(query) {
		  var lowercaseQuery = angular.lowercase(query);
		  return function filterFn(item) {
			return (item.value.indexOf(lowercaseQuery) === 0);
		  };
		}

/**
* @ngdoc method
* @name Sistema.UsuarioCtrl#cambiarTipo
* @methodOf Sistema.UsuarioCtrl
*
* @description
* Evento para cambiar el llenado del autocomplete por clues o por jurisdicción
* @param {string} tipo valor
*/	
		
		$scope.cambiarTipo = function(tipo)
		{
			if(tipo=="clues")
				$scope.repos = $scope.Clues;
			if(tipo=="jurisdiccion" )
				$scope.repos = $scope.Jurisdiccion;
		}
		//fin autocomplete
		$scope.existeUM=[];
		
		$scope.dato.usuarioclues=[];
/**
* @ngdoc method
* @name Sistema.UsuarioCtrl#CluesUsuario
* @methodOf Sistema.UsuarioCtrl
*
* @description
* Agrega un elemento a la lista si este no existe
* @param {string} value valor
*/		
		$scope.CluesUsuario = function(value) 
		{ 
			if(value!=null)
			{
				    
				$http.get(URLS.BASE_API+'/Clues/'+encodeURIComponent(value),{valor:''})
				.success(function(data, status, headers, config) 
				{
					if(data.status  == '407')
						$window.location="acceso";
				
					if(data.status==200)
					{
						if(data.data.cone=="NADA")
						{
							angular.forEach(data.data, function(item, key) 
							{													
								if($scope.existeUM.indexOf(item.clues)>-1)
									flash('warning', "Ooops! ya existe este elemento en la lista");
								else
								{
									$scope.dato.usuarioclues.push(item);
									$scope.existeUM.push(item.clues);
								}							
							});
						}
						else
						{
							if($scope.existeUM.indexOf(data.data.clues)>-1)
								flash('warning', "Ooops! ya existe este elemento en la lista");
							else
							{
								$scope.dato.usuarioclues.push(data.data);
								$scope.existeUM.push(data.data.clues);
							}
						}
					}
					else
            {
                errorFlash.error(data);
            }
	
				})
				.error(function(data, status, headers, config) 
				{
					errorFlash.error(data);
				});
			}
		}; 
		
/**
* @ngdoc method
* @name Sistema.UsuarioCtrl#CluesUsuarioBorrar
* @methodOf Sistema.UsuarioCtrl
*
* @description
* Quita un elemento a la lista si este existe
* @param {int} $index posicion del elemento en la lista
*/	
		$scope.CluesUsuarioBorrar = function($index)
		{
			$scope.existeUM.splice($index, 1);
			$scope.dato.clues[$index]=null;	
			$scope.dato.usuarioclues.splice($index, 1);			
		};

/**
* @ngdoc method
* @name Catalogos.CriterioCtrl#cargarCatalogo
* @methodOf Catalogos.CriterioCtrl
*
* @description
* Carga los datos como catalago de la url
* @param {string} url url para hacer la petición 
* @param {string} cat nombre del catalogo a crear
*/	
	$scope.indicadores = [];
	$scope.cones = [];
	$scope.lugares = [];
	$scope.cargarCatalogo = function(url, modelo, callback) 
	{	
		listaOpcion.options(url).success(function(data)
		{			
			if(data.status  == '407')
				$window.location="acceso";
				
			if(data.status==200)
			{
				modelo.length = 0;
				angular.forEach(data.data , function(val, key) 
				{
					modelo.push(val);	
				});
				if(!angular.isUndefined(callback))
					callback();
			}
			else
			{
				errorFlash.error(data);
			}
		});
	};
		
/**
* @ngdoc method
* @name Sistema.UsuarioCtrl#permisoGrupo
* @methodOf Sistema.UsuarioCtrl
*
* @description
* Optiene los permisos del grupo
*/	
		$scope.permisoGrupo = function() 
		{
			$scope.permissions=[];
			$scope.modulos=[];
			$scope.grupos=[];
			$scope.acciones=[];
			
			angular.forEach($scope.dato.grupos, function(id, key) 
			{
				sisGrupo.grupo(id,$scope).success(function(data)
				{
					if(data.status  == '407')
						$window.location="acceso";
	
					if(data.status == '200')
					{	
					}
					else
            {
                errorFlash.error(data);
            }
	
				});
					
			});		
		};
/**
* @ngdoc method
* @name Sistema.UsuarioCtrl#permisoEditGrupo
* @methodOf Sistema.UsuarioCtrl
*
* @description
* Muestra la lista de los permisos para el grupo en modo editar
*/			
		$scope.permisoEditGrupo = function() 
		{			
			$scope.permissions=[];
			$scope.modulos=[];
			$scope.grupos=[];
			$scope.acciones=[];
	
			var id=$location.search().id;
	
			$http.get(URLS.BASE_API+"/Usuario/"+id)
			.success(function(data, status, headers, config) 
			{	
				$scope.dato.grupos=[];
	
				if(data.status  == '407')
					$window.location="acceso";
									
				if(data.status == '200')
				{
					$scope.dato.permissions = {};
					for (var key in data.data.permissions) 
					{
						$scope.datos.push(key);
						$scope.dato.permissions[key]=-1;
					}
					
					angular.forEach(data.data.grupos, function(id, key) 
					{
						$scope.dato.grupos.push(id.id);
						sisGrupo.grupo(id.id,$scope).success(function(data)
						{
						});
							
					});	
				}
				else
            {
                errorFlash.error(data);
            }
			});	
		};
/**
* @ngdoc method
* @name Sistema.UsuarioCtrl#permisoGrupoDelete
* @methodOf Sistema.UsuarioCtrl
*
* @description
* Limpia los checkbox para los permisos denegados
*/		
		$scope.permisoGrupoDelete = function() 
		{	
			$scope.dato.permissions={};
		}
		$scope.dato.UsuarioZona=[];
		
/**
* @ngdoc method
* @name Sistema.UsuarioCtrl#limpiarZona
* @methodOf Sistema.UsuarioCtrl
*
* @description
* Limpia los modelos  para la lista de las zonas
*/			
		$scope.limpiarZona = function()
		{
			$scope.dato.UsuarioZona=[];
			$scope.existeUM=[];
			$scope.clues=[];
		}
		
/**
* @ngdoc method
* @name Sistema.UsuarioCtrl#equipoBorrar
* @methodOf Sistema.UsuarioCtrl
*
* @description
* Quita el equipo de la lista
* @param {int} $index posicion del elemento en la lista
*/		
		$scope.equipoBorrar = function($index)
		{
			$scope.existeUM.splice($index, 1);
			$scope.dato.clues[$index]=null;
			$scope.dato.UsuarioZona.splice($index, 1);
		}
/**
* @ngdoc method
* @name Sistema.UsuarioCtrl#addJurisdiccion
* @methodOf Sistema.UsuarioCtrl
*
* @description
* Agrega una jurisdiccion a la lista
* @param {int} id identificador de la jurisdiccion
*/			
		$scope.addJurisdiccion = function(id)
		{
			if($scope.existeUM.indexOf(id)<0 )
			{
				$scope.dato.UsuarioZona.push({id: id ,nombre: id});
			}
			else
				flash('warning', "Ooops! ya existe este elemento en la lista");
		}

/**
* @ngdoc method
* @name Sistema.UsuarioCtrl#addEquipo
* @methodOf Sistema.UsuarioCtrl
*
* @description
* Agrega un equipo a la lista
* @param {int} id identificador del equipo
*/
		
		$scope.addEquipo = function(id)
		{
			var url="/Zona";
			if($scope.existeUM.indexOf(parseInt(id))<0 )
			{
				CrudDataApi.ver(url, id, function (data) {
					if(data.status  == '407')
						$window.location="acceso";

					if(data.status==200)
					{
						$scope.dato.UsuarioZona.push({id: data.data.id,nombre: data.data.nombre});
					}
					else
            {
                errorFlash.error(data);
            }
						$scope.cargando = false;
					},function (e) {
						errorFlash.error(e);
						$scope.cargando = false;
					}
				);
			}
			else
				flash('warning', "Ooops! ya existe este elemento en la lista");
			
		}
/**
* @ngdoc method
* @name Sistema.UsuarioCtrl#getEquipos
* @methodOf Sistema.UsuarioCtrl
*
* @description
* Obtieene la lista de equipos de una jurisdicción
* @param {int} juris identificador de la jurisdiccion
*/
		$scope.getEquipos = function(juris) 
		{			
			var url="/Zona";

			CrudDataApi.lista(url+"?jurisdiccion="+juris, function (data) {
				if(data.status  == '407')
					$window.location="acceso";

				if(data.status==200)
				{
					$scope.equipos=data.data;					
				}
				else
            {
                errorFlash.error(data);
            }
					$scope.cargando = false;
				},function (e) {
					errorFlash.error(e);
					$scope.cargando = false;
				}
			);  		
		};
			// fin permiso
		//export PDF
    $scope.exportar = function()
    {
        $scope.generarExport("pdf");              
    }

    //export EXCEL
    $scope.excel = function()
    {        
         $scope.generarExport("xlsx");     
    }
    $scope.generarExport =  function(tipo)
    {
        $scope.btexcel=true;
        $scope.btexportar=true;

        var url = $scope.ruta;
        var json={tabla:url,tipo:tipo};
        CrudDataApi.crear('/Export', json, function (data) {
            $scope.btexcel=false;
            $scope.btexportar=false;
            $window.open(URLS.BASE+"export."+tipo)
          },function (e) {
            errorFlash.error(e);
            $scope.cargando = false;
            $scope.btexcel=false;
            $scope.btexportar=false;
          }); 
    }
    // inicializa las rutas para crear los href correspondientes en la vista actual
	$scope.index = function(ruta) 
	{
	  $scope.ruta=ruta;  
	  var uri=$scope.url;

	  if(uri.search("nuevo")==-1)
	  $scope.init();     
	};
	
	// obtiene los datos necesarios para crear el grid (listado)// obtiene los datos necesarios para crear el grid (listado)
    $scope.init = function(buscar,columna) 
	{
		var url=$scope.ruta;
		buscar = $scope.buscar;
		var pagina=$scope.paginacion.pag;
		var limite=$scope.paginacion.lim;
	
		var order=$scope.query.order;
	
		if(!angular.isUndefined(buscar))
			limite=limite+"&columna="+columna+"&valor="+buscar+"&buscar=true";


      	CrudDataApi.lista(url+'?pagina=' + pagina + '&limite=' + limite+"&order="+order, function (data) {
        if(data.status  == '407')
        	$window.location="acceso";

      		if(data.status==200)
      		{
    			$scope.datos = data.data;
    			$scope.paginacion.paginas = data.total;
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
    };

    // incia la busqueda con los parametros, columna = campo donde buscar, buscar = valor para la busqueda
	$scope.buscarL = function(buscar,columna) 
	{
	    $scope.cargando = true;
	  	$scope.init(buscar,columna);
	};	
	
	//Ver. Muestra el detalle del id del recurso
	$scope.ver = function(ruta) 
	{
		$scope.ruta=ruta;			
		var url=$scope.ruta;			
		var id=$location.search().id;

		CrudDataApi.ver(url, id, function (data) {
			if(data.status  == '407')
				$window.location="acceso";

			if(data.status==200)
			{
				$scope.id=data.data.id;
				
				var list = data.data.permissions;	
				$scope.dato=data.data;				
				for (var key in list) {
					$scope.datos.push(key);
				}
			}
			else
			{
				errorFlash.error(data);
			}
			$scope.cargando = false;
			},function (e) {
				errorFlash.error(e);
				$scope.cargando = false;
			}
		);  		
	};
	
	//Modificar. Actualiza el recurso con los datos que envia el usuario
	$scope.modificar = function(id) 
	{    
		var url=$scope.ruta;
		var json=$scope.dato;
		
		if(json)
		{
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
		
		
	//Borrar. Elimina el recurso del parametro id
	$scope.borrar = function(id, $index) 
	{    
		var op=1;
		if(angular.isUndefined(id))
		{
			id=$location.search().id;
			op=0;
		}
		if ($window.confirm($translate.instant('CONFIRM_DELETE'))) {   
			var url=$scope.ruta;
            $scope.cargando = true;
			
			CrudDataApi.eliminar(url, id, function (data) {
				if(data.status  == '407')
					$window.location="acceso";
				
				if(data.status==200)
				{
					if(op==1)
					  $scope.datos.splice($index, 1);
					else
					  angular.element('#lista').click();
					flash('success', data.messages);
				
					
					$scope.cargando = false;
				}
				else
				{
					errorFlash.error(data);
				}
				$scope.cargando = false;
				},function (e) {
					errorFlash.error(e);
					$scope.cargando = false;
				}
			); 
		}          
	};
		
	// Guardar
	$scope.guardar = function(form) 
	{
	  
	  var url=$scope.ruta;
	  var json=$scope.dato;
	
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
	};
	}])
})();