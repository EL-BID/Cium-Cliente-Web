/**
 * @ngdoc object
 * @name Dashboard.DashboardCtrl
 * @description
 * Manejo de los eventos del gráfico en el dashboard
 */
(function() {
    'use strict';
    angular.module('DashboardModule')
        .controller('DashboardCtrl', ['$rootScope', '$scope', '$translate', '$mdSidenav', '$location', '$mdBottomSheet', 'Auth', 'UsuarioData', 'Menu', '$http', '$window', '$timeout', '$route', 'flash', 'errorFlash', 'listaOpcion', 'Criterios', 'CrudDataApi', 'URLS',
            function($rootScope, $scope, $translate, $mdSidenav, $location, $mdBottomSheet, Auth, UsuarioData, Menu, $http, $window, $timeout, $route, flash, errorFlash, listaOpcion, Criterios, CrudDataApi, URLS) {

                // cambia de color el menu seleccionado

                $scope.menuSelected = $location.path();
                $scope.menuIsOpen = false;
                $scope.menu = Menu.getMenu();
                $scope.loggedUser = UsuarioData.getDatosUsuario();

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

                // carga el menu correspondiente para el usuario
                $scope.menu = Menu.getMenu();

                // inicializa el modulo ruta y url se le asigna el valor de la página actual
                $scope.ruta = "";
                $scope.url = $location.url();


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

            }
        ]);

    angular.module('DashboardModule')
        .controller('recursoController', function($scope, $http, $window, $location, $timeout, $route, flash, errorFlash, URLS, $mdDialog, $mdUtil, $mdSidenav, $translate, EvaluacionId, CrudDataApi) {

            $scope.recurso = true;

            $scope.datos = {};

            $scope.showModal = false;
            $scope.showModalCriterio = false;
            $scope.chart;
            $scope.verRecurso = "";
            $scope.dimension = [];
            $scope.despegarInfo = true;
            $scope.datosOk = true;
            $scope.datosOk = true;

            /**
             * @ngdoc method
             * @name Dashboard.DashboardCtrl#toggle
             * @methodOf Dashboard.DashboardCtrl
             *
             * @description
             * Agrega un dato a un modelo tipo array
             * @param {string} item valor a insertar
             * @param {model} list modelo 
             */
            $scope.tempIndicador = [];
            $scope.toggle = function(item, list) {
                var idx = list.indexOf(item);
                if (idx > -1)
                    list.splice(idx, 1);
                else {
                    list.push(item);
                }
            };
            /**
             * @ngdoc method
             * @name Dashboard.DashboardCtrl#exists
             * @methodOf Dashboard.DashboardCtrl
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
             * @name Dashboard.DashboardCtrl#cambiarVerTodoIndicador
             * @methodOf Dashboard.DashboardCtrl
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
                 * @name Dashboard.DashboardCtrl#cambiarVerTodoUM
                 * @methodOf Dashboard.DashboardCtrl
                 *
                 * @description
                 * Mostrar u ocultar las opciones de filtrado por parametros
                 */
            $scope.cambiarVerTodoUM = function() {
                    if ($scope.filtro.verTodosUM) {
                        $scope.filtro.um = {};
                        $scope.filtro.um.tipo = 'municipio';
                    }
                }
                /**
                 * @ngdoc method
                 * @name Dashboard.DashboardCtrl#cambiarVerTodoUM
                 * @methodOf Dashboard.DashboardCtrl
                 *
                 * @description
                 * Mostrar u ocultar las opciones de filtrado por clues
                 */
            $scope.cambiarVerTodoClues = function() {
                $scope.filtro.clues = [];
            }

            $scope.showAlert = function(ev) {
                $mdDialog.show(
                    $mdDialog.alert()
                    .parent(angular.element(document.getElementById('principal')))
                    .title($translate.instant('TITULO_DIALOG'))
                    .content($translate.instant('MENSAJE_DIALOG'))
                    .ariaLabel('info')
                    .ok('Ok')
                    .targetEvent(ev)
                );
            };

            var d = new Date();

            $scope.filtro = {};
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
            /**
             * @ngdoc method
             * @name Dashboard.DashboardCtrl#aplicarFiltro
             * @methodOf Dashboard.DashboardCtrl
             *
             * @description
             * Accion para procesar el filtro en la base de datos
             * @param {bool} avanzado compprueba si el filtro es avanzado o de la lista de indicadores activos
             * @param {string} item compsolo tiene un datorueba si indicadores es un array o  
             */
            $scope.aplicarFiltro = function(avanzado, item) {
                $scope.filtros.activo = true;
                $scope.filtro.indicador = $scope.tempIndicador;
                if (!avanzado) {
                    $scope.filtro.indicador = [];
                    $scope.filtro.verTodosIndicadores = false;
                    if ($scope.filtro.indicador.indexOf(item.codigo) == -1) {
                        $scope.filtro.indicador.push(item.codigo);
                        $scope.chipIndicador[item.codigo] = item;
                    }

                }
                $scope.contador = 0;
                $scope.intento = 0;
                $scope.init();
                $mdSidenav('recurso').close();
                if ($scope.filtro.visualizar == 'parametro' & $scope.filtro.um.nivel == 'clues') {
                    $scope.verInfo = true;
                    $scope.showAlert();
                }
            };

            $scope.contador = 0;
            $scope.chartClick = function(event) {
                    if ($scope.verInfo) {
                        var points = $scope.chart.getBarsAtEvent(event);
                        if ($scope.contador == 0) {
                            $scope.recurso = true;
                            $scope.intento = 0;
                            CrudDataApi.lista("/recursoClues?filtro=" + JSON.stringify($scope.filtro) + "&clues=" + points[0].label, function(data) {
                                if (data.status == 200) {
                                    $scope.data = data.data;
                                    $scope.total = data.total;
                                    $scope.recurso = false;
                                    $scope.contador++;
                                } else {
                                    $scope.recurso = false;
                                    errorFlash.error(data);
                                }
                            }, function(e) {
                                if ($scope.intento < 1) {
                                    $scope.chartClick(event);
                                    $scope.intento++;
                                }
                                $scope.recurso = false;
                            });
                        }
                        if ($scope.contador == 1) {
                            var punto = points[0].label;
                            punto = punto.split('#');

                            $scope.showModalCriterio = !$scope.showModalCriterio;
                            EvaluacionId.setId(punto[1]);
                            $mdDialog.show({
                                controller: DialogRecurso,
                                templateUrl: 'src/dashboard/views/verRecurso.html',
                                parent: angular.element(document.body),
                            });
                        }
                    }
                }
                /**
                 * @ngdoc method
                 * @name Dashboard.DashboardCtrl#quitarFiltro
                 * @methodOf Dashboard.DashboardCtrl
                 *
                 * @description
                 * Accion para quitar el filtro en la base de datos
                 * @param {bool} avanzado compprueba si el filtro es avanzado o de la lista de indicadores activos 
                 */
            $scope.quitarFiltro = function(avanzado) {
                $scope.filtro.indicador = [];
                $scope.filtro.clues = [];
                $scope.filtro.um = {};
                $scope.filtro.um.tipo = "municipio";
                $scope.filtro.verTodosIndicadores = true;
                $scope.filtro.verTodosUM = true;
                $scope.filtros.activo = false;

                $scope.intento = 0;
                $scope.contador = 0;
                $scope.init();
                $mdSidenav('recurso').close();
            };


            $scope.hide = function() {
                $mdDialog.hide();
            };
            /**
             * @ngdoc method
             * @name Dashboard.DashboardCtrl#quitarFiltro
             * @methodOf Dashboard.DashboardCtrl
             *
             * @description
             * Accion para poner en modo fullscreen el área del gráfico
             * @param {string} e área para hacer el fullscreen
             */
            $scope.isFullscreen = false;

            $scope.toggleFullScreen = function(e) {
                    $scope.isFullscreen = !$scope.isFullscreen;
                }
                /**
                 * @ngdoc method
                 * @name Dashboard.DashboardCtrl#buildToggler
                 * @methodOf Dashboard.DashboardCtrl
                 *
                 * @description
                 * Crea un sidenav con las opciones de filtrado
                 * @param {string} navID identificador del sidenav
                 */
            $scope.cargarFiltro = 0;
            $scope.toggleRightOpciones = function(navID) {
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
            };
            /**
             * @ngdoc method
             * @name Dashboard.DashboardCtrl#cambiarAnio
             * @methodOf Dashboard.DashboardCtrl
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
                 * @name Dashboard.DashboardCtrl#cambiarBimestre
                 * @methodOf Dashboard.DashboardCtrl
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
             * @name Dashboard.DashboardCtrl#getDimension
             * @methodOf Dashboard.DashboardCtrl
             *
             * @description
             * Cargar las opciones de filtrado por nivel
             * @param {string} nivel nivel a extraer de la base de datos
             * @param {int} c posicion para almacenar la información en el modelo datos
             */
            $scope.intentoOpcion = 0;
            $scope.selectedIndex = 2;
            $scope.getDimension = function(nivel, c) {
                $scope.opcion = true;
                if (c == 7) {
                    $scope.selectedIndex = 3;
                }
                var hacer = true;
                    if(c > 0){                    	
                    	if($scope.datos.length == 0 || $scope.filtro.anio == '') 
                    		hacer = false;
                    }
                    if(hacer){
	                CrudDataApi.lista('/recursoDimension?filtro=' + JSON.stringify($scope.filtro) + '&nivel=' + nivel, function(data) {
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
             * @name Dashboard.DashboardCtrl#getDimension
             * @methodOf Dashboard.DashboardCtrl
             *
             * @description
             * obtiene los datos necesarios para crear el gráfico
             */
            $scope.intento = 0;
            $scope.init = function() {
                var url = '/recurso';

                $scope.recurso = true;
                CrudDataApi.lista(url + "?filtro=" + JSON.stringify($scope.filtro), function(data) {
                    if (data.status == '407')
                        $window.location = "acceso";
                    if (!angular.isUndefined(data.data.datasets)) {
                        $scope.data = data.data;
                        $scope.total = data.total;
                        $scope.anios = data.anio;
                        $scope.recurso = false;
                        $scope.datosOk = true;
                    } else {
                        $scope.datosOk = false;
                        $scope.recurso = false;
                    }
                    $scope.recurso = false;
                }, function(e) {
                    if ($scope.intento < 1) {
                        $scope.init();
                        $scope.intento++;
                    }
                    $scope.recurso = false;
                });
            };
            $scope.init();
            $scope.quitar = false;
            $scope.quitarAlert = function() {
                $scope.quitar = !$scope.quitar;
                var border = 0;
                if ($scope.quitar)
                    border = 3;

                angular.forEach($scope.data.datasets, function(val, key) {
                    val.borderWidth = border;
                })

            }
            $scope.options = {

                legend: {
                    display: true
                },

                scales: {
                    xAxes: [{
                        barPercentage: 0.95,
                        categoryPercentage: 0.9
                    }]
                }
            };
        });

    angular.module('DashboardModule').controller('calidadController', function($scope, $http, $window, $location, $timeout, $route, flash, errorFlash, URLS, $mdDialog, $mdUtil, $mdSidenav, $translate, EvaluacionShow, EvaluacionId, CrudDataApi) {

        $scope.calidad = true;

        $scope.datos = {};

        $scope.showModal = false;
        $scope.showModalCriterio = false;
        $scope.chart;
        $scope.verCalidad = "";
        $scope.dimension = [];
        $scope.despegarInfo = true;
        $scope.datosOk = true;

        $scope.tempIndicador = [];
        $scope.toggle = function(item, list) {
            var idx = list.indexOf(item);
            if (idx > -1)
                list.splice(idx, 1);
            else {
                list.push(item);
            }
        };
        //lenar los check box tipo array
        $scope.exists = function(item, list) {
            return list.indexOf(item) > -1;
        };

        $scope.cambiarVerTodoIndicador = function() {
            if ($scope.filtro.verTodosIndicadores) {
                $scope.filtro.indicador = [];
                $scope.chipIndicador = [];
                $scope.tempIndicador = [];
            }
        }
        $scope.cambiarVerTodoUM = function() {
            if ($scope.filtro.verTodosUM) {
                $scope.filtro.um = {};
                $scope.filtro.um.tipo = 'municipio';
            }
        }

        $scope.cambiarVerTodoClues = function() {
            $scope.filtro.clues = [];
        }

        $scope.showAlert = function(ev) {
            $mdDialog.show(
                $mdDialog.alert()
                .parent(angular.element(document.getElementById('principal')))
                .title($translate.instant('TITULO_DIALOG'))
                .content($translate.instant('MENSAJE_DIALOG'))
                .ariaLabel('info')
                .ok('Ok')
                .targetEvent(ev)
            );
        };

        var d = new Date();

        $scope.filtro = {};
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
        //aplicar los filtros al area del grafico
        $scope.aplicarFiltro = function(avanzado, item) {
            $scope.filtros.activo = true;
            $scope.filtro.indicador = $scope.tempIndicador;
            if (!avanzado) {
                $scope.filtro.indicador = [];
                $scope.filtro.verTodosIndicadores = false;
                if ($scope.filtro.indicador.indexOf(item.codigo) == -1) {
                    $scope.filtro.indicador.push(item.codigo);
                    $scope.chipIndicador[item.codigo] = item;
                }

            }
            $scope.contador = 0;
            $scope.intento = 0;
            $scope.init();
            $mdSidenav('calidad').close();
            if ($scope.filtro.visualizar == 'parametro' & $scope.filtro.um.nivel == 'clues') {
                $scope.verInfo = true;
                $scope.showAlert();
            }
        };
        $scope.contador = 0;
        $scope.chartClick = function(event) {
                if ($scope.verInfo) {
                    var points = $scope.chart.getBarsAtEvent(event);
                    if ($scope.contador == 0) {
                        $scope.calidad = true;
                        $scope.intento = 0;
                        CrudDataApi.lista("/calidadClues?filtro=" + JSON.stringify($scope.filtro) + "&clues=" + points[0].label, function(data) {
                            if (data.status == 200) {
                                $scope.data = data.data;
                                $scope.total = data.total;
                                $scope.calidad = false;
                                $scope.contador++;
                            } else {
                                $scope.calidad = false;
                                errorFlash.error(data);
                            }
                        }, function(e) {
                            if ($scope.intento < 1) {
                                $scope.chartClick(event);
                                $scope.intento++;
                            }
                            $scope.calidad = false;
                        });
                    }
                    if ($scope.contador == 1) {
                        var punto = points[0].label;
                        punto = punto.split('#');

                        $scope.showModalCriterio = !$scope.showModalCriterio;
                        EvaluacionId.setId(punto[1]);
                        $mdDialog.show({
                            controller: DialogCalidad,
                            templateUrl: 'src/dashboard/views/verCalidad.html',
                            parent: angular.element(document.body),
                        });
                    }
                }
            }
            //quitar los filtros seleccionados del dialog
        $scope.quitarFiltro = function(avanzado) {
            $scope.filtro.indicador = [];
            $scope.filtro.clues = [];
            $scope.filtro.um = {};
            $scope.filtro.um.tipo = "municipio";
            $scope.filtro.verTodosIndicadores = true;
            $scope.filtro.verTodosUM = true;
            $scope.filtros.activo = false;

            $scope.intento = 0;
            $scope.contador = 0;
            $scope.init();
            $mdSidenav('calidad').close();
        };

        // cerrar el dialog
        $scope.hide = function() {
            $mdDialog.hide();
        };
        //cambiar a pantalla completa
        $scope.isFullscreen = false;

        $scope.toggleFullScreen = function(e) {
            $scope.isFullscreen = !$scope.isFullscreen;
        }
        $scope.cargarFiltro = 0;
        $scope.toggleRightOpciones = function(navID) {
            $mdSidenav(navID)
                .toggle()
                .then(function() {
                    if ($scope.cargarFiltro < 1) {
                        $scope.getDimension('anio', 0);
                        $scope.getDimension('month', 1);
                        $scope.getDimension("codigo,indicador,color, 'Calidad' as categoriaEvaluacion", 2);
                        $scope.getDimension('jurisdiccion', 3);
                        $scope.getDimension('municipio', 4);
                        $scope.getDimension('zona', 5);
                        $scope.getDimension('cone', 6);
                        $scope.cargarFiltro++;
                    }
                });
        };
        $scope.cambiarAnio = function(anio) {
            
            $scope.filtro.anio = anio;
            $scope.getDimension('month', 1);
            $scope.getDimension("codigo,indicador,color, '" + $scope.filtro.tipo + "' as categoriaEvaluacion", 2);
            $scope.getDimension('jurisdiccion', 3);
            $scope.getDimension('municipio', 4);
            $scope.getDimension('zona', 5);
            $scope.getDimension('cone', 6);
        }
        $scope.cambiarBimestre = function(bimestre) {
            $scope.filtro.bimestre = bimestre;
            $scope.getDimension("codigo,indicador,color, '" + $scope.filtro.tipo + "' as categoriaEvaluacion", 2);
            $scope.getDimension('jurisdiccion', 3);
            $scope.getDimension('municipio', 4);
            $scope.getDimension('zona', 5);
            $scope.getDimension('cone', 6);
        }

        $scope.intentoOpcion = 0;
            $scope.selectedIndex = 2;
            $scope.getDimension = function(nivel, c) {
                $scope.opcion = true;
                if (c == 7) {
                    $scope.selectedIndex = 3;
                }
                var hacer = true;
                    if(c > 0){                    	
                    	if($scope.datos.length == 0 || $scope.filtro.anio == '') 
                    		hacer = false;
                    }
                    if(hacer){
	                CrudDataApi.lista('/recursoDimension?filtro=' + JSON.stringify($scope.filtro) + '&nivel=' + nivel, function(data) {
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

        // obtiene los datos necesarios para crear el grid (listado)
        $scope.intento = 0;
        $scope.init = function() {
            var url = '/calidad';

            $scope.calidad = true;
            CrudDataApi.lista(url + "?filtro=" + JSON.stringify($scope.filtro), function(data) {
                if (data.status == '407')
                    $window.location = "acceso";

                if (!angular.isUndefined(data.data.datasets)) {
                    $scope.data = data.data;
                    $scope.total = data.total;
                    $scope.anios = data.anio;
                    $scope.calidad = false;
                    $scope.datosOk = true;
                } else {
                    $scope.calidad = false;
                    $scope.datosOk = false;
                }
                $scope.calidad = false;
            }, function(e) {
                if ($scope.intento < 1) {
                    $scope.init();
                    $scope.intento++;
                }
                $scope.calidad = false;
            });
        };
        $scope.init();
        $scope.quitar = false;
        $scope.quitarAlert = function() {
            $scope.quitar = !$scope.quitar;
            var border = 0;
            if ($scope.quitar)
                border = 3;

            angular.forEach($scope.data.datasets, function(val, key) {
                val.borderWidth = border;
            })

        }
        $scope.options = {

            legend: {
                display: true
            },

            scales: {
                xAxes: [{
                    barPercentage: 0.95,
                    categoryPercentage: 0.9
                }]
            }
        };
    });

    angular.module('DashboardModule').controller('pieRecursoController', function($scope, $http, $window, $location, $timeout, $route, flash, errorFlash, URLS, $mdDialog, $mdUtil, $mdSidenav, $translate, CrudDataApi, $filter) {

        $scope.pieRecurso = true;

        $scope.datos = {};

        $scope.showModal = false;
        $scope.showModalCriterio = false;
        $scope.chart;
        $scope.verpieRecurso = "";
        $scope.dimension = [];
        $scope.datosOk = true;

        $scope.tempIndicador = [];
        $scope.toggle = function(item, list) {
            var idx = list.indexOf(item);
            if (idx > -1)
                list.splice(idx, 1);
            else {
                list.push(item);
            }
        };
        //lenar los check box tipo array
        $scope.exists = function(item, list) {
            return list.indexOf(item) > -1;
        };

        $scope.cambiarVerTodoIndicador = function() {
            if ($scope.filtro.verTodosIndicadores) {
                $scope.filtro.indicador = [];
                $scope.chipIndicador = [];
                $scope.tempIndicador = [];
            }
        }
        $scope.cambiarVerTodoUM = function() {
            if ($scope.filtro.verTodosUM) {
                $scope.filtro.um = {};
                $scope.filtro.um.tipo = 'municipio';
            }
        }

        $scope.cambiarVerTodoClues = function() {
            $scope.filtro.clues = [];
        }

        var d = new Date();
        $scope.opcion = true;

        $scope.filtro = {};
        $scope.filtro.tipo = "Recurso";
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
        //aplicar los filtros al area del grafico
        $scope.aplicarFiltro = function(avanzado, item) {
            $scope.filtros.activo = true;
            $scope.filtro.indicador = $scope.tempIndicador;
            if (!avanzado) {
                $scope.filtro.indicador = [];
                $scope.filtro.verTodosIndicadores = false;
                if ($scope.filtro.indicador.indexOf(item.codigo) == -1) {
                    $scope.filtro.indicador.push(item.codigo);
                    $scope.chipIndicador[item.codigo] = item;
                }

            }
            $scope.contador = 0;
            $scope.intento = 0;
            $scope.init();
            $mdSidenav('pieRecurso').close();
        };
        $scope.contador = 0;

        //quitar los filtros seleccionados del dialog
        $scope.quitarFiltro = function(avanzado) {
            $scope.filtro.indicador = [];
            $scope.filtro.clues = [];
            $scope.filtro.um = {};
            $scope.filtro.um.tipo = "municipio";
            $scope.filtro.verTodosIndicadores = true;
            $scope.filtro.verTodosUM = true;
            $scope.filtros.activo = false;

            $scope.intento = 0;
            $scope.contador = 0;
            $scope.init();
            $mdSidenav('pieRecurso').close();
        };

        // cerrar el dialog
        $scope.hide = function() {
            $mdDialog.hide();
        };
        //cambiar a pantalla completa
        $scope.isFullscreen = false;

        $scope.toggleFullScreen = function(e) {
            $scope.isFullscreen = !$scope.isFullscreen;
        }
        $scope.cargarFiltro = 0;
        $scope.toggleRightOpciones = function(navID) {
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
            };
        $scope.cambiarAnio = function(anio) {
            
            $scope.filtro.anio = anio;
            $scope.getDimension('month', 1);
            $scope.getDimension("codigo,indicador,color, '" + $scope.filtro.tipo + "' as categoriaEvaluacion", 2);
            $scope.getDimension('jurisdiccion', 3);
            $scope.getDimension('municipio', 4);
            $scope.getDimension('zona', 5);
            $scope.getDimension('cone', 6);
        }
        $scope.cambiarBimestre = function(bimestre) {
            $scope.filtro.bimestre = bimestre;
            $scope.getDimension("codigo,indicador,color, '" + $scope.filtro.tipo + "' as categoriaEvaluacion", 2);
            $scope.getDimension('jurisdiccion', 3);
            $scope.getDimension('municipio', 4);
            $scope.getDimension('zona', 5);
            $scope.getDimension('cone', 6);
        }
        $scope.cambiarCategoria = function() {
            $scope.getDimension("codigo,indicador,color, '" + $scope.filtro.tipo + "' as categoriaEvaluacion", 2);
        }

        $scope.intentoOpcion = 0;
        $scope.getDimension = function(nivel, c) {
            $scope.opcion = true;
            var url = "/calidadDimension";
            if ($scope.filtro.tipo == "Recurso")
                url = "/recursoDimension";

            CrudDataApi.lista(url + '?filtro=' + JSON.stringify($scope.filtro) + '&nivel=' + nivel, function(data) {
                $scope.datos[c] = data.data;
                $scope.opcion = false;
            }, function(e) {
                if ($scope.intentoOpcion < 1) {
                    $scope.getDimension(nivel, c);
                    $scope.intentoOpcion++;
                }
                $scope.opcion = false;
            });
        };

        // obtiene los datos necesarios para crear el grid (listado)
        $scope.intento = 0;
        $scope.init = function() {
            var url = '/pieVisita';

            $scope.pieRecurso = true;
            CrudDataApi.lista(url + "?filtro=" + JSON.stringify($scope.filtro), function(data) {
                if (data.status == '407')
                    $window.location = "acceso";

                if (data.status == 200) {
                    $scope.data = data.data;
                    $scope.total = data.total;
                    $scope.anios = data.anio;
                    $scope.pieRecurso = false;
                } else {
                    $scope.pieRecurso = false;
                    errorFlash.error(data);
                }
                $scope.pieRecurso = false;
            }, function(e) {
                if ($scope.intento < 1) {
                    $scope.init();
                    $scope.intento++;
                }
                $scope.pie = false;
            });
        };
        $scope.init();



        $scope.options = {

            // Sets the chart to be responsive
            responsive: true,

            //Boolean - Whether we should show a stroke on each segment
            segmentShowStroke: true,

            //String - The colour of each segment stroke
            segmentStrokeColor: '#fff',

            //Number - The width of each segment stroke
            segmentStrokeWidth: 2,

            //Number - The percentage of the chart that we cut out of the middle
            percentageInnerCutout: 0, // This is 0 for Pie charts

            //Number - Amount of animation steps
            animationSteps: 100,

            //String - Animation easing effect
            animationEasing: 'easeOutBounce',

            //Boolean - Whether we animate the rotation of the Doughnut
            animateRotate: true,

            //Boolean - Whether we animate scaling the Doughnut from the centre
            animateScale: false,

            //String - A legend template
            legendTemplate: ''

        };
    })

    angular.module('DashboardModule').controller('pieCalidadController', function($scope, $http, $window, $location, $timeout, $route, flash, errorFlash, URLS, $mdDialog, $mdUtil, $mdSidenav, $translate, CrudDataApi, $filter) {

        $scope.pieCalidad = true;

        $scope.datos = {};

        $scope.showModal = false;
        $scope.showModalCriterio = false;
        $scope.chart;
        $scope.verpieCalidad = "";
        $scope.dimension = [];
        $scope.datosOk = true;

        $scope.tempIndicador = [];
        $scope.toggle = function(item, list) {
            var idx = list.indexOf(item);
            if (idx > -1)
                list.splice(idx, 1);
            else {
                list.push(item);
            }
        };
        //lenar los check box tipo array
        $scope.exists = function(item, list) {
            return list.indexOf(item) > -1;
        };

        $scope.cambiarVerTodoIndicador = function() {
            if ($scope.filtro.verTodosIndicadores) {
                $scope.filtro.indicador = [];
                $scope.chipIndicador = [];
                $scope.tempIndicador = [];
            }
        }
        $scope.cambiarVerTodoUM = function() {
            if ($scope.filtro.verTodosUM) {
                $scope.filtro.um = {};
                $scope.filtro.um.tipo = 'municipio';
            }
        }

        $scope.cambiarVerTodoClues = function() {
            $scope.filtro.clues = [];
        }

        var d = new Date();
        $scope.opcion = true;

        $scope.filtro = {};
        $scope.filtro.tipo = "Calidad";
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
        //aplicar los filtros al area del grafico
        $scope.aplicarFiltro = function(avanzado, item) {
            $scope.filtros.activo = true;
            $scope.filtro.indicador = $scope.tempIndicador;
            if (!avanzado) {
                $scope.filtro.indicador = [];
                $scope.filtro.verTodosIndicadores = false;
                if ($scope.filtro.indicador.indexOf(item.codigo) == -1) {
                    $scope.filtro.indicador.push(item.codigo);
                    $scope.chipIndicador[item.codigo] = item;
                }

            }
            $scope.contador = 0;
            $scope.intento = 0;
            $scope.init();
            $mdSidenav('pieCalidad').close();
        };
        $scope.contador = 0;

        //quitar los filtros seleccionados del dialog
        $scope.quitarFiltro = function(avanzado) {
            $scope.filtro.indicador = [];
            $scope.filtro.clues = [];
            $scope.filtro.um = {};
            $scope.filtro.um.tipo = "municipio";
            $scope.filtro.verTodosIndicadores = true;
            $scope.filtro.verTodosUM = true;
            $scope.filtros.activo = false;

            $scope.intento = 0;
            $scope.contador = 0;
            $scope.init();
            $mdSidenav('pieCalidad').close();
        };

        // cerrar el dialog
        $scope.hide = function() {
            $mdDialog.hide();
        };
        //cambiar a pantalla completa
        $scope.isFullscreen = false;

        $scope.toggleFullScreen = function(e) {
            $scope.isFullscreen = !$scope.isFullscreen;
        }
        $scope.cargarFiltro = 0;
        $scope.toggleRightOpciones = function(navID) {
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
            };
        $scope.cambiarAnio = function(anio) {
            
            $scope.filtro.anio = anio;
            $scope.getDimension('month', 1);
            $scope.getDimension("codigo,indicador,color, '" + $scope.filtro.tipo + "' as categoriaEvaluacion", 2);
            $scope.getDimension('jurisdiccion', 3);
            $scope.getDimension('municipio', 4);
            $scope.getDimension('zona', 5);
            $scope.getDimension('cone', 6);
        }
        $scope.cambiarBimestre = function(bimestre) {
            $scope.filtro.bimestre = bimestre;
            $scope.getDimension("codigo,indicador,color, '" + $scope.filtro.tipo + "' as categoriaEvaluacion", 2);
            $scope.getDimension('jurisdiccion', 3);
            $scope.getDimension('municipio', 4);
            $scope.getDimension('zona', 5);
            $scope.getDimension('cone', 6);
        }
        $scope.cambiarCategoria = function() {
            $scope.getDimension("codigo,indicador,color, '" + $scope.filtro.tipo + "' as categoriaEvaluacion", 2);
        }

        $scope.intentoOpcion = 0;
        $scope.getDimension = function(nivel, c) {
            $scope.opcion = true;
            var url = "/calidadDimension";
            if ($scope.filtro.tipo == "Recurso")
                url = "/recursoDimension";

            CrudDataApi.lista(url + '?filtro=' + JSON.stringify($scope.filtro) + '&nivel=' + nivel, function(data) {
                $scope.datos[c] = data.data;
                $scope.opcion = false;
            }, function(e) {
                if ($scope.intentoOpcion < 1) {
                    $scope.getDimension(nivel, c);
                    $scope.intentoOpcion++;
                }
                $scope.opcion = false;
            });
        };

        // obtiene los datos necesarios para crear el grid (listado)
        $scope.intento = 0;
        $scope.init = function() {
            var url = '/pieVisita';

            $scope.pieCalidad = true;
            CrudDataApi.lista(url + "?filtro=" + JSON.stringify($scope.filtro), function(data) {
                if (data.status == '407')
                    $window.location = "acceso";

                if (data.status == 200) {
                    $scope.data = data.data;
                    $scope.total = data.total;
                    $scope.anios = data.anio;
                    $scope.pieCalidad = false;
                } else {
                    $scope.pieCalidad = false;
                    errorFlash.error(data);
                }
                $scope.pieCalidad = false;
            }, function(e) {
                if ($scope.intento < 1) {
                    $scope.init();
                    $scope.intento++;
                }
                $scope.pieCalidad = false;
            });
        };
        $scope.init();



        $scope.options = {

            // Sets the chart to be responsive
            responsive: true,

            //Boolean - Whether we should show a stroke on each segment
            segmentShowStroke: true,

            //String - The colour of each segment stroke
            segmentStrokeColor: '#fff',

            //Number - The width of each segment stroke
            segmentStrokeWidth: 2,

            //Number - The percentage of the chart that we cut out of the middle
            percentageInnerCutout: 0, // This is 0 for Pie charts

            //Number - Amount of animation steps
            animationSteps: 100,

            //String - Animation easing effect
            animationEasing: 'easeOutBounce',

            //Boolean - Whether we animate the rotation of the Doughnut
            animateRotate: true,

            //Boolean - Whether we animate scaling the Doughnut from the centre
            animateScale: false,

            //String - A legend template
            legendTemplate: ''

        };
    })


    // agregado para el grafico de criterios
    angular.module('DashboardModule').controller('criterioRecursoController', function($scope, $localStorage, $http, $window, $location, $timeout, $route, flash, errorFlash, URLS, $mdDialog, $mdUtil, $mdSidenav, $translate, CrudDataApi) {

        $scope.criterioRecurso = true;

        $scope.datos = {};

        $scope.showModal = false;
        $scope.showModalCriterio = false;
        $scope.chart;
        $scope.vercriterioRecurso = "";
        $scope.dimension = [];
        $scope.datosOk = true;

        $scope.tempIndicador = [];
        $scope.toggle = function(item, list) {
            var idx = list.indexOf(item);
            if (idx > -1)
                list.splice(idx, 1);
            else {
                list.push(item);
            }
        };
        $scope.valorGuardado = [];
        $scope.getCriterioDetalle = function(ev, value) {
            $scope.indicadorSeleccionado = value;
            $scope.showDialog = $mdDialog;
            $scope.tipo = 0;
            delete $scope.filtro.valor;
            delete $scope.filtro.grado;
            $scope.filtro.valor = '';
            $scope.filtro.grado = 0;
            var url = "/criterioDetalle";
            $scope.cargando = true;
            $scope.criterioRecurso = true;
            $scope.filtro.id = value.codigo;
            CrudDataApi.lista(url + "?filtro=" + JSON.stringify($scope.filtro), function(data) {
                if (data.status == '407')
                    $window.location = "acceso";

                if (data.status == 200) {
                    $scope.valorGuardado[0] = value;
                    $scope.indicadorDetalle = data.data;
                    $scope.criterioRecurso = false;
                    $scope.datosOk = true;

                    $scope.showDialog.show({
                        targetEvent: ev,
                        scope: $scope.$new(),
                        templateUrl: 'src/dashboard/views/dashboard/criterio-detalle.html',
                        clickOutsideToClose: true
                    });

                } else {
                    $scope.criterioRecurso = false;
                    $scope.datosOk = false;
                }
                $scope.cargando = false;
                $scope.criterioRecurso = false;
            }, function(e) {
                $scope.criterio = false;
                $scope.cargando = false;
            });
        }
        $scope.criterioDetalle = false;
        $scope.tipo = 0;
        $scope.dimen = ['criterio', 'jurisdiccion', 'clues'];

        $scope.getCriterioDetalleClick2 = function(ev, value, tipo) {
            $scope.showDialog.show({
                targetEvent: ev,
                scope: $scope.$new(),
                templateUrl: 'src/dashboard/views/dashboard/criterio-detalle.html',
                clickOutsideToClose: true
            });
            $scope.getCriterioDetalleClick(ev, value, tipo);
        }

        $scope.getCriterioDetalleClick = function(ev, value, tipo) {
            $scope.tipo = tipo;
            var url = "/criterioDetalle";
            $scope.criterioDetalle = true;
            $scope.filtro.id = $scope.indicadorSeleccionado.codigo;
            $scope.filtro.valor = $scope.filtro.valor + "|" + value;
            $scope.filtro.grado = tipo;

            angular.forEach($scope.valorGuardado, function(v, k) {
                if (k > tipo) {
                    $scope.valorGuardado[k] = "";
                    delete $scope.valorGuardado[k];
                }                
            });
            CrudDataApi.lista(url + "?filtro=" + JSON.stringify($scope.filtro), function(data) {
                if (data.status == '407')
                    $window.location = "acceso";

                if (data.status == 200) {
                    $scope.valorGuardado[tipo] = value;
                    $scope.indicadorDetalle = data.data;
                }
                $scope.criterioDetalle = false;
            }, function(e) {
                $scope.criterioDetalle = false;
            });
        }

        $scope.getCluesCriterios = function(ev, value, tipo) {
            $scope.filtro.valor = $scope.filtro.valor + "|" + value;
            $scope.filtro.grado = tipo;
            $scope.filtro.indicador = $scope.indicadorSeleccionado.codigo;
            var url = "/criterioDetalle";
            $scope.criterioDetalle = true;
            CrudDataApi.lista(url + "?filtro=" + JSON.stringify($scope.filtro), function(data) {
                if (data.status == '407')
                    $window.location = "acceso";

                if (data.status == 200) {
                    $scope.datoClues = data.data;
                    $scope.editDialog = $mdDialog;
                    $scope.editDialog.show({
                        targetEvent: ev,
                        scope: $scope.$new(),
                        templateUrl: 'src/dashboard/views/dashboard/criterio-clues.html',
                        clickOutsideToClose: true
                    });
                } else {
                    $scope.criterioDetalle = false;
                    errorFlash.error(data);
                }
                $scope.criterioDetalle = false;
            }, function(e) {
                errorFlash.error(e);
                $scope.criterioDetalle = false;
            });
        }

        /**
         * @ngdoc method
         * @name Transaccion.DashboardCtrl#verEvaluacion
         * @methodOf Transaccion.DashboardCtrl
         *
         * @description
         * Accion para el click del listado de evaluaciones que correspondan al segundo click
         * @param {int} id identificador del objeto click
         * @param {string} tipo tipo de categoria Recurso o Calidad
         * @param {string} indicador codigo del indicador
         */
        $scope.verEvaluacion = function(ev, id) {
            $scope.evaluacion_id = id;
            $scope.filtro.valor = id;
            $scope.filtro.grado = 5;
            $scope.filtro.nivel = 3;
            $scope.filtro.historial = false;
            $scope.filtro.indicador = $scope.indicadorSeleccionado.codigo;
            var url = "/criterioEvaluacion";
            $scope.criterioDetalle = true;

            CrudDataApi.lista(url + "?filtro=" + JSON.stringify($scope.filtro), function(data) {
                if (data.status == '407')
                    $window.location = "acceso";

                if (data.status == 200) {
                    $scope.evaluacion = data.data;
                    $scope.editDialog = $mdDialog;
                    $scope.editDialog.show({
                        targetEvent: ev,
                        scope: $scope.$new(),
                        templateUrl: 'src/dashboard/views/dashboard/criterio-evaluacion.html',
                        clickOutsideToClose: true
                    });
                } else {
                    $scope.criterioDetalle = false;
                    errorFlash.error(data);
                }
                $scope.criterioDetalle = false;
            }, function(e) {
                errorFlash.error(e);
                $scope.criterioDetalle = false;
            });
        }
        $scope.verEvaluacionCompleta = function() {
            var id = $scope.evaluacion_id;
            $location.path("/evaluacion-recurso/ver").search({ id: id, });
        }

        //lenar los check box tipo array
        $scope.exists = function(item, list) {
            return list.indexOf(item) > -1;
        };

        $scope.cambiarVerTodoIndicador = function() {
            if ($scope.filtro.verTodosIndicadores) {
                $scope.filtro.indicador = [];
                $scope.chipIndicador = [];
                $scope.tempIndicador = [];
            }
        }
        $scope.cambiarVerTodoUM = function() {
            if ($scope.filtro.verTodosUM) {
                $scope.filtro.um = {};
                $scope.filtro.um.tipo = 'municipio';
            }
        }

        $scope.cambiarVerTodoClues = function() {
            $scope.filtro.clues = [];
        }

        var d = new Date();
        $scope.opcion = true;

        $scope.filtro = {};
        $scope.filtro.tipo = "Recurso";
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
        $scope.filtro.estricto = false;
        $scope.filtro.valor = '';

        //aplicar los filtros al area del grafico
        $scope.aplicarFiltro = function(avanzado, item) {
            $scope.filtros.activo = true;
            $scope.filtro.indicador = $scope.tempIndicador;
            if (!avanzado) {
                $scope.filtro.indicador = [];
                $scope.filtro.verTodosIndicadores = false;
                if ($scope.filtro.indicador.indexOf(item.codigo) == -1) {
                    $scope.filtro.indicador.push(item.codigo);
                    $scope.chipIndicador[item.codigo] = item;
                }

            }
            $scope.contador = 0;
            $scope.intento = 0;
            $scope.init();
            $mdSidenav('criterioRecurso').close();
        };
        $scope.contador = 0;

        //quitar los filtros seleccionados del dialog
        $scope.quitarFiltro = function(avanzado) {
            $scope.filtro.indicador = [];
            $scope.filtro.clues = [];
            $scope.filtro.um = {};
            $scope.filtro.um.tipo = "municipio";
            $scope.filtro.verTodosIndicadores = true;
            $scope.filtro.verTodosUM = true;
            $scope.filtros.activo = false;

            $scope.intento = 0;
            $scope.contador = 0;
            $scope.init();
            $mdSidenav('criterioRecurso').close();
        };

        // cerrar el dialog
        $scope.hide = function() {
            $mdDialog.hide();
        };
        //cambiar a pantalla completa
        $scope.isFullscreen = false;

        $scope.toggleFullScreen = function(e) {
            $scope.isFullscreen = !$scope.isFullscreen;
        }
        $scope.cargarFiltro = 0;
        $scope.toggleRightOpciones = function(navID) {
            $mdSidenav(navID)
                .toggle()
                .then(function() {
                    if ($scope.cargarFiltro < 1) {
                        $scope.getDimension('anio', 0);
                        $scope.getDimension('month', 1);
                        $scope.getDimension("codigo,indicador,color, '" + $scope.filtro.tipo + "' as categoriaEvaluacion", 2);
                        $scope.getDimension('jurisdiccion', 3);
                        $scope.getDimension('municipio', 4);
                        $scope.getDimension('zona', 5);
                        $scope.getDimension('cone', 6);
                        $scope.cargarFiltro++;
                    }
                });
        };
        $scope.cambiarAnio = function(anio) {
            
            $scope.filtro.anio = anio;
            $scope.getDimension('month', 1);
            $scope.getDimension("codigo,indicador,color, '" + $scope.filtro.tipo + "' as categoriaEvaluacion", 2);
            $scope.getDimension('jurisdiccion', 3);
            $scope.getDimension('municipio', 4);
            $scope.getDimension('zona', 5);
            $scope.getDimension('cone', 6);
        }
        $scope.cambiarBimestre = function(bimestre) {
            $scope.filtro.bimestre = bimestre;
            $scope.getDimension("codigo,indicador,color, '" + $scope.filtro.tipo + "' as categoriaEvaluacion", 2);
            $scope.getDimension('jurisdiccion', 3);
            $scope.getDimension('municipio', 4);
            $scope.getDimension('zona', 5);
            $scope.getDimension('cone', 6);
        }
        $scope.cambiarCategoria = function() {
            $scope.getDimension("codigo,indicador,color, '" + $scope.filtro.tipo + "' as categoriaEvaluacion", 2);

        }

        $scope.intentoOpcion = 0;
        $scope.getDimension = function(nivel, c) {
            $scope.opcion = true;
            var url = "/calidadDimension";
            if ($scope.filtro.tipo == "Recurso")
                url = "/recursoDimension";

            CrudDataApi.lista(url + '?filtro=' + JSON.stringify($scope.filtro) + '&nivel=' + nivel, function(data) {
                $scope.datos[c] = data.data;
                $scope.opcion = false;
            }, function(e) {
                if ($scope.intentoOpcion < 1) {
                    $scope.getDimension(nivel, c);
                    $scope.intentoOpcion++;
                }
                $scope.opcion = false;
            });
        };

        // obtiene los datos necesarios para crear el grid (listado)
        $scope.intento = 0;
        $scope.init = function() {
            var url = '/criterioDash';
            if ($scope.filtro.estricto)
                url = "/criterioEstricto";

            $scope.criterioDetalle = true;
            CrudDataApi.lista(url + "?filtro=" + JSON.stringify($scope.filtro), function(data) {
                if (data.status == '407')
                    $window.location = "acceso";

                if (data.status == 200) {
                    $scope.dato = data.data;
                    $scope.total = data.total;
                    $scope.anios = data.anio;
                    $scope.criterioDetalle = false;
                    $scope.datosOk = true;
                } else {
                    $scope.criterioDetalle = false;
                    $scope.datosOk = false;
                }
                $scope.criterioDetalle = false;
            }, function(e) {
                if ($scope.intento < 1) {
                    $scope.init();
                    $scope.intento++;
                }
                $scope.criterioDetalle = false;
            });
        };
        $scope.init();
    })
 
    angular.module('DashboardModule').controller('criterioCalidadController', function($scope, $localStorage, $http, $window, $location, $timeout, $route, flash, errorFlash, URLS, $mdDialog, $mdUtil, $mdSidenav, $translate, CrudDataApi) {

        $scope.criterioCalidad = true;

        $scope.datos = {};

        $scope.showModal = false;
        $scope.showModalCriterio = false;
        $scope.chart;
        $scope.vercriterioCalidad = "";
        $scope.dimension = [];
        $scope.datosOk = true;

        $scope.tempIndicador = [];
        $scope.toggle = function(item, list) {
            var idx = list.indexOf(item);
            if (idx > -1)
                list.splice(idx, 1);
            else {
                list.push(item);
            }
        };
        $scope.valorGuardado = [];
        $scope.getCriterioDetalle = function(ev, value) {
            $scope.indicadorSeleccionado = value;
            $scope.showDialog = $mdDialog;
            $scope.tipo = 0;
            delete $scope.filtro.valor;
            delete $scope.filtro.grado;
            var url = "/criterioDetalle";
            $scope.cargando = true;
            $scope.criterioDetalle = true;
            $scope.filtro.id = value.codigo;
            CrudDataApi.lista(url + "?filtro=" + JSON.stringify($scope.filtro), function(data) {
                if (data.status == '407')
                    $window.location = "acceso";

                if (data.status == 200) {
                    $scope.valorGuardado[0] = value;
                    $scope.indicadorDetalle = data.data;
                    $scope.criterioDetalle = false;

                    $scope.showDialog.show({
                        targetEvent: ev,
                        scope: $scope.$new(),
                        templateUrl: 'src/dashboard/views/dashboard/criterio-detalle.html',
                        clickOutsideToClose: true
                    });
                    $scope.datosOk = true;
                } else {
                    $scope.criterioDetalle = false;
                    $scope.datosOk = false;
                }
                $scope.cargando = false;
                $scope.criterioDetalle = false;
            }, function(e) {
                $scope.criterio = false;
                $scope.cargando = false;
            });
        }
        $scope.criterioDetalle = false;
        $scope.tipo = 0;
        $scope.dimen = ['criterio', 'jurisdiccion', 'clues'];

        $scope.getCriterioDetalleClick2 = function(ev, value, tipo) {
            $scope.showDialog.show({
                targetEvent: ev,
                scope: $scope.$new(),
                templateUrl: 'src/dashboard/views/dashboard/criterio-detalle.html',
                clickOutsideToClose: true
            });
            $scope.getCriterioDetalleClick(ev, value, tipo);
        }
         $scope.getCriterioDetalleClick = function(ev, value, tipo) {
            $scope.tipo = tipo;
            var url = "/criterioDetalle";
            $scope.criterioDetalle = true;
            $scope.filtro.id = $scope.indicadorSeleccionado.codigo;
            $scope.filtro.valor = $scope.filtro.valor + "|" + value;
            $scope.filtro.grado = tipo;

            angular.forEach($scope.valorGuardado, function(v, k) {
                if (k > tipo) {
                    $scope.valorGuardado[k] = "";
                    delete $scope.valorGuardado[k];
                }
            });
            CrudDataApi.lista(url + "?filtro=" + JSON.stringify($scope.filtro), function(data) {
                if (data.status == '407')
                    $window.location = "acceso";

                if (data.status == 200) {
                    $scope.valorGuardado[tipo] = value;
                    $scope.indicadorDetalle = data.data;
                }
                $scope.criterioDetalle = false;
            }, function(e) {
                $scope.criterioDetalle = false;
            });
        }

        $scope.getCluesCriterios = function(ev, value, tipo) {
            $scope.filtro.valor = $scope.filtro.valor + "|" + value;
            $scope.filtro.grado = tipo;
            $scope.filtro.indicador = $scope.indicadorSeleccionado.codigo;
            var url = "/criterioDetalle";
            $scope.criterioDetalle = true;
            CrudDataApi.lista(url + "?filtro=" + JSON.stringify($scope.filtro), function(data) {
                if (data.status == '407')
                    $window.location = "acceso";

                if (data.status == 200) {
                    $scope.datoClues = data.data;
                    $scope.editDialog = $mdDialog;
                    $scope.editDialog.show({
                        targetEvent: ev,
                        scope: $scope.$new(),
                        templateUrl: 'src/dashboard/views/dashboard/criterio-clues.html',
                        clickOutsideToClose: true
                    });
                } else {
                    $scope.criterioDetalle = false;
                    errorFlash.error(data);
                }
                $scope.criterioDetalle = false;
            }, function(e) {
                errorFlash.error(e);
                $scope.criterioDetalle = false;
            });
        }

        /**
         * @ngdoc method
         * @name Transaccion.DashboardCtrl#verEvaluacion
         * @methodOf Transaccion.DashboardCtrl
         *
         * @description
         * Accion para el click del listado de evaluaciones que correspondan al segundo click
         * @param {int} id identificador del objeto click
         * @param {string} tipo tipo de categoria Recurso o Calidad
         * @param {string} indicador codigo del indicador
         */
        $scope.verEvaluacion = function(ev, id) {
            $scope.evaluacion_id = id;
            $scope.filtro.valor = id;
            $scope.filtro.grado = 5;
            $scope.filtro.nivel = 3;
            $scope.filtro.historial = false;
            $scope.filtro.indicador = $scope.indicadorSeleccionado.codigo;
            var url = "/criterioEvaluacion";
            $scope.criterioDetalle = true;

            CrudDataApi.lista(url + "?filtro=" + JSON.stringify($scope.filtro), function(data) {
                if (data.status == '407')
                    $window.location = "acceso";

                if (data.status == 200) {
                    $scope.evaluacion = data.data;
                    $scope.editDialog = $mdDialog;
                    $scope.editDialog.show({
                        targetEvent: ev,
                        scope: $scope.$new(),
                        templateUrl: 'src/dashboard/views/dashboard/criterio-evaluacion.html',
                        clickOutsideToClose: true
                    });
                } else {
                    $scope.criterioDetalle = false;
                    errorFlash.error(data);
                }
                $scope.criterioDetalle = false;
            }, function(e) {
                errorFlash.error(e);
                $scope.criterioDetalle = false;
            });
        }
        $scope.verEvaluacionCompleta = function() {
                var id = $scope.evaluacion_id;
                $location.path("/evaluacion-caliad/ver").search({ id: id, });
            }
            //lenar los check box tipo array
        $scope.exists = function(item, list) {
            return list.indexOf(item) > -1;
        };

        $scope.cambiarVerTodoIndicador = function() {
            if ($scope.filtro.verTodosIndicadores) {
                $scope.filtro.indicador = [];
                $scope.chipIndicador = [];
                $scope.tempIndicador = [];
            }
        }
        $scope.cambiarVerTodoUM = function() {
            if ($scope.filtro.verTodosUM) {
                $scope.filtro.um = {};
                $scope.filtro.um.tipo = 'municipio';
            }
        }

        $scope.cambiarVerTodoClues = function() {
            $scope.filtro.clues = [];
        }

        var d = new Date();
        $scope.opcion = true;

        $scope.filtro = {};
        $scope.filtro.tipo = "Calidad";
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
        $scope.filtro.estricto = false;
        $scope.filtro.valor = '';

        //aplicar los filtros al area del grafico
        $scope.aplicarFiltro = function(avanzado, item) {
            $scope.filtros.activo = true;
            $scope.filtro.indicador = $scope.tempIndicador;
            if (!avanzado) {
                $scope.filtro.indicador = [];
                $scope.filtro.verTodosIndicadores = false;
                if ($scope.filtro.indicador.indexOf(item.codigo) == -1) {
                    $scope.filtro.indicador.push(item.codigo);
                    $scope.chipIndicador[item.codigo] = item;
                }

            }
            $scope.contador = 0;
            $scope.intento = 0;
            $scope.init();
            $mdSidenav('criterioCalidad').close();
        };
        $scope.contador = 0;

        //quitar los filtros seleccionados del dialog
        $scope.quitarFiltro = function(avanzado) {
            $scope.filtro.indicador = [];
            $scope.filtro.clues = [];
            $scope.filtro.um = {};
            $scope.filtro.um.tipo = "municipio";
            $scope.filtro.verTodosIndicadores = true;
            $scope.filtro.verTodosUM = true;
            $scope.filtros.activo = false;

            $scope.intento = 0;
            $scope.contador = 0;
            $scope.init();
            $mdSidenav('criterioCalidad').close();
        };

        // cerrar el dialog
        $scope.hide = function() {
            $mdDialog.hide();
        };
        //cambiar a pantalla completa
        $scope.isFullscreen = false;

        $scope.toggleFullScreen = function(e) {
            $scope.isFullscreen = !$scope.isFullscreen;
        }
        $scope.cargarFiltro = 0;
        $scope.toggleRightOpciones = function(navID) {
            $mdSidenav(navID)
                .toggle()
                .then(function() {
                    if ($scope.cargarFiltro < 1) {
                        $scope.getDimension('anio', 0);
                        $scope.getDimension('month', 1);
                        $scope.getDimension("codigo,indicador,color, '" + $scope.filtro.tipo + "' as categoriaEvaluacion", 2);
                        $scope.getDimension('jurisdiccion', 3);
                        $scope.getDimension('municipio', 4);
                        $scope.getDimension('zona', 5);
                        $scope.getDimension('cone', 6);
                        $scope.cargarFiltro++;
                    }
                });
        };
        $scope.cambiarAnio = function(anio) {
            
            $scope.filtro.anio = anio;
            $scope.getDimension('month', 1);
            $scope.getDimension("codigo,indicador,color, '" + $scope.filtro.tipo + "' as categoriaEvaluacion", 2);
            $scope.getDimension('jurisdiccion', 3);
            $scope.getDimension('municipio', 4);
            $scope.getDimension('zona', 5);
            $scope.getDimension('cone', 6);
        }
        $scope.cambiarBimestre = function(bimestre) {
            $scope.filtro.bimestre = bimestre;
            $scope.getDimension("codigo,indicador,color, '" + $scope.filtro.tipo + "' as categoriaEvaluacion", 2);
            $scope.getDimension('jurisdiccion', 3);
            $scope.getDimension('municipio', 4);
            $scope.getDimension('zona', 5);
            $scope.getDimension('cone', 6);
        }
        $scope.cambiarCategoria = function() {
            $scope.getDimension("codigo,indicador,color, '" + $scope.filtro.tipo + "' as categoriaEvaluacion", 2);
        }

        $scope.intentoOpcion = 0;
        $scope.getDimension = function(nivel, c) {
            $scope.opcion = true;
            var url = "/calidadDimension";
            if ($scope.filtro.tipo == "Recurso")
                url = "/recursoDimension";

            CrudDataApi.lista(url + '?filtro=' + JSON.stringify($scope.filtro) + '&nivel=' + nivel, function(data) {
                $scope.datos[c] = data.data;
                $scope.opcion = false;
            }, function(e) {
                if ($scope.intentoOpcion < 1) {
                    $scope.getDimension(nivel, c);
                    $scope.intentoOpcion++;
                }
                $scope.opcion = false;
            });
        };

        // obtiene los datos necesarios para crear el grid (listado)
        $scope.intento = 0;
        $scope.init = function() {
            var url = '/criterioDash';
            if ($scope.filtro.estricto)
                url = "/criterioEstricto";

            $scope.criterioDetalle = true;
            CrudDataApi.lista(url + "?filtro=" + JSON.stringify($scope.filtro), function(data) {
                if (data.status == '407')
                    $window.location = "acceso";

                if (data.status == 200) {
                    $scope.dato = data.data;
                    $scope.total = data.total;
                    $scope.anios = data.anio;
                    $scope.criterioDetalle = false;
                    $scope.datosOk = true;
                } else {
                    $scope.criterioDetalle = false;
                    $scope.datosOk = false;
                }
                $scope.criterioDetalle = false;
            }, function(e) {
                if ($scope.intento < 1) {
                    $scope.init();
                    $scope.intento++;
                }
                $scope.criterioDetalle = false;
            });
        };
        $scope.init();
    })
    // fin criterios


    angular.module('DashboardModule').controller('alertaRecursoController', function($scope, $localStorage, $http, $window, $location, $timeout, $route, flash, errorFlash, URLS, $mdDialog, $mdUtil, $mdSidenav, $translate, CrudDataApi) {

        $scope.alertaRecurso = true;

        $scope.datos = {};

        $scope.showModal = false;
        $scope.showModalCriterio = false;
        $scope.chart;
        $scope.veralertaRecurso = "";
        $scope.dimension = [];
        $scope.datosOk = true;

        $scope.tempIndicador = [];
        $scope.toggle = function(item, list) {
            var idx = list.indexOf(item);
            if (idx > -1)
                list.splice(idx, 1);
            else {
                list.push(item);
            }
        };
        $scope.valorGuardado = [];
        $scope.getAlertaDetalle = function(ev, value) {
            $scope.indicadorSeleccionado = value;
            $scope.showDialog = $mdDialog;
            $scope.tipo = 0;
            delete $scope.filtro.valor;
            delete $scope.filtro.grado;
            var url = "/alertaDetalle";
            $scope.cargando = true;
            $scope.alertaRecurso = true;
            $scope.filtro.id = value.codigo;
            CrudDataApi.lista(url + "?filtro=" + JSON.stringify($scope.filtro), function(data) {
                if (data.status == '407')
                    $window.location = "acceso";

                if (data.status == 200) {
                    $scope.valorGuardado[0] = value;
                    $scope.indicadorDetalle = data.data;
                    $scope.alertaRecurso = false;
                    $scope.datosOk = true;

                    $scope.showDialog.show({
                        targetEvent: ev,
                        scope: $scope.$new(),
                        templateUrl: 'src/dashboard/views/alerta_detalle.html',
                        clickOutsideToClose: true
                    });

                } else {
                    $scope.alertaRecurso = false;
                    $scope.datosOk = false;
                }
                $scope.cargando = false;
                $scope.alertaRecurso = false;
            }, function(e) {
                $scope.alerta = false;
                $scope.cargando = false;
            });
        }
        $scope.alertaDetalle = false;
        $scope.tipo = 0;
        $scope.dimen = ['jurisdiccion', 'municipio', 'cone'];

        $scope.getAlertaDetalleClick2 = function(ev, value, tipo) {
            $scope.showDialog.show({
                targetEvent: ev,
                scope: $scope.$new(),
                templateUrl: 'src/dashboard/views/alerta_detalle.html',
                clickOutsideToClose: true
            });
            $scope.getAlertaDetalleClick(ev, value, tipo);
        }
        $scope.getAlertaDetalleClick = function(ev, value, tipo) {
            $scope.tipo = tipo;
            var url = "/alertaDetalle";
            $scope.alertaDetalle = true;
            $scope.filtro.id = $scope.indicadorSeleccionado.codigo;
            $scope.filtro.valor = value;
            $scope.filtro.grado = tipo;

            angular.forEach($scope.valorGuardado, function(v, k) {
                if (k > tipo) {
                    $scope.valorGuardado[k] = "";
                    delete $scope.valorGuardado[k];
                }

            });
            CrudDataApi.lista(url + "?filtro=" + JSON.stringify($scope.filtro), function(data) {
                if (data.status == '407')
                    $window.location = "acceso";

                if (data.status == 200) {
                    $scope.valorGuardado[tipo] = value;
                    $scope.indicadorDetalle = data.data;
                }
                $scope.alertaDetalle = false;
            }, function(e) {
                $scope.alertaDetalle = false;
            });
        }

        $scope.getCluesCriterios = function(ev, evaluacion) {
            $scope.filtro.valor = evaluacion;
            $scope.filtro.grado = 4;
            $scope.filtro.indicador = $scope.indicadorSeleccionado.codigo;
            var url = "/alertaDetalle";
            $scope.alertaDetalle = true;
            CrudDataApi.lista(url + "?filtro=" + JSON.stringify($scope.filtro), function(data) {
                if (data.status == '407')
                    $window.location = "acceso";

                if (data.status == 200) {
                    $scope.datoClues = data.data;
                    $scope.editDialog = $mdDialog;
                    $scope.editDialog.show({
                        targetEvent: ev,
                        scope: $scope.$new(),
                        templateUrl: 'src/dashboard/views/alerta_clues.html',
                        clickOutsideToClose: true
                    });
                } else {
                    $scope.alertaDetalle = false;
                    errorFlash.error(data);
                }
                $scope.alertaDetalle = false;
            }, function(e) {
                errorFlash.error(e);
                $scope.alertaDetalle = false;
            });
        }

        /**
         * @ngdoc method
         * @name Transaccion.DashboardCtrl#verEvaluacion
         * @methodOf Transaccion.DashboardCtrl
         *
         * @description
         * Accion para el click del listado de evaluaciones que correspondan al segundo click
         * @param {int} id identificador del objeto click
         * @param {string} tipo tipo de categoria Recurso o Calidad
         * @param {string} indicador codigo del indicador
         */
        $scope.verEvaluacion = function(ev, id) {
            $scope.evaluacion_id = id;
            $scope.filtro.valor = id;
            $scope.filtro.grado = 5;
            $scope.filtro.nivel = 3;
            $scope.filtro.historial = false;
            $scope.filtro.indicador = $scope.indicadorSeleccionado.codigo;
            var url = "/alertaEvaluacion";
            $scope.alertaDetalle = true;

            CrudDataApi.lista(url + "?filtro=" + JSON.stringify($scope.filtro), function(data) {
                if (data.status == '407')
                    $window.location = "acceso";

                if (data.status == 200) {
                    $scope.evaluacion = data.data;
                    $scope.editDialog = $mdDialog;
                    $scope.editDialog.show({
                        targetEvent: ev,
                        scope: $scope.$new(),
                        templateUrl: 'src/dashboard/views/alerta_evaluacion.html',
                        clickOutsideToClose: true
                    });
                } else {
                    $scope.alertaDetalle = false;
                    errorFlash.error(data);
                }
                $scope.alertaDetalle = false;
            }, function(e) {
                errorFlash.error(e);
                $scope.alertaDetalle = false;
            });
        }
        $scope.verEvaluacionCompleta = function() {
            var id = $scope.evaluacion_id;
            $location.path("/evaluacion-recurso/ver").search({ id: id, });
        }

        //lenar los check box tipo array
        $scope.exists = function(item, list) {
            return list.indexOf(item) > -1;
        };

        $scope.cambiarVerTodoIndicador = function() {
            if ($scope.filtro.verTodosIndicadores) {
                $scope.filtro.indicador = [];
                $scope.chipIndicador = [];
                $scope.tempIndicador = [];
            }
        }
        $scope.cambiarVerTodoUM = function() {
            if ($scope.filtro.verTodosUM) {
                $scope.filtro.um = {};
                $scope.filtro.um.tipo = 'municipio';
            }
        }

        $scope.cambiarVerTodoClues = function() {
            $scope.filtro.clues = [];
        }

        var d = new Date();
        $scope.opcion = true;

        $scope.filtro = {};
        $scope.filtro.tipo = "Recurso";
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
        $scope.filtro.estricto = false;

        //aplicar los filtros al area del grafico
        $scope.aplicarFiltro = function(avanzado, item) {
            $scope.filtros.activo = true;
            $scope.filtro.indicador = $scope.tempIndicador;
            if (!avanzado) {
                $scope.filtro.indicador = [];
                $scope.filtro.verTodosIndicadores = false;
                if ($scope.filtro.indicador.indexOf(item.codigo) == -1) {
                    $scope.filtro.indicador.push(item.codigo);
                    $scope.chipIndicador[item.codigo] = item;
                }

            }
            $scope.contador = 0;
            $scope.intento = 0;
            $scope.init();
            $mdSidenav('alertaRecurso').close();
        };
        $scope.contador = 0;

        //quitar los filtros seleccionados del dialog
        $scope.quitarFiltro = function(avanzado) {
            $scope.filtro.indicador = [];
            $scope.filtro.clues = [];
            $scope.filtro.um = {};
            $scope.filtro.um.tipo = "municipio";
            $scope.filtro.verTodosIndicadores = true;
            $scope.filtro.verTodosUM = true;
            $scope.filtros.activo = false;

            $scope.intento = 0;
            $scope.contador = 0;
            $scope.init();
            $mdSidenav('alertaRecurso').close();
        };

        // cerrar el dialog
        $scope.hide = function() {
            $mdDialog.hide();
        };
        //cambiar a pantalla completa
        $scope.isFullscreen = false;

        $scope.toggleFullScreen = function(e) {
            $scope.isFullscreen = !$scope.isFullscreen;
        }
        $scope.cargarFiltro = 0;
        $scope.toggleRightOpciones = function(navID) {
            $mdSidenav(navID)
                .toggle()
                .then(function() {
                    if ($scope.cargarFiltro < 1) {
                        $scope.getDimension('anio', 0);
                        $scope.getDimension('month', 1);
                        $scope.getDimension("codigo,indicador,color, '" + $scope.filtro.tipo + "' as categoriaEvaluacion", 2);
                        $scope.getDimension('jurisdiccion', 3);
                        $scope.getDimension('municipio', 4);
                        $scope.getDimension('zona', 5);
                        $scope.getDimension('cone', 6);
                        $scope.cargarFiltro++;
                    }
                });
        };
        $scope.cambiarAnio = function(anio) {
            
            $scope.filtro.anio = anio;
            $scope.getDimension('month', 1);
            $scope.getDimension("codigo,indicador,color, '" + $scope.filtro.tipo + "' as categoriaEvaluacion", 2);
            $scope.getDimension('jurisdiccion', 3);
            $scope.getDimension('municipio', 4);
            $scope.getDimension('zona', 5);
            $scope.getDimension('cone', 6);
        }
        $scope.cambiarBimestre = function(bimestre) {
            $scope.filtro.bimestre = bimestre;
            $scope.getDimension("codigo,indicador,color, '" + $scope.filtro.tipo + "' as categoriaEvaluacion", 2);
            $scope.getDimension('jurisdiccion', 3);
            $scope.getDimension('municipio', 4);
            $scope.getDimension('zona', 5);
            $scope.getDimension('cone', 6);
        }
        $scope.cambiarCategoria = function() {
            $scope.getDimension("codigo,indicador,color, '" + $scope.filtro.tipo + "' as categoriaEvaluacion", 2);

        }

        $scope.intentoOpcion = 0;
        $scope.getDimension = function(nivel, c) {
            $scope.opcion = true;
            var url = "/calidadDimension";
            if ($scope.filtro.tipo == "Recurso")
                url = "/recursoDimension";

            CrudDataApi.lista(url + '?filtro=' + JSON.stringify($scope.filtro) + '&nivel=' + nivel, function(data) {
                $scope.datos[c] = data.data;
                $scope.opcion = false;
            }, function(e) {
                if ($scope.intentoOpcion < 1) {
                    $scope.getDimension(nivel, c);
                    $scope.intentoOpcion++;
                }
                $scope.opcion = false;
            });
        };

        // obtiene los datos necesarios para crear el grid (listado)
        $scope.intento = 0;
        $scope.init = function() {
            var url = '/alertaDash';
            if ($scope.filtro.estricto)
                url = "/alertaEstricto";

            $scope.alertaRecurso = true;
            CrudDataApi.lista(url + "?filtro=" + JSON.stringify($scope.filtro), function(data) {
                if (data.status == '407')
                    $window.location = "acceso";

                if (data.status == 200) {
                    $scope.dato = data.data;
                    $scope.total = data.total;
                    $scope.anios = data.anio;
                    $scope.alertaRecurso = false;
                    $scope.datosOk = true;
                } else {
                    $scope.alertaRecurso = false;
                    $scope.datosOk = false;
                }
                $scope.alertaRecurso = false;
            }, function(e) {
                if ($scope.intento < 1) {
                    $scope.init();
                    $scope.intento++;
                }
                $scope.alerta = false;
            });
        };
        $scope.init();
    })

    angular.module('DashboardModule').controller('alertaCalidadController', function($scope, $localStorage, $http, $window, $location, $timeout, $route, flash, errorFlash, URLS, $mdDialog, $mdUtil, $mdSidenav, $translate, CrudDataApi) {

        $scope.alertaCalidad = true;

        $scope.datos = {};

        $scope.showModal = false;
        $scope.showModalCriterio = false;
        $scope.chart;
        $scope.veralertaCalidad = "";
        $scope.dimension = [];
        $scope.datosOk = true;

        $scope.tempIndicador = [];
        $scope.toggle = function(item, list) {
            var idx = list.indexOf(item);
            if (idx > -1)
                list.splice(idx, 1);
            else {
                list.push(item);
            }
        };
        $scope.valorGuardado = [];
        $scope.getAlertaDetalle = function(ev, value) {
            $scope.indicadorSeleccionado = value;
            $scope.showDialog = $mdDialog;
            $scope.tipo = 0;
            delete $scope.filtro.valor;
            delete $scope.filtro.grado;
            var url = "/alertaDetalle";
            $scope.cargando = true;
            $scope.alertaRecurso = true;
            $scope.filtro.id = value.codigo;
            CrudDataApi.lista(url + "?filtro=" + JSON.stringify($scope.filtro), function(data) {
                if (data.status == '407')
                    $window.location = "acceso";

                if (data.status == 200) {
                    $scope.valorGuardado[0] = value;
                    $scope.indicadorDetalle = data.data;
                    $scope.alertaRecurso = false;

                    $scope.showDialog.show({
                        targetEvent: ev,
                        scope: $scope.$new(),
                        templateUrl: 'src/dashboard/views/alerta_detalle.html',
                        clickOutsideToClose: true
                    });
                    $scope.datosOk = true;
                } else {
                    $scope.alertaRecurso = false;
                    $scope.datosOk = false;
                }
                $scope.cargando = false;
                $scope.alertaRecurso = false;
            }, function(e) {
                $scope.alerta = false;
                $scope.cargando = false;
            });
        }
        $scope.alertaDetalle = false;
        $scope.tipo = 0;
        $scope.dimen = ['jurisdiccion', 'municipio', 'cone'];

        $scope.getAlertaDetalleClick2 = function(ev, value, tipo) {
            $scope.showDialog.show({
                targetEvent: ev,
                scope: $scope.$new(),
                templateUrl: 'src/dashboard/views/alerta_detalle.html',
                clickOutsideToClose: true
            });
            $scope.getAlertaDetalleClick(ev, value, tipo);
        }
        $scope.getAlertaDetalleClick = function(ev, value, tipo) {
            $scope.tipo = tipo;
            var url = "/alertaDetalle";
            $scope.alertaDetalle = true;
            $scope.filtro.id = $scope.indicadorSeleccionado.codigo;
            $scope.filtro.valor = value;
            $scope.filtro.grado = tipo;

            angular.forEach($scope.valorGuardado, function(v, k) {
                if (k > tipo) {
                    $scope.valorGuardado[k] = "";
                    delete $scope.valorGuardado[k];
                }

            });
            CrudDataApi.lista(url + "?filtro=" + JSON.stringify($scope.filtro), function(data) {
                if (data.status == '407')
                    $window.location = "acceso";

                if (data.status == 200) {
                    $scope.valorGuardado[tipo] = value;
                    $scope.indicadorDetalle = data.data;
                }
                $scope.alertaDetalle = false;
            }, function(e) {
                $scope.alertaDetalle = false;
            });
        }

        $scope.getCluesCriterios = function(ev, evaluacion) {
            $scope.filtro.valor = evaluacion;
            $scope.filtro.grado = 4;
            $scope.filtro.indicador = $scope.indicadorSeleccionado.codigo;
            var url = "/alertaDetalle";
            $scope.alertaDetalle = true;
            CrudDataApi.lista(url + "?filtro=" + JSON.stringify($scope.filtro), function(data) {
                if (data.status == '407')
                    $window.location = "acceso";

                if (data.status == 200) {
                    $scope.datoClues = data.data;
                    $scope.editDialog = $mdDialog;
                    $scope.editDialog.show({
                        targetEvent: ev,
                        scope: $scope.$new(),
                        templateUrl: 'src/dashboard/views/alerta_clues.html',
                        clickOutsideToClose: true
                    });
                } else {
                    $scope.alertaDetalle = false;
                    errorFlash.error(data);
                }
                $scope.alertaDetalle = false;
            }, function(e) {
                errorFlash.error(e);
                $scope.alertaDetalle = false;
            });
        }

        /**
         * @ngdoc method
         * @name Transaccion.DashboardCtrl#verEvaluacion
         * @methodOf Transaccion.DashboardCtrl
         *
         * @description
         * Accion para el click del listado de evaluaciones que correspondan al segundo click
         * @param {int} id identificador del objeto click
         * @param {string} tipo tipo de categoria Recurso o Calidad
         * @param {string} indicador codigo del indicador
         */
        $scope.verEvaluacion = function(ev, id) {
            $scope.evaluacion_id = id;
            $scope.filtro.valor = id;
            $scope.filtro.grado = 5;
            $scope.filtro.nivel = 3;
            $scope.filtro.historial = false;
            $scope.filtro.indicador = $scope.indicadorSeleccionado.codigo;
            var url = "/alertaEvaluacion";
            $scope.alertaDetalle = true;

            CrudDataApi.lista(url + "?filtro=" + JSON.stringify($scope.filtro), function(data) {
                if (data.status == '407')
                    $window.location = "acceso";

                if (data.status == 200) {
                    $scope.evaluacion = data.data;
                    $scope.editDialog = $mdDialog;
                    $scope.editDialog.show({
                        targetEvent: ev,
                        scope: $scope.$new(),
                        templateUrl: 'src/dashboard/views/alerta_evaluacion.html',
                        clickOutsideToClose: true
                    });
                } else {
                    $scope.alertaDetalle = false;
                    errorFlash.error(data);
                }
                $scope.alertaDetalle = false;
            }, function(e) {
                errorFlash.error(e);
                $scope.alertaDetalle = false;
            });
        }
        $scope.verEvaluacionCompleta = function() {
                var id = $scope.evaluacion_id;
                $location.path("/evaluacion-caliad/ver").search({ id: id, });
            }
            //lenar los check box tipo array
        $scope.exists = function(item, list) {
            return list.indexOf(item) > -1;
        };

        $scope.cambiarVerTodoIndicador = function() {
            if ($scope.filtro.verTodosIndicadores) {
                $scope.filtro.indicador = [];
                $scope.chipIndicador = [];
                $scope.tempIndicador = [];
            }
        }
        $scope.cambiarVerTodoUM = function() {
            if ($scope.filtro.verTodosUM) {
                $scope.filtro.um = {};
                $scope.filtro.um.tipo = 'municipio';
            }
        }

        $scope.cambiarVerTodoClues = function() {
            $scope.filtro.clues = [];
        }

        var d = new Date();
        $scope.opcion = true;

        $scope.filtro = {};
        $scope.filtro.tipo = "Calidad";
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
        $scope.filtro.estricto = false;

        //aplicar los filtros al area del grafico
        $scope.aplicarFiltro = function(avanzado, item) {
            $scope.filtros.activo = true;
            $scope.filtro.indicador = $scope.tempIndicador;
            if (!avanzado) {
                $scope.filtro.indicador = [];
                $scope.filtro.verTodosIndicadores = false;
                if ($scope.filtro.indicador.indexOf(item.codigo) == -1) {
                    $scope.filtro.indicador.push(item.codigo);
                    $scope.chipIndicador[item.codigo] = item;
                }

            }
            $scope.contador = 0;
            $scope.intento = 0;
            $scope.init();
            $mdSidenav('alertaCalidad').close();
        };
        $scope.contador = 0;

        //quitar los filtros seleccionados del dialog
        $scope.quitarFiltro = function(avanzado) {
            $scope.filtro.indicador = [];
            $scope.filtro.clues = [];
            $scope.filtro.um = {};
            $scope.filtro.um.tipo = "municipio";
            $scope.filtro.verTodosIndicadores = true;
            $scope.filtro.verTodosUM = true;
            $scope.filtros.activo = false;

            $scope.intento = 0;
            $scope.contador = 0;
            $scope.init();
            $mdSidenav('alertaCalidad').close();
        };

        // cerrar el dialog
        $scope.hide = function() {
            $mdDialog.hide();
        };
        //cambiar a pantalla completa
        $scope.isFullscreen = false;

        $scope.toggleFullScreen = function(e) {
            $scope.isFullscreen = !$scope.isFullscreen;
        }
        $scope.cargarFiltro = 0;
        $scope.toggleRightOpciones = function(navID) {
            $mdSidenav(navID)
                .toggle()
                .then(function() {
                    if ($scope.cargarFiltro < 1) {
                        $scope.getDimension('anio', 0);
                        $scope.getDimension('month', 1);
                        $scope.getDimension("codigo,indicador,color, '" + $scope.filtro.tipo + "' as categoriaEvaluacion", 2);
                        $scope.getDimension('jurisdiccion', 3);
                        $scope.getDimension('municipio', 4);
                        $scope.getDimension('zona', 5);
                        $scope.getDimension('cone', 6);
                        $scope.cargarFiltro++;
                    }
                });
        };
        $scope.cambiarAnio = function(anio) {
            
            $scope.filtro.anio = anio;
            $scope.getDimension('month', 1);
            $scope.getDimension("codigo,indicador,color, '" + $scope.filtro.tipo + "' as categoriaEvaluacion", 2);
            $scope.getDimension('jurisdiccion', 3);
            $scope.getDimension('municipio', 4);
            $scope.getDimension('zona', 5);
            $scope.getDimension('cone', 6);
        }
        $scope.cambiarBimestre = function(bimestre) {
            $scope.filtro.bimestre = bimestre;
            $scope.getDimension("codigo,indicador,color, '" + $scope.filtro.tipo + "' as categoriaEvaluacion", 2);
            $scope.getDimension('jurisdiccion', 3);
            $scope.getDimension('municipio', 4);
            $scope.getDimension('zona', 5);
            $scope.getDimension('cone', 6);
        }
        $scope.cambiarCategoria = function() {
            $scope.getDimension("codigo,indicador,color, '" + $scope.filtro.tipo + "' as categoriaEvaluacion", 2);
        }

        $scope.intentoOpcion = 0;
        $scope.getDimension = function(nivel, c) {
            $scope.opcion = true;
            var url = "/calidadDimension";
            if ($scope.filtro.tipo == "Recurso")
                url = "/recursoDimension";

            CrudDataApi.lista(url + '?filtro=' + JSON.stringify($scope.filtro) + '&nivel=' + nivel, function(data) {
                $scope.datos[c] = data.data;
                $scope.opcion = false;
            }, function(e) {
                if ($scope.intentoOpcion < 1) {
                    $scope.getDimension(nivel, c);
                    $scope.intentoOpcion++;
                }
                $scope.opcion = false;
            });
        };

        // obtiene los datos necesarios para crear el grid (listado)
        $scope.intento = 0;
        $scope.init = function() {
            var url = '/alertaDash';
            if ($scope.filtro.estricto)
                url = "/alertaEstricto";

            $scope.alertaCalidad = true;
            CrudDataApi.lista(url + "?filtro=" + JSON.stringify($scope.filtro), function(data) {
                if (data.status == '407')
                    $window.location = "acceso";

                if (data.status == 200) {
                    $scope.dato = data.data;
                    $scope.total = data.total;
                    $scope.anios = data.anio;
                    $scope.alertaCalidad = false;
                    $scope.datosOk = true;
                } else {
                    $scope.alertaCalidad = false;
                    $scope.datosOk = false;
                }
                $scope.alertaCalidad = false;
            }, function(e) {
                if ($scope.intento < 1) {
                    $scope.init();
                    $scope.intento++;
                }
                $scope.alertaCalidad = false;
            });
        };
        $scope.init();
    })
    

    angular.module('DashboardModule').controller('globalRecursoController', function($scope, $http, $window, $location, $timeout, $route, flash, errorFlash, URLS, $mdDialog, $mdUtil, $mdSidenav, $translate, CrudDataApi) {

        $scope.globalRecurso = true;

        $scope.datos = {};

        $scope.showModal = false;
        $scope.showModalCriterio = false;
        $scope.chart;
        $scope.verGlobalRecurso = "";
        $scope.dimension = [];
        $scope.datosOk = true;

        $scope.tempIndicador = [];
        $scope.toggle = function(item, list) {
            var idx = list.indexOf(item);
            if (idx > -1)
                list.splice(idx, 1);
            else {
                list.push(item);
            }
        };
        //lenar los check box tipo array
        $scope.exists = function(item, list) {
            return list.indexOf(item) > -1;
        };

        $scope.cambiarVerTodoIndicador = function() {
            if ($scope.filtro.verTodosIndicadores) {
                $scope.filtro.indicador = [];
                $scope.chipIndicador = [];
                $scope.tempIndicador = [];
            }
        }
        $scope.cambiarVerTodoUM = function() {
            if ($scope.filtro.verTodosUM) {
                $scope.filtro.um = {};
                $scope.filtro.um.tipo = 'municipio';
            }
        }

        $scope.cambiarVerTodoClues = function() {
            $scope.filtro.clues = [];
        }

        $scope.showAlert = function(ev) {
            $mdDialog.show(
                $mdDialog.alert()
                .parent(angular.element(document.getElementById('principal')))
                .title($translate.instant('TITULO_DIALOG'))
                .content($translate.instant('MENSAJE_DIALOG'))
                .ariaLabel('info')
                .ok('Ok')
                .targetEvent(ev)
            );
        };

        var d = new Date();
        $scope.opcion = true;
        $scope.catVisible = false;

        $scope.filtro = {};
        $scope.filtro.top = 5;
        $scope.mostrarTop = [];
        $scope.mostrarTop["Calidad"] = true;
        $scope.mostrarTop["TOP_MENOS"] = true;
        $scope.filtro.tipo = "Recurso";
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

        $scope.valorMostrarTop = 0;
        $scope.cambiarVistaTop = function(valor) {
            if (valor == 1) {
                $scope.mostrarTop["Calidad"] = true;
                $scope.mostrarTop["TOP_MENOS"] = false;
            }
            if (valor == 2) {
                $scope.mostrarTop["Calidad"] = false;
                $scope.mostrarTop["TOP_MENOS"] = true;
            }
            if (valor == 0) {
                $scope.mostrarTop["Calidad"] = true;
                $scope.mostrarTop["TOP_MENOS"] = true;
            }
        };
        //aplicar los filtros al area del grafico
        $scope.aplicarFiltro = function(avanzado, item) {
            $scope.filtros.activo = true;
            $scope.filtro.indicador = $scope.tempIndicador;
            if (!avanzado) {
                $scope.filtro.indicador = [];
                $scope.filtro.verTodosIndicadores = false;
                if ($scope.filtro.indicador.indexOf(item.codigo) == -1) {
                    $scope.filtro.indicador.push(item.codigo);
                    $scope.chipIndicador[item.codigo] = item;
                }

            }
            $scope.contador = 0;
            $scope.intento = 0;
            $scope.init();
            $mdSidenav('globalRecurso').close();
            if ($scope.filtro.visualizar == 'parametro' & $scope.filtro.um.nivel == 'clues') {
                $scope.verInfo = true;
                $scope.showAlert();
            }
        };
        $scope.contador = 0;

        //quitar los filtros seleccionados del dialog
        $scope.quitarFiltro = function(avanzado) {
            $scope.filtro.indicador = [];
            $scope.filtro.clues = [];
            $scope.filtro.um = {};
            $scope.filtro.um.tipo = "municipio";
            $scope.filtro.verTodosIndicadores = true;
            $scope.filtro.verTodosUM = true;
            $scope.filtros.activo = false;

            $scope.intento = 0;
            $scope.contador = 0;
            $scope.init();
            $mdSidenav('globalRecurso').close();
        };

        // cerrar el dialog
        $scope.hide = function() {
            $mdDialog.hide();
        };
        //cambiar a pantalla completa
        $scope.isFullscreen = false;

        $scope.toggleFullScreen = function(e) {
            $scope.isFullscreen = !$scope.isFullscreen;
        }
        $scope.cargarFiltro = 0;
        $scope.toggleRightOpciones = function(navID) {
            $scope.catVisible = false;
            $mdSidenav(navID)
                .toggle()
                .then(function() {
                    if ($scope.cargarFiltro < 1) {
                        $scope.getDimension('anio', 0);
                        $scope.getDimension('month', 1);
                        $scope.getDimension("codigo,indicador,color, '" + $scope.filtro.tipo + "' as categoriaEvaluacion", 2);
                        $scope.getDimension('jurisdiccion', 3);
                        $scope.getDimension('municipio', 4);
                        $scope.getDimension('zona', 5);
                        $scope.getDimension('cone', 6);
                        $scope.cargarFiltro++;
                    }
                });
        };
        $scope.cambiarAnio = function(anio) {
            
            $scope.filtro.anio = anio;
            $scope.getDimension('month', 1);
            $scope.getDimension("codigo,indicador,color, '" + $scope.filtro.tipo + "' as categoriaEvaluacion", 2);
            $scope.getDimension('jurisdiccion', 3);
            $scope.getDimension('municipio', 4);
            $scope.getDimension('zona', 5);
            $scope.getDimension('cone', 6);
        }
        $scope.cambiarBimestre = function(bimestre) {
            $scope.filtro.bimestre = bimestre;
            $scope.getDimension("codigo,indicador,color, '" + $scope.filtro.tipo + "' as categoriaEvaluacion", 2);
            $scope.getDimension('jurisdiccion', 3);
            $scope.getDimension('municipio', 4);
            $scope.getDimension('zona', 5);
            $scope.getDimension('cone', 6);
        }
        $scope.cambiarCategoria = function() {
            $scope.getDimension("codigo,indicador,color, '" + $scope.filtro.tipo + "' as categoriaEvaluacion", 2);
        }

        $scope.intentoOpcion = 0;
        $scope.getDimension = function(nivel, c) {
            $scope.opcion = true;
            var url = "/recursoDimension";

            CrudDataApi.lista(url + '?filtro=' + JSON.stringify($scope.filtro) + '&nivel=' + nivel, function(data) {
                $scope.datos[c] = data.data;
                $scope.opcion = false;

            }, function(e) {
                if ($scope.intentoOpcion < 1) {
                    $scope.getDimension(nivel, c);
                    $scope.intentoOpcion++;
                }
                $scope.opcion = false;
            });
        };

        // obtiene los datos necesarios para crear el grid (listado)
        $scope.intento = 0;
        $scope.init = function() {
            var url = '/TopRecursoGlobal';

            $scope.globalRecurso = true;
            CrudDataApi.lista(url + "?filtro=" + JSON.stringify($scope.filtro), function(data) {
                if (data.status == '407')
                    $window.location = "acceso";

                if (!angular.isUndefined(data.data.TOP_MAS)) {
                    $scope.indicadores = data.indicadores;
                    $scope.dato = data.data;
                    $scope.total = data.total;
                    $scope.anios = data.anio;
                    $scope.globalRecurso = false;
                } else {
                    $scope.globalRecurso = false;
                    $scope.datosOk = false;
                }
                $scope.globalRecurso = false;
            }, function(e) {
                if ($scope.intento < 1) {
                    $scope.init();
                    $scope.intento++;
                }
                $scope.globalRecurso = false;
            });
        };
        $scope.init();
    })

    angular.module('DashboardModule').controller('globalCalidadController', function($scope, $http, $window, $location, $timeout, $route, flash, errorFlash, URLS, $mdDialog, $mdUtil, $mdSidenav, $translate, CrudDataApi) {

        $scope.globalCalidad = true;

        $scope.datos = {};

        $scope.showModal = false;
        $scope.showModalCriterio = false;
        $scope.chart;
        $scope.verGlobalCalidad = "";
        $scope.dimension = [];
        $scope.datosOk = true;

        $scope.tempIndicador = [];
        $scope.toggle = function(item, list) {
            var idx = list.indexOf(item);
            if (idx > -1)
                list.splice(idx, 1);
            else {
                list.push(item);
            }
        };
        //lenar los check box tipo array
        $scope.exists = function(item, list) {
            return list.indexOf(item) > -1;
        };

        $scope.cambiarVerTodoIndicador = function() {
            if ($scope.filtro.verTodosIndicadores) {
                $scope.filtro.indicador = [];
                $scope.chipIndicador = [];
                $scope.tempIndicador = [];
            }
        }
        $scope.cambiarVerTodoUM = function() {
            if ($scope.filtro.verTodosUM) {
                $scope.filtro.um = {};
                $scope.filtro.um.tipo = 'municipio';
            }
        }

        $scope.cambiarVerTodoClues = function() {
            $scope.filtro.clues = [];
        }

        $scope.showAlert = function(ev) {
            $mdDialog.show(
                $mdDialog.alert()
                .parent(angular.element(document.getElementById('principal')))
                .title($translate.instant('TITULO_DIALOG'))
                .content($translate.instant('MENSAJE_DIALOG'))
                .ariaLabel('info')
                .ok('Ok')
                .targetEvent(ev)
            );
        };

        var d = new Date();
        $scope.opcion = true;
        $scope.catVisible = false;

        $scope.filtro = {};
        $scope.filtro.top = 5;
        $scope.mostrarTop = [];
        $scope.mostrarTop["TOP_MAS"] = true;
        $scope.mostrarTop["TOP_MENOS"] = true;
        $scope.filtro.tipo = "Calidad";
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

        $scope.valorMostrarTop = 0;
        $scope.cambiarVistaTop = function(valor) {
            if (valor == 1) {
                $scope.mostrarTop["TOP_MAS"] = true;
                $scope.mostrarTop["TOP_MENOS"] = false;
            }
            if (valor == 2) {
                $scope.mostrarTop["TOP_MAS"] = false;
                $scope.mostrarTop["TOP_MENOS"] = true;
            }
            if (valor == 0) {
                $scope.mostrarTop["TOP_MAS"] = true;
                $scope.mostrarTop["TOP_MENOS"] = true;
            }
        };
        //aplicar los filtros al area del grafico
        $scope.aplicarFiltro = function(avanzado, item) {
            $scope.filtros.activo = true;
            $scope.filtro.indicador = $scope.tempIndicador;
            if (!avanzado) {
                $scope.filtro.indicador = [];
                $scope.filtro.verTodosIndicadores = false;
                if ($scope.filtro.indicador.indexOf(item.codigo) == -1) {
                    $scope.filtro.indicador.push(item.codigo);
                    $scope.chipIndicador[item.codigo] = item;
                }

            }
            $scope.contador = 0;
            $scope.intento = 0;
            $scope.init();
            $mdSidenav('globalCalidad').close();
            if ($scope.filtro.visualizar == 'parametro' & $scope.filtro.um.nivel == 'clues') {
                $scope.verInfo = true;
                $scope.showAlert();
            }
        };
        $scope.contador = 0;

        //quitar los filtros seleccionados del dialog
        $scope.quitarFiltro = function(avanzado) {
            $scope.filtro.indicador = [];
            $scope.filtro.clues = [];
            $scope.filtro.um = {};
            $scope.filtro.um.tipo = "municipio";
            $scope.filtro.verTodosIndicadores = true;
            $scope.filtro.verTodosUM = true;
            $scope.filtros.activo = false;

            $scope.intento = 0;
            $scope.contador = 0;
            $scope.init();
            $mdSidenav('globalCalidad').close();
        };

        // cerrar el dialog
        $scope.hide = function() {
            $mdDialog.hide();
        };
        //cambiar a pantalla completa
        $scope.isFullscreen = false;

        $scope.toggleFullScreen = function(e) {
            $scope.isFullscreen = !$scope.isFullscreen;
        }
        $scope.cargarFiltro = 0;
        $scope.toggleRightOpciones = function(navID) {
            $scope.catVisible = false;
            $mdSidenav(navID)
                .toggle()
                .then(function() {
                    if ($scope.cargarFiltro < 1) {
                        $scope.getDimension('anio', 0);
                        $scope.getDimension('month', 1);
                        $scope.getDimension("codigo,indicador,color, '" + $scope.filtro.tipo + "' as categoriaEvaluacion", 2);
                        $scope.getDimension('jurisdiccion', 3);
                        $scope.getDimension('municipio', 4);
                        $scope.getDimension('zona', 5);
                        $scope.getDimension('cone', 6);
                        $scope.cargarFiltro++;
                    }
                });
        };
        $scope.cambiarAnio = function(anio) {
            
            $scope.filtro.anio = anio;
            $scope.getDimension('month', 1);
            $scope.getDimension("codigo,indicador,color, '" + $scope.filtro.tipo + "' as categoriaEvaluacion", 2);
            $scope.getDimension('jurisdiccion', 3);
            $scope.getDimension('municipio', 4);
            $scope.getDimension('zona', 5);
            $scope.getDimension('cone', 6);
        }
        $scope.cambiarBimestre = function(bimestre) {
            $scope.filtro.bimestre = bimestre;
            $scope.getDimension("codigo,indicador,color, '" + $scope.filtro.tipo + "' as categoriaEvaluacion", 2);
            $scope.getDimension('jurisdiccion', 3);
            $scope.getDimension('municipio', 4);
            $scope.getDimension('zona', 5);
            $scope.getDimension('cone', 6);
        }
        $scope.cambiarCategoria = function() {
            $scope.getDimension("codigo,indicador,color, '" + $scope.filtro.tipo + "' as categoriaEvaluacion", 2);
        }

        $scope.intentoOpcion = 0;
        $scope.getDimension = function(nivel, c) {
            $scope.opcion = true;
            var url = "/calidadDimension";

            CrudDataApi.lista(url + '?filtro=' + JSON.stringify($scope.filtro) + '&nivel=' + nivel, function(data) {
                $scope.datos[c] = data.data;
                $scope.opcion = false;

            }, function(e) {
                if ($scope.intentoOpcion < 1) {
                    $scope.getDimension(nivel, c);
                    $scope.intentoOpcion++;
                }
                $scope.opcion = false;
            });
        };

        // obtiene los datos necesarios para crear el grid (listado)
        $scope.intento = 0;
        $scope.init = function() {
            var url = '/TopCalidadGlobal';

            $scope.globalCalidad = true;
            CrudDataApi.lista(url + "?filtro=" + JSON.stringify($scope.filtro), function(data) {
                if (data.status == '407')
                    $window.location = "acceso";

                if (!angular.isUndefined(data.data.TOP_MAS)) {
                    $scope.indicadores = data.indicadores;
                    $scope.dato = data.data;
                    $scope.total = data.total;
                    $scope.anios = data.anio;
                    $scope.globalCalidad = false;
                } else {
                    $scope.globalCalidad = false;
                    $scope.datosOk = false;
                }
                $scope.globalCalidad = false;
            }, function(e) {
                if ($scope.intento < 1) {
                    $scope.init();
                    $scope.intento++;
                }
                $scope.globalCalidad = false;
            });
        };
        $scope.init();
    })

    angular.module('DashboardModule').controller('gaugeRecursoController', function($scope, $http, $window, $location, $timeout, $route, flash, errorFlash, URLS, $mdDialog, $mdUtil, $mdSidenav, $translate, CrudDataApi) {

        $scope.gaugeRecurso = true;

        $scope.datos = {};

        $scope.showModal = false;
        $scope.showModalCriterio = false;
        $scope.chart;
        $scope.verGaugeRecurso = "";
        $scope.dimension = [];
        $scope.datosOk = true;

        $scope.tempIndicador = [];
        $scope.toggle = function(item, list) {
            var idx = list.indexOf(item);
            if (idx > -1)
                list.splice(idx, 1);
            else {
                list.push(item);
            }
        };
        //lenar los check box tipo array
        $scope.exists = function(item, list) {
            return list.indexOf(item) > -1;
        };

        $scope.cambiarVerTodoIndicador = function() {
            if ($scope.filtro.verTodosIndicadores) {
                $scope.filtro.indicador = [];
                $scope.chipIndicador = [];
                $scope.tempIndicador = [];
            }
        }
        $scope.cambiarVerTodoUM = function() {
            if ($scope.filtro.verTodosUM) {
                $scope.filtro.um = {};
                $scope.filtro.um.tipo = 'municipio';
            }
        }

        $scope.cambiarVerTodoClues = function() {
            $scope.filtro.clues = [];
        }

        var d = new Date();
        $scope.opcion = true;

        $scope.filtro = {};
        $scope.filtro.tipo = "Recurso";
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
        $scope.indicadores = [];
        $scope.filtro.estricto = false;
        //aplicar los filtros al area del grafico
        $scope.aplicarFiltro = function(avanzado, item) {
            $scope.filtros.activo = true;
            $scope.filtro.indicador = $scope.tempIndicador;
            if (!avanzado) {
                $scope.filtro.indicador = [];
                $scope.filtro.verTodosIndicadores = false;
                if ($scope.filtro.indicador.indexOf(item.codigo) == -1) {
                    $scope.filtro.indicador.push(item.codigo);
                    $scope.chipIndicador[item.codigo] = item;
                }

            }
            $scope.contador = 0;
            $scope.intento = 0;
            $scope.init();
            $mdSidenav('gaugeRecurso').close();
        };
        $scope.contador = 0;

        //quitar los filtros seleccionados del dialog
        $scope.quitarFiltro = function(avanzado) {
            $scope.filtro.indicador = [];
            $scope.filtro.clues = [];
            $scope.filtro.um = {};
            $scope.filtro.um.tipo = "municipio";
            $scope.filtro.verTodosIndicadores = true;
            $scope.filtro.verTodosUM = true;
            $scope.filtros.activo = false;

            $scope.intento = 0;
            $scope.contador = 0;
            $scope.init();
            $mdSidenav('gaugeRecurso').close();
        };

        // cerrar el dialog
        $scope.hide = function() {
            $mdDialog.hide();
        };
        //cambiar a pantalla completa
        $scope.isFullscreen = false;

        $scope.toggleFullScreen = function(e) {
            $scope.isFullscreen = !$scope.isFullscreen;
        }
        $scope.cargarFiltro = 0;
        $scope.toggleRightOpciones = function(navID) {
            $scope.catVisible = false;
            $mdSidenav(navID)
                .toggle()
                .then(function() {
                    if ($scope.cargarFiltro < 1) {
                        $scope.getDimension('anio', 0);
                        $scope.getDimension('month', 1);
                        $scope.getDimension("codigo,indicador,color, '" + $scope.filtro.tipo + "' as categoriaEvaluacion", 2);
                        $scope.getDimension('jurisdiccion', 3);
                        $scope.getDimension('municipio', 4);
                        $scope.getDimension('zona', 5);
                        $scope.getDimension('cone', 6);
                        $scope.cargarFiltro++;
                    }
                });
        };
        $scope.cambiarAnio = function(anio) {
            
            $scope.filtro.anio = anio;
            $scope.getDimension('month', 1);
            $scope.getDimension("codigo,indicador,color, '" + $scope.filtro.tipo + "' as categoriaEvaluacion", 2);
            $scope.getDimension('jurisdiccion', 3);
            $scope.getDimension('municipio', 4);
            $scope.getDimension('zona', 5);
            $scope.getDimension('cone', 6);
        }
        $scope.cambiarBimestre = function(bimestre) {
            $scope.filtro.bimestre = bimestre;
            $scope.getDimension("codigo,indicador,color, '" + $scope.filtro.tipo + "' as categoriaEvaluacion", 2);
            $scope.getDimension('jurisdiccion', 3);
            $scope.getDimension('municipio', 4);
            $scope.getDimension('zona', 5);
            $scope.getDimension('cone', 6);
        }

        $scope.intentoOpcion = 0;
        $scope.getDimension = function(nivel, c) {
            var url = "/recursoDimension";

            CrudDataApi.lista(url + '?filtro=' + JSON.stringify($scope.filtro) + '&nivel=' + nivel, function(data) {
                $scope.datos[c] = data.data;
                $scope.opcion = false;
            }, function(e) {
                if ($scope.intentoOpcion < 1) {
                    $scope.getDimension(nivel, c);
                    $scope.intentoOpcion++;
                }
                $scope.opcion = false;
            });
        };

        // obtiene los datos necesarios para crear el grid (listado)
        $scope.intento = 0;
        $scope.init = function() {
            var url = '/hallazgoGauge';

            $scope.gaugeRecurso = true;
            CrudDataApi.lista(url + "?filtro=" + JSON.stringify($scope.filtro), function(data) {
                if (data.status == '407')
                    $window.location = "acceso";

                if (data.status == 200) {
                    $scope.value = data.valor;
                    $scope.indicadores = data.indicadores;
                    $scope.upperLimit = data.total;
                    $scope.lowerLimit = 0;
                    $scope.unit = "";
                    $scope.precision = 1;
                    $scope.ranges = data.rangos;

                    $scope.dato = data.data;
                    $scope.anios = data.anio;
                    $scope.gaugeRecurso = false;
                } else {
                    $scope.gaugeRecurso = false;
                    errorFlash.error(data);
                }
                $scope.gaugeRecurso = false;
            }, function(e) {
                if ($scope.intento < 1) {
                    $scope.init();
                    $scope.intento++;
                }
                $scope.gaugeRecurso = false;
            });
        };

        $scope.init();

    })

    angular.module('DashboardModule').controller('gaugeCalidadController', function($scope, $http, $window, $location, $timeout, $route, flash, errorFlash, URLS, $mdDialog, $mdUtil, $mdSidenav, $translate, CrudDataApi) {

        $scope.gaugeCalidad = true;

        $scope.datos = {};

        $scope.showModal = false;
        $scope.showModalCriterio = false;
        $scope.chart;
        $scope.verGaugeCalidad = "";
        $scope.dimension = [];
        $scope.datosOk = true;

        $scope.tempIndicador = [];
        $scope.toggle = function(item, list) {
            var idx = list.indexOf(item);
            if (idx > -1)
                list.splice(idx, 1);
            else {
                list.push(item);
            }
        };
        //lenar los check box tipo array
        $scope.exists = function(item, list) {
            return list.indexOf(item) > -1;
        };

        $scope.cambiarVerTodoIndicador = function() {
            if ($scope.filtro.verTodosIndicadores) {
                $scope.filtro.indicador = [];
                $scope.chipIndicador = [];
                $scope.tempIndicador = [];
            }
        }
        $scope.cambiarVerTodoUM = function() {
            if ($scope.filtro.verTodosUM) {
                $scope.filtro.um = {};
                $scope.filtro.um.tipo = 'municipio';
            }
        }

        $scope.cambiarVerTodoClues = function() {
            $scope.filtro.clues = [];
        }

        var d = new Date();
        $scope.opcion = true;

        $scope.filtro = {};
        $scope.filtro.tipo = "Calidad";
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
        $scope.indicadores = [];
        $scope.filtro.estricto = false;
        //aplicar los filtros al area del grafico
        $scope.aplicarFiltro = function(avanzado, item) {
            $scope.filtros.activo = true;
            $scope.filtro.indicador = $scope.tempIndicador;
            if (!avanzado) {
                $scope.filtro.indicador = [];
                $scope.filtro.verTodosIndicadores = false;
                if ($scope.filtro.indicador.indexOf(item.codigo) == -1) {
                    $scope.filtro.indicador.push(item.codigo);
                    $scope.chipIndicador[item.codigo] = item;
                }

            }
            $scope.contador = 0;
            $scope.intento = 0;
            $scope.init();
            $mdSidenav('gaugeCalidad').close();
        };
        $scope.contador = 0;

        //quitar los filtros seleccionados del dialog
        $scope.quitarFiltro = function(avanzado) {
            $scope.filtro.indicador = [];
            $scope.filtro.clues = [];
            $scope.filtro.um = {};
            $scope.filtro.um.tipo = "municipio";
            $scope.filtro.verTodosIndicadores = true;
            $scope.filtro.verTodosUM = true;
            $scope.filtros.activo = false;

            $scope.intento = 0;
            $scope.contador = 0;
            $scope.init();
            $mdSidenav('gaugeCalidad').close();
        };

        // cerrar el dialog
        $scope.hide = function() {
            $mdDialog.hide();
        };
        //cambiar a pantalla completa
        $scope.isFullscreen = false;

        $scope.toggleFullScreen = function(e) {
            $scope.isFullscreen = !$scope.isFullscreen;
        }
        $scope.cargarFiltro = 0;
        $scope.toggleRightOpciones = function(navID) {
            $scope.catVisible = false;
            $mdSidenav(navID)
                .toggle()
                .then(function() {
                    if ($scope.cargarFiltro < 1) {
                        $scope.getDimension('anio', 0);
                        $scope.getDimension('month', 1);
                        $scope.getDimension("codigo,indicador,color, '" + $scope.filtro.tipo + "' as categoriaEvaluacion", 2);
                        $scope.getDimension('jurisdiccion', 3);
                        $scope.getDimension('municipio', 4);
                        $scope.getDimension('zona', 5);
                        $scope.getDimension('cone', 6);
                        $scope.cargarFiltro++;
                    }
                });
        };
        $scope.cambiarAnio = function(anio) {
            
            $scope.filtro.anio = anio;
            $scope.getDimension('month', 1);
            $scope.getDimension("codigo,indicador,color, '" + $scope.filtro.tipo + "' as categoriaEvaluacion", 2);
            $scope.getDimension('jurisdiccion', 3);
            $scope.getDimension('municipio', 4);
            $scope.getDimension('zona', 5);
            $scope.getDimension('cone', 6);
        }
        $scope.cambiarBimestre = function(bimestre) {
            $scope.filtro.bimestre = bimestre;
            $scope.getDimension("codigo,indicador,color, '" + $scope.filtro.tipo + "' as categoriaEvaluacion", 2);
            $scope.getDimension('jurisdiccion', 3);
            $scope.getDimension('municipio', 4);
            $scope.getDimension('zona', 5);
            $scope.getDimension('cone', 6);
        }

        $scope.intentoOpcion = 0;
        $scope.getDimension = function(nivel, c) {
            $scope.opcion = true;
            var url = "/calidadDimension";

            CrudDataApi.lista(url + '?filtro=' + JSON.stringify($scope.filtro) + '&nivel=' + nivel, function(data) {
                $scope.datos[c] = data.data;
                $scope.opcion = false;
            }, function(e) {
                if ($scope.intentoOpcion < 1) {
                    $scope.getDimension(nivel, c);
                    $scope.intentoOpcion++;
                }
                $scope.opcion = false;
            });
        };

        // obtiene los datos necesarios para crear el grid (listado)
        $scope.intento = 0;
        $scope.init = function() {
            var url = '/hallazgoGauge';

            $scope.gaugeCalidad = true;
            CrudDataApi.lista(url + "?filtro=" + JSON.stringify($scope.filtro), function(data) {
                if (data.status == '407')
                    $window.location = "acceso";

                if (data.status == 200) {
                    $scope.value = data.valor;
                    $scope.indicadores = data.indicadores;
                    $scope.upperLimit = data.total;
                    $scope.lowerLimit = 0;
                    $scope.unit = "";
                    $scope.precision = 1;
                    $scope.ranges = data.rangos;

                    $scope.dato = data.data;
                    $scope.anios = data.anio;
                    $scope.gaugeCalidad = false;
                } else {
                    $scope.gaugeCalidad = false;
                    errorFlash.error(data);
                }
                $scope.gaugeCalidad = false;
            }, function(e) {
                if ($scope.intento < 1) {
                    $scope.init();
                    $scope.intento++;
                }
                $scope.gaugeCalidad = false;
            });
        };
        $scope.init();
    })

    function DialogRecurso($scope, $mdDialog, EvaluacionShow, EvaluacionId, errorFlash, listaOpcion) {
        $scope.imprimirDetalle = true;
        $scope.acciones = [];
        $scope.hallazgos = {};
        listaOpcion.options('/Accion').success(function(data) {
            $scope.acciones = data.data;
        });

        $scope.plazos = [];
        listaOpcion.options('/PlazoAccion').success(function(data) {
            $scope.plazos = data.data;
        });
        var id = EvaluacionId.getId();
        EvaluacionShow.ver('/EvaluacionRecurso', id, function(data) {
            if (data.status == '407')
                $window.location = "acceso";

            if (data.status == 200) {
                $scope.dato = data.data;
            } else {
                errorFlash.error(data);
            }
            $scope.cargando = false;
        }, function(e) {
            errorFlash.error(e);
            $scope.cargando = false;
        });

        EvaluacionShow.ver('/EvaluacionRecursoCriterio', id, function(data) {
            if (data.status == '407')
                $window.location = "acceso";

            if (data.status == 200) {
                $scope.indicadores = data.data;
                $scope.estadistica = data.estadistica;
            } else {
                flash('danger', "Ooops! Ocurrio un error (" + data.status + ") ->" + data.messages);
            }
            $scope.cargando = false;
        }, function(e) {
            errorFlash.error(e);
            $scope.cargando = false;
        });

        $scope.hide = function() {
            $mdDialog.hide();
        };
    }

    function DialogCalidad($scope, $mdDialog, EvaluacionShow, EvaluacionId, errorFlash, listaOpcion) {

        $scope.acciones = [];
        $scope.hallazgos = {};
        $scope.imprimirDetalle = true;
        listaOpcion.options('/Accion').success(function(data) {
            $scope.acciones = data.data;
        });

        $scope.plazos = [];
        listaOpcion.options('/PlazoAccion').success(function(data) {
            $scope.plazos = data.data;
        });

        var id = EvaluacionId.getId();
        EvaluacionShow.ver('/EvaluacionCalidad', id, function(data) {
            if (data.status == '407')
                $window.location = "acceso";

            if (data.status == 200) {
                $scope.dato = data.data;
            } else {
                errorFlash.error(data);
            }
            $scope.cargando = false;
        }, function(e) {
            errorFlash.error(e);
            $scope.cargando = false;
        });

        EvaluacionShow.ver('/EvaluacionCalidadCriterio', id, function(data) {
            if (data.status == '407')
                $window.location = "acceso";

            if (data.status == 200) {
                $scope.total = data.total;
                $scope.criterios = data.data.criterios;
                $scope.marcados = data.data.datos;
                $scope.columnas = {};
                $scope.indicadorColumna = [];
                $scope.hallazgos = data.hallazgos;
                $scope.indicadores = [];

                angular.forEach(data.data.indicadores, function(val, key) {
                    $scope.indicadores.push(val);
                    $scope.indicadorColumna[val.codigo] = [];
                    var c = 0;
                    angular.forEach(val.columnas, function(v, k) {
                        $scope.columnas[v.expediente] = v.expediente;
                        $scope.indicadorColumna[val.codigo][v.expediente] = v;
                        c++;
                    });

                });
                $scope.cargando = false;
            } else {
                $scope.cargando = false;
                flash('danger', "Ooops! Ocurrio un error (" + data.status + ") ->" + data.messages);
            }
            $scope.cargando = false;
        }, function(e) {
            errorFlash.error(e);
            $scope.cargando = false;
        });

        $scope.hide = function() {
            $mdDialog.hide();
        };
    }
})();
