//---------------------------------------------------------------------------------------------
//SECCIÓN DE ARREGLOS DE TITULACIÓN
let previousTitle = document.title;
window.addEventListener('blur', ()=>
{
    previousTitle = document.title;
    document.title = '¡No te vayas! ¡Vuelve!😢';
});
window.addEventListener('focus', ()=>
{
    document.title = previousTitle;
});
//---------------------------------------------------------------------------------------------

//FUNCIÓN PARA RESTAURAR CONTRASEÑA 
function restaurarContraseña ()
{
    var correo = document.getElementById('correo').value.trim();
    //Variables usadas para advertir de algún error
    var error = document.createElement('p'); 
    error.id = 'Parrafo';
    var parrafoExistente = document.getElementById('Parrafo');
    var formularioExistente = document.getElementById('formulario');
    var contenedor = formularioExistente.parentNode; 

    //Validamos si el campo no esta vacio
    if (correo !== '')
    {
        //Validamos que correo sea institucional
        const regexCorreo = /^[a-z]{2}\d{5}@ues\.edu\.sv$/;
        if (regexCorreo.test(correo)) {
            //Obtenemos el carnet
            var carne = correo.substring(0, 2).toUpperCase()+ correo.substring(2, 7);

            //Verificamos la existencia del carnet y si se restablecera
            verificarExistencia(carne,correo);
            
        } 
        else {
            //Advertencia de uso de correo no institucional
            error.textContent = '¡Debe de usar su correo universitario!';
            if (!parrafoExistente) {
                contenedor.insertBefore(error, formularioExistente);
            }
            else
            {
                parrafoExistente.textContent = error.textContent;
            }
        }
    }
    else
    {
        //Advertencia de campo de correo vacio
        error.textContent = '¡Ingrese el correo a restaurar!';
        if (!parrafoExistente) {
            contenedor.insertBefore(error, formularioExistente);
        }
        else
        {
            parrafoExistente.textContent = error.textContent;
        }
    }
}

//FUNCIÓN DE EXISTENCIA DE USUARIO Y ENVIO DE CORREO DE RECUPERACIÓN DE CONTRASEÑA
function verificarExistencia(carne, correo)
{
    var contrasena;
    var nombreUsuario;
    var correo;

    //Componentes/etiquetas para capturar falla en base
    var error = document.createElement('p'); 
    error.id = 'Parrafo';
    var parrafoExistente = document.getElementById('Parrafo');
    var formularioExistente = document.getElementById('formulario');
    var contenedor = formularioExistente.parentNode; 

    //Conectamos la base
    const db = firebase.firestore();
    
    //Setencia de recuperación de datos
    db.collection("usuarios")
    .doc(carne) // Obtener el documento específico por su ID
    .get()
    .then((doc) => {
        if (doc.exists) {
          //Obtenemos la contraseña del usuario
          const datos = doc.data();
          nombreUsuario= datos.nombre +" "+ datos.apellido;
          contrasena=datos.contrasena;
          correo=datos.email;
          //Confirmamos si acepta la restauración
            if (confirm('¿Estás seguro de restaurar su contraseña?')) {
                // Seleccionado 'Aceptar'
                //Enviamos un correo para restablecer la contraseña
                Email.send({
                    SecureToken : "6f7bf170-2e7e-423d-b259-4d17139edf2f",
                    To : correo,
                    From : "ivuan007@gmail.com",
                    Subject : "Recuperación de contraseña: MinervaConnect",
                    Body : "Saludes coordiales, <b>" + nombreUsuario + "</b><br> Recibimos una solicitud para restablecer tu contraseña. Si no solicitaste esto, puedes ignorar este correo electrónico.<br> Tu contraseña es: <b>"+ contrasena +
                    "</b><br>Te recomendamos cambiar esta contraseña por una más segura tan pronto como puedas.<br> Saludos, <b>MinervaConnect.<br>"

                }).then(
                  message => alert("Estado del correo"+ message)
                );
                //Regresamos al iniciar sesión
                window.location.href = '../index.html';
            } else {
                // Seleccionado 'Cancelar'
                console.log("Se cancelo");
            }
        }
        else
        {
            //Capturador de usuario invalido
            error.textContent = '¡Su usuario no existe, registrarse por favor!';
            if (!parrafoExistente) {
                contenedor.insertBefore(error, formularioExistente);
            }
            else
            {
                parrafoExistente.textContent = error.textContent;
            }
            
        }
    })
    .catch((errores) => {
        //Capturador de usuario invalido
        error.textContent = '¡Su usuario no existe, registrarse por favor!';
        if (!parrafoExistente) {
            contenedor.insertBefore(error, formularioExistente);
        }
        else
        {
            parrafoExistente.textContent = error.textContent;
        }
    });
}
