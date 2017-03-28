# Evaluaciones


<p style="text-align: justify;">
En este apartado se encuentra las parte transaccional de la aplicación es decir la parte donde se generan y procesan los datos recabados de las evaluaciónes.
<br>
<br>
Las evaluaciónes de recursos y procesos tiene un listado con el formato y las opciones siguientes:
</p>

![](evaluacion_lista.png)

>**Listado**

> - 1.- Despegar el campo de busqueda
> - 2.- Agregar una evaluación nueva
> - 3.- Generar una evaluación impresa para llevar a las unidades médicas que no tengan internet 
> - 4.- Estado de la evaluación verde terminado, amarillo en edición. Al hacer click en la linea se abre la evaluación
> - 5.- Eliminar la evaluación solo disponible para las que no se han cerrado
> - 6.- Datos
> - 7.- Enviar la evaluacion por correo, diponble solo para las que estan cerradas

![](evaluacion_lista_buscar.png)

>**Listado buscar**

> - 8.- Regresar y restablecer las opciones
> - 9.- Campo de busqueda: escribir y dar enter para iniciar la busqueda


## Recursos

<p style="text-align: justify;">
Recursos es la evaluación que en las unidades médicas se encarga de monitoriar los indicadores de medición del tipo abasto y equipos, asi como los recursos humanos.
</p>

### Crear una nueva evaluación

<p style="text-align: justify;">
Para crear una evaluación de recursos podemos acceder al formulario desde la pantalla inicial y hacer click en el menu de "Crear recurso"
</p>

![](recurso_nuevo_0.png)

#### En el listado de recursos

![](recurso_nuevo_1.png)

>**Nuevo**

> - 1.- Click en el menu lateral izquierdo RECURSO
> - 2.- Click en nuevo

#### Abre un pantalla para crear la ficha técnica

![](recurso_nuevo_2.png)

>**Ficha**

> - 1.- Buscar la unidad medica, puede buscar por jurisdicción, municipio, equipo zonal, nivel de cone, nombre clues o clave clues
> - 2.- Regresar al listado
> - 3.- Botón para crear la ficha este se habilita al seleccionar una unidad médica

![](recurso_nuevo_3.png)

>**Seleccionar Unidad**

> - 1.- Al escribir se crea una lista con los resultado
> - 2.- Si los resultados son muchos se crea un scroll a lado de la lista para navegar entre los resultados
> - 3.- Al seleccionar una unidad se llena la ficha técnica
> - 4.- Se habilita el botón crear
> - 5.- Cambiar de unidad médica

<p style="text-align: justify;">
Para crear la evaluación hacer click en el botón que se habilito (CREAR). Se muestra un mensaje y cambia de pantalla para seleccionar los indicadores a evaluar.
</p>

### Agregar indicadores

#### Pantalla de evaluación

![](recurso_nuevo_4.png)

>**Pantalla inicial**

> - 1.- Fecha y nombre de la clues
> - 2.- Menú de indicadores
> - 3.- Indicadores agregados a la evaluación, si no se ha agregado ninguno muestra el mensaje "No se ha agregado ningun indicador" si ya hay por lo menos un indicador muestra "Seleccione un indicador"
> - 4.- Regresar al listado
> - 5.- Ver/Editar ficha técnica

<p style="text-align: justify;">
Si nos equivocamos al seleccionar la unidad podemos cambiarla en la opcion ficha técnica
</p>

![](recurso_nuevo_5.png)

>**Fichar Ver/Editar**

> - 1.- Si se quiere cambiar la unidad médica click en editar

![](recurso_nuevo_6.png)

>**Ficha Editar**

> - 2.- El botón cambia a guardar para cambiar la unidad médica, al hacer click cierra la ventana
> - 3.- Buscar la unidad médica. Misma mecanica que al crear
> - 4.- Cerrar la ventana

#### Agregar un indicador

![](recurso_nuevo_7.png)

