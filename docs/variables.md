# Variables pasadas a los templates.

## Variables globales:

Todos los templates van a tener acceso a una variable llamada 'usuario' que representa al usuario
logeado, si es undefined no ha iniciado sesion, tiene la siguiente forma

```
usuario: {
  nombre: 'prueba',
  apellidos: 'si',
  es_admin: 0,
}
```

## Variables para algunos templates con formularios:

Algunos templates que tengan un formulario como el login, registro, olvide mi contrasenia, cambiar mi contrasenia van a tener disponibles las siguientes variables:

errores: contendra un objeto que dentro va a tener a otros objetos, las llaves van a ser los nombres de los campos en los formularios que tienen error y los valores van a ser los mensajes de error. Esta variable tambien puede tener un error 'general' que no es especifico para un campo.

datos_ingresados: Los datos que ingreso el usuario en cada uno de los campos en el formulario al momento de enviarlo

Ejemplo:

```
errores: {
  nombre: 'el nombre no puede estar vacio',
  email: 'el correo no tiene el formato correcto',
  general: 'esa cuenta no ha sido verificada'
},
datos_ingresados: {
  email: 'prueba@gmail.com',
  contrasenia: wow12345,
}
```

## Variables para templates especificos:

### Login

El login ademas de las otras variables mencionadas en 'Variables para algunos templates con formularios', puede tener las variables:
registroExitoso y cambioContraseniaExitoso

- registroExitoso solo va a tener un valor de true cuando el registro haya sido exitoso y haya redireccionado al login, undefined en caso contrario.
- cambioContraseniaExitoso solo va a tener un valor de true cuando el cambio de contrasenia haya sido exitoso y se haya redireccionado al login, undefined en caso contrario.

### Cambiar contrasenia

Ademas de las variables mencionadas en 'Variables para algunos templates con formularios', este template puede tener una variable 'mensaje', la cual indica que se envio correctamente el correo de confirmacion, se envia de la siguiente forma:

```
mensaje: 'Hemos mandado una confirmación a tu correo electrónico, por favor, haz click en la confirmación para cambiar tu contraseña'
```

### Verificar cuenta

Va a tener disponibles la variable de error y la de mensaje, mensaje puede ser un mensaje de error o mensaje exitoso, error puede ser null.

Ejemplos:

```
error: 'invalid_token',
mensaje: 'El token de verificación de registro ya expiró, por favor solicita nuevamente el link de verificación'


error: null
mensaje: 'Usuario verificado exitosamente'
```
