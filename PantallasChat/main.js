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

//---------------------------------------------------------------------------------------------
//FUNCIÓN CARGADO DE INFORMACIÓN DE USUARIO
window.addEventListener('load', function() {
  cargadoDePerfil();
  obtenerConversaciones();
  
  // ENLACE DE SUBIDA DE ARCHIVOS
  const inputImagen = document.getElementById('ficheroImagen'); //Obtener el subidor
  const enlaceSubirImagen = document.getElementById('subidaImagen'); //Obtener el enlace
  enlaceSubirImagen.addEventListener('click', function() {
    inputImagen.click();
  });
  inputImagen.style.display = 'none'; // Ocultar el file input
  inputImagen.addEventListener("change", subirImagen ,false);

  //Agregamos foto de perfil
  cargaFotoDePerfil();

});
//--------------------------------------------------------------------------------------------

//--------------------------------------------------------------------------------------------
//FUNCIÓN DE CARGADO DE PERFIL DE USUARIO
function cargadoDePerfil()
{
  //Conexión a base de datos
  const db = firebase.firestore();

  //Variables para agregar nombre de usuario
  var parrafoNombre = document.createElement('p'); 
  parrafoNombre.id = 'NombreUsuario';
  var contenedorUsuario = document.getElementById('usoPerfil');

  //Obtenemos el carnet
  const params = new URLSearchParams(window.location.search);
  const carne = params.get('usuario');

  //Setencia de recuperación de datos
  db.collection("usuarios")
  .doc(carne) // Obtener el documento específico por su ID
  .get()
  .then((doc) => {
    if (doc.exists) {
      // Acceder a los datos del documento
      const informacion = doc.data();
      parrafoNombre.textContent=informacion.nombre+" "+informacion.apellido; //Cambio perfil
      contenedorUsuario.appendChild(parrafoNombre); //Agrego nombre de usuario
    }
  })
  .catch((errores) => {
      console.log("Fallo en conexión");
  });
}
//--------------------------------------------------------------------------------------------

//--------------------------------------------------------------------------------------------
//FUNCIÓN CHAT OBTENIDOS
function obtenerConversaciones()
{
  //Conexión a base de datos
  const db = firebase.firestore();

  //Obtenemos el carnet
  const params = new URLSearchParams(window.location.search);
  const carne = params.get('usuario');
  
  //Componentes de agregado de usuario
  let lista = document.getElementById('conversacionesUsuarios'); //Obtenemos la lista

  //Setencia de recuperación de datos
  db.collection("usuarios").doc(carne).collection("amigos")
  .where("conversaron", "==", "Si")
  .get()
  .then((conversaciones) => {
    //Acciones para cada usuario con el que he hablado
    conversaciones.forEach((chat) => 
    {
      //Evitar repetición de usuario propio
      if(chat.id != carne)
      {
        db.collection("usuarios").doc(chat.id).get()
        .then((usuario) => 
        {
          //Obtenemos información del chat a usar
          var amistad = usuario.data();
          var nombreCompleto = amistad.nombre+" "+amistad.apellido;
          var foto = amistad.imagen;

          let nuevoElemento = document.createElement('li'); // Crear un nuevo elemento li
          nuevoElemento.id = chat.id; //Identificador
          // Agregar el evento onclick al nuevo elemento de la lista
          nuevoElemento.onclick = function() {
            verConversacion(this);
          };

          //Validamos existencia de foto de perfil
          if(foto && foto!="")
          {
            //Armado del nuevo elemento
            nuevoElemento.innerHTML = '<a href="#"><img src="'+foto+'"/><span id="'+chat.id+'">'+nombreCompleto+'</span></a>';
            lista.appendChild(nuevoElemento);
          }
          else
          {
            //Armado del nuevo elemento
            nuevoElemento.innerHTML = '<a href="#"><img src="../Recursos/perfil-r.png"/><span id="'+chat.id+'">'+nombreCompleto+'</span></a>';
            lista.appendChild(nuevoElemento);
          }

        })
        .catch((errores) => {
          console.log("Fallo al recuperar amistad"+errores);
        });

      }
      
    })
  }
  )
  .catch((errores) => {
      console.log("Fallo al obtener conversaciones");
  });

}
//--------------------------------------------------------------------------------------------