>**Menú indicador**

> - 1.- Click en el botón menu indicador
> - 2.- Seleccionar un indicador, al selecionar uno se quita del menu y se agrega a la lista desplegable, y se cargan los criterios
> - 3.- Scroll para cargar los demas indicadores

![](recurso_nuevo_7_1.png)

> - 4.- Si esta evaluando un indicador y le da seleccionar otro el sistema pide confirmación por que se borrara los datos del indicador que no ha guardado
> - 5.- Cancelar el cambio 
> - 6.- Aceptar el cambio y cargar otros datos

![](recurso_nuevo_8.png)

> - 6.- Puede cambiar entre indicadores evaluados recientemente en la lista a lado del menu, aca se muestra el codigo y nombre del indicador

![](recurso_nuevo_7_0.png)

<p style="text-align: justify;">
Si el indicador seleccionado tiene validacion, aparecerá un cuadro con úna lista de preguntas para determinar si se evalua o no la Unidad Médica
</p>

#### Criterios

![](recurso_nuevo_9.png)

>**Menú indicador**

> - 1.- Muestra la cantidad de criterios y el total evaluados
> - 2.- Lugar donde se tienen que verificar los criterios
> - 3.- Criterios a evaluar
> - 4.- Opciones de respuesta Si/No
> - 5.- Hallazgo se habilita cuando en el indicador marcamos un no en un criterio
> - 6.- Acciones para resolver el hallazgo
> - 7.- Boton guardar se habilita una vez completado los criterios y el hallazgo si existe

![](recurso_nuevo_10.png)

> - 8.- Cuando todos los indicadores estan completa su evaluación el botón cerra aparece
> - 9.- Si hacemos click en el botn cerrar el sistema pide confirmación y aparecer un mensaje

#### Resultado de la evaluación

![](recurso_nuevo_11.png)

> - 1.- Regresar al listado
> - 2.- Fecha de creación de la evaluación
> - 3.- Ficha técnica de la unidad médica evaluada
> - 4.- Resultado de los indicadores evaluados
> - 5.- Detalle de los indicadores desglose de criterios y su valor de la evaluación
> - 6.- Ocultar/Mostrar el detalle de criterios para incluir en la impresión o no
> - 7.- Generar/Imprimir evaluación

> - 8.- Por ultimo la firma del responsable de la unidad. Si la evaluación fue realizada con la APP MOVIL aparacera la firma digital
![](recurso_nuevo_12.png)

## Procesos


<p style="text-align: justify;">
Procesos es la evaluación que en las unidades médicas se encarga de monitoriar los indicadores de medición que tienen que ver con la procesos de la atención.
</p>

### Crear una nueva evaluación

<p style="text-align: justify;">
Para crear una evaluación de calidad podemos acceder al formulario desde la pantalla inicial y hacer click en el menu de "crear calidad"
</p>

![](calidad_nuevo_0.png)

#### En el listado de procesos

![](calidad_nuevo_1.png)

>**Nuevo**

> - 1.- Click en el menu lateral izquierdo PROCESOS
> - 2.- Click en nuevo

#### Abre un pantalla para crear la ficha técnica

![](calidad_nuevo_2.png)

>**Ficha**

> - 1.- Buscar la unidad medica, puede buscar por jurisdicción, municipio, equipo zonal, nivel de cone, nombre clues o clave clues
> - 2.- Regresar al listado
> - 3.- Botón para crear la ficha este se habilita al seleccionar una unidad médica

![](calidad_nuevo_3.png)

>**Seleccionar Unidad**

> - 1.- Al escribir se crea una lista con los resultado
> - 2.- Si los resultados son muchos se crea un scroll a lado de la lista para navegar entre los resultados
> - 3.- Al seleccionar una unidad se llena la ficha técnica
> - 4.- Se habilita el botón crear
> - 5.- Cambiar de unidad médica

