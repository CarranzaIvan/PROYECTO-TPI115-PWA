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

//--------------------------------------------------------------------------------------------
// FUNCIÓN RETORNO AL CHAT PRINCIPAL
function irRetorno(){
    //Obtenemos el carnet
    const params = new URLSearchParams(window.location.search);
    const carne = params.get('usuario');
  
    //Redirigimos
    window.location.href = '../PantallasChat/chat.html?usuario='+carne;
}
//--------------------------------------------------------------------------------------------

//--------------------------------------------------------------------------------------------
// FUNCIÓN RETORNO AL CHAT PRINCIPAL
function irAgregarGrupo(){
    //Obtenemos el carnet
    const params = new URLSearchParams(window.location.search);
    const carne = params.get('usuario');
  
    //Redirigimos
    window.location.href = './addGrupo.html?usuario='+carne;
}
//--------------------------------------------------------------------------------------------

//--------------------------------------------------------------------------------------------
// FUNCIÓN RETORNO AL CHAT PRINCIPAL
function irContactos(){
    //Obtenemos el carnet
    const params = new URLSearchParams(window.location.search);
    const carne = params.get('usuario');
  
    //Redirigimos
    window.location.href = '../PantallaContacto/contactos.html?usuario='+carne;
}
//--------------------------------------------------------------------------------------------

//--------------------------------------------------------------------------------------------
//FUNCIÓN ACCIONES AL INICIAR
window.addEventListener('load', function() 
{
  //Obtenemos el carnet
  const params = new URLSearchParams(window.location.search);
  const carne = params.get('usuario');

  //Validar si existe el carne en el enlace
  if(carne && carne!="")
  {
    //Conexión a base de datos
    const db = firebase.firestore();

    //Setencia de recuperación de datos
    db.collection("usuarios")
    .doc(carne) // Obtener el documento específico por su ID
    .get()
    .then((doc) => 
    {
      if (doc.exists) {
        recuperarGrupos();//Recuperamos grupos
      }
      else{
        //No existe el carnet
        window.location.href = '../PantallaAccesoDngdo/accesoDng.html'; //Pantalla de error
      }
    })
    .catch((errores) => {
      //Falla al buscar el carnet en base de datos
      window.location.href = '../PantallaAccesoDngdo/accesoDng.html'; //Pantalla de error
    });  
    
  }
  else{
    //No se conecto a base
    window.location.href = '../PantallaAccesoDngdo/accesoDng.html'; //Tiramos pantalla de error
  }
});
//-------------------------------------------------------------------------------------------

//---------------------------------------------------------------------------------------------
//FUNCIÓN DE GRUPOS EN LOS QUE ESTOY
function recuperarGrupos(){
  //Obtenemos el carnet
  const params = new URLSearchParams(window.location.search);
  const carne = params.get('usuario');

  //Conexión a base de datos
  const db = firebase.firestore();

  //Componentes de agregado de usuario
  let lista = document.getElementById('conversacionesGrupales'); //Obtenemos la lista

  //Setencia de recuperación de datos
    db.collection("grupos")
    .where("carnet", "array-contains", carne)
    .get()
    .then((chatGrupo) => 
    {
        //Recorrer cada grupo
        chatGrupo.forEach((chat) => 
        {
            //Obtenemos información de un grupo
            var informacionGrupo = chat.data();
            var nombreGrupo = chat.id; //Nombre del Grupo
            var integrantesCarnets = informacionGrupo.carnet; //Carnets Integrantes
            var integrantesEstado = informacionGrupo.estado; //Estados

            // Encontrar la posición del ID en la lista
            var posicionEstado = integrantesCarnets.indexOf(carne);
            var estado = integrantesEstado[posicionEstado]; //Obtenemos el estado de usuario

            let nuevoElemento = document.createElement('li'); // Crear un nuevo elemento li
            nuevoElemento.id = nombreGrupo;//Asigno id al grupo
            //Armado del nuevo elemento
            nuevoElemento.onclick = function() {
                verConversacionGrupal(this);
            };
            
            if(estado == "Activo")
            {
                nuevoElemento.innerHTML = '<a class="converGrupal" ><img src="../Recursos/grupo-r.png" alt="" /><span id="'+nombreGrupo+'">'+nombreGrupo+'</span></a';
                lista.appendChild(nuevoElemento);
            }

        })
    })
    .catch((errores) => {
        console.log("Fallo al obtener conversaciones"+errores);
    });
  
}
//---------------------------------------------------------------------------------------------