//--------------------------------------------------------------------------------------------
// FUNCIÓN DIRIGIR A CONTACTOS
function irContactos(){
  //Obtenemos el carnet
  const params = new URLSearchParams(window.location.search);
  const carne = params.get('usuario');

  //Redirigimos
  window.location.href = '../PantallaContacto/contactos.html?usuario='+carne;
}
//--------------------------------------------------------------------------------------------

//--------------------------------------------------------------------------------------------
// Función para mostrar/ocultar el menú del perfil
function mostrarMenu() {
    var menu = document.getElementById("desplegable");
    if (menu.style.display === "none" || menu.style.display === "") {
      menu.style.display = "block";
    } else {
      menu.style.display = "none";
    }
}

//--------------------------------------------------------------------------------------------
//ENVIO DE MENSAJES
function enviarTexto() {

  if (!(document.getElementById("inputMensaje").value=="")){
    // Obtener el valor del input
    var texto = document.getElementById("inputMensaje").value;
  
    // Crear un elemento <p>
    var mensaje = document.createElement("p");
  
    // Asignar el texto al elemento <p>
    mensaje.innerText = texto;
  
    // Obtener el contenedor donde se va a agregar el párrafo
    var nuevoDiv = document.createElement("div");
    nuevoDiv.id ="divMensajesEnviados";

    //Agregamos hora actual
    const tiempo= new Date();
    var hora = document.createElement("p");
    hora.id="horaActual";
    hora.textContent= tiempo.getHours()+":"+tiempo.getMinutes();

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
    document.getElementById("inputMensaje").value="";

    guardarMensaje(mensaje.textContent);//Me dirijo a subir imagen

  }
}
//--------------------------------------------------------------------------------------------

//--------------------------------------------------------------------------------------------
//FUNCIÓN GUARDAR MENSAJE EN BASE
function guardarMensaje(mensaje)
{
  //Obtenemos el carnet
  const params = new URLSearchParams(window.location.search);
  const carne = params.get('usuario');

  // Obtener el botón que está dentro del div con la clase msmEnvio y el ID msmEnvio
  let boton = document.querySelector('div.msmEnvio#msmEnvio button');
  const destinatario = boton.id.slice(0, 7);

  //Conexión a base de datos
  const db = firebase.firestore();

  //Obtenemos fecha actual
  const fechaActual = new Date();

  // Guardar en mi mensajeria
  db.collection("usuarios").doc(carne).collection("amigos").doc(destinatario).collection("chat")
  .add(
  {
    persona: carne,
    mensaje: mensaje,
    estado:"Disponible",
    dia:fechaActual.getDate(),
    mes:fechaActual.getMonth()+1,
    anyo:fechaActual.getFullYear(),
    horaEnvio :fechaActual.getHours(),
    minutoEnvio: fechaActual.getMinutes(),
    segundoEnvio: fechaActual.getSeconds()
  }).then((mensajeria) => { 
    db.collection("usuarios").doc(destinatario).collection("amigos").doc(carne).collection("chat")
    .add(
    {
      persona: carne,
      mensaje: mensaje,
      estado:"Disponible",
      dia:fechaActual.getDate(),
      mes:fechaActual.getMonth()+1,
      anyo:fechaActual.getFullYear(),
      horaEnvio :fechaActual.getHours(),
      minutoEnvio: fechaActual.getMinutes(),
      segundoEnvio: fechaActual.getSeconds()
    })
  })
  .catch((error) => {
    console.error("Error al guardar el chat", error);
  });
}
//--------------------------------------------------------------------------------------------

