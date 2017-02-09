(function(){
	'use strict';
/**
 * @ngdoc interface
 * @name App.interface:Scaffolding
 * @description
 * A continuación se lista las carpetas y se explica el contenido de cada uno.
 * 
* <br>
 * <h4>assets</h4>
 * <p>cualquier recurso gráfico que se carga externamente</p>
 * <table>
 *    <tr>
 *      <th>Nombre</th>
 *      <th>Descripción</th>
 *    </tr>
 *    <tr>
 *      <td>css</th>
 *      <td>Todos los estilos de app</th>
 *    </tr>
 *    <tr>
 *      <td>img</th>
 *      <td>Imagenes que se usen en el app</th>
 *    </tr>
 *    <tr>
 *      <td>js</th>
 *      <td>Javascript que se necesiten extras a los bower_componets</th>
 *    </tr>
 *    <tr>
 *      <td>svg</th>
 *      <td>Imagenes tipo svg</th>
 *    </tr>
 * </table>
 * 
 * <h4>bower_componets</h4>
 * <p>Vendor de terceros para agilizar la programación</p>
 * <table>
 *    <tr>
 *      <th>Nombre</th>
 *      <th>Descripción</th>
 *    </tr>
 *    <tr>
 *      <td>*.*</th>
 *      <td>Aca se generan todos los modulos de terceros</th>
 *    </tr>
 * </table>
 * 
 * <h4>src</h4>
 * <p>Modelo del proyecto: contiene las vistas y controladores (js) angular del app</p>
 * <table>
 *    <tr>
 *      <th>Nombre</th>
 *      <th>Descripción</th>
 *    </tr>
 *    <tr>
 *      <td>App</th>
 *      <td>Configuracion de la aplicación</th>
 *    </tr>
 *    <tr>
 *      <td>catalogos</th>
 *      <td>Contiene el controlador general para el manejo del CRDU y las carpetas contiene las vistas dentro de otra carpeta llamada views si el modulo necesita realizar una acción especifica y el controlador principal no lo proporciona se genera otro controlador dentro, como el caso de criterio e indicador</th>
 *    </tr>
 *    <tr>
 *      <td>dashboard</th>
 *      <td>Contiene un controlador y en su codigo se separa por multiples controladores que manejan un area del dashboard de cada grafico, la vista lista contiene todas las areas de grafico, dialog contiene las opciones de filtrado</th>
 *    </tr>
 *    <tr>
 *      <td>sistema</th>
 *      <td>Contiene las carpetas de cada modulo y en su interior de cada uno contiene un controlador para ccaiones especificas del modulo y en la carpeta views estan las vistas de cada modulo</th>
 *    </tr>
 *    <tr>
 *      <td>transaccion</th>
 *      <td>Contiene la parte mas importante del modulo que son las recoleccion de datos o evaluaciones. contiene 3 carpetas y dentro de cada uno se encuentra un controlador y sus vistas</th>
 *    </tr>
 * </table>
 */ 
 var app = angular.module('App');  
	app.directive('ngPermiso',function($localStorage,filterFilter,$parse){
    return {
      link: function(scope, element, attrs){
        var model = $parse(attrs.ngPermiso);
        scope.$watch(model, function(value) {
          var resultados = filterFilter($localStorage.cium.permisos,value);
          if(resultados[0] != value){
            element.addClass('ng-hide');
          }
        });
      }
    };
  });

	/**
 * @ngdoc directive
 * @name App.directive:urlModulo
 * @description
 * Genera la url (modificar, nuevo, ver, listar) de las vistas, sin necesidad de poner la ruta completa, solamente al metodo acceder.
 * @example
   <example module="urlModulo">
     <file name="index.html">
         <a url-modulo="modificar?id={{ dato.id }}">Modificar</a>
     </file>
   </example>
 */   
app.directive('urlModulo', function() 
{ 
  return{
    link: function (scope, element, attrs){
      if(element[0].tagName === "A") 
      {
        var  url=scope.url;
        var urlM=attrs.urlModulo;
        url=url + "/" + urlM;
        if(urlM.search("-")>-1)
        {                   
          var array = url.split('/');
          if(urlM.search("--")>-1)
          {
            url = "/"+array[1];
          }
          else
          {
            var parametro = url.split('=')
            parametro=parametro[1].split("/");
            url = array[1]+"/"+array[array.length-1]+parametro[0];            
          }
          //url=url.replace("-","")
        }
        attrs.$set('href',"#" + url);
      } 
    }
  };
});
/**
 * @ngdoc directive
 * @name App.directive:errorFlash
 * @description
 * Muestra en pantalla los mensajes que devuelve la api.
 * @example
 * flash('success', 'texto del mensaje'); o errorFlash.error(array('success','texto del mensaje'));   
 * @param {string} tipo tipo(success,danger,warning,info)
 * @param {string} mensaje mensaje 
 * @param {object} object en caso de ser objeto  errorFlash.error(data)
 * @returns {toast} con el mensaje y el tipo.
 */    
app.factory('errorFlash', function($http, flash, $rootScope ) 
{ 
  return {     
    error: function(data) 
    { 
      var datos=[];
      if(angular.isObject(data))
      { 
        if(!angular.isObject(data[1]))  
        {
          if(angular.isUndefined(data.messages)){    
            if(angular.isUndefined(data[1]))   
              datos.push({ level: 'danger', text: JSON.stringify(data), x: 'left', y: 'top', t: '8000'});
            else
              datos.push({ level: 'danger', text: data[1], x: 'right', y: 'top', t: '4000'});
          }
          else  
            datos.push({ level: 'info', text: data.messages, x: 'right', y: 'top', t: '3000'});
        }
      }
      else
      { 
        if($rootScope.online)   
          datos.push({ level: 'danger', text: ':( "Ooops! Ocurrio un error (500) ', x: 'right', y: 'top', t: '3000'});
        else
          datos.push({ level: 'warning', text: ':( "Ooops! No hay Internet', x: 'right', y: 'top', t: '3000'});
      }
      flash(datos);
    }
  };
});

/**
 * @ngdoc directive
 * @name App.directive:imprimirDiv
 * @description
 * Genera un boton para imprimir el contenido de un area determinada en la vista.
 * @example
   <example module="imprimirDiv">
     <file name="index.html">
     <p>Imprimir el area que contenga la clase imprimir</p>
         <a imprimir-div=".imprimir">Imprimir</a>
     <div class="imprimir">Este es el contenido a imprimir</div>
     </file>
   </example>
 */      
app.directive('imprimirDiv', function () 
{
  return {
    restrict: 'A',
    link: function(scope, element, attrs) 
    {
      // evento que dispara el generador de impresión
      element.bind('click', function(evt)
      {    
          evt.preventDefault();  
          var elem = document.querySelector(attrs.imprimirDiv);  
          PrintElem(elem);
      });
      // obtener el área a imprimir y se extrae su contenido html
      function PrintElem(elem)
      {
          PrintWithIframe(angular.element(elem).html());
      }
      // generar el ddocumento a imprimir
      function PrintWithIframe(data) 
      {
        // comprobar que el contenedor de impresión no exista
          if (!angular.isUndefined(document.getElementById('printf'))) 
          {
            // crear el contenedor para guardar el elemento a imprimir
            var iframe = document.createElement('iframe');
            iframe.setAttribute("id","printf"); 
            iframe.setAttribute("style","display:none"); 
            document.body.appendChild(iframe);  

          var mywindow =  document.getElementById('printf');
          mywindow.contentWindow.document.write('<html lang="en" ng-app="App">'
+' <head>'
+' <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />'
+' <meta name="charset" content="UTF-8">'
+' <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">'
+' <meta name="apple-mobile-web-app-capable" content="yes">'
+' <link rel="shortcut icon" href="assets/img/favicon-cium.ico" />'
+' <title></title><link rel="stylesheet" href="assets/css/print.css"/>'
+' <link rel="stylesheet" href="bower_components/angular-material/angular-material.min.css"/>'
+' <link href="bower_components/angular-material-data-table/dist/md-data-table.min.css" rel="stylesheet" type="text/css"/>'
+' <meta name="viewport" content="initial-scale=1" />'
+' </head>'
+' <body>'
+data
+' <script src="bower_components/angular/angular.min.js"></script>'
+' <script src="bower_components/angular-material/angular-material.min.js"></script>'
+' <script src="assets/js/angular-material-icons.min.js"></script>'
+' <script type="text/javascript" src="bower_components/angular-material-data-table/dist/md-data-table.min.js"></script>'
+' </body>'
+' </html>');

            
              setTimeout(function()
              {
                // lanzar la sentencia imprimir
              mywindow.contentWindow.print();
            },500);
              setTimeout(function()
              {
                // remover el contenedor de impresión
                document.body.removeChild(iframe);
              },2000);  
           
          }

          return true;
      }
    }
  };
});

/**
 * @ngdoc directive
 * @name App.directive:focusMe
 * @description
 * Pone el foco en un elemento.
 */  
app.directive('focusMe', function($timeout, $parse) {
  return {
    link: function(scope, element, attrs) {
      var model = $parse(attrs.focusMe);
      scope.$watch(model, function(value) {
        if(value === true) { 
          $timeout(function() {
            element[0].focus(); 
          });
        }
      });
    }
  };
});


/**
 * @ngdoc filter
 * @name App.filter:numberFixedLen
 * @description
 * Fomato a numeros con 2 decimales.
 */  
app.filter('numberFixedLen', function () {
    return function(a,b){
        return(1e4+a+"").slice(-b)
    }
});

app.filter('numeroBimestre', function () {
    return function(a){
    if(a == 1 || a == 2 || a == 3)
      a = "1 and 3";
    else if(a == 4 || a == 5 || a == 6)
      a = "4 and 6";
   
    else if(a == 7 || a == 8 || a == 9)
      a = "7 and 9";
    else if(a == 10 || a == 11 || a == 12)
      a = "10 and 12";   
        return(a)
    }
});


app.filter('nombreBimestre', function () {
    return function(val){
    var bi = ""
    if(val == "1 and 3")
      bi = "Enero - Marzo";
    else if(val == "4 and 6")
      bi = "Abril - Junio";
    
    else if(val == "7 and 9")
      bi = "Julio - Septiembre";
    else if(val == "10 and 12")
      bi = "Octubre - Diciembre";
  
        return(bi)
    }
});
})(window.angular);