//---------------------------------------------------------------------------------------------
//FUNCIÓN DE OBTENER CONVERSACIÓN GRUPAL
function verConversacionGrupal(chatGrupal){

    

    // Titulo del chat
    var tituloChat = document.getElementById('chatActualTitulo');
    tituloChat.textContent = chatGrupal.id; //NOMBRE GRUPO

    //Imagen del chat
    var imagenChat = document.getElementById('chatActualImagen');
    imagenChat.src= "../Recursos/grupo-b.png";
    imagenChat.style.display = 'block'; //IMAGEN GRUPO

    //Entrada del mensaje
    var entradaMensaje = document.getElementById('inputMensaje');
    entradaMensaje.style.display = 'block';

    //Boton de envio
    var btnsMensaje = document.getElementsByClassName('btnMensaje');
    var btnMensaje = btnsMensaje[0];
    btnMensaje.style.display = 'block';//Muestro en pantalla
    btnMensaje.id = chatGrupal.id;  

    //Obtenemos el carnet
    const params = new URLSearchParams(window.location.search);
    const carneUsuario = params.get('usuario');

    //Sección de examenes
    const elementoConClase = document.querySelector('.contenidoMensajeria');
    
    //Conexión a base de datos
    const db = firebase.firestore();

    //Almacenadores de fecha pasadas y usuario pasado
    var diaAnterior = 0, mesAnterios = 0, anyoAnterior = 0, usuarioAnterior = "";
    
    //Obtenemos información de conversaciones
    db.collection("grupos").doc(chatGrupal.id).collection("chatGrupal")
    .orderBy("anyo")
    .orderBy("mes")
    .orderBy("dia")
    .orderBy("horaEnvio")
    .orderBy("minutoEnvio")
    .orderBy("segundoEnvio")
    .get()
    .then((mensajeria) => {
        mensajeria.forEach((doc) => {
            var msg = doc.data();
            var remitente = msg.remitente;//Persona que envio el mensaje

            //Información de mensaje
            var tiempo;
            var mensajeMostrar = msg.mensaje;
            var diaMensaje = msg.dia;
            var mesMensaje = msg.mes;
            var anyoMensaje = msg.anyo;
            var nombreRemitente = msg.nombre;

            if (!msg.eliminadoPor.includes(carneUsuario)) {
                //Fecha a imprimir
                if(msg.minutoEnvio<10)
                {
                    tiempo =  msg.horaEnvio + ":0" +msg.minutoEnvio; //Para agregar el cero al minuto
                }
                else
                {
                    tiempo =  msg.horaEnvio + ":" +msg.minutoEnvio;
                }

                var mensaje = document.createElement("p");
                var nuevoDiv = document.createElement("div");
                var hora = document.createElement("p");
                // Obtener el elemento main con la clase "mensajes"
                var contenedorEntradasMensajes = document.querySelector(".mensajes");
                var divExterno = document.createElement("div");

                //Verificamos quien envio mensaje
                if(remitente == carneUsuario)
                {
                        
                    // Creamos el texto mensaje
                    mensaje.innerText = mensajeMostrar;//Asignación de texto

                    // Obtener el contenedor donde se va a agregar el párrafo
                    nuevoDiv.classList.add("divMensajesEnviados");

                    //Div general
                    divExterno.id ="divMensaje";

                    //Hora-Minutos a mostrar
                    hora.id="horaActual";
                    hora.textContent= tiempo+" ";

                    // Crear un elemento SVG
                    var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
                    svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
                    svg.setAttribute("width", "15");
                    svg.setAttribute("height", "15");
                    svg.setAttribute("viewBox", "0 0 24 24");
                    svg.id = doc.id ;
                    svg.classList.add("puntearBasurero");
                    svg.onclick = function() {
                        eliminarMensaje(this);
                    };
                    var path = document.createElementNS("http://www.w3.org/2000/svg", "path");
                    path.setAttribute("d", "M 10 2 L 9 3 L 5 3 C 4.4 3 4 3.4 4 4 C 4 4.6 4.4 5 5 5 L 7 5 L 17 5 L 19 5 C 19.6 5 20 4.6 20 4 C 20 3.4 19.6 3 19 3 L 15 3 L 14 2 L 10 2 z M 5 7 L 5 20 C 5 21.1 5.9 22 7 22 L 17 22 C 18.1 22 19 21.1 19 20 L 19 7 L 5 7 z M 9 9 C 9.6 9 10 9.4 10 10 L 10 19 C 10 19.6 9.6 20 9 20 C 8.4 20 8 19.6 8 19 L 8 10 C 8 9.4 8.4 9 9 9 z M 15 9 C 15.6 9 16 9.4 16 10 L 16 19 C 16 19.6 15.6 20 15 20 C 14.4 20 14 19.6 14 19 L 14 10 C 14 9.4 14.4 9 15 9 z"); 
                    svg.appendChild(path);
                    hora.appendChild(svg);
                    
                    if(diaAnterior == diaMensaje && mesAnterios==mesMensaje && anyoAnterior==anyoMensaje)
                    {
                        //Asigno valores
                        diaAnterior = diaMensaje;
                        mesAnterios = mesMensaje; 
                        anyoAnterior = anyoMensaje;
                    }
                    else
                    {
                        // Creamos el texto mensaje
                        var fechaMensaje = document.createElement("p");
                        fechaMensaje.innerText = diaMensaje+"/"+mesMensaje+"/"+anyoMensaje;//Creo fecha
                        fechaMensaje.id = "FechaLadoRemitente"

                        //Muestro en pantalla
                        divExterno.appendChild(fechaMensaje);

                        //Asigno valores nuevos
                        diaAnterior = diaMensaje;
                        mesAnterios = mesMensaje; 
                        anyoAnterior = anyoMensaje;
                    }
                    
                    // Agregar el elemento <p> al contenedor
                    nuevoDiv.appendChild(mensaje);
                    divExterno.appendChild(nuevoDiv);
                    divExterno.appendChild(hora);
                    contenedorEntradasMensajes.appendChild(divExterno);
                    elementoConClase.scrollTop = elementoConClase.scrollHeight;//Ir al final de la sección
                        
                }
                //CASO CONTRARIO
                else
                {
                    // Creamos el texto mensaje
                    mensaje.innerText = mensajeMostrar;//Asignación de texto

                    // Obtener el contenedor donde se va a agregar el párrafo
                    nuevoDiv.classList.add("divMensajesRecibidos");
                    nuevoDiv.onclick = function() {
                        eliminarMensaje(this);
                    };

                    //Div general
                    divExterno.id ="divMensajeR";
                    
                    hora.id="horaActualR";
                    hora.textContent= tiempo+" ";

                    // Crear un elemento SVG
                    var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
                    svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
                    svg.setAttribute("width", "15");
                    svg.setAttribute("height", "15");
                    svg.setAttribute("viewBox", "0 0 24 24");
                    svg.id = doc.id ;
                    svg.classList.add("puntearBasurero");
                    svg.onclick = function() {
                        eliminarMensaje(this);
                    };
                    var path = document.createElementNS("http://www.w3.org/2000/svg", "path");
                    path.setAttribute("d", "M 10 2 L 9 3 L 5 3 C 4.4 3 4 3.4 4 4 C 4 4.6 4.4 5 5 5 L 7 5 L 17 5 L 19 5 C 19.6 5 20 4.6 20 4 C 20 3.4 19.6 3 19 3 L 15 3 L 14 2 L 10 2 z M 5 7 L 5 20 C 5 21.1 5.9 22 7 22 L 17 22 C 18.1 22 19 21.1 19 20 L 19 7 L 5 7 z M 9 9 C 9.6 9 10 9.4 10 10 L 10 19 C 10 19.6 9.6 20 9 20 C 8.4 20 8 19.6 8 19 L 8 10 C 8 9.4 8.4 9 9 9 z M 15 9 C 15.6 9 16 9.4 16 10 L 16 19 C 16 19.6 15.6 20 15 20 C 14.4 20 14 19.6 14 19 L 14 10 C 14 9.4 14.4 9 15 9 z"); 
                    svg.appendChild(path);
                    
                    // Cambiar orden
                    var contenedorFlex = document.createElement("div");
                    contenedorFlex.style.display = "flex";
                    contenedorFlex.style.alignItems = "center"; // Alinear elementos verticalmente
                    contenedorFlex.appendChild(svg); //Primero svg
                    contenedorFlex.appendChild(hora); //Segundo hora
                    
                    // Obtener el elemento main con la clase "mensajes"
                    var contenedorEntradasMensajes = document.querySelector(".mensajes");

                    if(diaAnterior == diaMensaje && mesAnterios==mesMensaje && anyoAnterior==anyoMensaje)
                    {
                        //Asigno valores
                        diaAnterior = diaMensaje;
                        mesAnterios = mesMensaje; 
                        anyoAnterior = anyoMensaje;
                    }
                    else
                    {
                        // Creamos el texto mensaje
                        var fechaMensaje = document.createElement("p");
                        fechaMensaje.innerText = diaMensaje+"/"+mesMensaje+"/"+anyoMensaje;//Creo fecha
                        fechaMensaje.id = "FechaLadoDestinatario"

                        //Muestro en pantalla
                        divExterno.appendChild(fechaMensaje);

                        //Asigno valores nuevos
                        diaAnterior = diaMensaje;
                        mesAnterios = mesMensaje; 
                        anyoAnterior = anyoMensaje;
                    }
                    //USUARIO DIFERENTES AL ACTUAL
                    if(remitente != usuarioAnterior)
                    {
                        // Creamos el texto mensaje
                        var remitenteMensaje = document.createElement("p");
                        remitenteMensaje.innerText = nombreRemitente;//Creo nombre usuario grupal
                        remitenteMensaje.id = "UsuarioLadoDestinatario"

                        //Muestro en pantalla
                        divExterno.appendChild(remitenteMensaje);
                    }
                    // Agregar el elemento <p> al contenedor
                    nuevoDiv.appendChild(mensaje);
                    divExterno.appendChild(nuevoDiv);
                    divExterno.appendChild(contenedorFlex);
                    contenedorEntradasMensajes.appendChild(divExterno);
                    elementoConClase.scrollTop = elementoConClase.scrollHeight;//Ir al final de la sección
                } 
            }
            usuarioAnterior = remitente;
        })
    })
    .catch((error) => {
      console.error("Error al obtener mensajeria completa:", error);
    });
}
//---------------------------------------------------------------------------------------------

