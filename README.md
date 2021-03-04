# IoT_UCO_2021_BackEnd

El proyecto consta de una Api que se conecta a una base de datos PostgreSQL en la que se manejan las transacciones para la creación,
eliminación, actualización, y consulta de usuarios con sus roles.


## Puesta en marcha

1. Instalar [Node.js](https://nodejs.org/en/download/).
2. Instalar las herramientas de linea de comandos de Nest.js desde la terminal con el comando `$ npm install -g @nest/cli`.
3. Instalar [PostgreSQL](https://www.postgresql.org/download/).
4. Correr en linea de comandos `$ npm install` para instalar todas las dependencias en node_modules
5. Crear base de datos llamada VaultIoT en PostgreSQL para que corran bien las migraciones.
6. Correr en linea de comandos `$ npm start` para iniciar el proyecto.
7. Ir a la url (http://localhost:3000/swagger) para ver documentación de la API y ejecutar endpoints. 