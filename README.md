# vt-quizz-app

### Páginas 

- Registro 

- Inicio de sesión

- Lista de cuestionarios

- Crear, Detalle (lista de preguntas), Jugar o Crear una pregunta / Crear las opciones de respuestas / Demostrar que la aplicación funciona.

- Lista de preguntas, Crear, Vista previa o Resultados, mostrar las preguntas con sus respuestas (correcta/incorrecta)



### Características 

- Los usuarios pueden registrarse e iniciar sesión en la aplicación con un nombre de usuario y una contraseña. La aplicación puede recordar y auto-registrarse cuando vuelvan a visitarla 

- Los usuarios pueden listar/crear/editar/borrar y jugar a los cuestionarios 

- Los usuarios pueden listar/crear/editar/borrar preguntas en la página de detalle de los cuestionarios 

- Los usuarios pueden crear preguntas de tipo de selección simple con un texto de pregunta y opciones (mínimo 2, máximo 10 opciones) 

- Los usuarios deben seleccionar una opción como la opción correcta en la pantalla de creación de cuestionarios 

- Los usuarios pueden jugar a estos cuestionarios.

- Los usuarios pueden cerrar la sesión y la aplicación no los conectará automáticamente si cierran la sesión



### Tecnologías 

- Para la base de datos, MongoDB con mongoose 

- API Node.JS con Express.js

- Aplicación de una sola página con React/redux y utiliza la API Node.js api para comunicarse con el servidor

- La lista de preguntas esta en redux y actualizar el estado de redux al crear/editar/borrar el cuestionario 

- La lista de preguntas esta en redux con los valores extraído de la API cuando el usuario haga clic en el detalle del cuestionario o en la reproducción 

- Puedes utilizar cualquier marco de interfaz de usuario como bootstrap, ant design o material - UI
