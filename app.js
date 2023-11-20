//FUNCIÓN DE CAMBIO DE ESTRUCTURA
function activateTab(elemento) {
    var idDelElemento = elemento.id;
    var miElemento = document.getElementById(idDelElemento);
    var cambio;
    var entrada = document.getElementById('login');
    var contra = document.getElementById('password');

    //Validar si ya estaba activado
    if(!miElemento.classList.contains('active'))
    {
        if (idDelElemento == "Registrar") {

            //Cambio de tarjetero
            miElemento.classList.remove('inactive', 'underlineHover');
            miElemento.classList.add('active');
    
            cambio = document.getElementById("Iniciar");
            cambio.classList.remove('active');
            cambio.classList.add('inactive', 'underlineHover');
    
            //Cambio estructura de nuevo ingreso
            entrada.placeholder = 'Ingrese correo institucional';
            entrada.value = '';
            contra.value = '';
    
            //Creo nuevos elementos
            var input1 = document.createElement('input'); //Creamos primera entrada.
            input1.type = 'text';
            input1.placeholder = 'Ingrese nombres';
            input1.id = 'nombre';
            var input2 = document.createElement('input'); //Creamos segundo entrada.
            input2.type = 'text';
            input2.placeholder = 'Ingrese apellidos';
            input2.id = 'apellido';
            var input3 = document.createElement('input'); //Creamos tercero entrada.
            input3.type = 'password';
            input3.placeholder = 'Confirme su contraseña';
            input3.id = 'confirmacion';
    
            //Agrego nuevo elementos
            var formulario = document.getElementById('formulario');
            formulario.appendChild(input1.cloneNode());
            formulario.appendChild(input2.cloneNode());
            formulario.appendChild(input3.cloneNode());
    
            //Reordenamiento
            var entrada = document.getElementById('nombre');
            formulario.insertBefore(entrada, formulario.firstChild);
            var entradaNueva = document.getElementById('apellido');
            formulario.insertBefore(entradaNueva, entrada.nextSibling);
            entrada = document.getElementById('password');
            entradaNueva = document.getElementById('confirmacion');
            formulario.insertBefore(entradaNueva, entrada.nextSibling);
    
            //Elimino componente
            var contenedor = document.getElementById('formFooter');
            contenedor.style.display = 'none';
    
            //Modifico el botón
            var boton = document.getElementById('botonIniciar');
            boton.value = 'Registrar';
            boton.id = 'botonRegistrar';
    
            //Eliminar etiqueta de advertencia
            var parrafoExistente = document.getElementById('Parrafo');
            if (parrafoExistente)
            {
                parrafoExistente.remove();
            } 
    
        } 
        else if (idDelElemento == "Iniciar")
        {
            miElemento.classList.remove('inactive', 'underlineHover');
            miElemento.classList.add('active');
    
            cambio = document.getElementById("Registrar");
            cambio.classList.remove('active');
            cambio.classList.add('inactive', 'underlineHover');
    
            //Cambio estructura de cuenta existente
            entrada.placeholder = 'Usuario/Carné';
    
            //Elimino componentes
            var formulario = document.getElementById('formulario');
            var input1 = document.getElementById('nombre');
            var input2 = document.getElementById('apellido');
            var input3 = document.getElementById('confirmacion');
            formulario.removeChild(input1);
            formulario.removeChild(input2);
            formulario.removeChild(input3);
    
            //Agrego un componente
            var contenedor = document.getElementById('formFooter');
            contenedor.style.display = 'block';
    
            //Restauro entradas
            entrada.value = '';
            contra.value = '';
    
            //Modifico el botón
            var boton = document.getElementById('botonRegistrar');
            boton.value = 'Iniciar Sesión';
            boton.id = 'botonIniciar';
    
            //Eliminar etiqueta de advertencia
            var parrafoExistente = document.getElementById('Parrafo');
            if (parrafoExistente)
            {
                parrafoExistente.remove();
            } 
        }
    } 

}