<p style="text-align: justify;">
Para crear la evaluación hacer click en el botón que se habilito (CREAR) y se muestra un mensaje y cambia de pantalla para seleccionar los indicadores a evaluar.
</p>

### Agregar indicadores

#### Pantalla de evaluación

![](calidad_nuevo_4.png)

>**Pantalla inicial**

> - 1.- Fecha y nombre de la clues
> - 2.- Menú de indicadores
> - 3.- Indicadores agregados a la evaluación, si no se ha agregado ninguno muestra el mensaje "No se ha agregado ningun indicador" si ya hay por lo menos un indicador muestra "Seleccione un indicador"
> - 4.- Regresar al listado
> - 5.- Ver/Editar ficha técnica

<p style="text-align: justify;">
Si nos equivocamos al seleccionar la unidad podemos cambiarla en la opcion ficha técnica
</p>

![](calidad_nuevo_5.png)

>**Fichar Ver/Editar**

> - 1.- Si se quiere cambiar la unidad médica click en editar

![](calidad_nuevo_6.png)

>**Ficha Editar**

> - 2.- El botón cambia a guardar para cambiar la unidad médica, al hacer click cierra la ventana
> - 3.- Buscar la unidad médica. Misma mecanica que al crear
> - 4.- Cerrar la ventana

#### Agregar un indicador

![](calidad_nuevo_7.png)

>**Menú indicador**

> - 1.- Click en el botón menu indicador
> - 2.- Seleccionar un indicador, al selecionar uno se quita del menu y se agrega a la lista desplegable, y se cargan los criterios
> - 3.- Scroll para cargar los demas indicadores

![](calidad_nuevo_7_1.png)

> - 4.- Si esta evaluando un indicador y le da seleccionar otro el sistema pide confirmación por que se borrara los datos del indicador que no ha guardado
> - 5.- Cancelar el cambio 
> - 6.- Aceptar el cambio y cargar otros datos

![](calidad_nuevo_8.png)

> - 6.- Puede cambiar entre indicadores evaluados recientemente en la lista a lado del menu, aca se muestra el codigo y nombre del indicador
> - 7.- Porcentaje de la evaluacion del indicador

#### Criterios

![](calidad_nuevo_9_1.png)

>**Expedientes**

> - 1.- Escribir el número del expediente a agregar (no se debe repetir en elmismo indicador) si se repite aparece un mensaje como este ![](calidad_nuevo_9_1_1.png)
> - 2.- Agregar el expediente al indicador

![](calidad_nuevo_9_1_2.png)

> - 3.- Si el indicador tiene validacion, nos aparece un cuadro con preguntas. Arriba los botones aplicar y cancelar 
> - 4.- Encabezado que muestra el numero de preguntas
> - 5.- Preguntas, algunas estan con un valor por default y no se pueden cambiar, el tipo puede ser fecha, falso verdadero y números
> - 6.- Si el expediente cumple con la validacion se agregara una pestaña con su número en caso contrario el sistema nos muestra un mensaje para seleccionar otro expediente

![](calidad_nuevo_9_1_3.png)

> - 7.- Expedientes agregados al indicador, cada expediente cuenta con la lista de criterios a evaluar o evaluados, podemos movernos entre cada pestaña haciendo clic
> - 8.- Los criterios se encuentran agrupados por el nombre del lugar de verificacion
> - 9.- Muestra la estadistica de la evaluacion en el expediente, tambien cuenta con un boton rojo para eliminar el expediente
> - 10.- Respuestas para el criterio, algunas pueden tener validacion y su valor depende de si pase o no

![](calidad_nuevo_9_1_4.png)

<p style="text-align: justify;">
Esta validación funciona igual que la del inidcador
</p>

![](calidad_nuevo_9_1_5.png)

> - 11.- Si en nuestra evaluación encontramos un criterio con un "no" el sistema nos pedira que escribamos un hallazgo y seleccionemos una acción

