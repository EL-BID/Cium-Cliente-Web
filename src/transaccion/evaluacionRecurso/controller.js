/**
 * @ngdoc object
 * @name Transaccion.RecursoCtrl
 * @description
 * Complemento del controlador CrudCtrl  para tareas especificas en EvaluacionRecurso
 */
(function() {
    'use strict';
    angular.module('RecursoModule')
        .controller('RecursoCtrl', function($rootScope, $translate, $localStorage, $mdDialog, $mdToast, $mdMedia, $scope, $mdSidenav, $location, $mdBottomSheet, UsuarioData, Auth, Menu, $http, $window, $timeout, $route, $filter, flash, errorFlash, listaOpcion, Criterios, CrudDataApi, URLS) {
            /**************************************************************
            Codigo general
            */
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
            //TODO: Revisar
            $scope.ruta = "";
            $scope.url = $location.url();

            $scope.permisoModificar = $localStorage.cium.permisos.indexOf("7461725265") >= 0 ? true : false;
            $scope.permisoEliminar = $localStorage.cium.permisos.indexOf("AE61725265") >= 0 ? true : false;
            $scope.permisoVer = $localStorage.cium.permisos.indexOf("7665725265") >= 0 ? true : false;
            $scope.permisoAgregar = $localStorage.cium.permisos.indexOf("6F73727563") >= 0 ? true : false;

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

            /**
             * @ngdoc method
             * @name Transaccion.RecursoCtrl#abrirFicha
             * @methodOf Transaccion.RecursoCtrl
             *
             * @description
             * abre la ficha de la clues en un dialog
             * @param {event} ev evento click
             */
            $scope.abrirValidar = function(ev, data) {
                var valido = false;
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
                $scope.dialog_validacion = true;
                $scope.criterios = {};
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
                                        scope.mostrarCriterios(data);
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
                    $scope.mostrarCriterios(data);
            };
            $scope.dato = {};
            $scope.dato.aprobado = [];
            $scope.dato.mirespuesta = [];
            $scope.abrirValidarCriterio = function(ev, data) {
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

                                        if (v1.tipo == "RECURSO" && val.id == v1.idCriterioValidacion && data.idCriterio == v1.idCriterio && scope.id == v1.idEvaluacion) {
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
                                        if (angular.isUndefined(scope.dato.mirespuesta[data.idCriterio]))
                                            scope.dato.mirespuesta[data.idCriterio] = [];
                                        scope.dato.mirespuesta[data.idCriterio][val.id] = {
                                            idCriterio: data.idCriterio,
                                            idCriterioValidacion: val.id,
                                            tipo: 'RECURSO',
                                            respuesta1: p1.pregunta1,
                                            respuesta2: p2.pregunta2
                                        };
                                    });
                                    if (malas == 0)
                                        valido = true;

                                    if (valido) {
                                        scope.dato.aprobado[data.idCriterio] = 1;
                                    } else {
                                        scope.dato.aprobado[data.idCriterio] = 0;
                                    }
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

            /**
             * @ngdoc method
             * @name Transaccion.RecursoCtrl#getClues
             * @methodOf Transaccion.RecursoCtrl
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
                    return $scope.repos;
                }, function(e) {
                    errorFlash.error(e);
                    $scope.cargando = false;
                });
            };

            /**
             * @ngdoc method
             * @name Transaccion.RecursoCtrl#CluesChange
             * @methodOf Transaccion.RecursoCtrl
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
                        if (data.data.cone_clues != null) {
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
                            flash('danger', "Ooops! " + $translate.instant('NO_CONE'));
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
            $scope.indicadores = [];
            /**
             * @ngdoc method
             * @name Transaccion.RecursoCtrl#cargarCatalogo
             * @methodOf Transaccion.RecursoCtrl
             *
             * @description
             * Con esta funcion listamos cualquier catalogo que especifiquemos con la url
             * @param {string} url url del recurso a listar
             * @param {string}  modelo nombre de el modelo en el cual se asignara el resultado de la petición
             * @param {function} callback ejecutar alguna función después de un resultado exitoso
             */
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

            $scope.cargarCatalogo = function(url) {
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
                            $scope.estadistica();
                    } else {
                        errorFlash.error(data);
                    }
                    $scope.cargando = false;
                });
            };

            /*
            Fin de codigo general
             **************************************************************/


            /**************************************************************
            Este bloque es exclusivo para el listado.
            */
            // cambia los textos del paginado de cada grid
            $scope.paginationLabel = {
                text: $translate.instant('ROWSPERPAGE'),
                of: $translate.instant('DE')
            };

            // Inicializa el campo para busquedas disponibles para cada grid
            $scope.BuscarPor = [{
                id: "clues",
                nombre: "clues"
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

            //Se ejecuta al dar click en una fila del listado
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

            // evento para el boton nuevo, redirecciona a la vista nuevo
            $scope.nuevo = function() {
                var uri = $scope.url.split('/');

                uri = "/" + uri[1] + "/nuevo";

                $location.path(uri);
            }

            $scope.showSearch = false;
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

            /**
             * @ngdoc method
             * @name Transaccion.RecursoCtrl#abrirEvaluacionFicha
             * @methodOf Transaccion.RecursoCtrl
             *
             * @description
             * abre un dialogo para seleccionar unidad medica e indicadores para generar una evaluación impresa
             * @param {event} ev evento click
             */
            $scope.abrirEvaluacionFicha = function(ev) {
                $scope.indicadores = [];
                $scope.editDialog = $mdDialog;
                $scope.editDialog.show({
                    targetEvent: ev,

                    scope: $scope.$new(),
                    templateUrl: 'src/transaccion/evaluacionRecurso/views/evaluacionFicha.html',
                    clickOutsideToClose: true
                });
            };

            //generar impreso
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
                $localStorage.cium.recurso = {};
                $localStorage.cium.recurso.imprimir = {};
                $localStorage.cium.recurso.imprimir.um = $scope.dato;
                $localStorage.cium.recurso.imprimir.indicadores = $scope.tempIndicador;
                $location.path("evaluacion-recurso/evaluacionImpresa");
            }
            $scope.vistaImpreso = function() {
                $scope.dato = $localStorage.cium.recurso.imprimir.um;
                $scope.indicadores = [];
                var cone = $scope.dato.idCone;
                angular.forEach($localStorage.cium.recurso.imprimir.indicadores, function(val, key) {
                    CrudDataApi.lista('/CriterioEvaluacionRecursoImprimir/' + cone + '/' + val, function(data) {
                        if (data.status == 200) {
                            $scope.indicadores.push(data.data);
                        }
                    }, function(e) {
                        errorFlash.error(e);
                    });
                });
                $scope.cargando = false;
            }
            // fin generar impreso

            $scope.jurisdiccion = '';
            $scope.email = '';
            $scope.cone = '';
            $scope.cerrado = 1;
            $scope.desde = '';
            $scope.hasta = '';

            // obtiene los datos necesarios para crear el grid (listado)
            $scope.init = function(buscar, columna) {
                var url = $scope.ruta;
                buscar = $scope.buscar ? $scope.buscar : '';
                var pagina = $scope.paginacion.pag;
                var limite = $scope.paginacion.lim;

                var jurisdiccion = $scope.jurisdiccion;
                var email = $scope.email;
                var cone = $scope.cone;
                var cerrado = $scope.cerrado;
                var desde = $scope.desde ? moment($scope.desde).format('YYYY-MM-DD') : '';
                var hasta = $scope.hasta ? moment($scope.hasta).format('YYYY-MM-DD') : '';

                var order = $scope.query.order;

                limite = limite + "&columna=" + columna + "&valor=" + buscar + "&buscar=true";

                $scope.cargando = true;

                CrudDataApi.lista(url + '?pagina=' + pagina + '&limite=' + limite + "&order=" + order
                    + "&jurisdiccion=" + jurisdiccion
                    + "&email=" + email
                    + "&cone=" + cone
                    + "&cerrado=" + cerrado
                    + "&desde=" + desde
                    + "&hasta=" + hasta, function(data) {
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

            //Ver. Muestra el detalle del id del recurso
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

                        $scope.cargarCatalogo('/Indicador?categoria=RECURSO', $scope.lista_indicadores)
                    } else {
                        errorFlash.error(data);
                    }
                    $scope.cargando = false;
                }, function(e) {
                    errorFlash.error(e);
                    $scope.cargando = false;
                });
            };


            //Modificar. Actualiza el recurso con los datos que envia el usuario
            $scope.modificar = function(id, f) {
                var url = $scope.ruta;
                var json = {};
                var criterios = [];
                if (f == 1) $scope.clues = $scope.dato.clues;
                angular.forEach($scope.dato.aprobado, function(val, key) {
                    criterios.push({
                        idCriterio: key,
                        idIndicador: $scope.dato.idIndicador,
                        aprobado: val
                    });
                });
                json.evaluaciones = [];
                json.evaluaciones[0] = {
                    id: $scope.dato.id,
                    clues: $scope.clues,
                    fechaEvaluacion: $scope.dato.fechaEvaluacion,
                    cerrado: $scope.dato.cerrado
                };
                json.evaluaciones[0].criterios = criterios;
                json.evaluaciones[0].criterio_respuestas = $scope.dato.mirespuesta;
                json.evaluaciones[0].hallazgos = [];
                if (!angular.isUndefined($scope.dato.hallazgos))
                    if ($scope.dato.hallazgos.idAccion) {
                        json.evaluaciones[0].hallazgos[0] = $scope.dato.hallazgos;
                        json.evaluaciones[0].hallazgos[0].idIndicador = $scope.dato.idIndicador;
                    }

                if (json) {
                    $scope.cargando = true;
                    CrudDataApi.editar(url, id, json, function(data) {
                        if (data.status == '407')
                            $window.location = "acceso";

                        if (data.status == 200) {
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
                            $scope.cargarCriterios();
                            $scope.estadistica();
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

            //Correo. Enviar evaluacion al correo
            $scope.correo = function(id, index) {
                $scope.cargando = true;
                CrudDataApi.ver('/RecursoCorreo', id, function(data) {
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
            /*
            Termina bloque del listado
            **************************************************************/

            /**************************************************************
            bloque de modulo de ver
            */
            $scope.datos = [];
            $scope.imprimirDetalle = true;

            /**
             * @ngdoc method
             * @name Transaccion.RecursoCtrl#cargarCriteriosVer
             * @methodOf Transaccion.RecursoCtrl
             *
             * @description
             * cargar los criterios para la vista ver
             */
            $scope.cargarCriteriosVer = function() {
                var idev = $location.search().id;
                $scope.cargando2 = true;
                $http.get(URLS.BASE_API + '/EvaluacionRecursoCriterio/' + idev)
                    .success(function(data, status, headers, config) {
                        if (data.status == '407')
                            $window.location = "acceso";

                        if (data.status == 200) {
                            $scope.indicadores = data.data;
                            $scope.estadistica = data.estadistica;
                        } else {
                            flash('danger', "Ooops! Ocurrio un error (" + data.status + ") ->" + data.messages);
                        }
                        $scope.cargando2 = false;
                    })
                    .error(function(data, status, headers, config) {
                        $scope.cargando2 = false;
                        errorFlash.error(data);
                    });
            };
            /*
            Fin bloque de ver
            **************************************************************/

            /**************************************************************
            bloque de modulo de modificar
            */
            $scope.tamanoHeight = $window.innerHeight - 230;
            $scope.$watch(function() {
                return window.innerWidth;
            }, function(value) {
                $scope.tamanoHeight = $window.innerHeight - 230;
            });
            $scope.sumarNoAplica = function() {
                $scope.contadorNoAplica++;
            }
            $scope.contadorNoAplica = 0;
            $scope.terminado = false;
            $scope.lista_indicadores = [];

            /**
             * @ngdoc method
             * @name Transaccion.RecursoCtrl#acciones
             * @methodOf Transaccion.RecursoCtrl
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

            /**
             * @ngdoc method
             * @name Transaccion.RecursoCtrl#verificarCambios
             * @methodOf Transaccion.RecursoCtrl
             *
             * @description
             * Comprueba que el indicador actual no tenga cambios en la evaluacion
             */
            $scope.criterios = [];
            $scope.modificado = false;
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

            $scope.dialog_validacion = false;
            $scope.verIndicacion = function(ev, data) {

                $scope.editDialog = $mdDialog;
                $scope.editDialog.show({
                    targetEvent: ev,
                    scope: $scope.$new(),
                    templateUrl: 'src/transaccion/evaluacionCalidad/views/indicaciones.html',
                    clickOutsideToClose: true
                }).then(function(answer) {
                    if (!$scope.dialog_validacion)
                        $scope.abrirValidar(null, data);
                }, function() {
                    if (!$scope.dialog_validacion)
                        $scope.abrirValidar(null, data);
                });
            };

            /**
             * @ngdoc method
             * @name Transaccion.RecursoCtrl#cargarCriterios
             * @methodOf Transaccion.RecursoCtrl
             *
             * @description
             * cargar los criterios que le correspondan por indicador y nivel de cone
             */
            $scope.cargarCriterios = function(id, codigo, nombre, indicacion, validacion, preguntas, $index) {
                var cone = $scope.dato.idCone;
                var indi = $scope.dato.idIndicador;
                var idev = $scope.dato.id;

                $scope.indicador_validaciones = validacion;
                $scope.indicador_preguntas = preguntas;

                $scope.verificarCambios();

                if (!angular.isUndefined(cone) && cone != "" && !angular.isUndefined(indi) && indi != "" && !$scope.modificado) {
                    $scope.cargando = true;
                    $http.get(URLS.BASE_API + '/CriterioEvaluacionRecurso/' + cone + '/' + indi + '/' + idev)
                        .success(function(data, status, headers, config) {
                            if (data.status == '407')
                                $window.location = "acceso";

                            $scope.dialog_validacion = false;
                            if (data.status == 200) {
                                if (!angular.isUndefined(nombre)) {
                                    if (angular.isUndefined($scope.informacion)) {
                                        $scope.informacion = new Object();
                                    }
                                    var evaluado = 0;
                                    angular.forEach(data.aprobado, function(val, key) {
                                        evaluado++;
                                    })
                                    $scope.informacion[codigo] = {
                                        "id": id,
                                        "codigo": codigo,
                                        "nombre": nombre,
                                        "indicacion": indicacion,
                                        "indicador_validaciones": validacion,
                                        "indicador_preguntas": preguntas,
                                        "evaluado": evaluado
                                    };
                                    $scope.informacion[codigo][codigo] = data.total;
                                    console.log($scope.informacion[codigo]);
                                    var myObject = $scope.informacion;
                                    var newObject = Object.keys(myObject).reduce(function(previous, current) {
                                        previous[current] = myObject[current];
                                        return previous;
                                    }, {});

                                    $scope.informacion = newObject;

                                    if (angular.isUndefined($scope.totalDeTotal[id]))
                                        $scope.totalDeTotal[id] = [];
                                    $scope.totalDeTotal[id]["de"] = $scope.totalDeTotal[id]["de"] > 0 ? $scope.totalDeTotal[id]["de"] : 0;
                                    $scope.totalDeTotal[id]["total"] = data.total;
                                    if (!angular.isUndefined($index))
                                        $scope.lista_indicadores.splice($index, 1);
                                }
                                if (indicacion != null) {
                                    $scope.indicaciones = indicacion;
                                    $scope.verIndicacion(null, data);
                                } else {
                                    $scope.indicaciones = null;
                                    if (validacion)
                                        $scope.abrirValidar(null, data);
                                    else
                                        $scope.mostrarCriterios(data);
                                }
                            } else
                                flash('danger', "Ooops! Ocurrio un error (" + data.status + ") ->" + data.messages);

                            $scope.cargando = false;
                        })
                        .error(function(data, status, headers, config) {
                            $scope.cargando = false;
                            errorFlash.error(data);
                        });
                }
            };

            $scope.mostrarCriterios = function(data) {
                var op = 0;
                $scope.criterios = {};
                $scope.criterios = data.data;
                $scope.dato.aprobado = data.aprobado;
                if (!angular.isUndefined(data.hallazgo)) {
                    $scope.dato.hallazgos = {};

                    $scope.dato.hallazgos.descripcion = data.hallazgo.descripcion;
                    $scope.dato.hallazgos.idAccion = data.hallazgo.idAccion;
                    $scope.dato.hallazgos.idPlazoAccion = data.hallazgo.idPlazoAccion;
                    if ($scope.dato.hallazgos.idPlazoAccion > 0)
                        $scope.esSeguimiento = true;
                    if (!angular.isUndefined(data.hallazgo.descripcion))
                        $scope.tieneHallazgo = true;
                    else
                        $scope.tieneHallazgo = false;
                    op = 1;
                } else {
                    op = 0;
                }
                if (data.total == 0)
                    flash('warning', $translate.instant("NO_CRITERIO"));

                if (data.status != 200 || op == 0) {
                    $scope.dato.hallazgos.descripcion = "";
                    $scope.dato.hallazgos.idAccion = "";
                    $scope.dato.hallazgos.idPlazoAccion = "";
                    $scope.esSeguimiento = false;
                    $scope.tieneHallazgo = false;
                }
            }
            $scope.hallazgos = {};

            /**
             * @ngdoc method
             * @name Transaccion.RecursoCtrl#estadistica
             * @methodOf Transaccion.RecursoCtrl
             *
             * @description
             * obtener las estadisticas de la evaluacion
             */
            $scope.totalDeTotal = [];
            $scope.estadistica = function() {
                $scope.cargando = true;
                var idev = $scope.dato.id;
                if (angular.isUndefined(idev) || idev == "")
                    idev = $location.search().id;
                CrudDataApi.ver('/EstadisticaRecurso', idev, function(data) {
                    if (data.status == '407')
                        $window.location = "acceso";

                    if (data.status == 200) {
                        $scope.modificado = false;

                        if (angular.isObject(data.data))
                            $scope.informacion = data.data;

                        angular.forEach($scope.informacion, function(val, key) {
                            angular.forEach($scope.lista_indicadores, function(v, k) {
                                if (key == v.codigo) {
                                    $scope.lista_indicadores.splice(k, 1);
                                }
                            });
                        });

                        $scope.completo = 0;
                        $scope.incompleto = 0;
                        var co = 0;
                        var inc = 0;

                        angular.forEach(data.data, function(val, key) {
                            $scope.totalDeTotal[val.id] = [];
                            $scope.totalDeTotal[val.id]["total"] = val[key];
                            $scope.totalDeTotal[val.id]["de"] = val.evaluado;

                            if (val[key] == val.evaluado)
                                co = co + 1;
                            else
                                inc = inc + 1;
                        });

                        $scope.completo = co;
                        $scope.incompleto = inc;
                        if (inc == 0 && co > 0)
                            $scope.terminado = true;
                        else
                            $scope.terminado = false;
                    }

                    $scope.cargando = false;
                }, function(e) {

                    $scope.cargando = false;
                });
            };

            /**
             * @ngdoc method
             * @name Transaccion.RecursoCtrl#aprobar
             * @methodOf Transaccion.RecursoCtrl
             *
             * @description
             * Evaluar los criterios si/no
             * @param {string} index identificador del criterio
             * @param {string} evaluacion id de la evaluación
             * @param {string} ap lugar de verificación
             */
            $scope.json = {};
            $scope.tieneHallazgo = false;
            $scope.aprobar = function(index, evaluacion) {
                $scope.modificado = true;
                $scope.tieneHallazgo = false;
                angular.forEach($scope.dato.aprobado, function(item, key) {
                    if (item == 0) {
                        $scope.tieneHallazgo = true;
                    }
                });
                if (!$scope.tieneHallazgo)
                    $scope.dato.hallazgos = {};

                var indi = angular.element(document.querySelector('#indicador'));

                var code = indi[0].innerText;
                code = code.split(" - ");
                var info = 0;
                var totalAprobado = 0;
                var totalCriterio = 0;
                angular.forEach($scope.dato.aprobado, function(item, key) {
                    totalAprobado++;
                });
                angular.forEach($scope.criterios, function(item, key) {
                    totalCriterio++;
                });

                var codigo = code[0].trim();

                $scope.informacion[codigo]["evaluado"] = totalAprobado;
                $scope.informacion[codigo][codigo] = totalCriterio;

                $scope.completo = 0;
                $scope.incompleto = 0;
                var co = 0;
                var inc = 0;
                angular.forEach($scope.informacion, function(val, key) {
                    if (angular.isUndefined($scope.totalDeTotal[val.id]))
                        $scope.totalDeTotal[val.id] = [];
                    $scope.totalDeTotal[val.id]["de"] = val.evaluado;
                    $scope.totalDeTotal[val.id]["total"] = val[key];
                    if (val[key] == val.evaluado)
                        co = co + 1;
                    else
                        inc = inc + 1;
                });
                $scope.completo = co;
                $scope.incompleto = inc;

                if (inc == 0 && co > 0)
                    $scope.terminado = true;
                else
                    $scope.terminado = false;
            };
            $scope.esSeguimiento = false;
            $scope.verSeguimiento = function(text) {
                if (text == 's' || text == 'S')
                    $scope.esSeguimiento = true;
                else
                    $scope.esSeguimiento = false;
            };

            /**
             * @ngdoc method
             * @name Transaccion.RecursoCtrl#cerrar
             * @methodOf Transaccion.RecursoCtrl
             *
             * @description
             * Cerrar evaluación
             * @param {string} id identificador de la evaluación
             */
            $scope.cerrar = function(id) {
                var scope = $scope;

                var confirm = $mdDialog.confirm()
                    .title($translate.instant('CONFIRM_CERRAR'))
                    .ariaLabel('Lucky day')
                    .ok('Aceptar')
                    .cancel('Cancelar');

                $mdDialog.show(confirm).then(function() {
                    scope.dato.cerrado = 1;
                    scope.modificar(id);
                }, function() {

                });
            };

            //Borrar. Elimina el recurso del parametro id

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

                CrudDataApi.eliminar("/EvaluacionRecursoCriterio", eva + "?idIndicador=" + ind, function(data) {
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
            /*
            Fin bloque de modificar
            **************************************************************/

            /**************************************************************
            bloque de modulo de ficha que esta en modificar
            */
            $scope.update = false;

            /**
             * @ngdoc method
             * @name Transaccion.RecursoCtrl#hide
             * @methodOf Transaccion.RecursoCtrl
             *
             * @description
             * Cerrar el dialogo de la ficha
             */
            $scope.hide = function() {
                $mdDialog.hide();
            };

            /**
             * @ngdoc method
             * @name Transaccion.RecursoCtrl#abrirFicha
             * @methodOf Transaccion.RecursoCtrl
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
                    templateUrl: 'src/transaccion/evaluacionRecurso/views/ficha.html',
                    clickOutsideToClose: true
                });
            };

            /*
            Fin bloque de ficha que esta en modificar
            **************************************************************/

            /**************************************************************
            Bloque de autocomplete
            usado en todo donde se busque unidad medica
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
            $scope.cambiarTipo = function(tipo) {
                    if (tipo == "clues")
                        $scope.repos = $scope.Clues;
                    if (tipo == "jurisdiccion")
                        $scope.repos = $scope.Jurisdiccion;
                }
                /*
                Fin bloque autocomplete
                **************************************************************/

            /**************************************************************
            Bloque de nuevo
            */
            // inicializa las rutas para crear los href correspondientes en la vista actual
            $scope.index = function(ruta) {
                $scope.ruta = ruta;
                var uri = $scope.url;

                if (uri.search("nuevo") == -1)
                    $scope.init();
            };

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
            Fin bloque de nuevo
            **************************************************************/
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
                json.nombre = "recurso_" + $scope.dato.id;
                if (json) {
                    $scope.cargando = true;
                    CrudDataApi.crear("/html-pdf", json, function(data) {
                        $scope.cargando = false;
                        if (data.status == 200) {
                            window.open(URLS.BASE + "/v1/pdf");
                        } else {
                            flash('warning', data.messages);
                        }
                    }, function(e) {
                        console.log(e);
                        $scope.cargando = false;
                    });
                }
            }

        })
})();