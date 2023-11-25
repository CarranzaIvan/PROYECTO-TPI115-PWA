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
// FUNCIÓN DIRIGIR A CONTACTOS
function irAgregarContactos(){
    //Obtenemos el carnet
    const params = new URLSearchParams(window.location.search);
    const carne = params.get('usuario');
  
    //Redirigimos
    window.location.href = '../PantallaContacto/addContacto.html?usuario='+carne;
  }
//--------------------------------------------------------------------------------------------

//--------------------------------------------------------------------------------------------
// FUNCIÓN RETORNO
function irRetorno(){
    //Obtenemos el carnet
    const params = new URLSearchParams(window.location.search);
    const carne = params.get('usuario');
  
    //Redirigimos
    window.location.href = '../PantallasChat/chat.html?usuario='+carne;
  }
//--------------------------------------------------------------------------------------------

//--------------------------------------------------------------------------------------------
// FUNCIÓN RECUPERACIÓN DE USUARIOS Y INSERTADO EN TABLA
function cargarUsuarios()
{
  //Conexión a base de datos
  const db = firebase.firestore();

  //Obtenemos el carnet
  const params = new URLSearchParams(window.location.search);
  const carne = params.get('usuario');

  //Tabla insertada
  const tabla = document.getElementById('tablaAmistad');

  //Capturador de nombre
  var nombreCompleto;

  //Setencia de amistades
  db.collection("usuarios").doc(carne).collection("amigos")
  .where("amistad", "==", "Si")
  .get()
  .then((amigos) => 
  {
    //Setencia por cada amistad
    amigos.forEach((doc) => 
    {
      //Obtenemos identificador de la amistad
      var carnetAmistad = doc.id;

      //Extraemos los datos de la amistad
      db.collection("usuarios").doc(carnetAmistad).get()
      .then((contacto) => {

        //Información personal de la amistad
        var amigo = contacto.data();
        nombreCompleto = amigo.nombre+" "+amigo.apellido;
        var foto = amigo.imagen;

        if(amigo.estado == "Activo")
        {
          // Crear un nueva fila (tr)
          var nuevaFila = document.createElement('tr');
          //Agregado de id a la fila
          nuevaFila.id = nombreCompleto;
          
          //Verificamos la existencia de la foto
          if(foto && foto!="")
          {
            //Si existe la imagen y no esta vacia
            nuevaFila.innerHTML = '<td><img src="'+foto+'"></td><td>'+nombreCompleto+'</td><td><button class="btnConversar" id="'+doc.id+'Conversar" onclick="conversar(this)">Conversar</button></td><td><button class="btnEliminar" id="'+contacto.id+'" onclick="eliminarAmistad(this)" >Eliminar</button></td>';
          }
          else{
            //Si no existe la imagen
            nuevaFila.innerHTML = '<td><img src="../Recursos/perfil-b.png"></td><td>'+nombreCompleto+'</td><td><button class="btnConversar" id="'+doc.id+'Conversar" onclick="conversar(this)">Conversar</button></td><td><button class="btnEliminar" id="'+contacto.id+'" onclick="eliminarAmistad(this)" >Eliminar</button></td>';
          }
          
          //Agregamos a tabla la nueva fila
          tabla.appendChild(nuevaFila);
        }
      })
      .catch((error) => {
        console.error("No existe la amistad", error);
        
      });
    
    });
  })
  .catch((error) => {
      console.error("Error buscar amigo", error);
  });

}
//--------------------------------------------------------------------------------------------

//--------------------------------------------------------------------------------------------
//FUNCIÓN ACCIONES AL INICIAR
window.addEventListener('load', function() {
  cargarUsuarios();
});
//--------------------------------------------------------------------------------------------

//--------------------------------------------------------------------------------------------
//FUNCIÓN ELIMINAR UNA AMISTAD
function eliminarAmistad(eliminado)
{
  //Obtenemos carnet del usuario actual
  const params = new URLSearchParams(window.location.search);
  const carne = params.get('usuario');

  //Conexión a base de datos
  const db = firebase.firestore();

  db.collection("usuarios").doc(carne).collection("amigos").doc(eliminado.id).update({ 
      amistad: "No"
  })
  .then((amigo) => 
  {
    // Seleccionamos que presionamos
    var fila = eliminado.parentNode.parentNode;
    // Ocultamos la fila
    fila.style.display = "none";

  })
  .catch((error) => {
      console.log("No se agrego amistad");
  });
}
//--------------------------------------------------------------------------------------------

//--------------------------------------------------------------------------------------------
//FUNCIÓN DE GENERAR UNA CONVERSACIÓN
function conversar(receptor)
{
  //Usuario con el que conversaremos
  var destinatario= receptor.id.slice(0, 7);

  //Obtenemos carnet del remitente
  const params = new URLSearchParams(window.location.search);
  const carne = params.get('usuario');

  //Conexión a base de datos
  const db = firebase.firestore();

  db.collection("usuarios").doc(carne).collection("amigos").doc(destinatario).update({ 
      conversaron: "Si"
  })
  .then((amigo) => 
  {
    //Nos vamos al chat
    window.location.href = '../PantallasChat/chat.html?usuario='+carne;
  })
  .catch((error) => {
      console.log("No puede conversar");
  });
}