![](calidad_nuevo_9_1_7.png)

> - 12.- Regresar a la lista de evaluaciones
> - 13.- Una vez completado todos los expedientes con sus criterios y/o hallazgos se activa el boton para cerrar la evaluacion
> - 14.- Bonton para guardar los expedientes sin cerrar la evaluacion, podemos seguir agregando mas expedientes o modificadon los que ya estan despues de guardar
> - 15.- Eliminar todos los expedientes del indicador

#### Resultado de la evaluación

![](calidad_nuevo_11.png)

> - 1.- Regresar al listado
> - 2.- Fecha de creación de la evaluación
> - 3.- Ficha técnica de la unidad médica evaluada
> - 4.- Resultado de los indicadores evaluados
> - 5.- Detalle de los indicadores desglose de criterios y su valor de la evaluación
> - 6.- Ocultar/Mostrar el detalle de criterios para incluir en la impresión o no
> - 7.- Detalle general del indicador para los expedientes
> - 8.- Resultado de la evaluacion por criterios y por expediente
> - 9.- Firma del responsable de la unidad médica
> - 10.- Generar/Imprimir evaluación



#### Enviar por correo el resultado de la evaluación

![](calidad_nuevo_9_1_8.png)

> - 1.- Regresar al listado de las evaluaciones y hacer click en el icono del correo para enviar

## Hallazgo

<p style="text-align: justify;">
Hallazgos módulo que muestra de entrada los problemas principales actuales o historico segun el filtro por unidad médica, indicador y criterio.
</p>
<p style="text-align: justify;">
Podemos acceder al modulo desde la pantalla de inicio "Reporte de hallazgos" o desde el menu lateral "Hallazgo".
</p>

![](hallazgo_criterio_0.png)

### Listado Criterios

>**Criterios**

<p style="text-align: justify;">
Los hallazgos se dividen en 2 pestañas, el primero es la lista de criterios con hallazgos reportados, y la segunda es las unidades médicas en las que se detectaron esos problemas.
</p>

![](hallazgo_criterio_0_1.png)

> - 1.- Pestaña de criterios con hallazgos
> - 2.- Filtrar/ Buscar un criterio en la lista cargada
> - 3.- Mostrar los criterios de PROCESOS/RECURSO
> - 4.- Ordenar de mayor incidencia a menor y viceversa
> - 5.- Agrupar/Desagrupar los criterios por indicador (por default esta agrupado)
> - 6.- Listado de Indicador/Criterios

![](hallazgo_criterio_0_2.png)

> - 7.- Numero de criterios con hallazgos del indicador (Agrupado) al hacer clic muestra los criterios

![](hallazgo_criterio_0_3.png)

> - 8.- Nombre del criterio
> - 9.- Cantidad de hallazgos encontrados

<p style="text-align: justify;">
Los puntos 8 y 9 se muestra igual si los criterios estan desagrupados
</p>

>**Unidades Médicas**

![](hallazgo_criterio_0_4.png)

> - 1.- Pestaña de unidades médicas con hallazgos
> - 2.- Datos de la unidad por tabla

### Filtros

<p style="text-align: justify;">
Los filtros nos sirven para mostrar la información en un periodo de tiempo o un lugar determinado
</p>

>**Elementos generales**

![](hallazgo_criterio_1.png)

> - 1.- Buscar en la lista de criterios
> - 2.- Abrir las opciones de filtrado en un menu a la derecha 
> - 3.- Lista de indicadores que en el momento actual tiene problemas
> - 4.- Habilitar/Deshabilitar historial, si se habilita el historial muestra los problemas desde la primera evalación hasta la ultima

>**Buscar**

![](hallazgo_criterio_2.png)

> - 1.- Campo de busqueda
> - 2.- Regresar/Cerrar la busqueda

>**Unidades Médicas**

![](hallazgo_criterio_3.png)

> - 1.- Lista de unidades afectadas
> - 2.- Paginación y limites por página

