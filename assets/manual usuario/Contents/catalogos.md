# Catálogos


<p style="text-align: justify;">
En términos generales, un catálogo es la lista ordenada o clasificada que se hará sobre los datos que necesita el sistema para operar. Normalmente estos catálogos no cambian su contenido. Se crean una sola vez y después se utilizan muchas veces en operaciones y reportes.
<br>
Todos los catalogos tiene un listado con las opciones como se describen. 
<br>
</p>

![](images/catalogo_lista.png)

>**Listado**

> - 1.- Datos
> - 2.- Paginación y limites por página
> - 3.- Opciones por registro de izquierda a derecha: ver, modificar y eliminar
> - 4.- Despegar el campo de busqueda
> - 5.- Agregar un registro nuevo

![](images/catalogo_lista_buscar.png)

>**Listado buscar**

> - 6.- Regresar y restablecer las opciones
> - 7.- Campo de busqueda: escribir y dar enter para iniciar la busqueda


Algunos encabeceados tiene la función de ordenar por el nombre de esa columna

## Acciones


<p style="text-align: justify;">
Acciones contiene todos los datos a seleccionar cuando en una evaluación se encuentra un hallazgo. 
</p>

![](images/accion.png)

>**Crear / Editar**

> - 1.- Nombre de la accion
> - 2.- Tipo de evaluacion en la que estara disponible
> - 3.- Regresar al listado
> - 4.- Guardar 
> - 5.- Eliminar
> - 6.- Ir a crear un registro nuevo

## Alertas


<p style="text-align: justify;">
Alerta contiene todos los datos a seleccionar para identifcar las alertas por el valor que tome los indicadores en las evaluaciones. 
</p>


![](images/alerta.png)

>**Crear / Editar**

> - 1.- Nombre de la alerta
> - 2.- Color 
> - 3.- Regresar al listado
> - 4.- Guardar 
> - 5.- Eliminar
> - 6.- Ir a crear un registro nuevo

## Clues


<p style="text-align: justify;">
Clues contiene un listado de todas las unidades medicas con su informacion de la ficha tecnica. clues solo cuenta con 2 secciones listado y ficha tecnica para 
crear o modificar solicitarlo al administrador de los catalosgos de la seceretaia de salud
</p>

![](images/clues.png)

>**Ficha**

> - 1.- Regresar al listado
> - 2.- Imprimir (Exportar pdf) 

## Cone


<p style="text-align: justify;">
Cone (Cuidado obstétrico y neonatal esencial) este catálogo agrupa las unidades medicas, es de suma importancia ya que todo los criterios dependen del nivel de cone de cada unidad médica. 
</p>

![](images/cone.png)

>**Crear / Editar**

> - 1.- Nombre del cone
> - 2.- Jurisdicción 
> - 3.- Buscar clues que pertenecerá al nivel de cone a crear
> - 4.- Unidades médicas agregadas 
> - 5.- Eliminar la unidad de la lista 
> - 6.- Regresar al listado
> - 7.- Guardar 
> - 8.- Eliminar
> - 9.- Ir a crear un registro nuevo

## Criterio


<p style="text-align: justify;">
Criterio este catálogo contiene todos los puntos a evaluar se relaciona con indicador, cone y lugar de verificación para obtener el listado correspondiente a cada de las unidades médicas, el lugar de verificación sirve para agrupar los criterios. 
</p>

![](images/criterio.png)

>**Crear / Editar**

> - 1.- Nombre del criterio
> - 2.- Seleccionar el indicador, nivel o niveles de cone y el lugar de verificación. Si el color del criterio es azul el dato es correcto, si es naranja le hace falta lugar de verificación si es rojo le hace falta selecionar un nivel de cone 
> - 3.- Regresar al listado
> - 4.- Guardar 
> - 5.- Eliminar
> - 6.- Ir a crear un registro nuevo


## Indicador


<p style="text-align: justify;">
Indicador este catálogo contiene todos los indicadores para generar las evaluaciones. Se relaciona con alertaIndicador para generar los colores segun el porcentaje obtenido.
</p>

![](images/indicador.png)

>**Crear / Editar**

> - 1.- Codigo del indicador
> - 2.- Nombre del indicador 
> - 3.- Categoria para la evaluación que estará disponible
> - 4.- color para identificar el indicador
> - 5.- Alertas, Minimo del valor. Este depende del maximo de la linea anterior
> - 6.- Maximo del rango para la alerta 
> - 7.- Seleccionar del cátalogo de alertas el color 
> - 8.- Vista Previa del color
> - 9.- Eliminar la alerta de la lista
> - 10.- Agregar una linea a las alertas
> - 11.- Regresar al listado
> - 12.- Guardar 
> - 13.- Eliminar
> - 14.- Ir a crear un registro nuevo

## Lugar de Verificación


<p style="text-align: justify;">
LugarVerificacion este catálogo contiene los lugares de verificacion para agrupar los criterios de cada indicador para las unidades médicas.
</p>

![](images/lugar.png)

>**Crear / Editar**

> - 1.- Nombre del lugar de verificación
> - 2.- Regresar al listado
> - 3.- Guardar 
> - 4.- Eliminar
> - 5.- Ir a crear un registro nuevo

## Plazo acción


<p style="text-align: justify;">
PlazoAccion este catálogo contiene los lugares de verificacion para agrupar los criterios de cada indicador para las unidades médicas.
</p>

![](images/plazo.png)

>**Crear / Editar**

> - 1.- Nombre del plazo de la acción
> - 2.- Tipo (tiempo)
> - 3.- Valor con respecto al tipo
> - 4.- Regresar al listado
> - 5.- Guardar 
> - 6.- Eliminar
> - 7.- Ir a crear un registro nuevo

## Zona


<p style="text-align: justify;">
Zona este catálogo contiene las zonas y las unidades médicas que la conforman, Debido a que cada zona puede tener muchas unidades médiacas y para no hacer tardio la carga del listado se recomienda descargar el listado y depues hacer un recorrido de cada uno de los resultados para extraer los datos del metodo show.
</p>

![](images/zona.png)

>**Crear / Editar**

> - 1.- Nombre de la zona o equipo
> - 2.- Jurisdicción 
> - 3.- Buscar clues que pertenecerá al nivel de cone a crear
> - 4.- Unidades médicas agregadas 
> - 5.- Eliminar la unidad de la lista 
> - 6.- Regresar al listado
> - 7.- Guardar 
> - 8.- Eliminar
> - 9.- Ir a crear un registro nuevo