/**
 * @ngdoc object
 * @name Transaccion.HallazgoCtrl
 * @description
 * Complemento del controlador CrudCtrl  para tareas especificas en Hallazgo
 */
(function() {
    'use strict';
    angular.module('HallazgoModule')
        .controller('HallazgoCtrl', ['$rootScope', '$scope', '$translate', '$mdDialog', '$mdSidenav', '$localStorage', '$mdUtil', '$log', '$location', '$mdBottomSheet', 'UsuarioData', 'Auth', 'Menu', '$http', '$window', '$timeout', '$filter', '$route', 'flash', 'errorFlash', 'CrudDataApi', 'URLS',
            function($rootScope, $scope, $translate, $mdDialog, $mdSidenav, $localStorage, $mdUtil, $log, $location, $mdBottomSheet, UsuarioData, Auth, Menu, $http, $window, $timeout, $filter, $route, flash, errorFlash, CrudDataApi, URLS) {

                // cambia de color el menu seleccionado
                // cambia de color el menu seleccionado
                $scope.menuSelected = $location.path();
                $scope.menuIsOpen = false;
                $scope.menu = Menu.getMenu();
                $scope.loggedUser = UsuarioData.getDatosUsuario();

                $scope.data = [];
                $scope.pedirdatosde = 'PROBLEMAS';
                $scope.cambiofiltro = false;
                $scope.menuCerrado = !UsuarioData.obtenerEstadoMenu();
                if (!$scope.menuCerrado) {
                    $scope.menuIsOpen = true;
                }

                // muestra el menu para aquellos dispositivos que por su tamaño es oculto
                $scope.toggleMenu = function(isSm) {
                    if (!$scope.menuCerrado && !isSm) {
                        $mdSidenav('left').close();
                        $scope.menuIsOpen = false;
                        $scope.menuCerrado = true;
                    } else {
                        $mdSidenav('left').toggle();
                        $scope.menuIsOpen = $mdSidenav('left').isOpen();
                    }
                    UsuarioData.guardarEstadoMenu($scope.menuIsOpen);
                };
                $scope.fecha_actual = new Date();

                // inicia la inimación de cargando
                $scope.cargando = true;
                $scope.agrupado = true;
                $scope.abriIndicado = [];
                // inicializa el modulo ruta y url se le asigna el valor de la página actual
                $scope.ruta = "";
                $scope.url = $location.url();

                // cambia los textos del paginado de cada grid
                $scope.paginationLabel = {
                    text: $translate.instant('ROWSPERPAGE'),
                    of: $translate.instant('DE')
                };

                // Inicializa el campo para busquedas disponibles para cada grid
                $scope.BuscarPor = [
                    { id: "nombre", nombre: $translate.instant('NOMBRE') },
                    { id: 'creadoAl', nombre: $translate.instant('CREADO') },
                    { id: 'modificadoAl', nombre: $translate.instant('MODIFICADO') }
                ];

                // inicia configuración para los data table (grid)
                $scope.selected = [];

                // incializa el modelo para el filtro, ordenamiento y paginación
                $scope.query = {
                    filter: '',
                    order: 'id',
                    limit: 15,
                    page: 1
                };

                // Evento para incializar el ordenamiento segun la columna clickeada
                $scope.onOrderChange = function(order) {
                    $scope.query.order = order;
                    $scope.cargando = true;
                    $scope.init();
                };

                // Evento para el control del paginado.
                $scope.onPaginationChange = function(page, limit) {
                    $scope.paginacion = {
                        pag: (page - 1) * limit,
                        lim: limit,
                        paginas: 0
                    };
                    $scope.cargando = true;
                    $scope.init();
                };

                //fin data
                $scope.paginacion = {
                    pag: 1,
                    lim: 15,
                    paginas: 0
                };
                $scope.datos = [];


                // muestra el templete para cambiar el idioma
                $scope.mostrarIdiomas = function($event) {

                    $mdBottomSheet.show({
                        templateUrl: 'src/app/views/idiomas.html',
                        controller: 'ListaIdiomasCtrl',
                        targetEvent: $event
                    });
                };

                // cierra la session para salir del sistema
                $scope.logout = function() {
                    Auth.logout(function() {
                        $location.path("signin");
                    });
                };

                // redirecciona a la página que se le pase como parametro
                $scope.ir = function(path) {
                    $scope.menuSelected = path;
                    $location.path(path).search({ id: null });
                };

                // evento para el boton nuevo, redirecciona a la vista nuevo
                $scope.nuevo = function() {
                    var uri = $scope.url.split('/');

                    uri = "/" + uri[1] + "/nuevo";
                    $location.path(uri).search({ id: null });
                }
                $scope.showSearch = false;
                $scope.listaTemp = {};
                $scope.moduloName = angular.uppercase($location.path().split('/')[1]);
                $scope.mostrarSearch = function(t) {
                    $scope.showSearch = !$scope.showSearch;
                    if (t == 0) {
                        $scope.listaTemp = $scope.datos;
                    } else {
                        $scope.buscar = '';
                        $scope.datos = $scope.listaTemp;
                    }
                }

                var d = new Date();
                $scope.filtro = {};
                $scope.filtro.historial = false;
                $scope.filtro.indicador = [];
                $scope.filtro.visualizar = 'tiempo';
                $scope.filtro.anio = d.getFullYear();
                $scope.filtro.um = {};
                $scope.filtro.um.tipo = 'municipio';
                $scope.filtro.clues = [];
                $scope.mostrarCategoria = [];
                $scope.filtro.verTodosIndicadores = true;
                $scope.filtro.verTodosUM = true;
                $scope.filtro.verTodosClues = true;
                $scope.chipIndicador = [];
                $scope.filtros = {};
                $scope.filtros.activo = false;
                $scope.verInfo = false;

                $scope.cargarUM = true;
                $scope.cargarP = true;

                $scope.toggleRight = buildToggler('filtro');
                $scope.toggleRightIndicadores = buildToggler('indicadores');
                /**
                 * @ngdoc method
                 * @name Transaccion.HallazgoCtrl#buildToggler
                 * @methodOf Transaccion.HallazgoCtrl
                 *
                 * @description
                 * Crea un sidenav con las opciones de filtrado
                 * @param {string} navID identificador del sidenav
                 */
                $scope.cargarFiltro = 0;

                function buildToggler(navID) {
                    var debounceFn = $mdUtil.debounce(function() {
                        $mdSidenav(navID)
                            .toggle()
                            .then(function() {
                                if ($scope.cargarFiltro < 1) {
                                    $scope.getDimension('anio', 0);
                                    $scope.getDimension('month', 1);
                                    $scope.getDimension("codigo,indicador,color, 'Recurso' as categoriaEvaluacion", 2);
                                    $scope.getDimension('jurisdiccion', 3);
                                    $scope.getDimension('municipio', 4);
                                    $scope.getDimension('zona', 5);
                                    $scope.getDimension('cone', 6);
                                    $scope.cargarFiltro++;
                                }
                            });
                    }, 200);
                    return debounceFn;
                };
                /**
                 * @ngdoc method
                 * @name Transaccion.HallazgoCtrl#cambiarAnio
                 * @methodOf Transaccion.HallazgoCtrl
                 *
                 * @description
                 * Evento change para el filtro año
                 */

                $scope.cambiarAnio = function(anio) {  
                	$scope.filtro.anio = anio;              	
                    $scope.getDimension('month', 1);
                    $scope.getDimension("codigo,indicador,color, '" + $scope.filtro.tipo + "' as categoriaEvaluacion", 2);
                    $scope.getDimension('jurisdiccion', 3);
                    $scope.getDimension('municipio', 4);
                    $scope.getDimension('zona', 5);
                    $scope.getDimension('cone', 6);	                
                }
                /**
                 * @ngdoc method
                 * @name Transaccion.HallazgoCtrl#cambiarBimestre
                 * @methodOf Transaccion.HallazgoCtrl
                 *
                 * @description
                 * Evento change para el filtro bimestre
                 */
                $scope.cambiarBimestre = function(bimestre) {
                	$scope.filtro.bimestre = bimestre;
                    $scope.getDimension("codigo,indicador,color, '" + $scope.filtro.tipo + "' as categoriaEvaluacion", 2);
                    $scope.getDimension('jurisdiccion', 3);
                    $scope.getDimension('municipio', 4);
                    $scope.getDimension('zona', 5);
                    $scope.getDimension('cone', 6);
                }
                /**
                 * @ngdoc method
                 * @name Transaccion.HallazgoCtrl#getDimension
                 * @methodOf Transaccion.HallazgoCtrl
                 *
                 * @description
                 * Cargar las opciones de filtrado por nivel
                 * @param {string} nivel nivel a extraer de la base de datos
                 * @param {int} c posicion para almacenar la información en el modelo datos
                 */
                $scope.intentoOpcion = 0;
                $scope.getDimension = function(nivel, c) {
                    $scope.opcion = true;
                    var hacer = true;
                    if(c > 0){                    	
                    	if($scope.datos.length == 0 || $scope.filtro.anio == '') 
                    		hacer = false;
                    }
                    if(hacer){
	                    CrudDataApi.lista('/hallazgoDimension?filtro=' + JSON.stringify($scope.filtro) + '&nivel=' + nivel, function(data) {
	                        $scope.datos[c] = data.data;
	                        $scope.opcion = false;
	                    }, function(e) {
	                        if ($scope.intentoOpcion < 1) {
	                            $scope.getDimension(nivel, c);
	                            $scope.intentoOpcion++;
	                        }
	                        $scope.opcion = false;
	                    });
                	}
                };
                /**
                 * @ngdoc method
                 * @name Transaccion.HallazgoCtrl#toggle
                 * @methodOf Transaccion.HallazgoCtrl
                 *
                 * @description
                 * Agrega un dato a un modelo tipo array
                 * @param {string} item valor a insertar
                 * @param {model} list modelo 
                 */
                $scope.tempIndicador = [];
                $scope.toggle = function(item, list) {
                    var idx = list.indexOf(item.codigo);
                    if (idx > -1)
                        list.splice(idx, 1);
                    else {
                        list.push(item.codigo);
                        $scope.chipIndicador[item.codigo] = item;
                    }
                };
                /**
                 * @ngdoc method
                 * @name Transaccion.HallazgoCtrl#exists
                 * @methodOf Transaccion.HallazgoCtrl
                 *
                 * @description
                 * Comrpueba que el item no exista en el modelo
                 * @param {string} item valor a insertar
                 * @param {model} list modelo 
                 */
                $scope.exists = function(item, list) {
                    return list.indexOf(item) > -1;
                };
                /**
                 * @ngdoc method
                 * @name Transaccion.HallazgoCtrl#cambiarVerTodoIndicador
                 * @methodOf Transaccion.HallazgoCtrl
                 *
                 * @description
                 * Mostrar u ocultar la lista de indicadores agrupado por categoria
                 */
                $scope.cambiarVerTodoIndicador = function() {
                        if ($scope.filtro.verTodosIndicadores) {
                            $scope.filtro.indicador = [];
                            $scope.chipIndicador = [];
                            $scope.tempIndicador = [];
                        }
                    }
                    /**
                     * @ngdoc method
                     * @name Transaccion.HallazgoCtrl#cambiarVerTodoUM
                     * @methodOf Transaccion.HallazgoCtrl
                     *
                     * @description
                     * Mostrar u ocultar las opciones de filtrado por parametros
                     */
                $scope.cambiarVerTodoUM = function() {
                        if ($scope.filtro.verTodosUM)
                            $scope.filtro.um = [];
                    }
                    /**
                     * @ngdoc method
                     * @name Transaccion.HallazgoCtrl#aplicarFiltro
                     * @methodOf Transaccion.HallazgoCtrl
                     *
                     * @description
                     * Accion para procesar el filtro en la base de datos
                     * @param {bool} avanzado compprueba si el filtro es avanzado o de la lista de indicadores activos
                     * @param {string} item compsolo tiene un datorueba si indicadores es un array o  
                     */
                $scope.tipo = 'CALIDAD';
                $scope.aplicarFiltro = function(avanzado, item, key) {
                    $scope.filtros.activo = true;
                    if (key == "" || angular.isUndefined(key))
                        key = 'CALIDAD';
                    $scope.tipo = key;
                    $scope.filtro.indicador = $scope.tempIndicador;
                    if (!avanzado) {
                        $scope.filtro.indicador = [];
                        $scope.filtro.verTodosIndicadores = false;
                        if ($scope.filtro.indicador.indexOf(item.codigo) == -1) {
                            $scope.filtro.indicador.push(item.codigo);
                            $scope.chipIndicador[item.codigo] = item;
                        }
                        $mdSidenav('filtro').close();
                    }

                    $scope.cambiofiltro = true;
                    if($scope.pedirdatosde == 'UNIDADES')
                    	$scope.init();
                    if($scope.pedirdatosde == 'PROBLEMAS')
                    	$scope.getCriterios();
                };
                /**
                 * @ngdoc method
                 * @name Transaccion.HallazgoCtrl#quitarFiltro
                 * @methodOf Transaccion.HallazgoCtrl
                 *
                 * @description
                 * Accion para quitar el filtro en la base de datos
                 * @param {bool} avanzado compprueba si el filtro es avanzado o de la lista de indicadores activos 
                 */
                $scope.quitarFiltro = function(avanzado) {
                    $scope.filtro.indicador = [];
                    $scope.filtro.um = {};
                    $scope.filtro.verTodosIndicadores = true;
                    $scope.filtro.verTodosUM = true;
                    $scope.filtros.activo = false;
                    if($scope.pedirdatosde == 'UNIDADES')
                    	$scope.init();
                    if($scope.pedirdatosde == 'PROBLEMAS')
                    	$scope.getCriterios();
                };
                $scope.historyBack = function() {
                    $scope.filtro.nivel = 2;
                    $scope.filtro.tipo = $scope.tipo;
                    $localStorage.cium.filtro = $scope.filtro;
                    window.history.back();
                }
                /**
                 * @ngdoc method
                 * @name Transaccion.HallazgoCtrl#history
                 * @methodOf Transaccion.HallazgoCtrl
                 *
                 * @description
                 * Accion para extraer los datos por filtro actual o por historico
                 */
                $scope.history = function() {
                    if($scope.pedirdatosde == 'UNIDADES')
                    	$scope.init();
                    if($scope.pedirdatosde == 'PROBLEMAS')
                    	$scope.getCriterios();
                }
                /**
                 * @ngdoc method
                 * @name Transaccion.HallazgoCtrl#firstClick
                 * @methodOf Transaccion.HallazgoCtrl
                 *
                 * @description
                 * Accion para el click del listado de unidades medicas que correspondan al fiiltro
                 * @param {int} id identificador del objeto click
                 * @param {int} ev identificador del origen del click
                 */
                $scope.firstClick = function(id, ev) {
                    id = angular.isUndefined(id) ? $scope.filtro.umActiva : id;

                    $scope.filtro.umActiva = id;
                    if ($scope.filtro.indicador.length > 1 || $scope.filtro.verTodosIndicadores) {
                        $scope.filtro.nivel = 1;
                        $localStorage.cium.filtro = $scope.filtro;

                        $location.path("/hallazgo/indicadores").search({ id: id });
                    } else {
                        if (ev)
                            $location.path("/hallazgo").search({ id: null });
                        else {
                            $scope.filtro.nivel = 2;
                            $scope.filtro.tipo = $scope.tipo;
                            $localStorage.cium.filtro = $scope.filtro;
                            $location.path("/hallazgo/evaluaciones").search({ id: $scope.filtro.indicador[0] });
                        }
                    }
                };
                /**
                 * @ngdoc method
                 * @name Transaccion.HallazgoCtrl#secondClick
                 * @methodOf Transaccion.HallazgoCtrl
                 *
                 * @description
                 * Accion para el click del listado de indicadores que correspondan al primer click
                 * @param {int} id identificador del objeto click
                 */
                $scope.secondClick = function(id) {
                        $scope.filtro.nivel = 2;
                        $scope.filtro.tipo = $scope.tipo;
                        $localStorage.cium.filtro = $scope.filtro;
                        $location.path("/hallazgo/evaluaciones").search({ id: id });
                    }
                    /**
                     * @ngdoc method
                     * @name Transaccion.HallazgoCtrl#verEvaluacion
                     * @methodOf Transaccion.HallazgoCtrl
                     *
                     * @description
                     * Accion para el click del listado de evaluaciones que correspondan al segundo click
                     * @param {int} id identificador del objeto click
                     * @param {string} tipo tipo de categoria Recurso o Calidad
                     * @param {string} indicador codigo del indicador
                     */
                $scope.verEvaluacion = function(id, tipo, indicador) {
                        $scope.filtro.nivel = 3;
                        $scope.filtro.tipo = tipo;
                        if (angular.isUndefined(indicador))
                            indicador = $location.search().id;

                        $scope.filtro.indicadorActivo = indicador;

                        $localStorage.cium.filtro = $scope.filtro;
                        $location.path("/hallazgo/ver").search({ id: id });
                    }
                    /**
                     * @ngdoc method
                     * @name Transaccion.HallazgoCtrl#verEvaluacionCompleta
                     * @methodOf Transaccion.HallazgoCtrl
                     *
                     * @description
                     * Accion para ver la evaluación completa 
                     */
                $scope.verEvaluacionCompleta = function() {
                        var id = $location.search().id;
                        if ($scope.filtro.tipo == "CALIDAD")
                            $location.path("/evaluacion-calidad/ver").search({ id: id, });
                        if ($scope.filtro.tipo == "RECURSO")
                            $location.path("/evaluacion-recurso/ver").search({ id: id, });
                    }
                    // inicializa las rutas para crear los href correspondientes en la vista actual
                $scope.index = function(ruta) {
                    $scope.ruta = ruta;
                    var uri = $scope.url;

                    if (uri.search("nuevo") == -1)
                        $scope.init();
                };

                $scope.indexUrl = function(ruta) {
                    $scope.ruta = ruta;
                    var uri = $scope.url;
                };
                $scope.tamano = $window.innerHeight - 50;
                $scope.$watch(function() {
                        return $window.innerHeight;
                    },
                    function(value) {
                        $scope.tamano = value - 50;
                    });
                $scope.hide = function() {
                    $mdDialog.hide();
                };
                /**
                 * @ngdoc method
                 * @name Transaccion.HallazgoCtrl#getCluesCriterios
                 * @methodOf Transaccion.HallazgoCtrl
                 *
                 * @description
                 * obtiene la lista de clues que pertenescan al criterio
                 * @param {int} ev id de la evaluacion
                 * @param {string} criterio id criterio
                 * @param {string} indicador id del indicador
                 * @param {string} codigo codigo del indicador
                 * @param {string} tipo tipo de categoria Recurso o Calidad
                 */
                $scope.getCluesCriterios = function(ev, criterio, indicador, codigo, tipo) {
                        $scope.filtro.criterio = {};
                        $scope.filtro.indicadorActivo = codigo;
                        $scope.filtro.tipo = tipo;
                        $scope.filtro.criterio.criterio = criterio;
                        $scope.filtro.criterio.indicador = indicador;
                        $localStorage.cium.filtro = $scope.filtro;
                        $scope.cargarP = true;
                        CrudDataApi.lista("/showCriterios?filtro=" + JSON.stringify($scope.filtro), function(data) {
                            if (data.status == '407')
                                $window.location = "acceso";

                            if (data.status == 200) {
                                $scope.dato = data.data;
                                $scope.eIndicador = [];
                                $scope.eIndicador.push(data.data[0]);
                                $scope.filtro.nivel = 3;
                                $scope.editDialog = $mdDialog;
                                $scope.editDialog.show({
                                    targetEvent: ev,
                                    scope: $scope.$new(),
                                    templateUrl: 'src/transaccion/hallazgo/views/clues.html',
                                    clickOutsideToClose: true
                                });
                            } else {
                                $scope.cargarUM = false;
                                errorFlash.error(data);
                            }
                            $scope.cargarUM = false;
                            $scope.cargarP = false;
                        }, function(e) {
                            errorFlash.error(e);
                            $scope.cargarUM = false;
                            $scope.cargarP = false;
                        });
                    }
                    /**
                     * @ngdoc method
                     * @name Transaccion.HallazgoCtrl#getCriterios
                     * @methodOf Transaccion.HallazgoCtrl
                     *
                     * @description
                     * obtiene los datos criterios malos
                     */
                $scope.getCriterios = function() {
                    $scope.cargando = true;
                    $scope.cargarP = true;

                    CrudDataApi.lista("/indexCriterios?filtro=" + JSON.stringify($scope.filtro), function(data) {
                        if (data.status == '407')
                            $window.location = "acceso";

                        if (data.status == 200) {
                            $scope.criterios = {};
                            angular.forEach(data.data, function(val, key) {
                                $scope.criterios[key] = [];
                                angular.forEach(val, function(v, k) {
                                    $scope.criterios[key].push(v);
                                });
                            });
                            
                            $scope.totalCriterios = data.total;
                        } else {
                            errorFlash.error(data);
                        }
                        $scope.cargando = false;
                        $scope.cargarP = false;
                    }, function(e) {
                        errorFlash.error(e);
                        $scope.cargando = false;
                        $scope.cargarP = false;
                    });
                };
                if (angular.isUndefined($location.search().id))
                    $scope.getCriterios();

                // obtiene los datos necesarios para crear el grid (listado)
                $scope.init = function(buscar, columna) {
                    var url = $scope.ruta;
                    buscar = $scope.buscar;
                    var pagina = $scope.paginacion.pag;
                    var limite = $scope.paginacion.lim;

                    var order = $scope.query.order;

                    if (!angular.isUndefined(buscar))
                        limite = limite + "&columna=" + columna + "&valor=" + buscar + "&buscar=true";

                    $scope.cargando = true;
                    $scope.cargarUM = true;

                    $localStorage.cium.filtro = $scope.filtro;
                    CrudDataApi.lista(url + '?pagina=' + pagina + '&limite=' + limite + "&order=" + order + "&filtro=" + JSON.stringify($scope.filtro), function(data) {
                        if (data.status == '407')
                            $window.location = "acceso";

                        if (data.status == 200) {
                            $scope.data = data.data;

                            $scope.datos.indicadores = data.indicadores;
                            $scope.total = data.totalIndicador;
                            $scope.paginacion.paginas = data.total;

                        } else {

                            errorFlash.error(data);
                        }
                        $scope.cargarUM = false;
                        $scope.cargando = false;
                    }, function(e) {
                        errorFlash.error(e);
                        $scope.cargarUM = false;
                        $scope.cargando = false;
                    });
                };

                // incia la busqueda con los parametros, columna = campo donde buscar, buscar = valor para la busqueda
                $scope.buscarL = function(buscar, columna) {
                    $scope.cargando = true;
                    $scope.init(buscar, columna);
                };

                //Ver. Muestra el detalle del id del recurso
                $scope.ver = function(ruta) {
                    $scope.ruta = ruta;
                    var url = $scope.ruta;
                    var id = $location.search().id;
                    $scope.cargando = true;
                    $scope.filtro = $localStorage.cium.filtro;

                    CrudDataApi.ver(url, id + "?filtro=" + JSON.stringify($localStorage.cium.filtro), function(data) {
                        if (data.status == '407')
                            $window.location = "acceso";

                        if (data.status == 200) {
                            $scope.dato = data.data;
                            if ($localStorage.cium.filtro.nivel == 2) {
                                $scope.eIndicador = [];
                                $scope.eIndicador.push(data.data[0]);
                            }
                        } else {
                            errorFlash.error(data);
                        }
                        $scope.cargando = false;
                    }, function(e) {
                        errorFlash.error(e);
                        $scope.cargando = false;
                    });
                };

                $scope.validarTab = function(valor){                	                	
            		$scope.pedirdatosde = valor;               		
            		if($scope.cambiofiltro)
            		{
            			$scope.cambiofiltro = false;
            			if(valor == 'UNIDADES'){
            				$scope.data = [];
	                    	$scope.init();
            			}
	                    if(valor == 'PROBLEMAS'){
	                    	$scope.criterios = [];
	                    	$scope.getCriterios();
	                    }
            		}
                }
            }
        ])
})();
