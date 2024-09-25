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
    # Extraer el contenido del script
    script_content = script_tag.string
    
    # Encontrar el inicio y fin de la lista de juguetes
    start = script_content.index('[')
    end = script_content.rindex(']') + 1
    
    # Extraer la lista de juguetes como una cadena
    toys_str = script_content[start:end]
    
    # Evaluar la cadena como una lista de Python
    toys = eval(toys_str)
    
    # Extraer tipos y estados de juguetes
    toy_types = [toy[4] for toy in toys]  # Asumiendo que el tipo está en el índice 4
    toy_status = [toy[7] for toy in toys]  # Asumiendo que el estado está en el índice 7
    
    type_counts = Counter(toy_types)
    status_counts = Counter(toy_status)
    
    # Gráfica de tipos de juguetes
    plt.figure(figsize=(10, 5))
    plt.bar(type_counts.keys(), type_counts.values())
    plt.title('Distribución de Tipos de Juguetes')
    plt.xlabel('Tipo de Juguete')
    plt.ylabel('Cantidad')
    plt.xticks(rotation=45)
    plt.tight_layout()
    plt.savefig('toy_types_distribution.png')
    plt.close()
    
    # Gráfica de estado de juguetes
    plt.figure(figsize=(10, 5))
    plt.pie(status_counts.values(), labels=status_counts.keys(), autopct='%1.1f%%')
    plt.title('Distribución de Estados de Juguetes')
    plt.axis('equal')
    plt.tight_layout()
    plt.savefig('toy_status_distribution.png')
    plt.close()
    
    print("Análisis completado. Las gráficas se han guardado como 'toy_types_distribution.png' y 'toy_status_distribution.png'.")
else:
    print("No se pudo encontrar la lista de juguetes en el archivo HTML.")