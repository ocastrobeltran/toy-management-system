# Sistema de Control de Juguetes

## Descripción
Este proyecto es un Sistema de Control de Juguetes diseñado para ayudar a gestionar y hacer seguimiento de los juguetes de un niño. Permite registrar nuevos juguetes, ver una lista de juguetes existentes, actualizar su estado, y generar reportes sobre la colección de juguetes.

## Características
- Registro de nuevos juguetes con detalles como nombre, descripción, imágenes múltiples, tipo, origen, fecha de llegada, estado y etiquetas.
- Visualización de juguetes en una tabla paginada con búsqueda y filtrado avanzado.
- Actualización del estado de los juguetes directamente desde la tabla.
- Sistema de etiquetas para categorizar y buscar juguetes fácilmente.
- Galería de imágenes para cada juguete.
- Historial de cambios para cada juguete.
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
2. Para la parte web, no se requiere instalación adicional.
3. Para el script de Python:
   - Asegúrate de tener Python 3.x instalado en tu sistema.
   - Instala las dependencias necesarias ejecutando:
   ``` pip install beautifulsoup4 matplotlib ```

### Ejecución
1. Para la aplicación web:
- Abre el archivo `index.html` en tu navegador web.
- Navega por las diferentes secciones utilizando el menú de navegación.

2. Para el script de Python:
- Asegúrate de que el archivo `index.html` esté en la misma carpeta que `analyze_toys.py`.
- Ejecuta el script desde la línea de comandos:
  ``` python analyze_toys.py ```

### Funcionalidades

#### Ingresar un Nuevo Juguete
1. Haz clic en "Ingresar Juguete" en el menú de navegación.
2. Completa el formulario con los detalles del juguete, incluyendo múltiples imágenes y etiquetas.
3. Haz clic en "Guardar Juguete" para añadirlo a la colección.

#### Ver Lista de Juguetes
1. Haz clic en "Ver Juguetes" en el menú de navegación.
2. Utiliza la paginación para navegar por la lista si hay más de 10 juguetes.
3. Usa la barra de búsqueda para encontrar juguetes por nombre, descripción o etiquetas.
4. Utiliza los filtros de tipo y estado para refinar la lista de juguetes.
5. Haz clic en "Limpiar Filtros" para restablecer la búsqueda y los filtros.

#### Actualizar Estado de un Juguete
1. En la lista de juguetes, utiliza el menú desplegable en la columna "Estado" para cambiar el estado del juguete.

#### Ver Detalles del Juguete
1. En la lista de juguetes, haz clic en el botón "Ver Detalles" para abrir un modal con información detallada.
2. En el modal, podrás ver la galería de imágenes, todas las características del juguete y su historial de cambios.

#### Regalar o Botar un Juguete
1. En la lista de juguetes, haz clic en el botón "Regalar" o "Botar" (dependiendo del estado y antigüedad del juguete).
2. Confirma la acción en el cuadro de diálogo que aparece.

#### Ver Reportes
1. Haz clic en "Reportes" en el menú de navegación.
2. Utiliza los selectores de año y mes para filtrar los reportes por período.
3. Visualiza diferentes categorías de reportes: juguetes por mes y año, por estado, juguetes dañados, por origen y por tipo.

## Análisis de Datos con Python

El archivo `analyze_toys.py` proporciona funcionalidades adicionales para el análisis de datos:

1. Extracción de datos:
- Utiliza BeautifulSoup para analizar el archivo HTML y extraer los datos de los juguetes.

2. Análisis de datos:
- Cuenta la frecuencia de tipos de juguetes y estados.

3. Generación de gráficos:
- Crea un gráfico de barras para la distribución de tipos de juguetes.
- Crea un gráfico circular para la distribución de estados de juguetes.

4. Guardado de gráficos:
- Guarda los gráficos generados como archivos PNG.

### Explicación del Código de analyze_toys.py

```python
import os
from bs4 import BeautifulSoup
import matplotlib.pyplot as plt
from collections import Counter

# Leer el archivo HTML
with open('index.html', 'r', encoding='utf-8') as file:
content = file.read()

# Crear objeto BeautifulSoup
soup = BeautifulSoup(content, 'html.parser')

# Encontrar el script que contiene los datos de los juguetes
script_tag = soup.find('script', text=lambda t: t and 'let toys =' in t)

if script_tag:
# Extraer y procesar los datos de los juguetes
# ...

# Generar gráficos
# ...

print("Análisis completado. Las gráficas se han guardado como 'toy_types_distribution.png' y 'toy_status_distribution.png'.")
else:
print("No se pudo encontrar la lista de juguetes en el archivo HTML.")
```

Este script realiza las siguientes operaciones:

1. Lee el archivo HTML de la aplicación.
2. Utiliza BeautifulSoup para analizar el HTML y encontrar los datos de los juguetes.
3. Extrae y procesa los datos para obtener estadísticas sobre tipos y estados de juguetes.
4. Genera dos gráficos utilizando Matplotlib:

1. Un gráfico de barras para la distribución de tipos de juguetes.
2. Un gráfico circular para la distribución de estados de juguetes.



5. Guarda los gráficos generados como archivos PNG.


Los gráficos generados pueden ser utilizados para enriquecer los reportes en la aplicación web.

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
- Cada juguete puede tener múltiples etiquetas para facilitar su categorización y búsqueda.
- Se mantiene un historial de cambios para cada juguete, registrando modificaciones en su estado o características.

## Contacto
Oscar Castro - ocastrobeltran@gmail.com

Enlace del Proyecto: https://github.com/ocastrobeltran/toy-management-system.git