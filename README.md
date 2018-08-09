Esta herramienta digital forma parte del catálogo de herramientas del **Banco Interamericano de Desarrollo*. Puedes conocer más sobre la iniciativa del BID en [code.iadb.org](code.iadb.org)*

  

## Cliente Web CIUM (Captura de Indicadores en Unidades Médicas).

  

[![Build Status](https://travis-ci.org/laravel/framework.svg)]
[![License](https://poser.pugx.org/laravel/framework/license.svg)]

### Descripción y contexto

  

El proyecto CIUM cliente web consume la api rest de CIUM API para dar soporte a la parte de captura del control de procesos y recurso en las unidades médicas, y los datos que se generen alimentaran al tablero de control eTAB para la medición de los indicadores del proyecto Salud Mesoamérica. Los gráficos que se presentan en eTAB son de manera generalizada, por lo tanto el CIUM contendrá un Dashboard para profundizar en el desglose de los indicadores de procesos y recurso.

---
### Guía de usuario
---
##### Manual de Usuario:
Para guiar y ser mas explicito a cualquier usuario encargado para trabajar con CIUM

[Manual PDF](assets/manual%20usuario/Output/print/book.pdf)

[Introducción](assets/manual%20usuario/Contents/introduccion.md)

[Catalogos](assets/manual%20usuario/Contents/catalogos.md)

[Evaluaciones](assets/manual%20usuario/Contents/evaluaciones.md)

[Sistema](assets/manual%20usuario/Contents/sistema.md)

  
##### Manual Técnico:

Para la continuidad en el desarrollo de CIUM se brinda un Manual Técnico:

[ver](docs)

### Guía de instalación

---

#### Requisitos de Instalación.

##### Software:

El desarrollo del Cliente web de CIUM se programó en [Angular js](https://angularjs.org/)

  

Para poder instalar y utilizar el Cliente web, deberá asegurarse que su servidor cumpla con los siguientes requisitos:

  
* Angular
* Material Design
* OAuth 2.0 [Salud ID]('http://id.saludchiapas.gob.mx')


*Si algo de lo anterior mencionado no se instalara correctamente, podrá consultar la documentación oficial de cada paquete de instalación*
  

#### Instalación y Configuración:

Una ves instalado todo lo anterior, abrimos una consola en nuestro servidor para clonar el proyecto en base al [Repositorio](https://github.com/checherman/Cium-Cliente-Web.git).

  

Ejecutamos el siguiente comando en nuestra consola:

```

git clone https://github.com/checherman/Cium-Cliente-Web.git

```


Una ves clonado el proyecto, cargamos e instalamos todos los paquetes y sus dependencias, siempre y cuando estemos dentro de la carpeta del proyecto raíz y ejecutando el siguiente comando:

```

`bower update` 

```
Una ves instaladas nuestras las dependencias con el comando anterior, entramos a localhost:

http://localhost/cium
 

#### Dependencias:

Todas la dependencias que requiere CIUM para funcionar, están en el archivo [bower.json](https://github.com/checherman/CLIENTE-CIUM/bower.json):

El desarrollo de CIUM esta construido en 2 partes:

1.  La [API](https://github.com/checherman/Cium-APIRESTfull) que se conecta la arquitectura de Base de Datos. (Seguir los pasos de instalación y configuración de la API).

2. El [Cliente Web](https://github.com/checherman/CLIENTE-CIUM) que solicita y envía datos a la API antes mencionada.

3. El [Cliente Android](https://github.com/joramdeveloper/CIUM_movil) que almacena los datos off-line y se sincroniza con la API

  

Para tener este vinculo y conexión entre API y CLIENTE, debe asegurarse que el archivos [url.js](https://github.com/checherman/CLIENTE-CIUM/tree/master/src/app/url.js) tengan las cadenas de conexión correspondientes

  

```

  BASE: 'http://localhost/Cium/APIRESTfull/public',
  BASE_API: 'http://localhost/Cium/APIRESTfull/public/v1',
	OAUTH_CLIENTE: 'http://sistemas.salud.chiapas.gob.mx/salud-id',
	OAUTH_SERVER: 'http://saludid.salud.chiapas.gob.mx'

```
¡En hora buena!, si todo esta correcto, podrá abrir una pestaña del navegador [Google Chrome](https://www.google.com.mx) y acceder a localhost, *por ejemplo: http://localhost/cium* :

 

### Cómo contribuir

  

---

Si deseas contribuir con este proyecto, por favor lee las siguientes guías que establece el [BID](https://www.iadb.org/es  "BID"):

*  [Guía para Publicar Herramientas Digitales](https://el-bid.github.io/guia-de-publicacion/  "Guía para Publicar")

*  [Guía para la Contribución de Código](https://github.com/EL-BID/Plantilla-de-repositorio/blob/master/CONTRIBUTING.md  "Guía de Contribución de Código")

  

### Código de conducta

---

Puedes ver el código de conducta para este proyecto en el siguiente archivo [CODEOFCONDUCT.md](https://github.com/EL-BID/Supervision-SISBEN-ML/blob/master/CODEOFCONDUCT.md).

  

### Autor/es
  

---
 - Secretaria de salud del estado de chiapas ISECH
> - Salud Mesoamerica 2015 SM2015
> - akira.redwolf@gmail.com 
> - h.cortes@gmail.com 
* **[Eliecer Ramirez Esquinca](https://github.com/checherman "Github")**


  

### Información adicional

---

Para hacer el correcto uso del Cliente Web para CIUM, previamente tienen que instalar la [API](https://github.com/checherman/Cium-APIRESTfull) que contiene las conexiones correspondientes a la base de datos y la encargada de realizar peticiones a los datos.

  

### Licencia
---

Los detalles de licencia para este código fuente se encuentran en el archivo [LICENCIA.md](https://github.com/checherman/CLIENTE-CIUM/blob/master/LICENSE.md)

  

## Limitación de responsabilidades

  

El BID no será responsable, bajo circunstancia alguna, de daño ni indemnización, moral o patrimonial; directo o indirecto; accesorio o especial; o por vía de consecuencia, previsto o imprevisto, que pudiese surgir:

I. Bajo cualquier teoría de responsabilidad, ya sea por contrato, infracción de derechos de propiedad intelectual, negligencia o bajo cualquier otra teoría; y/o

II. A raíz del uso de la Herramienta Digital, incluyendo, pero sin limitación de potenciales defectos en la Herramienta Digital, o la pérdida o inexactitud de los datos de cualquier tipo. Lo anterior incluye los gastos o daños asociados a fallas de comunicación y/o fallas de funcionamiento de computadoras, vinculados con la utilización de la Herramienta Digital.