### Lista de indicadores con detalle

<p style="text-align: justify;">
Para ver la lista de indicadores con problemas actual, hacer clic en el menu de arriba en el icono rojo con un numero en medio
</p>

![](hallazgo_criterio_4_1.png)

![](hallazgo_criterio_4.png)

> - 1.- Cantidad de indicadores con problema
> - 2.- Lista de indicadores con problema
> - 3.- Indicador(es) filtrado(s)

### Opciones de filtrado

<p style="text-align: justify;">
Las opciones de filtrado toma en cuenta si el historial esta activado, y filtra segun sea el caso. al activar el historial la lista de indicadores con problema desaparece. hal filtrar se afecta a las dos categorias o tabs criterios y unidades medicas
</p>

>**Filtro**

<p style="text-align: justify;">
Para ver el filtro, hacer clic en el menu de arriba en el icono de la rueda
</p>

![](hallazgo_criterio_5.png)

<p style="text-align: justify;">
Aparece un menu de lado derecho con encabezado de color rojo 3 a 4 pestañas segun el filtro
</p>

![](hallazgo_criterio_5_1.png)

>**Encabezado (HEADER)**

![](hallazgo_criterio_5_2.png)

> - 1.- Toolbar con los botones (Filtro)
> - 2.- Aplicar filtro, Esta opción aplica los filtros que el usuario confuguro en cualquiera de las pestañas. Es necesario hacer clic para que se aplique los cambios
> - 3.- Quitar los filtros, Si queremos dejar todo como lo encontramos al entrar al modulo


>**Pestaña 1 (PERIODO)**

![](hallazgo_criterio_6.png)

> - 1.- Seleccionar el año a filtrar
> - 2.- Quitar el filtro de año seleccionado
> - 3.- Seleccionar el trimestre (Depende del año seleccionado)
> - 4.- Quitar el filtro de trimestre seleccionado
> - 5.- Si no queremos filtrar por trimestre podemos hacer por periodos de tiempo, primero seleccione la fecha de inicio
> - 6.- Seleccione la fecha de fin del peridoa filtrar

<p style="text-align: justify;">
Si queremos que los filtros se reflejen hacer clic en aplicar filtro.
</p>

>**Pestaña 2 (INDICADOR)**

![](hallazgo_criterio_6_1.png)

> - 1.- Opciones "ver todo": filtra todos los indicadores, "Por indicador": Muestra una lista de indicadores para marcar los que aplican al filtro 
> - 2.- Agrupación por categoria "recurso/proceso" de los indicadores
> - 3.- Lista de indicadores disponibles para el filtro

<p style="text-align: justify;">
Si queremos que los filtros se reflejen hacer clic en aplicar filtro.
</p>


>**Pestaña 3 (PARAMETROS)**

![](hallazgo_criterio_6_2.png)

> - 1.- Opciones "ver todo": filtra todos los indicadores, "Filtro": Selecionar las opciones requeridas
> - 2.- Seleccionar uno o mas cones del istado disponible
> - 3.- Limpiar los cones seleccionados del la lista
> - 4.- Seleccionar uno o mas jurisdicciones del istado disponible
> - 5.- Limpiar las jurisdicciones seleccionados del la lista
> - 6.- Opciones "Municipio": Permite sleccionar una lisda de municipios, "Zona": Si estan disponibles las zonas
> - 7.- Seleccionar uno o mas municipios del istado disponible
> - 8.- Limpiar los municipios seleccionados del la lista

<p style="text-align: justify;">
Si queremos que los filtros se reflejen hacer clic en aplicar filtro.
</p>


### Detalle del problema

<p style="text-align: justify;">
Al Hacer click sobre el criterio para el tab PROBLEMAS DETECTADOS o en la unidad médica para el tab UNIDADES MÉDICAS AFECTADAS se puede acceder al detalle del problema de esta manera:
</p>

>**Criterios**