//---------------------------------------------------------------------------------------------
//FUNCIÓN DE ENVIAR MENSAJE
function enviarMensaje(grupo)
{
    //Obtenemos mensaje
    var mensajeAEnviar = document.getElementById('inputMensaje').value;
    
    //Obtenemos el carnet
    const params = new URLSearchParams(window.location.search);
    const carneUsuario = params.get('usuario');

    //Obtenemos nombre del grupo
    var grupoNombre = grupo.id;

    //Obtenemos la fecha
    const fechaActual = new Date();

    //Inicializar eliminados
    const eliminados= ["Eliminado1","Eliminado2"];

    //Sección de examenes
    const elementoConClase = document.querySelector('.contenidoMensajeria');

    //Conexión a base de datos
    const db = firebase.firestore();

    if(mensajeAEnviar != "")
    {
        //Limpiamos la entrada de mensaje
        document.getElementById('inputMensaje').value = ""

        db.collection("usuarios")
        .doc(carneUsuario)
        .get()
        .then((user) =>{
            var info = user.data()
            var nombreRemitente = info.nombre + " " + info.apellido;

            db.collection("grupos")
            .doc(grupoNombre)
            .collection("chatGrupal")
            .add({
                remitente:carneUsuario,
                dia:fechaActual.getDate(),
                mes:fechaActual.getMonth()+1,
                anyo:fechaActual.getFullYear(),
                horaEnvio :fechaActual.getHours(),
                minutoEnvio: fechaActual.getMinutes(),
                segundoEnvio: fechaActual.getSeconds(),
                eliminadoPor: eliminados,
                mensaje: mensajeAEnviar,
                nombre:nombreRemitente
            })
            .then((chatGrupo) => 
            {
                // Crear un elemento <p>
                var mensaje = document.createElement("p");
            
                // Asignar el texto al elemento <p>
                mensaje.innerText = mensajeAEnviar;
            
                // Obtener el contenedor donde se va a agregar el párrafo
                var nuevoDiv = document.createElement("div");
                nuevoDiv.id ="divMensajesEnviados";

                //Agregamos hora actual
                var hora = document.createElement("p");
                hora.id="horaActual";
                hora.textContent= fechaActual.getHours()+":"+fechaActual.getMinutes();

                //Div general
                var divExterno = document.createElement("div");
                divExterno.id ="divMensaje";

                // Obtener el elemento main con la clase "mensajes"
                var contenedorEntradasMensajes = document.querySelector(".mensajes");
                
                // Agregar el elemento <p> al contenedor
                nuevoDiv.appendChild(mensaje);
                divExterno.appendChild(nuevoDiv);
                divExterno.appendChild(hora);
                contenedorEntradasMensajes.appendChild(divExterno);

                elementoConClase.scrollTop = elementoConClase.scrollHeight;//Ir al final de la sección

            })
            .catch((errores) => {
                console.log("Fallo al obtener chat grupal"+errores);
            });

        })
        .catch((errores) => {
            console.log("ERROR AL RECUPERAR NOMBRE DE USUARIO"+errores);
        });
        
    }
   
}
//---------------------------------------------------------------------------------------------