function validarCampos(boton) {
    //Campos a Validar
    //Usados para el registrar y agregar
    var login = document.getElementById('login').value.trim();
    var contra = document.getElementById('password').value.trim();

    //Componentes de fallo
    var error = document.createElement('p'); //Contraseña Erronea
    error.id = 'Parrafo';
    var formularioExistente = document.getElementById('formulario');  
    var contenedor = formularioExistente.parentNode;
    var parrafoExistente = document.getElementById('Parrafo');

    //Para el boton de Inicio de Sesión
    if (boton.id == "botonIniciar")
    {
        //Validar campos vacios para iniciar sesión
        if (login !== '' && contra !== '') {
            //Expresión regular de carnet
            const regexCorreo = /^[A-Za-z]{2}\d{5}$/;
            if (regexCorreo.test(login)) {
                validarUsuario(login);
            } 
            else {
                error.textContent = '¡Verificar que su carnet ha sido escrito de acorde!';
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
            //Capturador de campos Vacios
            error.textContent = '¡Hay campos vacios por favor completar!';
            if (!parrafoExistente) {
                contenedor.insertBefore(error, formularioExistente);
            }
        }
    }
    //Para el boton de registro de usuario
    else if (boton.id == "botonRegistrar"){
        var nombre = document.getElementById("nombre").value.trim();
        var apellido = document.getElementById("apellido").value.trim();
        var confirmacion = document.getElementById("confirmacion").value.trim();
        
        //Validar campos vacios para registrar
        if (login !== '' && contra !== '' && nombre !== '' && apellido!== '' && confirmacion !== '') {
            //Validar confirmación de la contraseña
            if (confirmacion == contra)
            {
                //Expresión regular de carnet
                const regexCorreo = /^[a-z]{2}\d{5}@ues\.edu\.sv$/;
                if (regexCorreo.test(login)) {
                    var carne = login.substring(0, 2).toUpperCase()+ login.substring(2, 7);
                    guardar(carne);
                    //Esperar envio a base de datos
                    setTimeout(function() {
                        window.location.href = './index.html';
                      }, 3000); 
                } 
                else {
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
                error.textContent = '¡Verifica que las contraseñas se han iguales!';
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
            //Capturador de campos Vacios
            error.textContent = '¡Hay campos vacios por favor completar!';
            if (!parrafoExistente) {
                contenedor.insertBefore(error, formularioExistente);
            }
            else
            {
                parrafoExistente.textContent = error.textContent;
            }
        }

    }
}

//GUARDAR USUARIOS EN BASE DE DATOS
function guardar(carne)
{
    const db = firebase.firestore();
    db.collection("usuarios").doc(carne).set({
        nombre: document.getElementById("nombre").value.trim(),
        apellido: document.getElementById("apellido").value.trim(),
        email: document.getElementById("login").value.trim(),
        contrasena:document.getElementById("password").value.trim()
    })
    .then((docRef) => { 
        console.log("Registro exitoso");
    })
    .catch((error) => {
        console.log("Error en el registro");
    });
}

//VERIFICAR USUARIO
function validarUsuario(carne) {
    var contra = document.getElementById("password").value.trim();
    const db = firebase.firestore();
    var error = document.createElement('p'); 
    error.id = 'Parrafo';
    var parrafoExistente = document.getElementById('Parrafo');
    var formularioExistente = document.getElementById('formulario');
    var contenedor = formularioExistente.parentNode; 

    //Setencia de recuperación de datos
    db.collection("usuarios")
    .doc(carne) // Obtener el documento específico por su ID
    .get()
    .then((doc) => {
        if (doc.exists) {
          // Acceder a los datos del documento
          const datos = doc.data();
          if (datos.contrasena == contra) {
            window.location.href = './PantallasChat/chat.html';
          } 
          else 
          {
            error.textContent = '¡La contraseña es erronea!';
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
    .catch((error) => {
        alert("Fallo")
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
  