![](hallazgo_criterio_7.png)

> - 1.- Al hacer click en un criterio se habre una ventana con la lista de evaluaciones
> - 2.- Lista de evaluaciones con detalle. Si el historial esta deshabilitado muestra solo la ultima evalación si no muestra todas las evaluaciones

>**Unidades médicas**

![](hallazgo_criterio_8.png)

> - 1.- Al hacer click en una unidad se habre una lista de los indicadores afectados, si en el filtro se habilito solo un indicador se pasa directo a la lista de evaluaciones

![](hallazgo_criterio_8_1.png)

> - 2.- Al hacer click en un inidcador se habre una lista de las evaluaciones

![](hallazgo_criterio_8_2.png)

> - 3.- Lista de evaluaciones. Si esta deshabilitado historial solo muestra la evaluacion mas actual si no todas. Al hacer click muestra el detalle del o los inidcadores con sus criterios

Para los dos criterio o unidades médicas llegamos a la vista detalle.

![](hallazgo_criterio_9.png)

> - 1.- Detalle del o los indicadores unicamente los que tienen detalle
> - 2.- Abrir la evaluación completa y mostrar todos los indicadores que se evaluo

## Inicio

<p style="text-align: justify;">
En esta pantalla se encuentras los modulos en forma de iconos tipo windows 8 para acceder de manera rapida a cualquier reporte que ofrece el sistema, unicamente haciendo clic en el de su agrado.
</p>

![](dashboard_1.png)

## Dashboard

![](dashboard_1_1.png)

<p style="text-align: justify;">
Este es el primer icono del menu de inicio, aca se encuentra todos los reportes gráficos que se generan con las evaluaciónes capturadas de recursos y procesos. Este es un conjunto de todos los reportes se puede acceder a cada uno para mayor comodidad desde el menu de inicio
</p>

![](dashboard_1_2.png)

>**Elementos generales**

> - 1.- Toolbar con el nombre del gráfico
> - 2.- Abrir el menu de filtro
> - 3.- Ampliar el gráfico
> - 4.- Área de gráficos o datos

>**Filtro**

<p style="text-align: justify;">
El filtro es similar para todos los gráficos y reportes por lo que se explica en esta sección y no individualmente por reporte.
</p>


>**Encabezado (HEADER)**

![](dashboard_1_2_0.png)

> - 1.- Toolbar con los botones (Filtro)
> - 2.- Aplicar filtro, Esta opción aplica los filtros que el usuario confuguro en cualquiera de las pestañas. Es necesario hacer clic para que se aplique los cambios
> - 3.- Quitar los filtros, Si queremos dejar todo como lo encontramos al entrar al modulo


>**Pestaña 1 (PERIODO)**

![](dashboard_1_2_1.png)

> - 1.- Seleccionar el año a filtrar
> - 2.- Quitar el filtro de año seleccionado
> - 3.- Seleccionar el trimestre (Depende del año seleccionado)
> - 4.- Quitar el filtro de trimestre seleccionado
> - 5.- Si no queremos filtrar por trimestre podemos hacer por periodos de tiempo, primero seleccione la fecha de inicio
> - 6.- Seleccione la fecha de fin del peridoa filtrar

<p style="text-align: justify;">
Si queremos que los filtros se reflejen hacer clic en aplicar filtro.
</p>

>**Pestaña 2 (INDICADOR)**

![](dashboard_1_2_2.png)

> - 1.- Opciones "ver todo": filtra todos los indicadores, "Por indicador": Muestra una lista de indicadores para marcar los que aplican al filtro 
> - 2.- Agrupación por categoria "recurso/proceso" de los indicadores
> - 3.- Lista de indicadores disponibles para el filtro

<p style="text-align: justify;">
Si queremos que los filtros se reflejen hacer clic en aplicar filtro.
</p>


>**Pestaña 3 (PARAMETROS)**

![](dashboard_1_2_3.png)