//---------------------------------------------------------------------------------------------
//FUNCIÓN ELIMINACIÓN DE MENSAJES
function eliminarMensaje(mensajeAEliminar){
    //Obtenemos el carnet
    const params = new URLSearchParams(window.location.search);
    const carne = params.get('usuario');

    // Obtener el grupo
    var contenedor = document.getElementById('msmEnvio');
    var boton = contenedor.querySelector('button');
    var grupoDelMensaje = boton.id;

    //Identificador del mensaje
    var mensaje = mensajeAEliminar.id

    //Conexión a base de datos de información
    const db = firebase.firestore();

    // Mostrar un cuadro de diálogo de confirmación
    var eliminación = confirm("¿Estás seguro de que quieres eliminar este mensaje?");
    
    // Verificar la respuesta del usuario
    if (eliminación) 
    {
        
        db.collection("grupos")
        .doc(grupoDelMensaje)
        .collection("chatGrupal")
        .doc(mensaje)
        .get()
        .then((chatGrupo) => {
            var informacionMensaje = chatGrupo.data();
            var personasEliminadoras = informacionMensaje.eliminadoPor;

            if (personasEliminadoras.includes("Eliminado1") && personasEliminadoras.includes("Eliminado2")) {
                personasEliminadoras.splice(0, personasEliminadoras.length); // Elimina todos los elementos del array
            }
            personasEliminadoras.push(carne);

            db.collection("grupos")
            .doc(grupoDelMensaje)
            .collection("chatGrupal")
            .doc(mensaje)
            .update({ 
                eliminadoPor: personasEliminadoras
            })
            .then((detalles) => {
                var elemento = document.getElementById(grupoDelMensaje);
                verConversacionGrupal(elemento); //Recargamos el chat
            })
            .catch((error) => {
                console.log("No se borro el mensaje");
            });

        })
        .catch((error) => {
            console.log("No se borro el mensaje");
        });
    } 
    else 
    {
        console.log("La eliminación del mensaje ha sido cancelada.");
    }
}
//--------------------------------------------------------------------------------------------

//--------------------------------------------------------------------------------------------
//FUNCIÓN CAPTURADORA DE ENTER
function controlarEnter(event) {
    if (event.keyCode === 13) {
        
        const button = document.querySelector('.btnMensaje');
        enviarMensaje(button);
    }
}
//--------------------------------------------------------------------------------------------