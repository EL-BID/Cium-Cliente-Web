/**
* @ngdoc object
* @name Catalogos.CriterioCtrl
* @description
* Complemento del controlador CrudCtrl  para tareas especificas en criterios
*/
(function(){
	'use strict';
	angular.module('CriterioModule')
	.controller('CriterioCtrl',
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
	$scope.fecha_actual = new Date();

	// inicia la inimación de cargando
	$scope.cargando = true;

	// inicializa el modulo ruta y url se le asigna el valor de la página actual
	$scope.ruta="";
    $scope.url=$location.url();

    // cambia los textos del paginado de cada grid
    $scope.paginationLabel = {
      text: $translate.instant('ROWSPERPAGE'),
      of: $translate.instant('DE')
    };
	   
    // Inicializa el campo para busquedas disponibles para cada grid
    $scope.BuscarPor=
    [
		{id:"nombre", nombre:$translate.instant('NOMBRE')},
		{id:'creadoAl', nombre:$translate.instant('CREADO')},
		{id:'modificadoAl', nombre:$translate.instant('MODIFICADO')}
	];
	   
	// inicia configuración para los data table (grid)
    $scope.selected = [];

    // incializa el modelo para el filtro, ordenamiento y paginación
	$scope.query = {
		filter: '',
		order: 'Criterio.id',
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

	$scope.icono=[];
	$scope.criterio = [];
	$scope.criterio.indicador = {};
	
/**
* @ngdoc method
* @name Catalogos.CriterioCtrl#treeClick
* @methodOf Catalogos.CriterioCtrl
*
* @description
* Evento para expandir o colapsar el arbol de criterios por indicador
* @param {property} a id del area donde se genero el evento click  
*/	
	$scope.treeClick =function(a)
	{
		var children = angular.element(document.getElementById(a)).parent('li.parent_li').find('ul').find('li');
		
		if (children.attr("style")=="display: none;") {
			children.attr("style","display: ;");
			angular.element(document.getElementById(a)).attr('title', 'Expandir');
			$scope.icono[a]=true;
		} else {
			children.attr("style","display: none;");
			angular.element(document.getElementById(a)).attr('title', 'Cerrar');
			$scope.icono[a]=false;
		}
	};
	$scope.che=[];
/**
* @ngdoc method
* @name Catalogos.CriterioCtrl#treeClickCheck
* @methodOf Catalogos.CriterioCtrl
*
* @description
* Marca los checkbox al hacer click en cada uno y pinta el indicador al que pertenezca segun la valización
* @param {property} a id del indicador 
* @param {property} b bandera para determinar si tiene datos por defaul 
* @param {property} c id de los hijos del indicador
*/	
	$scope.treeClickCheck =function(a,b,c)
	{
		var cone = null;
		if($scope.criterio.indicador[a].hasOwnProperty("cone"))
			cone = $scope.criterio.indicador[a].cone;
		var lugar = 0;
		if($scope.criterio.indicador[a].hasOwnProperty("lugar"))
			lugar = $scope.criterio.indicador[a].lugar;
	
		if(lugar === null || angular.isUndefined(lugar))
		{
			delete $scope.criterio.indicador[a].lugar;
			lugar = 0;
		}
	
		if(cone === null || angular.isUndefined(cone) || cone.length<1)
		{
			delete $scope.criterio.indicador[a].cone;
			cone = null;
		}
		
		var children = angular.element(document.getElementById(c));
		if(cone==null & lugar==0)
		{				
			delete $scope.criterio.indicador[a];
			children.removeAttr("style");
		}
		else if(cone==null & lugar>0)	
			children.attr("style","background-color: red;");
		else if(cone!=null & lugar<1)	
			children.attr("style","background-color: darkorange;");
		else 
			children.attr("style","background-color: cornflowerblue;");
	
		if(b==-1)
		{
			$scope.che[a]=false;			
		}
		else
		{
			if(!$scope.che[a])
			{				
				$scope.che[a]=true;
			}
			if(b!=0)
			{
				if(!$scope.che[b])
					$scope.che[b]=true;
			}
		}
	};

/**
* @ngdoc method
* @name Catalogos.IndicadorCtrl#agregarAlerta
* @methodOf Catalogos.IndicadorCtrl
*
* @description
* Agrega una linea mas al formulario de alertas
*/	
	$scope.dato = {};
	$scope.dato.validaciones = [];

	$scope.tipos = TIPOS;
	$scope.unidadMedidas = UNIDAD_MEDIDA;
	$scope.operadoresLogicos = OPERADOR_LOGICO;
	$scope.operadoresAritmeticos = OPERADOR_ARITMETICO;
	
	$scope.agregarValidacion = function() 
	{	
		if(angular.isUndefined($scope.dato.criterio_validaciones))
			$scope.dato.criterio_validaciones = [];
		$scope.dato.criterio_validaciones.push({id:''});		
	};

	$scope.limpiarValidacion = function() 
	{
		var scope = $scope;

        var confirm = $mdDialog.confirm()
          .title("Limpiar lista?")
          .textContent("Se eliminara las filas de la lista actual")
          .ariaLabel('Lucky day')
          .ok('Aceptar')
          .cancel('Cancelar');

		$mdDialog.show(confirm).then(function() {
		      scope.dato.criterio_validaciones = [];
		    }, function() {	      
	    });
	};
	$scope.quitarValidacion = function($index) 
	{
		$scope.dato.criterio_validaciones.splice($index, 1);		
	}

	$scope.agregarPregunta = function() 
	{
		var d = new Date();
		var t = d.getTime();	
		if(angular.isUndefined($scope.dato.criterio_preguntas))
			$scope.dato.criterio_preguntas = [];
		$scope.dato.criterio_preguntas.push({id:t, nombre:'', tipo: 'fecha', constante: '', valorConstante: '', fechaSistema: ''});		
	};

	$scope.limpiarPregunta = function() 
	{
		var scope = $scope;

        var confirm = $mdDialog.confirm()
          .title("Limpiar lista?")
          .textContent("Se eliminara las filas de la lista actual")
          .ariaLabel('Lucky day')
          .ok('Aceptar')
          .cancel('Cancelar');

		$mdDialog.show(confirm).then(function() {
		      scope.dato.criterio_preguntas = [];
		      scope.dato.criterio_validaciones = [];
		    }, function() {	      
	    });
	};
	$scope.quitarPregunta = function($index) 
	{
		$scope.dato.criterio_preguntas.splice($index, 1);		
	}

	$scope.bool = [];
	$scope.bool1 = [];
	$scope.bool2 = [];
	$scope.check = [];
	$scope.pregunta1 = function(pregunta1, pregunta2, index){
		angular.forEach($scope.dato.indicador_preguntas, function(item,key){
			if(item.id == pregunta1 || item.id == pregunta2){
				if(item.tipo == "boolean"){
					$scope.check[index] = true;
					$scope.dato.indicador_validaciones[index].operadorLogico = "=";
					$scope.dato.indicador_validaciones[index].operadorAritmetico = "";					
					$scope.dato.indicador_validaciones[index].unidadMedida = "";

					if(item.id == pregunta1){
						$scope.dato.indicador_validaciones[index].pregunta2 = "";
						$scope.bool1[index] = false;
						$scope.bool2[index] = true;
					}
					else{
						$scope.dato.indicador_validaciones[index].pregunta1 = "";
						$scope.bool1[index] = true;
						$scope.bool2[index] = false;
					}

					$scope.bool[index] = true;
				}
				else{
					$scope.bool[index]  = false;
					$scope.bool1[index] = false;
					$scope.bool2[index] = false;
					$scope.check[index] = false;
				}
			}
		});
	}
	$scope.validarTipo = function(){
		angular.forEach($scope.dato.indicador_validaciones, function(i,k){
			angular.forEach($scope.dato.indicador_preguntas, function(item,key){
				if(item.id == i.pregunta1 || item.id == i.pregunta2){
					if(item.tipo == "boolean"){
						$scope.check[k] = true;
						$scope.dato.indicador_validaciones[k].operadorLogico = "=";
						$scope.dato.indicador_validaciones[k].operadorAritmetico = "";						
						$scope.dato.indicador_validaciones[k].unidadMedida = "";
						$scope.bool[k] = true;
						if(item.id == i.pregunta1){
							$scope.dato.indicador_validaciones[k].pregunta2 = "";
							$scope.bool1[k] = false;
							$scope.bool2[k] = true;
						}
						else {
							$scope.dato.indicador_validaciones[k].pregunta1 = "";
							$scope.bool1[k] = true;
							$scope.bool2[k] = false;
						}
					}
					else{
						$scope.check[k] = false;
						$scope.bool[k]  = false;
						$scope.bool1[k] = false;
						$scope.bool2[k] = false;
					}
				}
			});
		});
	}

	/**
	* @ngdoc method
	* @name Catalogo.IndicadorCtrl#probarValidacion
	* @methodOf Catalogo.IndicadorCtrl
	*
	* @description
	* abre la ficha para probar una validacion
	* @param {event} ev evento click
	*/	
	$scope.probarValidacion = function(ev)
	{	 
		// si validacion ok ver donde poner el metodo para crear expediente
		
		var valido = false;
		var exp = $scope.dato.numExpediente;
		var validaciones = $scope.dato.criterio_validaciones;
		
		angular.forEach($scope.dato.criterio_validaciones, function(val,k){
			angular.forEach($scope.dato.criterio_preguntas, function(item,key){
				if(item.id ==  val.pregunta1)
					val.preguntaNombre1 = item;
				if(item.id ==  val.pregunta2)
					val.preguntaNombre2 = item;
			});
		});
		
		if(validaciones){

			var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;
		    $mdDialog.show({
		     	controller: function ($scope, $mdDialog, $mdToast, $filter) {
		     		$scope.validaciones = validaciones;
		     		
		     		angular.forEach($scope.validaciones, function(val,k){
		     			var p1 = val.preguntaNombre1;
		     			var p2 = val.preguntaNombre2;
			     		var temp1 = p1.tipo == 'date' ? new Date() : '';
						var temp2 = p2.tipo == 'date' ? new Date() : '';

			     		p1.pregunta1 = p1.constante == '1' ? p1.fechaSistema == '1' ? temp1 : p1.valorConstante :  temp1;
						p2.pregunta2 = p2.constante == '1' ? p2.fechaSistema == '1' ? temp2 : p2.valorConstante :  temp2;
					});
					$scope.hide = function() {
						$mdDialog.hide();
					};
					$scope.cancel = function() {
						$mdDialog.cancel();
					};
					$scope.validar = function() {
						var valido = false, texto = "", icon = "", color = "", result = 0, malas = 0; 

						var div = [];
					    div["secs"]    = 1000;                          // segundos
					    div["mins"]    = 1000 * 60;						// minutos
					    div["hours"]   = 1000 * 60 * 60;				// horas
					    div["days"]    = 1000 * 60 * 60 * 24;			// dias
					    div["weeks"]   = div["days"] * 7;				// semanas
					    div["months"]  = div["days"] * 30.5;			// meses
					    div["2months"] = div["days"] * (30.5 * 2);		// 2 meses
					    div["3months"] = div["days"] * (30.5 * 3);		// 3 meses
					    div["6months"] = div["days"] * (30.5 * 6);		// 6 meses
					    div["years"]   = (1000 * 60 * 60 * 24) * 365;	// años
                        var respuesta = [];
					    angular.forEach($scope.validaciones, function(val,k){
					    	var p1 = val.preguntaNombre1;
		     				var p2 = val.preguntaNombre2;

						    if(p1.tipo == 'date' && p2.tipo == 'date'){
							    var pregunta1 = $filter('date')(document.querySelector("#pregunta1"+k+" .md-datepicker-input-container input").value, "dd/MM/yyyy");
							    var pregunta2 = $filter('date')(document.querySelector("#pregunta2"+k+" .md-datepicker-input-container input").value, "dd/MM/yyyy");						    						   

								var fecha1 = pregunta1.split("/");
								var fecha2 = pregunta2.split("/");

								var d1 = new Date(fecha1[2], fecha1[1], fecha1[0], 0, 0, 0, 0);
								var d2 = new Date(fecha2[2], fecha2[1], fecha2[0], 0, 0, 0, 0);
								
								var t1 = d1.getTime();
		                		var t2 = d2.getTime();
		                		
		                		if(val.operadorAritmetico == '-')
		                			result = t1 - t2;

		                		if(val.operadorAritmetico == '+')
		                			result = t1 + t2;
		                		
		                		result = parseInt(("" + result).replace("-", "")) / div[val.unidadMedida];
	                		}
                            else if(p1.tipo == 'time'){
                                var date = $filter('date')(new Date(), "dd/MM/yyyy");
                                
                                var fecha1 = date.split("/");
                                
                                var m1 = $filter('date')(p1.pregunta1, "HH:mm");	
                                var m2 = $filter('date')(p2.pregunta2, "HH:mm");	
                                
                                m1 = m1.split(":");							
                                m2 = m2.split(":");
                                
								var d1 = new Date(fecha1[2], fecha1[1], fecha1[0], m1[0], m1[1], 0, 0);
								var d2 = new Date(fecha1[2], fecha1[1], fecha1[0], m2[0], m2[1], 0, 0);
                                
                                var t1 = d1.getTime();
		                		var t2 = d2.getTime();
		                		
		                		if(val.operadorAritmetico == '-')
		                			result = t1 - t2;

		                		if(val.operadorAritmetico == '+')
		                			result = t1 + t2;
		                		
		                		result = parseInt(("" + result).replace("-", "")) / div[val.unidadMedida];
	                		}
                            else if(p1.tipo == 'number'){
                                var pregunta1 = parseFloat(p1.pregunta1);
							    var pregunta2 = parseFloat(p2.pregunta2);
	                			if(val.operadorAritmetico == '-')
		                			result = pregunta1 - pregunta2;

		                		if(val.operadorAritmetico == '+')
		                			result = pregunta1 + pregunta2;
	                		}
	                		else{
                                var pregunta1 = parseInt(p1.pregunta1); 
							    var pregunta2 = parseInt(p2.pregunta2);
	                			if(val.operadorAritmetico == '-')
		                			result = pregunta1 - pregunta2;

		                		if(val.operadorAritmetico == '+')
		                			result = pregunta1 + pregunta2;
	                		}

	                		// operador logico
	                		var bien = false;
                            var vc_o = "";                                                                              
                            vc_o = val.valorComparativo.split("o");
                            respuesta[k] = [];
                            angular.forEach(vc_o, function(valorComparativo, b){                                                            
                                if(val.operadorLogico == ">"){
                                    if(result > valorComparativo){
                                        bien = true;
                                    }
                                    else{
                                        bien = false;
                                    }
                                }

                                else if(val.operadorLogico == "<"){
                                    if(result < valorComparativo){
                                        bien = true;
                                    }
                                    else{
                                        bien = false;
                                    }

                                }

                                else if(val.operadorLogico == "<="){
                                    if(result <= valorComparativo){
                                        bien = true;
                                    }
                                    else{
                                        bien = false;
                                    }
                                }

                                else if(val.operadorLogico == ">="){
                                    if(result >= valorComparativo){
                                        bien = true;
                                    }
                                    else{
                                        bien = false;
                                    }
                                }

                                else if(val.operadorLogico == "="){
                                    if(result == valorComparativo){
                                        bien = true;
                                    }
                                    else{
                                        bien = false;
                                    }
                                }

                                else if(val.operadorLogico == "<>"){
                                    if(result != valorComparativo){
                                        bien = true;
                                    }
                                    else{
                                        bien = false;
                                    }
                                }
                                else{
                                    $mdToast.show(
                                    $mdToast.simple()
                                        .textContent('Error en formula fila '+ (k+1))
                                        .position("bottom right") 
                                        .hideDelay(3000)
                                    );
                                }
                                respuesta[k][b] = bien;
                            })
                            var todobien = 0; var existetrue = false;
                            angular.forEach( respuesta[k], function(ok, c){
                                if(!existetrue){
                                    if(ok){
                                        todobien = 0;
                                        existetrue = true;
                                    }
                                    else
                                        todobien = todobien + 1;
                                }
                            })
                            if(todobien > 0)
                                malas = malas + 1;
	                		var idB = document.getElementById("bien"+k);
	                		var idM = document.getElementById("mal"+k);
	                		document.getElementById("result"+k).innerHTML=result.toFixed(2) + val.operadorLogico + val.valorComparativo + " = " + bien;
	                		if(todobien == 0){
	                			idB.className = idB.className.replace(/ng-hide/g,"");
	                			idM.className += " ng-hide";
	                		}
	                		else{
	                			idB.className += " ng-hide";
	                			idM.className = idM.className.replace(/ng-hide/g,"");	
	                		}
	                			
                		});
                		if(malas == 0)
                			valido = true;

						if(valido){
							texto = "Valido :)";
		    				icon  = "check";
		    				color = "#7BE15E";
						}
						else{
							texto = "No valido :(";
							icon  = "close";
		    				color = "#FF3C3C";
						}
						
						var template = '<md-toast style="margin-top:60px">' +
											'<span flex ><md-icon md-svg-icon="'+icon+'" style="color: '+color+'"></md-icon>&nbsp; '+texto+'</span>'+
											'<md-button ng-click="closeToast()">X</md-button>'+
										'</md-toast>';
					    $mdToast.show({
					        template: template,
					        hideDelay: 3000,
					        parent: document.getElementById("validaciones"),
					        position: "bottom right",
					        controller: function ($scope) {
					        	$scope.closeToast = function() {
									$mdToast.hide();
							  	};
					        }
					    })

					};
				},
		      templateUrl: 'src/catalogos/indicador/views/validaciones.html',
		      parent: angular.element(document.body),
		      targetEvent: ev,
		      clickOutsideToClose:true,
		      fullscreen: useFullScreen,
		      parent: angular.element(document.body)
		    });
		    $scope.$watch(function() {
		      return $mdMedia('xs') || $mdMedia('sm');
		    }, function(wantsFullScreen) {
		      $scope.customFullscreen = (wantsFullScreen === true);
		    });
		}
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
* @name Catalogos.CriterioCtrl#seleccionado
* @methodOf Catalogos.CriterioCtrl
*
* @description
* Marca los indicadores que ya contienen datos
* @param {object} data contiene el json con los datos
*/
	
	$scope.seleccionado = function(data) 
	{
		$scope.criterio.indicador={}; var cone=[];
		
		angular.forEach(data, function(value, key) {					
			angular.forEach(value.cones, function(c, k) {
				cone.push(value.id+','+c.id);		
			});
			
			angular.element(document.getElementById('indicador'+$scope.dato.id+value.id)).attr("style","background-color: cornflowerblue;");
			
			$scope.criterio.indicador[value.id]={lugar:value.lugarVerificacion.id,cone:cone};
	
			cone=[];
		});			
	}
/**
* @ngdoc method
* @name Catalogos.CriterioCtrl#validarIndicador
* @methodOf Catalogos.CriterioCtrl
*
* @description
* Validar que en el indicador exista por lo menos un nivel de cone y el lugar de verificacion para poder ser insertado
*/
	
	$scope.validarIndicador = function() 
	{	
		var bien=true; var cone=0;	
		angular.forEach($scope.criterio.indicador, function(value, key) {					
			angular.forEach(value.cone, function(c, k) {
				cone++;		
			});	
	
			if(!value.hasOwnProperty("lugar")||cone==0)			
				bien=false;
			
		});	
		
		if(!bien)
			flash('danger', "Ooops! Ocurrio un error: Verifique que los indicadores seleccionados esten de color azul");
		return bien;		
	}
	
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

	// obtiene los datos necesarios para crear el grid (listado)
    $scope.init = function(buscar,columna) 
	{
		var url=$scope.ruta;
		buscar = $scope.buscar;
		var pagina=$scope.paginacion.pag;
		var limite=$scope.paginacion.lim;
		
		var order=$scope.query.order;
	
		if(!angular.isUndefined(buscar))
			limite=limite+"&columna="+columna+"&valor="+buscar+"&buscar=true";

		$scope.cargando = true;
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

				$scope.criterio=data.data;	
				setTimeout(function()
				{
					$scope.seleccionado(data.data.indicadores);
				},500);							
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
		
		var json={};
		json.nombre=$scope.dato.nombre;
        json.orden=$scope.dato.orden;	
		json.criterio_validaciones=$scope.dato.criterio_validaciones;
		json.criterio_preguntas=$scope.dato.criterio_preguntas;
		json.habilitarNoAplica=$scope.dato.habilitarNoAplica;					
		json.indicadores = $scope.getIndicadores($scope.criterio.indicador);
		
		if(!$scope.validarIndicador())
		{
			json=false;
		}
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
    
    //Modificar orden desde lista
    $scope.actualizarOrden = function(id, orden, nombre){
        $scope.cargando = true;
        var json = {};
        json.id= id;
        json.orden = orden;
        json.nombre = nombre;
        CrudDataApi.crear("/CriterioOrden", json, function (data) {
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
	
/**
* @ngdoc method
* @name Catalogos.CriterioCtrl#getIndicadores
* @methodOf Catalogos.CriterioCtrl
*
* @description
* Formatea los datos del arbol para poder ser enviados a la api y esta pueda interpretarla
* @param {object} valores contiene el json con los datos del arbol
*/	
	$scope.getIndicadores = function(valores)
	{
		var indicadores = []; var i = 0;
		angular.forEach(valores, function(value, key) {
			var cones = [] ;
			angular.forEach(value["cone"], function(val, k) {
				var valor = val.split(",");	
				cones.push({"id": valor[1]});
			});
			indicadores.push({"id": key, "idLugarVerificacion": value["lugar"], "cones": cones});
		});
		return indicadores;
	}
	
	// Guardar
	$scope.guardar = function(form) 
	{
		
		var url=$scope.ruta;
		var json={};
		json.nombre=$scope.dato.nombre;	
        json.orden=$scope.dato.orden;	
		json.criterio_validaciones=$scope.dato.criterio_validaciones;
		json.criterio_preguntas=$scope.dato.criterio_preguntas;
		json.habilitarNoAplica=$scope.dato.habilitarNoAplica;				
		json.indicadores = $scope.getIndicadores($scope.criterio.indicador);
		
		if($scope.validarIndicador())
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

	//Borrar. Elimina el recurso del parametro id
	$scope.borrar = function(id, index) {
		var scope = $scope;

        var confirm = $mdDialog.confirm()
          .title($translate.instant('CONFIRM_DELETE'))
          .textContent($translate.instant('CONFIRM_DELETE_TEXT'))
          .ariaLabel('Lucky day')
          .ok('Aceptar')
          .cancel('Cancelar');

		$mdDialog.show(confirm).then(function() {
	      scope.eliminar(id, index);
	    }, function() {
	      
	    });
		
	};

	//Borrar. Elimina el calidad del parametro id
	$scope.eliminar = function(id, $index) 
	{    
		var op=1;
		if(angular.isUndefined(id))
		{
			id=$location.search().id;
			op=0;
		}
		   
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
		        
	};
	})
})();