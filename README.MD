# Sistema de Control de Juguetes

## Descripción
Este proyecto es un Sistema de Control de Juguetes diseñado para ayudar a gestionar y hacer seguimiento de los juguetes de un niño. Permite registrar nuevos juguetes, ver una lista de juguetes existentes, actualizar su estado, y generar reportes sobre la colección de juguetes.

## Características
- Registro de nuevos juguetes con detalles como nombre, descripción, imagen, tipo, origen, fecha de llegada y estado.
- Visualización de juguetes en una tabla paginada.
- Actualización del estado de los juguetes directamente desde la tabla.
- Funcionalidad para regalar o botar juguetes basado en condiciones específicas.
- Generación de reportes detallados sobre la colección de juguetes.
- Interfaz de usuario intuitiva con diseño responsivo.

## Estructura del Proyecto
/toy-management-system
│   index.html
│   README.md
├── css
│   └── styles.css
├── js
│   ├── main.js
│   └── data.js
└── img
└── (imágenes de juguetes)


## Tecnologías Utilizadas
- HTML5
- CSS3
- JavaScript (ES6+)
- LocalStorage para persistencia de datos

## Cómo Usar

### Instalación
1. Clona este repositorio o descarga los archivos.
2. No se requiere instalación adicional, ya que el proyecto utiliza tecnologías del lado del cliente.

### Ejecución
1. Abre el archivo `index.html` en tu navegador web.
2. Navega por las diferentes secciones utilizando el menú de navegación.

### Funcionalidades

#### Ingresar un Nuevo Juguete
1. Haz clic en "Ingresar Juguete" en el menú de navegación.
2. Completa el formulario con los detalles del juguete.
3. Haz clic en "Guardar Juguete" para añadirlo a la colección.

#### Ver Lista de Juguetes
1. Haz clic en "Ver Juguetes" en el menú de navegación.
2. Utiliza la paginación para navegar por la lista si hay más de 10 juguetes.

#### Actualizar Estado de un Juguete
1. En la lista de juguetes, utiliza el menú desplegable en la columna "Estado" para cambiar el estado del juguete.

#### Regalar o Botar un Juguete
1. En la lista de juguetes, haz clic en el botón "Regalar" o "Botar" (dependiendo del estado y antigüedad del juguete).
2. Confirma la acción en el cuadro de diálogo que aparece.

#### Ver Reportes
1. Haz clic en "Reportes" en el menú de navegación.
2. Utiliza los selectores de año y mes para filtrar los reportes por período.

## Reglas de Negocio
- Un juguete puede ser regalado si:
  - Tiene más de un año de antigüedad.
  - Su estado es "Nuevo", "Buen estado" o "Aun funciona".
- Un juguete puede ser botado si:
  - Su estado es "Dañado".
- Los estados posibles de un juguete son: Nuevo, Buen estado, Aun funciona, Dañado.
- Los orígenes posibles de un juguete son: Padres, Familiar, Amigos, Navidad, Cumpleaños, Otros.
- Los tipos de juguete son: Muñeco, Didáctico, Auto, Peluche, Maquillaje, Electrónico, Electrodoméstico, Deportivo.
- La fecha de llegada de un juguete no puede ser mayor a 6 años de antigüedad ni posterior a la fecha actual.

## Contribuir
Si deseas contribuir a este proyecto, por favor:
1. Haz un fork del repositorio.
2. Crea una nueva rama para tu característica (`git checkout -b feature/AmazingFeature`).
3. Haz commit de tus cambios (`git commit -m 'Add some AmazingFeature'`).
4. Haz Push a la rama (`git push origin feature/AmazingFeature`).
5. Abre un Pull Request.

## Contacto
Oscar Castro - ocastrobeltran@gmail.com

Enlace del Proyecto: https://github.com/ocastrobeltran/toy-management-system.git 
