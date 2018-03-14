/**
 * @ngdoc object
 * @name Transaccion.CalidadCtrl
 * @description
 * Complemento del controlador CrudCtrl  para tareas especificas en EvaluacionCalidad
 */
(function() {
    'use strict';
    angular.module('CalidadModule')
        .controller('CalidadCtrl', function($rootScope, $translate, $localStorage, $mdDialog, $mdToast, $mdMedia, $scope, $mdSidenav, $location, $mdBottomSheet, UsuarioData, Auth, Menu, $http, $window, $timeout, $route, $filter, flash, errorFlash, listaOpcion, Criterios, CrudDataApi, URLS) {

            /************************************************************************************
             *  Bloque General
             */
            // inicializa las rutas para crear los href correspondientes en la vista actual
            $scope.index = function(ruta) {
                $scope.ruta = ruta;
                var uri = $scope.url;

                if (uri.search("nuevo") == -1)
                    $scope.init();
            };
            // cambia de color el menu seleccionado
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

            // inicia la inimación de cargando
            $scope.cargando = true;
            $scope.cargando2 = true;

            // inicializa el modulo ruta y url se le asigna el valor de la página actual
            $scope.ruta = "";
            $scope.url = $location.url();

            $scope.permisoModificar = $localStorage.cium.permisos.indexOf("616C696461") >= 0 ? true : false;
            $scope.permisoEliminar = $localStorage.cium.permisos.indexOf("C696466964") >= 0 ? true : false;
            $scope.permisoVer = $localStorage.cium.permisos.indexOf("7665724361") >= 0 ? true : false;
            $scope.permisoAgregar = $localStorage.cium.permisos.indexOf("646164696C") >= 0 ? true : false;

            $scope.datos = [];
            $scope.update = false;

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
                $location.path(path).search({
                    id: null
                });
            };

            $scope.tamanoHeight = $window.innerHeight;
            $scope.$watch(function() {
                return window.innerHeight;
            }, function(value) {
                if (document.getElementById("contenido_tab")) {
                    var rect = document.getElementById("contenido_tab").getBoundingClientRect();
                    $scope.tamanoHeight = value - (rect.top + 110);
                }
            });

            $scope.moduloName = angular.uppercase($location.path().split('/')[1]);
            $scope.lista_indicadores = [];
            
            $scope.cat_cone = [];
            $scope.cat_jurisdiccion = [];
            $scope.cat_usuario = [];

            $scope.cargarCat = function(url, modelo) {
                $scope.cargando = true;
                
                listaOpcion.options(url).success(function(data) {                    
                    angular.forEach(data.data, function(val, key) {
                        modelo.push(val);
                    });                                            
                });
            };
            $scope.cargarCat('/Cone', $scope.cat_cone);
            $scope.cargarCat('/Jurisdiccion', $scope.cat_jurisdiccion);
            $scope.cargarCat('/usuarios', $scope.cat_usuario);

            $scope.cargarCatalogo = function(url, modelo, callback) {
                $scope.cargando = true;
                if (!angular.isUndefined($scope.dato.idCone))
                    url = url + "&cone=" + $scope.dato.idCone;
                listaOpcion.options(url).success(function(data) {
                    if (data.status == '407')
                        $window.location = "acceso";

                    if (data.status == 200) {
                        angular.forEach(data.data, function(val, key) {
                            $scope.lista_indicadores.push(val);
                        });
                        if (!angular.isUndefined($scope.dato.idCone))
                            $scope.indicadoresActuales();
                    } else {
                        errorFlash.error(data);
                    }
                    $scope.cargando = false;
                });
            };

            $scope.tieneExpediente = [];

            $scope.tempIndicador = [];
            $scope.toggle = function(item, list) {
                var idx = list.indexOf(item.id);
                if (idx > -1)
                    list.splice(idx, 1);
                else {
                    list.push(item.id);
                }
            };
            $scope.exists = function(item, list) {
                return list.indexOf(item) > -1;
            };
            $scope.generarImpreso = function() {
                $localStorage.cium.calidad = {};
                $localStorage.cium.calidad.imprimir = {};
                $localStorage.cium.calidad.imprimir.um = $scope.dato;
                $localStorage.cium.calidad.imprimir.indicadores = $scope.tempIndicador;
                $location.path("evaluacion-calidad/evaluacionImpresa");
            }
            $scope.vistaImpreso = function() {
                    $scope.dato = $localStorage.cium.calidad.imprimir.um;
                    $scope.indicadores = [];
                    var cone = $scope.dato.idCone;
                    $scope.expedientes = [];
                    for (var i = 0; i < $scope.dato.expediente; i++)
                        $scope.expedientes.push(i);
                    $scope.expedientes
                    angular.forEach($localStorage.cium.calidad.imprimir.indicadores, function(val, key) {
                        CrudDataApi.lista('/CriterioEvaluacionCalidadImprimir/' + cone + '/' + val, function(data) {
                            if (data.status == 200) {
                                $scope.indicadores.push(data.data);
                            }
                        }, function(e) {
                            errorFlash.error(e);
                        });
                    });
                    $scope.cargando = false;
                }
                /*
                 *  Fin Bloque General
                 ************************************************************************************/

            /************************************************************************************
             *  Bloque Lista
             */
            // cambia los textos del paginado de cada grid
            $scope.paginationLabel = {
                text: $translate.instant('ROWSPERPAGE'),
                of: $translate.instant('DE')
            };

            // Inicializa el campo para busquedas disponibles para cada grid
            $scope.BuscarPor = [{
                id: "clues",
                nombre: "Clues"
            }, {
                id: 'fechaEvaluacion',
                nombre: $translate.instant('CREADO')
            }];

            // inicia configuración para los data table (grid)
            $scope.selected = [];

            // incializa el modelo para el filtro, ordenamiento y paginación
            $scope.query = {
                filter: '',
                order: '-fechaEvaluacion',
                limit: 25,
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
                lim: 25,
                paginas: 0
            };

            // evento para el boton nuevo, redirecciona a la vista nuevo
            $scope.nuevo = function() {
                var uri = $scope.url.split('/');

                uri = "/" + uri[1] + "/nuevo";
                $location.path(uri).search({
                    id: null
                });
            }

            $scope.opcionEvaluacion = function(ir, id) {
                if(ir == 'ver'){
                    var viewPath = $location.path() + "/" + ir + "?id=" + id;
                    var currentPath = window.location.href.substr(0, window.location.href.indexOf('#') + 1);
                    var fullPath = currentPath + viewPath;
                    $window.open(fullPath );
                } else{
                    $location.path($location.path() + "/" + ir).search({
                        id: id
                    });
                }
            }

            $scope.showSearch = false;
            $scope.imprimirDetalle = true;
            $scope.listaTemp = {};

            $scope.mostrarSearch = function(t) {
                $scope.showSearch = !$scope.showSearch;
                if (t == 0) {
                    $scope.listaTemp = $scope.datos;
                } else {
                    $scope.buscar = '';
                    $scope.datos = $scope.listaTemp;
                }
            }

            $scope.update = false;

            /**
             * @ngdoc method
             * @name Transaccion.CalidadCtrl#getClues
             * @methodOf Transaccion.CalidadCtrl
             *
             * @description
             * Obtiene las clues que le corresponden al usuario
             */

            $scope.getClues = function() {
                $scope.cargando = true;
                CrudDataApi.lista('/CluesUsuario', function(data) {
                    if (data.status == '407')
                        $window.location = "acceso";

                    if (data.status == 200) {
                        $scope.Clues = data.data.map(function(repo) {
                            repo.value = repo.nombre.toLowerCase();
                            return repo;
                        });
                        $scope.repos = $scope.Clues;
                    } else {
                        errorFlash.error(data);
                    }
                    $scope.cargando = false;
                }, function(e) {
                    errorFlash.error(e);
                    $scope.cargando = false;
                });
            };

            /**
             * @ngdoc method
             * @name Transaccion.CalidadCtrl#CluesChange
             * @methodOf Transaccion.CalidadCtrl
             *
             * @description
             * Carga los datos de la ficha para clues
             * @param {string} value codigo de la clues
             */
            $scope.CluesChange = function(value) {
                $scope.cargando = true;
                CrudDataApi.ver('/Clues', value, function(data) {
                    if (data.status == '407')
                        $window.location = "acceso";

                    if (data.status == 200) {
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
                    } else {
                        errorFlash.error(data);
                    }
                    $scope.cargando = false;
                }, function(e) {
                    errorFlash.error(e);
                    $scope.cargando = false;
                });
            };

            $scope.abrirEvaluacionFicha = function(ev) {
                $scope.editDialog = $mdDialog;
                $scope.editDialog.show({
                    targetEvent: ev,

                    scope: $scope.$new(),
                    templateUrl: 'src/transaccion/evaluacionCalidad/views/evaluacionFicha.html',
                    clickOutsideToClose: true
                });
            };

            $scope.jurisdiccion = '';
            $scope.email = '';
            $scope.cone = '';
            $scope.cerrado = 1;
            $scope.desde = '';
            $scope.hasta = '';            

            // obtiene los datos necesarios para crear el grid (listado)// obtiene los datos necesarios para crear el grid (listado)
            $scope.init = function(buscar, columna) {
                var url = $scope.ruta;
                buscar = $scope.buscar ? $scope.buscar : '';
                var pagina = $scope.paginacion.pag;
                var limite = $scope.paginacion.lim;

                var jurisdiccion = $scope.jurisdiccion;
                var email = $scope.email;
                var cone = $scope.cone;
                var cerrado = $scope.cerrado;
                var desde = desde ? moment($scope.desde).format('YYYY-MM-DD') : '';
                var hasta = hasta ? moment($scope.hasta).format('YYYY-MM-DD') : '';

                var order = $scope.query.order;

                limite = limite + "&columna=" + columna + "&valor=" + buscar + "&buscar=true";

                $scope.cargando = true;
                CrudDataApi.lista(url + '?pagina=' + pagina + '&limite=' + limite + "&order=" + order 
                    + "&jurisdiccion=" + jurisdiccion
                    + "&email=" + email
                    + "&cone=" + cone
                    + "&cerrado=" + cerrado
                    + "&desde=" + desde
                    + "&hasta=" + hasta , function(data) {
                    if (data.status == '407')
                        $window.location = "acceso";

                    if (data.status == 200) {
                        $scope.datos = data.data;
                        $scope.paginacion.paginas = data.total;
                    } else {
                        errorFlash.error(data);
                    }
                    $scope.cargando = false;
                }, function(e) {
                    errorFlash.error(e);
                    $scope.cargando = false;
                });
            };

            // incia la busqueda con los parametros, columna = campo donde buscar, buscar = valor para la busqueda
            $scope.buscarL = function(buscar, columna) {
                $scope.cargando = true;
                $scope.init(buscar, columna);
            };

            // Ver. Muestra los datos del elemento que se le pase como parametro
            $scope.ver = function(ruta) {
                $scope.ruta = ruta;
                var url = $scope.ruta;
                var id = $location.search().id;
                $scope.cargando = true;
                CrudDataApi.ver(url, id, function(data) {
                    if (data.status == '407')
                        $window.location = "acceso";

                    if (data.status == 200) {
                        $scope.id = data.data.id;
                        $scope.dato = data.data;
                        $scope.nombre = data.data.nombre;
                        $scope.clues = data.data.clues;

                        $scope.cargarCatalogo('/Indicador?categoria=CALIDAD');
                    } else {
                        errorFlash.error(data);
                    }
                    $scope.cargando = false;
                }, function(e) {
                    errorFlash.error(e);
                    $scope.cargando = false;
                });
            };

            //Correo. Enviar evaluacion al correo
            $scope.correo = function(id, index) {
                $scope.cargando = true;
                CrudDataApi.ver('/CalidadCorreo', id, function(data) {
                    if (data.status == 200) {
                        $scope.datos[index].enviado = 1;
                        flash('success', data.messages);
                    } else {
                        flash('warning', data.messages);
                    }
                    $scope.cargando = false;
                }, function(e) {
                    $scope.cargando = false;
                    errorFlash.error(e);
                });
            };

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
            $scope.eliminar = function(id, $index) {
                var op = 1;
                if (angular.isUndefined(id)) {
                    id = $location.search().id;
                    op = 0;
                }
                var url = $scope.ruta;
                $scope.cargando = true;

                CrudDataApi.eliminar(url, id, function(data) {
                    if (data.status == '407')
                        $window.location = "acceso";

                    if (data.status == 200) {
                        if (op == 1)
                            $scope.datos.splice($index, 1);
                        else
                            angular.element('#lista').click();
                        flash('success', data.messages);


                        $scope.cargando = false;
                    } else {
                        errorFlash.error(data);
                    }
                    $scope.cargando = false;
                }, function(e) {
                    errorFlash.error(e);
                    $scope.cargando = false;
                });

            };
            $scope.indicadores = [];
            /*
             *  Fin Bloque Lista
             ************************************************************************************/

            /************************************************************************************
             *  Bloque Modificar
             */

            $scope.showModal = false;
            $scope.terminado = false;

            $scope.delay = 0;
            $scope.minDuration = 0;
            $scope.message = 'Guardando...';
            $scope.backdrop = true;
            $scope.calidad = null;
            $scope.dato = {};

            $scope.today = function() {
                $scope.dato.fechaEvaluacion = new Date();
            };

            $scope.clear = function() {
                $scope.dato.fechaEvaluacion = null;
            };

            $scope.open = function($event) {
                $event.preventDefault();
                $event.stopPropagation();

                $scope.opened = true;
            };

            $scope.dateOptions = {
                formatYear: 'yyyy',
                startingDay: 1
            };
            $scope.format = 'yyyy-MM-dd';
            $scope.criterios = [];
            $scope.informacion = [];
            /**
             * @ngdoc method
             * @name Transaccion.CalidadCtrl#hide
             * @methodOf Transaccion.CalidadCtrl
             *
             * @description
             * Cerrar el dialogo de la ficha
             */
            $scope.hide = function() {
                $mdDialog.hide();
            };

            /**
             * @ngdoc method
             * @name Transaccion.CalidadCtrl#abrirFicha
             * @methodOf Transaccion.CalidadCtrl
             *
             * @description
             * abre la ficha de la clues en un dialog
             * @param {event} ev evento click
             */
            $scope.abrirFicha = function(ev) {
                $scope.editDialog = $mdDialog;
                $scope.editDialog.show({
                    targetEvent: ev,

                    scope: $scope.$new(),
                    templateUrl: 'src/transaccion/evaluacionCalidad/views/ficha.html',
                    clickOutsideToClose: true
                });
            };

            /**
             * @ngdoc method
             * @name Transaccion.CalidadCtrl#abrirFicha
             * @methodOf Transaccion.CalidadCtrl
             *
             * @description
             * abre la ficha de la clues en un dialog
             * @param {event} ev evento click
             */
            $scope.abrirValidar = function(ev) {
                var valido = false;
                var exp = $scope.dato.numExpediente;
                var validaciones = $scope.indicador_validaciones;
                var scope = $scope;
                angular.forEach(validaciones, function(val, k) {
                    angular.forEach($scope.indicador_preguntas, function(item, key) {
                        if (item.id == val.pregunta1)
                            val.preguntaNombre1 = item;
                        if (item.id == val.pregunta2)
                            val.preguntaNombre2 = item;
                    });
                });
                if (validaciones.length) {

                    var useFullScreen = ($mdMedia('sm') || $mdMedia('xs')) && $scope.customFullscreen;
                    $mdDialog.show({
                            controller: function($scope, $mdDialog) {
                                $scope.validaciones = validaciones;
                                $scope.validaciones = validaciones;

                                angular.forEach($scope.validaciones, function(val, k) {
                                    var p1 = val.preguntaNombre1;
                                    var p2 = val.preguntaNombre2;
                                    var temp1 = p1.tipo == 'date' ? new Date() : '';
                                    var temp2 = p2.tipo == 'date' ? new Date() : '';

                                    p1.pregunta1 = p1.constante == '1' ? p1.fechaSistema == '1' ? temp1 : p1.valorConstante : temp1;
                                    p2.pregunta2 = p2.constante == '1' ? p2.fechaSistema == '1' ? temp2 : p2.valorConstante : temp2;
                                });
                                $scope.hide = function() {
                                    $mdDialog.hide();
                                };
                                $scope.cancel = function() {
                                    $mdDialog.cancel();
                                };
                                $scope.validar = function() {
                                    var valido = false,
                                        texto = "",
                                        icon = "",
                                        color = "",
                                        result = 0,
                                        malas = 0;

                                    var div = [];
                                    div["secs"] = 1000; // segundos
                                    div["mins"] = 1000 * 60; // minutos
                                    div["hours"] = 1000 * 60 * 60; // horas
                                    div["days"] = 1000 * 60 * 60 * 24; // dias
                                    div["weeks"] = div["days"] * 7; // semanas
                                    div["months"] = div["days"] * 30.5; // meses
                                    div["2months"] = div["days"] * (30.5 * 2); // 2 meses
                                    div["3months"] = div["days"] * (30.5 * 3); // 3 meses
                                    div["6months"] = div["days"] * (30.5 * 6); // 6 meses
                                    div["years"] = (1000 * 60 * 60 * 24) * 365; // años
                                    var respuesta = [];
                                    angular.forEach($scope.validaciones, function(val, k) {
                                        var p1 = val.preguntaNombre1;
                                        var p2 = val.preguntaNombre2;

                                        if (p1.tipo == 'date' && p2.tipo == 'date') {
                                            var pregunta1 = $filter('date')(document.querySelector("#pregunta1" + k + " .md-datepicker-input-container input").value, "dd/MM/yyyy");
                                            var pregunta2 = $filter('date')(document.querySelector("#pregunta2" + k + " .md-datepicker-input-container input").value, "dd/MM/yyyy");

                                            var fecha1 = pregunta1.split("/");
                                            var fecha2 = pregunta2.split("/");

                                            var d1 = new Date(fecha1[2], fecha1[1], fecha1[0], 0, 0, 0, 0);
                                            var d2 = new Date(fecha2[2], fecha2[1], fecha2[0], 0, 0, 0, 0);

                                            var t1 = d1.getTime();
                                            var t2 = d2.getTime();

                                            if (val.operadorAritmetico == '-')
                                                result = t1 - t2;

                                            if (val.operadorAritmetico == '+')
                                                result = t1 + t2;

                                            result = parseInt(("" + result).replace("-", "")) / div[val.unidadMedida];
                                        } else if (p1.tipo == 'time') {
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

                                            if (val.operadorAritmetico == '-')
                                                result = t1 - t2;

                                            if (val.operadorAritmetico == '+')
                                                result = t1 + t2;

                                            result = parseInt(("" + result).replace("-", "")) / div[val.unidadMedida];
                                        } else if (p1.tipo == 'number') {
                                            var pregunta1 = parseFloat(p1.pregunta1);
                                            var pregunta2 = parseFloat(p2.pregunta2);
                                            if (val.operadorAritmetico == '-')
                                                result = pregunta1 - pregunta2;

                                            if (val.operadorAritmetico == '+')
                                                result = pregunta1 + pregunta2;
                                        } else {
                                            var pregunta1 = parseInt(p1.pregunta1);
                                            var pregunta2 = parseInt(p2.pregunta2);
                                            if (val.operadorAritmetico == '-')
                                                result = pregunta1 - pregunta2;

                                            if (val.operadorAritmetico == '+')
                                                result = pregunta1 + pregunta2;
                                        }
                                        // operador logico
                                        var bien = false;
                                        var vc_o = "";
                                        vc_o = val.valorComparativo.split("o");
                                        respuesta[k] = [];
                                        angular.forEach(vc_o, function(valorComparativo, b) {
                                            if (val.operadorLogico == ">") {
                                                if (result > valorComparativo) {
                                                    bien = true;
                                                } else {
                                                    bien = false;
                                                }
                                            } else if (val.operadorLogico == "<") {
                                                if (result < valorComparativo) {
                                                    bien = true;
                                                } else {
                                                    bien = false;
                                                }

                                            } else if (val.operadorLogico == "<=") {
                                                if (result <= valorComparativo) {
                                                    bien = true;
                                                } else {
                                                    bien = false;
                                                }
                                            } else if (val.operadorLogico == ">=") {
                                                if (result >= valorComparativo) {
                                                    bien = true;
                                                } else {
                                                    bien = false;
                                                }
                                            } else if (val.operadorLogico == "=") {
                                                if (result == valorComparativo) {
                                                    bien = true;
                                                } else {
                                                    bien = false;
                                                }
                                            } else if (val.operadorLogico == "<>") {
                                                if (result != valorComparativo) {
                                                    bien = true;
                                                } else {
                                                    bien = false;
                                                }
                                            } else {
                                                $mdToast.show(
                                                    $mdToast.simple()
                                                    .textContent('Error en formula fila ' + (k + 1))
                                                    .position("bottom right")
                                                    .hideDelay(3000)
                                                );
                                            }
                                            respuesta[k][b] = bien;
                                        })
                                        var todobien = 0;
                                        var existetrue = false;
                                        angular.forEach(respuesta[k], function(ok, c) {
                                            if (!existetrue) {
                                                if (ok) {
                                                    todobien = 0;
                                                    existetrue = true;
                                                } else
                                                    todobien = todobien + 1;
                                            }
                                        })
                                        if (todobien > 0)
                                            malas = malas + 1;
                                    });
                                    if (malas == 0)
                                        valido = true;

                                    if (valido) {
                                        scope.validarNoRepetirExpediente(exp);
                                        $mdDialog.hide();
                                    } else {
                                        texto = "Este expediente no cumple con la muestra, porfavor seleccione otro";
                                        icon = "close";
                                        color = "#FF3C3C";


                                        var template = '<md-toast style="margin-top:60px">' +
                                            '<span flex ><md-icon md-svg-icon="' + icon + '" style="color: ' + color + '"></md-icon>&nbsp; ' + texto + '</span>' +
                                            '<md-button ng-click="closeToast()">X</md-button>' +
                                            '</md-toast>';
                                        $mdToast.show({
                                            template: template,
                                            hideDelay: 3000,
                                            parent: document.getElementById("validaciones"),
                                            position: "bottom right",
                                            controller: function($scope) {
                                                $scope.closeToast = function() {
                                                    $mdToast.hide();
                                                };
                                            }
                                        })
                                    }

                                };
                            },
                            templateUrl: 'src/transaccion/evaluacionCalidad/views/validaciones.html',
                            parent: angular.element(document.body),
                            targetEvent: ev,
                            clickOutsideToClose: true,
                            fullscreen: useFullScreen
                        })
                        .then(function(answer) {

                        }, function() {
                            valido = false;
                        });
                    $scope.$watch(function() {
                        return $mdMedia('xs') || $mdMedia('sm');
                    }, function(wantsFullScreen) {
                        $scope.customFullscreen = (wantsFullScreen === true);
                    });

                } else
                    $scope.validarNoRepetirExpediente(exp);
            };

            $scope.dato.mirespuesta = [];
            $scope.abrirValidarCriterio = function(ev, data, exp, col) {
                var valido = false;

                var validaciones = data.criterio_validaciones;
                var scope = $scope;
                angular.forEach(validaciones, function(val, k) {
                    angular.forEach(data.criterio_preguntas, function(item, key) {
                        if (item.id == val.pregunta1)
                            val.preguntaNombre1 = item;
                        if (item.id == val.pregunta2)
                            val.preguntaNombre2 = item;
                    });
                });

                if (validaciones.length) {

                    var useFullScreen = ($mdMedia('sm') || $mdMedia('xs')) && $scope.customFullscreen;
                    $mdDialog.show({
                            controller: function($scope, $mdDialog) {
                                $scope.validaciones = validaciones;
                                $scope.validaciones = validaciones;

                                angular.forEach($scope.validaciones, function(val, k) {
                                    var p1 = val.preguntaNombre1;
                                    var p2 = val.preguntaNombre2;

                                    var temp1 = p1.tipo == 'date' ? new Date() : '';
                                    var temp2 = p2.tipo == 'date' ? new Date() : '';

                                    p1.pregunta1 = p1.constante == '1' ? p1.fechaSistema == '1' ? temp1 : p1.valorConstante : temp1;
                                    p2.pregunta2 = p2.constante == '1' ? p2.fechaSistema == '1' ? temp2 : p2.valorConstante : temp2;

                                    angular.forEach(data.criterio_respuestas, function(v1, k1) {

                                        if (v1.tipo == "CALIDAD" && v1.expediente == exp && val.id == v1.idCriterioValidacion && data.idCriterio == v1.idCriterio && scope.id == v1.idEvaluacion) {
                                            var f1 = v1.respuesta1.split("/");
                                            var f2 = v1.respuesta2.split("/");
                                            if (p1.tipo == 'date') {
                                                temp1 = new Date(f1[2], f1[1] - 1, f1[0], 0, 0, 0, 0);
                                                temp2 = new Date(f2[2], f2[1] - 1, f2[0], 0, 0, 0, 0);
                                            } else {
                                                temp1 = f1[0];
                                                temp2 = f2[0];
                                            }
                                            p1.pregunta1 = temp1;
                                            p2.pregunta2 = temp2;
                                        }
                                    })
                                });
                                $scope.hide = function() {
                                    $mdDialog.hide();
                                };
                                $scope.cancel = function() {
                                    $mdDialog.cancel();
                                };
                                $scope.validar = function() {

                                    var valido = false,
                                        texto = "",
                                        icon = "",
                                        color = "",
                                        result = 0,
                                        malas = 0;

                                    var div = [];
                                    div["secs"] = 1000; // segundos
                                    div["mins"] = 1000 * 60; // minutos
                                    div["hours"] = 1000 * 60 * 60; // horas
                                    div["days"] = 1000 * 60 * 60 * 24; // dias
                                    div["weeks"] = div["days"] * 7; // semanas
                                    div["months"] = div["days"] * 30.5; // meses
                                    div["2months"] = div["days"] * (30.5 * 2); // 2 meses
                                    div["3months"] = div["days"] * (30.5 * 3); // 3 meses
                                    div["6months"] = div["days"] * (30.5 * 6); // 6 meses
                                    div["years"] = (1000 * 60 * 60 * 24) * 365; // años

                                    var respuesta = [];
                                    angular.forEach($scope.validaciones, function(val, k) {
                                        var p1 = val.preguntaNombre1;
                                        var p2 = val.preguntaNombre2;

                                        if (p1.tipo == 'date' && p2.tipo == 'date') {
                                            var pregunta1 = $filter('date')(document.querySelector("#pregunta1" + k + " .md-datepicker-input-container input").value, "dd/MM/yyyy");
                                            var pregunta2 = $filter('date')(document.querySelector("#pregunta2" + k + " .md-datepicker-input-container input").value, "dd/MM/yyyy");

                                            var fecha1 = pregunta1.split("/");
                                            var fecha2 = pregunta2.split("/");

                                            var d1 = new Date(fecha1[2], fecha1[1], fecha1[0], 0, 0, 0, 0);
                                            var d2 = new Date(fecha2[2], fecha2[1], fecha2[0], 0, 0, 0, 0);

                                            var t1 = d1.getTime();
                                            var t2 = d2.getTime();

                                            if (val.operadorAritmetico == '-')
                                                result = t1 - t2;

                                            if (val.operadorAritmetico == '+')
                                                result = t1 + t2;

                                            result = parseInt(("" + result).replace("-", "")) / div[val.unidadMedida];
                                        } else if (p1.tipo == 'time') {
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

                                            if (val.operadorAritmetico == '-')
                                                result = t1 - t2;

                                            if (val.operadorAritmetico == '+')
                                                result = t1 + t2;

                                            result = parseInt(("" + result).replace("-", "")) / div[val.unidadMedida];
                                        } else if (p1.tipo == 'number') {
                                            var pregunta1 = parseFloat(p1.pregunta1);
                                            var pregunta2 = parseFloat(p2.pregunta2);
                                            if (val.operadorAritmetico == '-')
                                                result = pregunta1 - pregunta2;

                                            if (val.operadorAritmetico == '+')
                                                result = pregunta1 + pregunta2;
                                        } else {
                                            var pregunta1 = parseInt(p1.pregunta1);
                                            var pregunta2 = parseInt(p2.pregunta2);
                                            if (val.operadorAritmetico == '-')
                                                result = pregunta1 - pregunta2;

                                            if (val.operadorAritmetico == '+')
                                                result = pregunta1 + pregunta2;
                                        }
                                        // operador logico
                                        var bien = false;
                                        var vc_o = "";
                                        vc_o = val.valorComparativo.split("o");
                                        respuesta[k] = [];
                                        angular.forEach(vc_o, function(valorComparativo, b) {
                                            if (val.operadorLogico == ">") {
                                                if (result > valorComparativo) {
                                                    bien = true;
                                                } else {
                                                    bien = false;
                                                }
                                            } else if (val.operadorLogico == "<") {
                                                if (result < valorComparativo) {
                                                    bien = true;
                                                } else {
                                                    bien = false;
                                                }

                                            } else if (val.operadorLogico == "<=") {
                                                if (result <= valorComparativo) {
                                                    bien = true;
                                                } else {
                                                    bien = false;
                                                }
                                            } else if (val.operadorLogico == ">=") {
                                                if (result >= valorComparativo) {
                                                    bien = true;
                                                } else {
                                                    bien = false;
                                                }
                                            } else if (val.operadorLogico == "=") {
                                                if (result == valorComparativo) {
                                                    bien = true;
                                                } else {
                                                    bien = false;
                                                }
                                            } else if (val.operadorLogico == "<>") {
                                                if (result != valorComparativo) {
                                                    bien = true;
                                                } else {
                                                    bien = false;
                                                }
                                            } else {
                                                $mdToast.show(
                                                    $mdToast.simple()
                                                    .textContent('Error en formula fila ' + (k + 1))
                                                    .position("bottom right")
                                                    .hideDelay(3000)
                                                );
                                            }
                                            respuesta[k][b] = bien;
                                        })
                                        var todobien = 0;
                                        var existetrue = false;
                                        angular.forEach(respuesta[k], function(ok, c) {
                                            if (!existetrue) {
                                                if (ok) {
                                                    todobien = 0;
                                                    existetrue = true;
                                                } else
                                                    todobien = todobien + 1;
                                            }
                                        })
                                        if (todobien > 0)
                                            malas = malas + 1;

                                        if (angular.isUndefined(scope.dato.mirespuesta))
                                            scope.dato.mirespuesta = [];

                                        if (angular.isUndefined(scope.dato.mirespuesta[exp]))
                                            scope.dato.mirespuesta[exp] = [];

                                        if (angular.isUndefined(scope.dato.mirespuesta[exp][data.idCriterio]))
                                            scope.dato.mirespuesta[exp][data.idCriterio] = [];

                                        scope.dato.mirespuesta[exp][data.idCriterio][val.id] = {
                                            expediente: exp,
                                            idCriterio: data.idCriterio,
                                            idCriterioValidacion: val.id,
                                            tipo: 'CALIDAD',
                                            respuesta1: p1.pregunta1,
                                            respuesta2: p2.pregunta2
                                        };
                                    });
                                    if (malas == 0)
                                        valido = true;
                                    if (angular.isUndefined(scope.dato.aprobado[exp]))
                                        scope.dato.aprobado[exp] = [];

                                    if (angular.isUndefined(scope.dato.aprobado[exp][data.idCriterio]))
                                        scope.dato.aprobado[exp][data.idCriterio] = [];

                                    if (valido) {
                                        scope.dato.aprobado[exp][data.idCriterio] = 1;
                                    } else {
                                        scope.dato.aprobado[exp][data.idCriterio] = 0;
                                    }
                                    scope.aprobar(data.idCriterio, scope.dato.id, col, exp);
                                    $mdDialog.hide();
                                };
                            },
                            templateUrl: 'src/transaccion/evaluacionCalidad/views/validaciones.html',
                            parent: angular.element(document.body),
                            targetEvent: ev,
                            clickOutsideToClose: true,
                            fullscreen: useFullScreen
                        })
                        .then(function(answer) {

                        }, function() {
                            valido = false;
                        });
                    $scope.$watch(function() {
                        return $mdMedia('xs') || $mdMedia('sm');
                    }, function(wantsFullScreen) {
                        $scope.customFullscreen = (wantsFullScreen === true);
                    });
                }
            };

            $scope.verIndicacion = function(ev) {

                $scope.editDialog = $mdDialog;
                $scope.editDialog.show({
                    targetEvent: ev,

                    scope: $scope.$new(),
                    templateUrl: 'src/transaccion/evaluacionCalidad/views/indicaciones.html',
                    clickOutsideToClose: true
                });
            };

            /**
             * @ngdoc method
             * @name Transaccion.CalidadCtrl#acciones
             * @methodOf Transaccion.CalidadCtrl
             *
             * @description
             * Carga el catalogo de acciones 
             */
            $scope.acciones = function() {
                $scope.acciones = [];
                $scope.cargando = true;
                listaOpcion.options('/Accion').success(function(data) {
                    if (data.status == '407')
                        $window.location = "acceso";

                    if (data.status == 200) {
                        $scope.acciones = data.data;
                        $scope.groupList = $scope.acciones.reduce(function(previous, current) {
                            if (previous.indexOf(current.tipo) === -1) {
                                previous.push(current.tipo);
                            }

                            return previous;
                        }, []);
                    } else {
                        errorFlash.error(data);
                    }
                    $scope.cargando = false;
                });
                $scope.cargando = false;
            };

            $scope.completo = []
            $scope.incompleto = [];
            // agregar columnas(expediente)
            $scope.columnas = [];

            /**
             * @ngdoc method
             * @name Transaccion.CalidadCtrl#agregarColumna
             * @methodOf Transaccion.CalidadCtrl
             *
             * @description
             * Agrega otro expediente al indicador
             * @param {string} exp numero de expediente
             */
            $scope.selectedIndex = 0;
            $scope.agregarColumna = function(exp) {
                var indi = $scope.indicador;

                if ($scope.columnas.length < 20) {
                    $scope.columnas.push({
                        id: $scope.columnas.length + 1,
                        exp: exp
                    });
                    $scope.dato.totalExpediente = $scope.columnas.length;
                }
                if (angular.isUndefined($scope.dato.expediente))
                    $scope.dato.expediente = [];
                $scope.dato.expediente.push(exp);

                setTimeout(function() {
                    $scope.selectedIndex = $scope.columnas.length - 1;
                }, 80);

            }

            $scope.criterios = [];
            $scope.modificado = false;

            /**
             * @ngdoc method
             * @name Transaccion.CalidadCtrl#verificarCambios
             * @methodOf Transaccion.CalidadCtrl
             *
             * @description
             * Comprueba que el indicador actual no tenga cambios en la evaluacion
             */
            $scope.verificarCambios = function() {
                if ($scope.modificado) {
                    var scope = $scope;

                    var confirm = $mdDialog.confirm()
                        .title($translate.instant('CONFIRM_MODIFICADO'))
                        .textContent($translate.instant('CONFIRM_MODIFICADO_TEXT'))
                        .ariaLabel('Lucky day')
                        .ok('Aceptar')
                        .cancel('Cancelar');

                    $mdDialog.show(confirm).then(function() {
                        scope.modificado = false;
                    }, function() {

                    });
                    event.preventDefault();
                    event.stopPropagation();
                }
            }

            /**
             * @ngdoc method
             * @name Transaccion.CalidadCtrl#cargarCriterios
             * @methodOf Transaccion.CalidadCtrl
             *
             * @description
             * cargar los criterios que le correspondan por indicador y nivel de cone
             */
            $scope.TieneDatosIndicador = false;
            $scope.information = {};
            $scope.dato.hallazgos = [];
            $scope.cargarCriterios = function(id, codigo, nombre, indicacion, validacion, preguntas, $index) {
                var cone = $scope.dato.idCone;
                var indi = $scope.dato.idIndicador;
                var idev = $scope.dato.id;
                var op = 0;
                if (angular.isUndefined($scope.dato.hallazgos))
                    $scope.dato.hallazgos = [];
                if (angular.isUndefined($scope.dato.hallazgos[id]))
                    $scope.dato.hallazgos[id] = [];
                if (indicacion != null) {
                    $scope.indicaciones = indicacion;
                    $scope.verIndicacion(null);
                } else {
                    $scope.indicaciones = null;
                }
                $scope.indicador_validaciones = validacion;
                $scope.indicador_preguntas = preguntas;
                if (validacion != null) {
                    $scope.validaciones = validacion;
                } else {
                    $scope.validaciones = null;
                }

                $scope.verificarCambios();
                $scope.dato.tempExpediente = $scope.dato.expediente;
                if (!angular.isUndefined(cone) && cone != "" && !angular.isUndefined(indi) && indi != "" && !$scope.modificado) {
                    $scope.cargando = true;
                    $scope.criterios = {};
                    $scope.dato.expediente = [];
                    $scope.estadistica();
                    $http.get(URLS.BASE_API + '/CriterioEvaluacionCalidad/' + cone + '/' + indi + '/' + idev)
                        .success(function(data, status, headers, config) {
                            if (data.status == '407')
                                $window.location = "acceso";

                            if (data.status == 200) {
                                if (!angular.isUndefined(nombre)) {
                                    if (angular.isUndefined($scope.information))
                                        $scope.information = [];
                                    $scope.information[codigo] = {
                                        "id": id,
                                        "codigo": codigo,
                                        "nombre": nombre,
                                        "indicacion": indicacion,
                                        "indicador_validaciones": validacion,
                                        "indicador_preguntas": preguntas,
                                        "completo": false
                                    };
                                    $scope.lista_indicadores.splice($index, 1);
                                }
                                $scope.dato.totalExpediente = 0;
                                $scope.columnas = [];

                                $scope.dato.totalCriterio = {};

                                $scope.dato.cumple = {};
                                $scope.dato.promedio = {};

                                $scope.dato.aprobado = {};
                                if (angular.isUndefined($scope.dato.totalExpediente))
                                    $scope.dato.totalExpediente = 0;
                                var total = data.total;
                                var totalCriterio = data.totalCriterio;
                                var promedioGeneral = 0;
                                var aprobado = 0;
                                if (data.hallazgo)
                                    $scope.dato.hallazgos = data.hallazgos;

                                $scope.criterios = data.criterios;
                                angular.forEach(data.data, function(val, key) {
                                    var exp = val.expediente;

                                    if ($scope.dato.totalExpediente < total)
                                        $scope.agregarColumna(exp);

                                    if (angular.isUndefined($scope.dato.expediente))
                                        $scope.dato.expediente = [];

                                    $scope.dato.cumple[exp] = val.cumple;
                                    $scope.dato.promedio[exp] = val.promedio;

                                    $scope.dato.aprobado[exp] = val.aprobado;

                                    if (!angular.isUndefined(val.aprobado))
                                        $scope.TieneDatosIndicador = true;
                                    else
                                        $scope.TieneDatosIndicador = false;

                                });

                                $scope.obtenerPromedio();
                            } else {
                                $scope.dato.totalCriterio = {};
                                $scope.dato.expediente = [];
                                $scope.dato.cumple = {};
                                $scope.dato.promedio = {};

                                $scope.dato.aprobado = {};
                                $scope.criterios = {};
                                $scope.dato.totalExpediente = 0;
                                $scope.columnas = [];

                                $scope.dato.hallazgo = "";
                                $scope.dato.accion = "";
                                $scope.dato.plazoAccion = "";
                                $scope.esSeguimiento = false;
                                flash('danger', "Ooops! Ocurrio un error (" + data.status + ") ->" + data.messages);
                            }
                            $scope.cargando = false;
                        })
                        .error(function(data, status, headers, config) {
                            $scope.cargando = false;
                            errorFlash.error(data);
                        });
                }
            };
            $scope.hallazgos = [];

            /**
             * @ngdoc method
             * @name Transaccion.CalidadCtrl#estadistica
             * @methodOf Transaccion.CalidadCtrl
             *
             * @description
             * obtener las estadisticas de la evaluacion
             */
            $scope.totalDeTotal = [];

            $scope.estadistica = function() {
                $scope.cargando = true;
                var indi = $scope.dato.idIndicador;
                var idev = $scope.dato.id;
                if (angular.isUndefined(idev) || idev == "")
                    idev = $location.search().id;
                var tco = 0;
                var co = 0;
                var tinc = 0;
                var inc = 0;
                $http.get(URLS.BASE_API + '/EstadisticaCalidad/' + idev)
                    .success(function(data, status, headers, config) {
                        if (data.status == '407')
                            $window.location = "acceso";

                        if (data.status == 200) {
                            $scope.informacion = data.data;


                            var tco = 0;
                            var tinc = 0;
                            $scope.misIndicadores = [];
                            angular.forEach($scope.informacion, function(val, key) {
                                angular.forEach(val, function(v, k) {
                                    $scope.completo[v.id] = [];
                                    $scope.incompleto[v.id] = [];
                                    $scope.misIndicadores.push(v.id);
                                })
                            })

                            angular.forEach($scope.informacion, function(val, key) {
                                var exp = key;
                                angular.forEach($scope.misIndicadores, function(vl, ky) {
                                    var co = 0;
                                    var inc = 0;
                                    if (angular.isUndefined($scope.totalDeTotal[$scope.dato.idIndicador]))
                                        $scope.totalDeTotal[$scope.dato.idIndicador] = [];
                                    angular.forEach(val, function(v, k) {
                                        if (v.id == $scope.dato.idIndicador) {
                                            $scope.totalDeTotal[$scope.dato.idIndicador][exp] = [];
                                            $scope.totalDeTotal[$scope.dato.idIndicador][exp]["de"] = v[v.codigo];
                                            $scope.totalDeTotal[$scope.dato.idIndicador][exp]["total"] = v.total;
                                        }
                                        if (v[v.codigo] == v.total) {
                                            tco = tco + 1;
                                            co = co + 1;
                                        } else {
                                            tinc = tinc + 1;
                                            inc = inc + 1;
                                        }
                                    });
                                    indi = vl;
                                    $scope.completo[indi][exp] = co;
                                    $scope.incompleto[indi][exp] = inc;
                                    $scope.tieneExpediente[exp] = true;
                                });
                            });
                            if (tinc == 0 && tco > 0)
                                $scope.terminado = true;
                            else
                                $scope.terminado = false;

                        } else {
                            errorFlash.error(data);
                        }
                        $scope.cargando = false;
                    })
                    .error(function(data, status, headers, config) {
                        $scope.cargando = false;
                        errorFlash.error(data);
                    });
            };
            $scope.cragraActualesError = 0;
            $scope.indicadoresActuales = function() {
                var idev = $scope.dato.id;
                if (angular.isUndefined(idev) || idev == "")
                    idev = $location.search().id;
                $scope.cargando = true;

                CrudDataApi.lista('/CriterioEvaluacionCalidadIndicador/' + idev, function(data) {
                    if (data.status == '407')
                        $window.location = "acceso";

                    if (data.status == 200) {
                        $scope.information = data.data;

                        angular.forEach($scope.information, function(val, key) {
                            angular.forEach($scope.lista_indicadores, function(v, k) {
                                if (val.codigo == v.codigo) {
                                    $scope.lista_indicadores.splice(k, 1);
                                }
                            });
                        });
                    }

                    $scope.cargando = false;
                }, function(e) {
                    if ($scope.cragraActualesError < 1) {
                        $scope.cragraActualesError++;
                        $scope.indicadoresActuales();
                    }

                    $scope.cargando = false;
                });

            }

            $scope.json = {};
            $scope.TH = {};
            $scope.AR = {};

            /**
             * @ngdoc method
             * @name Transaccion.CalidadCtrl#obtenerPromedio
             * @methodOf Transaccion.CalidadCtrl
             *
             * @description
             * optener el promedio para la evaluacion
             */
            $scope.obtenerPromedio = function() {
                var totalCriterio = 0;
                var aprobado = 0;
                var noaprobado = 0;
                var noaplica = 0;
                var promedioGeneral = 0;
                var total = 0;
                $scope.dato.totalCriterio = {};

                angular.forEach($scope.dato.expediente, function(val, exp) {
                    angular.forEach($scope.criterios, function(value, key) {
                        if (value.hasOwnProperty("idCriterio")) {
                            try {
                                if ($scope.dato.aprobado[val][value.idCriterio] == 1)
                                    aprobado++;
                                if ($scope.dato.aprobado[val][value.idCriterio] == 0)
                                    noaprobado++;
                                if ($scope.dato.aprobado[val][value.idCriterio] == 2)
                                    noaplica++;
                            } catch (e) {}
                            totalCriterio++;
                        }
                    });
                    $scope.tieneHallazgo[exp] = false;
                    if (noaprobado > 0)
                        $scope.tieneHallazgo[exp] = true;

                    total = aprobado + noaplica;
                    $scope.dato.totalCriterio[val] = totalCriterio;
                    if (total == totalCriterio)
                        $scope.dato.cumple[val] = 1;
                    else
                        $scope.dato.cumple[val] = 0;

                    $scope.dato.promedio[val] = (total / totalCriterio) * 100;
                    promedioGeneral = promedioGeneral + $scope.dato.promedio[val];
                    totalCriterio = 0;
                    total = 0;
                    aprobado = 0;
                    noaplica = 0;
                    noaprobado = 0;
                });

                $scope.dato.promedioGeneral = promedioGeneral / $scope.dato.totalExpediente;
            };

            /**
             * @ngdoc method
             * @name Transaccion.CalidadCtrl#validarNoRepetirExpediente
             * @methodOf Transaccion.CalidadCtrl
             *
             * @description
             * valida que no se repita un expediente
             * @param {string} valor valor a comprobar
             * @param {string} exp numero de expediente
             */
            $scope.expedienteValido = true;
            $scope.dato.expediente = [];
            $scope.validarNoRepetirExpediente = function(valor) {
                var repite = 0;
                angular.forEach($scope.dato.expediente, function(item, key) {
                    if (item == valor) {
                        repite++;
                    }
                });
                if (repite > 0)
                    flash('warning', $translate.instant("REPITE_EXPEDIENTE"));
                if (repite == 0) {
                    $scope.expedienteValido = false;
                    $scope.numExpediente = '';
                    $scope.exp = valor;
                    $scope.agregarColumna(valor);
                    $scope.dato.numExpediente = "";
                }
            }

            /**
             * @ngdoc method
             * @name Transaccion.CalidadCtrl#aprobar
             * @methodOf Transaccion.CalidadCtrl
             *
             * @description
             * Evaluar los criterios si/no
             * @param {string} index identificador del criterio
             * @param {string} evaluacion id de la evaluación
             * @param {string} ap lugar de verificación
             * @param {string} exp numero de expediente
             * @param {string} id numero de columna
             */
            $scope.json = {};
            $scope.tieneHallazgo = [];

            $scope.aprobar = function(index, evaluacion, col, exp) {
                if (!angular.isUndefined($scope.dato.expediente[col])) {
                    $scope.obtenerPromedio();

                    $scope.modificado = true;
                    $scope.tieneHallazgo[exp] = false;
                    angular.forEach($scope.dato.aprobado[exp], function(item, key) {
                        if (item == 0) {
                            $scope.tieneHallazgo[exp] = true;
                        }
                    });

                    var indi = angular.element(document.querySelector('#indicador'));
                    var code = indi[0].innerText;
                    code = code.split(" - ");
                    var info = 0;
                    var totalAprobado = 0;
                    var totalCriterio = 0;
                    angular.forEach($scope.dato.aprobado[exp], function(item, key) {
                        totalAprobado++;
                    });

                    totalCriterio = $scope.dato.totalCriterio[exp];

                    angular.forEach($scope.informacion[exp], function(item, key) {
                        var existe = false;
                        info++;
                        angular.forEach($scope.informacion[exp], function(item, key) {
                            angular.forEach(item, function(v, k) {
                                if (k == code[0])
                                    existe = true;
                            })
                        });
                        if (existe) {
                            $scope.informacion[exp][key][code[0]] = totalAprobado;
                        } else {
                            $scope.informacion[exp][key] = {
                                "id": $scope.dato.idIndicador,
                                "codigo": code[0],
                                "nombre": code[1],
                                "total": totalCriterio
                            };
                            $scope.informacion[exp][key][code[0]] = totalAprobado;
                        }
                    });
                    if (info == 0) {
                        $scope.informacion[exp] = [];
                        $scope.informacion[exp][0] = {
                            "id": $scope.dato.idIndicador,
                            "codigo": code[0],
                            "nombre": code[1],
                            "total": totalCriterio
                        };
                        $scope.informacion[exp][0][code[0]] = totalAprobado;
                    }
                    var tco = 0;
                    var tinc = 0;
                    $scope.misIndicadores = [];

                    angular.forEach($scope.informacion, function(val, key) {
                        angular.forEach(val, function(v, k) {
                            $scope.completo[v.id] = [];
                            $scope.incompleto[v.id] = [];
                            $scope.misIndicadores.push(v.id);
                        })
                    });
                    if (angular.isUndefined($scope.totalDeTotal[$scope.dato.idIndicador]))
                        $scope.totalDeTotal[$scope.dato.idIndicador] = [];
                    angular.forEach($scope.informacion, function(val, key) {
                        var exp = key;
                        angular.forEach($scope.misIndicadores, function(vl, ky) {
                            var co = 0;
                            var inc = 0;
                            angular.forEach(val, function(v, k) {
                                $scope.totalDeTotal[$scope.dato.idIndicador][exp] = [];
                                $scope.totalDeTotal[$scope.dato.idIndicador][exp]["de"] = v[v.codigo];
                                $scope.totalDeTotal[$scope.dato.idIndicador][exp]["total"] = v.total;
                                if (v[v.codigo] == v.total) {
                                    tco = tco + 1;
                                    co = co + 1;
                                } else {
                                    tinc = tinc + 1;
                                    inc = inc + 1;
                                }
                            });
                            indi = vl;
                            $scope.completo[indi][exp] = co;
                            $scope.incompleto[indi][exp] = inc;
                        });
                    });
                    if (tinc == 0 && tco > 0)
                        $scope.terminado = true;
                    else
                        $scope.terminado = false;
                } else {
                    flash('warning', $translate.instant("NO_EXPEDIENTE"));
                    $scope.dato.aprobado[exp][index] = null;
                }
            };
            $scope.esSeguimiento = false;
            $scope.verSeguimiento = function(text) {
                if (text == 's' || text == 'S')
                    $scope.esSeguimiento = true;
                else
                    $scope.esSeguimiento = false;
            };

            $scope.valido = false;

            /**
             * @ngdoc method
             * @name Transaccion.CalidadCtrl#cerrar
             * @methodOf Transaccion.CalidadCtrl
             *
             * @description
             * Cerrar evaluación
             * @param {string} id identificador de la evaluación
             */
            $scope.cerrar = function(id) {
                var scope = $scope;

                var confirm = $mdDialog.confirm()
                    .title($translate.instant('CONFIRM_CERRAR'))
                    .textContent($translate.instant('CONFIRM_CERRAR_TEXT'))
                    .ariaLabel('Lucky day')
                    .ok('Aceptar')
                    .cancel('Cancelar');

                $mdDialog.show(confirm).then(function() {
                    scope.dato.cerrado = 1;
                    scope.modificar(id);
                }, function() {

                });
            };

            //Modificar. Actualiza el calidad con los datos que envia el usuario
            $scope.modificar = function(id, f) {
                var url = $scope.ruta;
                var json = {};
                var registros = [];
                var i = 0;
                if (f == 1) $scope.clues = $scope.dato.clues;
                angular.forEach($scope.dato.aprobado, function(val, key) {
                    angular.forEach($scope.dato.expediente, function(v, k) {
                        if (v == key) {
                            i++;
                            registros.push({
                                idIndicador: $scope.dato.idIndicador,
                                expediente: v,
                                columna: i,
                                cumple: $scope.dato.cumple[key],
                                promedio: $scope.dato.promedio[key],
                                totalCriterio: $scope.dato.totalCriterio[key]
                            });
                            registros[i - 1].criterios = [];
                            angular.forEach(val, function(v, k) {
                                registros[i - 1].criterios.push({
                                    idCriterio: k,
                                    idIndicador: $scope.dato.idIndicador,
                                    aprobado: v
                                });
                            });
                        }
                    });
                });
                json.evaluaciones = [];
                json.evaluaciones[0] = {
                    id: $scope.dato.id,
                    clues: $scope.clues,
                    fechaEvaluacion: $scope.dato.fechaEvaluacion,
                    cerrado: $scope.dato.cerrado
                };
                json.evaluaciones[0].registros = registros;
                json.evaluaciones[0].criterio_respuestas = $scope.dato.mirespuesta;
                json.evaluaciones[0].hallazgos = $scope.dato.hallazgos;

                if (json) {
                    $scope.cargando = true;
                    CrudDataApi.editar(url, id, json, function(data) {
                        if (data.status == '407')
                            $window.location = "acceso";

                        if (data.status == 200) {
                            $scope.TieneDatosIndicador = true;
                            flash('success', data.messages);
                            if ($scope.dato.cerrado == 1) {
                                var uri = $scope.url.split('/');
                                uri = "/" + uri[1] + "/ver";
                                $location.path(uri).search({
                                    id: id
                                });
                            }
                            if (f == 1)
                                $scope.nombre = $scope.dato.nombre;
                            $scope.clues = data.data.clues;
                            $scope.modificado = false;
                            $mdDialog.hide();
                        } else {
                            errorFlash.error(data);
                        }
                        $scope.cargando = false;
                    }, function(e) {
                        errorFlash.error(e);
                        $scope.cargando = false;
                    });
                }
            };
            //Borrar. Elimina el calidad del parametro id
            $scope.borrarIndicador = function() {
                var scope = $scope;

                var confirm = $mdDialog.confirm()
                    .title($translate.instant('CONFIRM_DELETE'))
                    .textContent($translate.instant('CONFIRM_DELETE_TEXT'))
                    .ariaLabel('Lucky day')
                    .ok('Aceptar')
                    .cancel('Cancelar');

                $mdDialog.show(confirm).then(function() {
                    scope.eliminarIndicador();
                }, function() {

                });
            }
            $scope.eliminarIndicador = function() {
                var ind = $scope.dato.idIndicador;
                var eva = $location.search().id;

                var url = $scope.ruta;
                $scope.cargando = true;

                CrudDataApi.eliminar("/EvaluacionCalidadCriterio", eva + "?idIndicador=" + ind, function(data) {
                    if (data.status == '407')
                        $window.location = "acceso";

                    if (data.status == 200) {
                        flash('success', data.messages);

                        $scope.cargando = false;

                        $route.reload();
                    } else {
                        errorFlash.error(data);
                    }
                    $scope.cargando = false;
                }, function(e) {
                    errorFlash.error(e);
                    $scope.cargando = false;
                });

            };
            //Borrar. Elimina el calidad del parametro id
            $scope.borrarExpediente = function(exp, col) {

                if (angular.isUndefined($scope.tieneExpediente[exp])) {
                    $scope.columnas.splice(col, 1);
                    $scope.dato.expediente.splice(col, 1);
                    $scope.dato.totalExpediente = $scope.columnas.length;
                    delete $scope.completo[exp];
                    delete $scope.incompleto[exp];
                    $scope.obtenerPromedio();
                } else {
                    var scope = $scope;

                    var confirm = $mdDialog.confirm()
                        .title($translate.instant('CONFIRM_DELETE'))
                        .textContent($translate.instant('CONFIRM_DELETE_TEXT'))
                        .ariaLabel('Lucky day')
                        .ok('Aceptar')
                        .cancel('Cancelar');

                    $mdDialog.show(confirm).then(function() {
                        scope.eliminarExpediente();
                    }, function() {

                    });
                }
            }
            $scope.eliminarExpediente = function(exp, col) {
                var ind = $scope.dato.idIndicador;
                var eva = $location.search().id;
                var url = $scope.ruta;
                $scope.cargando = true;

                CrudDataApi.eliminar("/EvaluacionCalidadCriterio", eva + "?idIndicador=" + ind + "&expediente=" + exp, function(data) {
                    if (data.status == '407')
                        $window.location = "acceso";

                    if (data.status == 200) {
                        flash('success', data.messages);

                        $scope.cargando = false;

                        $scope.columnas.splice(col, 1);
                        delete $scope.completo[exp];
                        delete $scope.incompleto[exp];
                        $scope.dato.totalExpediente--;
                        $scope.obtenerPromedio();
                    } else {
                        errorFlash.error(data);
                    }
                    $scope.cargando = false;
                }, function(e) {
                    errorFlash.error(e);
                    $scope.cargando = false;
                });

            };
            /*
             *  Fin Bloque Modificar
             ************************************************************************************/

            /************************************************************************************
             *  Bloque Ver
             */
            /**
             * @ngdoc method
             * @name Transaccion.CalidadCtrl#cargarCriteriosVer
             * @methodOf Transaccion.CalidadCtrl
             *
             * @description
             * cargar los criterios para la vista ver
             */
            $scope.cargarCriteriosVer = function() {
                var idev = $location.search().id;
                $scope.cargando2 = true;
                $http.get(URLS.BASE_API + '/EvaluacionCalidadCriterio/' + idev)
                    .success(function(data, status, headers, config) {
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
                            $scope.cargando2 = false;
                        } else {
                            $scope.cargando2 = false;
                            flash('danger', "Ooops! Ocurrio un error (" + data.status + ") ->" + data.messages);
                        }
                    })
                    .error(function(data, status, headers, config) {
                        $scope.cargando2 = false;
                        errorFlash.error(data);
                    });
            };

            $scope.tieneExpediente = [];
            /*
             *  Fin Bloque Ver
             ************************************************************************************/

            /************************************************************************************
             *  Bloque Autocomplete
             */
            $scope.querySearch = function(query) {
                return $http.get(URLS.BASE_API + '/CluesUsuario', {
                        params: {
                            termino: query
                        }
                    })
                    .then(function(res) {
                        return res.data.data;
                    });
            }
            $scope.selectedItemChange = function(item) {
                    if (!angular.isUndefined(item)) {
                        $scope.CluesChange(item.clues);
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
            $scope.cambiarTipo = function(tipo) {
                    if (tipo == "clues")
                        $scope.repos = $scope.Clues;
                    if (tipo == "jurisdiccion")
                        $scope.repos = $scope.Jurisdiccion;
                }
                /*
                 *  Fin Bloque Autocomplete
                 ************************************************************************************/


            /************************************************************************************
             *  Fin Bloque Autocomplete
             */
            // Guardar
            $scope.guardar = function(form) {

                var url = $scope.ruta;
                var json = $scope.dato;
                if (json) {
                    $scope.cargando = true;
                    CrudDataApi.crear(url, json, function(data) {
                        if (data.status == '407')
                            $window.location = "acceso";

                        if (data.status == 201) {
                            $scope.dato = angular.copy($scope.limpio);
                            form.$setPristine();
                            form.$setUntouched();
                            flash('success', data.messages);
                            var uri = $scope.url.split('/');

                            uri = "/" + uri[1] + "/modificar";

                            $location.path(uri).search({
                                id: data.data.id
                            });
                        } else {
                            errorFlash.error(data);
                        }
                        $scope.cargando = false;
                    }, function(e) {
                        errorFlash.error(e);
                        $scope.cargando = false;
                    });
                }
            };
            /*
             *  Fin Bloque Nuevo
             ************************************************************************************/

            /**
             * @ngdoc method
             * @name Transaccion.RecursoCtrl#pdf
             * @methodOf Transaccion.RecursoCtrl
             *
             * @description
             * Imprime el pdf de la evaluacion	
             */
            $scope.pdf = function() {
                var elem = document.getElementById("imprimir");
                var json = {};
                json.html = window.encodeURIComponent(elem.innerHTML);
                json.header = "";
                json.footer = "";
                json.nombre = "calidad_" + $scope.dato.id;
                if (json) {
                    CrudDataApi.crear("/html-pdf", json, function(data) {

                        if (data.status == 200) {
                            window.open(URLS.BASE + "/v1/pdf");
                        } else {
                            growlService.growl(data.messages, "warning");
                        }
                    }, function(e) {
                        growlService.growl(e, "danger");
                    });
                }
            }

        })
})();