> - 1.- Opciones "ver todo": filtra todos los indicadores, "Filtro": Selecionar las opciones requeridas
> - 2.- Seleccionar uno o mas cones del istado disponible
> - 3.- Limpiar los cones seleccionados del la lista
> - 4.- Seleccionar uno o mas jurisdicciones del istado disponible
> - 5.- Limpiar las jurisdicciones seleccionados del la lista
> - 6.- Opciones "Municipio": Permite sleccionar una lisda de municipios, "Zona": Si estan disponibles las zonas
> - 7.- Seleccionar uno o mas municipios del istado disponible
> - 8.- Limpiar los municipios seleccionados del la lista

<p style="text-align: justify;">
Si queremos que los filtros se reflejen hacer clic en aplicar filtro.
</p>


### Indicador recurso/proceso

<p style="text-align: justify;">
Este grafico muestra la lista de indicadores con el procentaje pintado del color de la configuración de las alertas, su distintivo es que tiene un switch que muetra la informacion del todo o el nada.
</p>

![](dashboard_1_3.png)

<p style="text-align: justify;">
Para acceder a este gráfico ir al menú principal y seleccionarlo bien sea de recurso o proceso
</p>

![](alertas.png)

>**Indicador**

> - 1.- Switch para activar/desactivar el conteo del todo o el nada
> - 2.- Codigo del indicador
> - 3.- Nombre del indicador
> - 4.- Porcentaje obtenido en la evaluación
> - 5.- Opciones de filtrado

>**Clic en indicador**

<p style="text-align: justify;">
Al hacer clic en un indicador aparece un cuadro con el listado de jurisdicciones agrupado por nivel de cone y el porcentaje obtenido para cada uno, como se muestra en la siguiente imagen.
</p>

![](alertas_1.png)

>**Clic en jurisdicción**

<p style="text-align: justify;">
Al hacer clic en una jurisdicción aparece un cuadro con el listado de municipios agrupado por nivel de cone y el porcentaje obtenido para cada uno, como se muestra en la siguiente imagen.
</p>

![](alertas_2.png)

>**Clic en municipio**

<p style="text-align: justify;">
Al hacer clic en un municipio aparece un cuadro con el listado de clues, se puede hacer clic para ver sus evaluaciones, como se muestra en la siguiente imagen.
</p>

![](alertas_3.png)

>**Clic en clues**

<p style="text-align: justify;">
Al hacer clic en una clues aparece un cuadro con el listado de evaluaciones del periodo, se puede hacer clic para ver su ficha y resultados, como se muestra en la siguiente imagen.
</p>

![](alertas_4.png)


>**Parte de la evaluación**

<p style="text-align: justify;">
Al hacer clic en una evaluacion aparece un cuadro con parte de la evaluación, se puede hacer clic en el menu "VER EVALUACION COMPLETA" para ver la evaluacion completa, como se muestra en la siguiente imagen.
</p>

![](alertas_5.png)

>**Menú de navegación**

<p style="text-align: justify;">
Durante el proceso de detalle del indicador se va creadno unos links en la parte de arriba de bajo del nombre del indicador del header en color rojo. Este menú nos permiten regresar a un estado anterior haciendo click
</p>

![](alertas_6.png)


### Top recurso/proceso

<p style="text-align: justify;">
Este grafico muestra la lista de unidades médicas con el top configurable de mejores y peores segun la evaluacion en el periodo
</p>

![](dashboard_1_4.png)

<p style="text-align: justify;">
Para acceder a este gráfico ir al menú principal y seleccionarlo bien sea de recurso o proceso
</p>

![](top_1.png)

>**Top**

> - 1.- Datos con el top si existe datos puede mostrar 2 ventanas (mejores y peores)
> - 2.- Filtro
> - 3.- Pestaña adicional para seleccionar el tipo de top y el número

### Medicion de hallazgos