//--------------------------------------------------------------------------------------------
//FUNCIÓN CAPTURADORA DE ENTER
function controlarEnter(event) {
  if (event.keyCode === 13) {
    enviarTexto();
  }
}
//--------------------------------------------------------------------------------------------

//--------------------------------------------------------------------------------------------
//FUNCIÓN DE VER CONVERSACIÓN
function verConversacion(conversacion)
{
  //Obtenemos el nombre del destinatario
  let identificador = document.getElementById(conversacion.id);
  let nombreDestinatario= identificador.textContent;

  // Componentes de extración de información
  let navElemento = document.getElementById('encabezadoChat');
  let imgExistente = navElemento.querySelector('img');
  let spanExistente = document.getElementById('Titulo');
  let contenedorEntradasMensajes = document.getElementById('msmEnvio');// Elemento main
  
  // Limpiar el chat
  let mainElement = document.getElementById('mensajes');
  // Limpiar todo el contenido del main
  mainElement.innerHTML = '';

  // Crear el input para el mensaje
  let inputMensaje = document.createElement('input');
  inputMensaje.type = 'text';
  inputMensaje.placeholder = 'Ingrese su mensaje aquí...';
  inputMensaje.addEventListener('keydown', controlarEnter); // Agrega el evento directamente

  // Crear el botón para enviar el mensaje
  let btnMensaje = document.createElement('button');
  btnMensaje.addEventListener('click', enviarTexto); // Agrega el evento directamente

  // Crear el elemento SVG
  let svgElement = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svgElement.setAttribute("class", "icon icon-tabler icon-tabler-brand-telegram");
  svgElement.setAttribute("viewBox", "0 0 24 24");
  svgElement.setAttribute("stroke-width", "2");
  svgElement.setAttribute("stroke", "#ffffff");
  svgElement.setAttribute("fill", "none");
  svgElement.setAttribute("stroke-linecap", "round");
  svgElement.setAttribute("stroke-linejoin", "round");

  // Crear el elemento 'path' dentro del SVG
  let pathElement = document.createElementNS("http://www.w3.org/2000/svg", "path");
  pathElement.setAttribute("stroke", "none");
  pathElement.setAttribute("d", "M0 0h24v24H0z");
  pathElement.setAttribute("fill", "none");

  // Crear el segundo 'path' dentro del SVG
  let pathElement2 = document.createElementNS("http://www.w3.org/2000/svg", "path");
  pathElement2.setAttribute("d", "M15 10l-4 4l6 6l4 -16l-18 7l4 2l2 6l3 -4");

  // Agregar los elementos al SVG
  svgElement.appendChild(pathElement);
  svgElement.appendChild(pathElement2);

  // Agregar el SVG al botón
  btnMensaje.appendChild(svgElement);

  //Verificación de perfil ya obtenido
  if (!(imgExistente && spanExistente.id == "Titulo" && inputMensaje && btnMensaje)) {
    let imgElemento = document.createElement('img');// Crear un elemento img
    imgElemento.src = "../Recursos/perfil-b.png";
    let spanElemento = document.createElement('span');// Crear un elemento span
    spanElemento.textContent = nombreDestinatario;
    spanElemento.id = "Titulo";
    navElemento.appendChild(imgElemento);// Agregar el elemento img al nav
    navElemento.appendChild(spanElemento);// Agregar el elemento span al nav
    // Agregar los elementos al main
    contenedorEntradasMensajes.appendChild(inputMensaje);
    contenedorEntradasMensajes.appendChild(btnMensaje);

    //Modificamos los id
    inputMensaje.id = 'inputMensaje';
    btnMensaje.id = conversacion.id+'Boton';
    // Agregar los elementos al main
    contenedorEntradasMensajes.appendChild(inputMensaje);
    contenedorEntradasMensajes.appendChild(btnMensaje);
  } 
  else {
    spanExistente.textContent = nombreDestinatario;
    //Modificamos los id
    let boton = contenedorEntradasMensajes.querySelector('button');
    boton.id = conversacion.id+'Boton';
  }
  //Cargamos la foto con quien conversamos
  fotoConversaciones(conversacion.id);
  //Cargamos las conversación
  cargarConversaciones();
  
}
//--------------------------------------------------------------------------------------------

