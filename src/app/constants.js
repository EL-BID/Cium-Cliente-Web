(function() {
    'use strict';

    angular.module('App').constant('MENU', [{
            grupo: false,
            lista: [{
                titulo: 'Dashboard',
                key: '4441534842',
                path: '/dashboard',
                icono: 'view-grid'
            }]
        },



        {
            grupo: 'EVALUACION',
            lista: [{
                titulo: 'RECURSO',
                key: '7265637572',
                path: '/evaluacion-recurso',
                icono: 'note-plus-outline'
            }, {
                titulo: 'CALIDAD',
                key: '63616C6964',
                path: '/evaluacion-calidad',
                icono: 'note-plus'
            }, {
                titulo: "HALLAZGO",
                key: "568616C6CF",
                path: "/hallazgo",
                icono: "view-list"
            }]
        }, {
            grupo: "CATALOGO",
            lista: [{
                    titulo: "ACCION",
                    key: "416363696F",
                    path: "/accion",
                    icono: "spellcheck"
                }, {
                    titulo: "ALERTA",
                    key: "416C657274",
                    path: "/alerta",
                    icono: "alert"
                }, {
                    titulo: "Clues",
                    key: "436C756573",
                    path: "/clues",
                    icono: "hospital"
                }, {
                    titulo: "CONE",
                    key: "4571756970",
                    path: "/cone",
                    icono: "seat-flat"
                }, {
                    titulo: "ZONA",
                    key: "AC7A6F6E61",
                    path: "/zona",
                    icono: "google-maps"
                },

                {
                    titulo: "CRITERIO",
                    key: "4372697465",
                    path: "/criterio",
                    icono: "content-paste"
                }, {
                    titulo: "INDICADOR",
                    key: "496E646963",
                    path: "/indicador",
                    icono: "calendar-multiple-check"
                }, {
                    titulo: "LUGAR-VERIFICACION",
                    key: "4C75676172",
                    path: "/lugar-verificacion",
                    icono: "map-marker"
                }, {
                    titulo: "PLAZO-ACCION",
                    key: "506C617A6F",
                    path: "/plazo-accion",
                    icono: "calendar-clock"
                }, {
                    titulo: "VERSION-APP",
                    key: "506C617XXX",
                    path: "/versionApp",
                    icono: "android"
                }
            ]
        }, {
            grupo: 'Administrador',
            lista: [
                { titulo: 'Usuarios', key: '4C49535441', path: '/usuarios', icono: 'account-multiple' },
                { titulo: 'Roles', key: '524F4C4553', path: '/roles', icono: 'group' }
            ]
        }

    ]);
    angular.module('App').constant('MENU_PUBLICO', [
        { icono: 'exit-to-app', titulo: 'INICIAR_SESION', path: 'signin' },
        { icono: 'information-outline', titulo: 'QUE_ES_APP', path: 'que-es' }

    ]);

    angular.module('App').constant('TIPOS', [
        { id: "time", nombre: "Hora" },
        { id: "date", nombre: "Fecha" },
        { id: "number", nombre: "Numero" },
        { id: "boolean", nombre: "Falso/Verdadero" }
    ]);

    angular.module('App').constant('UNIDAD_MEDIDA', [
        { id: "", nombre: "Ninguno" },
        { id: "secs", nombre: "Segundos" },
        { id: "mins", nombre: "Minutos" },
        { id: "hours", nombre: "Horas" },
        { id: "days", nombre: "Dias" },
        { id: "weeks", nombre: "Semana" },
        { id: "months", nombre: " Meses" },
        { id: "2months", nombre: "Bimestre" },
        { id: "3months", nombre: "Trimestre" },
        { id: "6months", nombre: "Semestre" },
        { id: "years", nombre: "Año" }
    ]);

    angular.module('App').constant('OPERADOR_LOGICO', [
        { id: "<", nombre: "Menor que" },
        { id: ">", nombre: "Mayor que" },
        { id: "<=", nombre: "Menor igual que" },
        { id: ">=", nombre: "Mayor igual que" },
        { id: "<>", nombre: "Diferente de" },
        { id: "=", nombre: "Igual a" }
    ]);

    angular.module('App').constant('OPERADOR_ARITMETICO', [
        { id: "-", nombre: "Resta" },
        { id: "+", nombre: "Suma" }
    ]);

})();