<p style="text-align: justify;">
Este grafico mide los hallazgos en una gráfica tipo gauge del periodo
</p>

![](dashboard_1_5.png)

<p style="text-align: justify;">
Para acceder a este gráfico ir al menú principal y seleccionarlo bien sea de recurso o proceso
</p>

![](gauge_1.png)

>**Gauge**

> - 1.- Switch para activar/desactivar el modo estricto
> - 2.- Gráfico con datos de medición, la aguja debe estar lo mas cerca posible a 0 para tener un buen desempeño
> - 3.- Numero de unidades con hallazgo
> - 4.- Limite del gráfico determinado por el número de unidades totales (universo)
> - 5.- Indicadores con hallazgo
> - 6.- Filtros

### Reporte de cobertura

<p style="text-align: justify;">
Este grafico muestra trimestralmente la cobertura de unidades en el periodo
</p>

![](dashboard_1_6.png)

<p style="text-align: justify;">
Para acceder a este gráfico ir al menú principal y seleccionarlo bien sea de recurso o proceso
</p>

![](cobertura_1.png)

>**Cobertura**

> - 1.- Trimestre que se muestra
> - 2.- Gráfica de pastel en verde lo visitado y en rojo lo que falta por visitar
> - 3.- Mini estadistica del número de unidades a visitar
> - 4.- Filtros

### Reporte indicador/criterio

<p style="text-align: justify;">
Este grafico muestra el listado de indicadores y el detalle de criterio por el perido. Por su naturaleza este unico gráfico el reporte tiene un corte al día de su selección, es decir que si el día de hoy se ejecuto a las 8 am y depues alguien  sincronizo evaluaciones estas no apareceran en el reporte hasta el dia de mañana, ya que el reporte se crea a la hora que alguien le dio clic en el día, por lo que para la primera persona que le dio clic la primera vez del día sera lento la carga ya que esta creando la vista para mostrar los criterios
</p>

![](dashboard_1_7.png)

<p style="text-align: justify;">
Para acceder a este gráfico ir al menú principal y seleccionarlo bien sea de recurso o proceso
</p>

![](criterios_1.png)

>**Cobertura**

> - 1.- Codigo del indicador
> - 2.- Nombre del indicador
> - 3.- porcentaje obtenido
> - 4.- Filtros

>**Clic en indicador**

<p style="text-align: justify;">
Al hacer clic en un indicador aparece un cuadro con el listado de criterios y el porcentaje obtenido para cada uno, como se muestra en la siguiente imagen.
</p>

![](criterios_2.png)

>**Clic en el criterio**

<p style="text-align: justify;">
Al hacer clic en un criterio muestra las jurisdicciones y su porcentaje obtenido para cada una, como se muestra en la siguiente imagen.
</p>

![](criterios_3.png)

>**Clic en jurisdicción**

<p style="text-align: justify;">
Al hacer clic en una jusrisdiccion muestra las CLUES y su valor obtenido para cada una (100 = si, 0 = no), como se muestra en la siguiente imagen.
</p>

![](criterios_4.png)

//
>**Clic en clues**

<p style="text-align: justify;">
Al hacer clic en una clues aparece un cuadro con el listado de evaluaciones del periodo, se puede hacer clic para ver su ficha y resultados, como se muestra en la siguiente imagen.
</p>

![](criterios_5.png)


>**Parte de la evaluación**

<p style="text-align: justify;">
Al hacer clic en una evaluacion aparece un cuadro con parte de la evaluación, se puede hacer clic en el menu "VER EVALUACION COMPLETA" para ver la evaluacion completa, como se muestra en la siguiente imagen.
</p>

![](criterios_6.png)

>**Menú de navegación**

<p style="text-align: justify;">
Durante el proceso de detalle del indicador se va creadno unos links en la parte de arriba de bajo del nombre del indicador del header en color rojo. Este menú nos permiten regresar a un estado anterior haciendo click
</p>

![](alertas_6.png)