//--------------------------------------------------------------------------------------------
//FUNCIÓN DE CARGADO DE CONVERSACIONES
function cargarConversaciones()
{
  //Obtenemos el carnet
  const params = new URLSearchParams(window.location.search);
  const carne = params.get('usuario');

  // Obtener el destinatario
  let boton = document.querySelector('div.msmEnvio#msmEnvio button');
  const destinatario = boton.id.slice(0, 7);

  //Conexión a base de datos
  const db = firebase.firestore();

  //Sección de examenes
  const elementoConClase = document.querySelector('.contenidoMensajeria');

  //Consulta extractora de mensajes
  db.collection("usuarios").doc(carne).collection("amigos").doc(destinatario).collection("chat")
  .where("estado", "==", "Disponible")
  .orderBy("anyo")
  .orderBy("mes")
  .orderBy("dia")
  .orderBy("horaEnvio")
  .orderBy("minutoEnvio")
  .orderBy("segundoEnvio")
  .get()
  .then((mensajeria) => {
    mensajeria.forEach((doc) => {
      mensaje = doc.data()
      //Información a mostrar en el chat
      var tiempo ;
      var mensajeFinal = mensaje.mensaje;
      var propietario = mensaje.persona;

      if(mensaje.minutoEnvio<10)
      {
        tiempo =  mensaje.horaEnvio + ":0" +mensaje.minutoEnvio; //Para agregar el cero al minuto
      }
      else
      {
        tiempo =  mensaje.horaEnvio + ":" +mensaje.minutoEnvio;
      }
        
      if (propietario == carne)
      {
        // Creamos el texto mensaje
        var mensaje = document.createElement("p");
        mensaje.innerText = mensajeFinal;//Asignación de texto

        // Obtener el contenedor donde se va a agregar el párrafo
        var nuevoDiv = document.createElement("div");
        nuevoDiv.id ="divMensajesEnviados";

        //Div general
        var divExterno = document.createElement("div");
        divExterno.id ="divMensaje";

        var hora = document.createElement("p");
        hora.id="horaActual";
        hora.textContent= tiempo;

        // Obtener el elemento main con la clase "mensajes"
        var contenedorEntradasMensajes = document.querySelector(".mensajes");
      
        // Agregar el elemento <p> al contenedor
        nuevoDiv.appendChild(mensaje);
        divExterno.appendChild(nuevoDiv);
        divExterno.appendChild(hora);
        contenedorEntradasMensajes.appendChild(divExterno);
        elementoConClase.scrollTop = elementoConClase.scrollHeight;//Ir al final de la sección
      }
      else
      {
        // Creamos el texto mensaje
        var mensaje = document.createElement("p");
        mensaje.innerText = mensajeFinal;//Asignación de texto

        // Obtener el contenedor donde se va a agregar el párrafo
        var nuevoDiv = document.createElement("div");
        nuevoDiv.id ="divMensajesRecibidos";

        //Div general
        var divExterno = document.createElement("div");
        divExterno.id ="divMensajeR";

        var hora = document.createElement("p");
        hora.id="horaActualR";
        hora.textContent= tiempo;

        // Obtener el elemento main con la clase "mensajes"
        var contenedorEntradasMensajes = document.querySelector(".mensajes");
      
        // Agregar el elemento <p> al contenedor
        nuevoDiv.appendChild(mensaje);
        divExterno.appendChild(nuevoDiv);
        divExterno.appendChild(hora);
        contenedorEntradasMensajes.appendChild(divExterno);
        elementoConClase.scrollTop = elementoConClase.scrollHeight;//Ir al final de la sección
      }

    });
    
  })
  .catch((error) => {
    console.error("Error al mensajeria completa:", error);
  });

}
//--------------------------------------------------------------------------------------------

