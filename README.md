#Este es un proyecto web desarrollado con Python (Flask) y SQLite para gestionar créditos de clientes y visualizar la distribución de los mismos a través de un gráfico dinámico usando Chart.js.


Requisitos
Para ejecutar este proyecto, necesitas tener instalados los siguientes programas en tu sistema:

Python 3.13.2
Pip (gestor de paquetes de Python)
SQLite (base de datos incorporada en el proyecto)

Instalacion del proyecto.

1. Ingresar desde el cmd a la ruta donde este alojado el proyecto (Ejemplo: C:\Users\ilse\Desktop\registro_creditos>)
2. Activar el entorno virtual usando el comando: venv\Scripts\activate (Una vez activo el directorio se mostrara asi; (venv) C:\Users\ilse\Desktop\registro_creditos>)
3. Ya estando en el entorno virtual hay que hacer la instalacion de las dependencias, usando el comando: pip install -r requirements.txt (Este archivo contiene todas las dependencias necesarias a instalar)
4. Una vez instaladas las dependencias se puede proceder con la ejecucion del proyecto...

Ejecución del Proyecto
1. Ejecutar el servidor Flask
Para iniciar el servidor local de Flask, utiliza el siguiente comando:

python app.py

También con el comando anterior se crea automáticamente la base de datos y las tablas necesarias para el funcionamiento de la aplicación:

Esto iniciará el servidor en http://127.0.0.1:5000/ por defecto.

2. Acceder a la aplicación
Abre tu navegador y navega a http://127.0.0.1:5000/ para acceder a la aplicación web. Desde ahí, podrás agregar, editar y eliminar créditos, así como ver la distribución de los créditos en un gráfico interactivo.

Funcionalidades
Agregar Créditos: Los usuarios pueden agregar créditos especificando el cliente, monto, tasa de interés, plazo y fecha de otorgamiento.
Editar Créditos: Los usuarios pueden editar los detalles de un crédito existente.
Eliminar Créditos: Los usuarios pueden eliminar créditos que ya no sean necesarios.
Visualización de Gráfico: Los créditos se agrupan por cliente y se muestran en un gráfico dinámico utilizando Chart.js.

Notas*: Cuando se hace la edicion de un credito ya extistente este se vera reflejado hasta la parte inferior de la pagina. Ahi se mostraran los componentes con los datos a editar junto con sus botones de accion.
