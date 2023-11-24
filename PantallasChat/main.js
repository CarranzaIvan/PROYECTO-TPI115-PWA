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
  obtenerConversaciones()
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

          let nuevoElemento = document.createElement('li'); // Crear un nuevo elemento li
          nuevoElemento.id = chat.id; //Identificador
          // Agregar el evento onclick al nuevo elemento de la lista
          nuevoElemento.onclick = function() {
            verConversacion(this);
          };

          //Armado del nuevo elemento
          nuevoElemento.innerHTML = '<a href="#"><img src="../Recursos/perfil-r.png"/><span id="'+chat.id+'">'+nombreCompleto+'</span></a>';
          lista.appendChild(nuevoElemento);
        })
        .catch((errores) => {
          console.log("Fallo al recuperar amistad"+errores);
        });

      }
      
    })
  })
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
    var contenedorMensajes = document.querySelector(".mensajes");
    
    // Agregar el elemento <p> al contenedor
    nuevoDiv.appendChild(mensaje);
    divExterno.appendChild(nuevoDiv);
    divExterno.appendChild(hora);
    contenedorMensajes.appendChild(divExterno);
    document.getElementById("inputMensaje").value="";
  }
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
//FUNCIÓN DE VER CONVERSACIONES
function verConversacion(conversacion)
{
  //Obtenemos el nombre del destinatario
  let identificador = document.getElementById(conversacion.id);
  let nombreDestinatario= identificador.textContent;

  // Verificar si los elementos ya existen dentro del navbar
  let navElemento = document.getElementById('encabezadoChat');
  let imgExistente = navElemento.querySelector('img');
  let spanExistente = document.getElementById('Titulo');

  //Verificación de perfil ya obtenido
  if (!(imgExistente && spanExistente.id == "Titulo")) {
    
    let imgElemento = document.createElement('img');// Crear un elemento img
    imgElemento.src = "../Recursos/perfil-b.png";
    let spanElemento = document.createElement('span');// Crear un elemento span
    spanElemento.textContent = nombreDestinatario;
    spanElemento.id = "Titulo";
    navElemento.appendChild(imgElemento);// Agregar el elemento img al nav
    navElemento.appendChild(spanElemento);// Agregar el elemento span al nav
  } 
  else {
    spanExistente.textContent = nombreDestinatario;
  }

}
//--------------------------------------------------------------------------------------------