//--------------------------------------------------------------------------------------------
//FUNCIÓN PARA SUBIR IMAGENES
function subirImagen(){

  //Obtenemos el carnet
  const params = new URLSearchParams(window.location.search);
  const carne = params.get('usuario');

  const inputImagen = document.getElementById('ficheroImagen'); //Obtener el subidor
  var imagenASubir = inputImagen.files[0]; //Guardo imagen
  var imagenNombre =carne+".jpg";

  //Conexión a base de datos de imagenes
  const storage = firebase.storage();
  const storageRef = storage.ref();
  var subida = storageRef.child('imagenesUsuario/'+imagenNombre).put(imagenASubir);

  //Conexión a base de datos de información
  const db = firebase.firestore();

  //Cerrado de sidebar
  const sidebar = document.querySelector(".sidebar");
  const sidebarActive = sidebar.classList.contains("active");
  subida.on('state_changed', 
  (snapshot) => {
    //Para eventos de subida
  }, 
  (error) => {
    console.log("No se logró la subida");
  }, 
  () => {
    // Obtener enlace de descarga
    subida.snapshot.ref.getDownloadURL().then((enlaceDescarga) => {
      //Agrego información a base de datos
      db.collection("usuarios").doc(carne).update({ 
        imagen: enlaceDescarga
      })
      .then((docRef) => { 
        firebase.auth().signOut().then(() => {
          // Recargar pagina
          window.location.reload();
        })
        .catch((error) => {
          console.error('Error al cerrar la sesión:', error);
        });
      })
      .catch((error) => {
        console.log("No se agrego imagen");
      });

    }).catch((error) => {
      console.error('Error al obtener el enlace de descarga:', error);
    });
  }
  
);
}

//--------------------------------------------------------------------------------------------
//FUNCIÓN CARGA LA FOTO DE PERFIL
function cargaFotoDePerfil()
{
  //Obtenemos el carnet
  const params = new URLSearchParams(window.location.search);
  const carne = params.get('usuario');

  // Obtener referencia a la imagen por su ID
  const imagenPerfil = document.getElementById('fotoPerfil');

  //Conexión a base de datos de información
  const db = firebase.firestore();

  //Actualizamos la foto del perfil
  db.collection("usuarios").doc(carne).get()
  .then((docRef) => { 
    //Información del usuario
    var perfil = docRef.data();
    //Insertado de imagen
    if (perfil.imagen && perfil.imagen !== "") {
      imagenPerfil.src = perfil.imagen;
    }
  })
  .catch((error) => {
    console.log("No agrego foto de perfil"+error);
  });
 
}
//--------------------------------------------------------------------------------------------

//--------------------------------------------------------------------------------------------
//FUNCIÓN CARGAR FOTOS DE MI CONVERSACION ACTUAL
function fotoConversaciones(chat)
{
  // Obtener la imagen del usuario que presionamos
  var listaUsuarios = document.getElementById("conversacionesUsuarios");
  var elementoEspecifico = listaUsuarios.querySelector("#"+chat);//Elemento de lista a extraer imagen
  var imagen = elementoEspecifico.querySelector("img"); //Seleccionamos la etiqueta imagen
  var urlImagen = imagen.src; // Obtenemos la url

  //Obtener la imagen a modificar
  var encabezadoChat = document.getElementById("encabezadoChat");
  var imagenEncabezado = encabezadoChat.querySelector("img");//Seleccionamos la etiqueta imagen
  var urlImagenEncabezado = imagenEncabezado.src;

  //Validamos si existe imagen
  if(urlImagen!=urlImagenEncabezado)
  {
    imagenEncabezado.src = urlImagen;
  }
}
//--------------------------------------------------------------------------------------------