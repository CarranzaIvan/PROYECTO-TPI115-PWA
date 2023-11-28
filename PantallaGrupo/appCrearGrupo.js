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
// FUNCIÓN RETORNO
function irRetorno(){
    //Obtenemos el carnet
    const params = new URLSearchParams(window.location.search);
    const carne = params.get('usuario');
  
    //Redirigimos
    window.location.href = './gruposChat.html?usuario='+carne;
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
        contactosDisponibles();
      }
      else{
        window.location.href = '../PantallaAccesoDngdo/accesoDng.html'; //Tiramos pantalla de error
      }
    })
    .catch((errores) => {
      //En esta ocasión por inexistencia de usuario
      window.location.href = '../PantallaAccesoDngdo/accesoDng.html'; //Pantalla de error
    });  
    
  }
  else{
    window.location.href = '../PantallaAccesoDngdo/accesoDng.html'; //Tiramos pantalla de error
  }
});
//--------------------------------------------------------------------------------------------

//--------------------------------------------------------------------------------------------
// EXTRAER CONTACTOS DISPONIBLES
function contactosDisponibles(){
    //Obtenemos el carnet
    const params = new URLSearchParams(window.location.search);
    const carne = params.get('usuario');

    //Tabla insertada
    const tabla = document.getElementById('contactosDisponibles');

    //Conexión a base de datos
    const db = firebase.firestore();

    //Capturador de nombre
    var nombreCompleto;

    //Setencia de amistades
    db.collection("usuarios").doc(carne).collection("amigos")
    .where("amistad", "==", "Si")
    .get()
    .then((amigos) =>{ 
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

                //Solo usuarios activos no bloqueados
                if(amigo.estado == "Activo")
                {
                    // Crear un nueva fila
                    var nuevaFila = document.createElement('tr');
                    //Agregado de id a la fila
                    nuevaFila.id = nombreCompleto;

                    //Verificamos la existencia de la foto
                    if(foto && foto!="")
                    {
                        //Si existe la imagen y no esta vacia
                        nuevaFila.innerHTML = '<td><input type="checkbox" id="'+doc.id+'" class="selector"/></td><td><img src="'+foto+'"></td><td>'+nombreCompleto+'</td>';
                    }
                    else{
                        //Si no existe la imagen
                        nuevaFila.innerHTML = '<td><input type="checkbox" id="'+doc.id+'" class="selector"/></td><td><img src="../Recursos/perfil-b.png"></td><td>'+nombreCompleto+'</td>';
                    }
                    
                    //Agregamos a tabla la nueva fila
                    tabla.appendChild(nuevaFila);
                }

                //Activación de botón
                var boton = document.getElementById('btnCrearGrupo');
                boton.disabled = false;

            })
            .catch((error) => {
                console.error("No existe la amistad", error);
                
            });
            
        })
    })
    .catch((error) => {
        console.error("Error buscar amigo", error);
    });

}
//--------------------------------------------------------------------------------------------

//--------------------------------------------------------------------------------------------
//FUNCIÓN CREAR GRUPO
function crearGrupo()
{
    //Obtenemos el carnet
    const params = new URLSearchParams(window.location.search);
    const carne = params.get('usuario');

    const nombreGrupo = document.getElementById("nombreGrupo").value;//Nombre del grupo
    var tabla = document.getElementById('contactosDisponibles');//Tabla completa
    var integrantesID = [];
    var integrantesNombres = [];
    var integrantesEstado = [];

    //Conexión a Base de Datos
    const db = firebase.firestore();

    //Validamos que input no este vacio
    if(nombreGrupo !="")
    {
        //Obtenemos listado de seleccion de integrantes
        var filas = tabla.getElementsByTagName('tr'); //Filas
        for (var i = 0; i < filas.length; i++) {
            var checkbox = filas[i].getElementsByTagName('input')[0];
            if (checkbox && checkbox.type === 'checkbox' && checkbox.checked) {
              integrantesID.push(checkbox.id); //Obtenemos identificador
              integrantesNombres.push(filas[i].id); //Obtenemos nombre
              integrantesEstado.push("Activo"); //Obtenemos nombre

            }
        }

        //Agregamos nuestro perfil a la lista grupal
        integrantesID.push(carne); //ID
        integrantesEstado.push("Activo"); //ESTADO
        db.collection("usuarios").doc(carne).get()
        .then((perfil) => {
            var informacion =perfil.data();
            var nombreCompleto = informacion.nombre + " " + informacion.apellido;
            integrantesNombres.push(nombreCompleto); //Nombre
            
             //Validar que un grupo tenga más de dos integrantes
            if(integrantesID.length > 2){
                //Guardado de Grupo
                db.collection("grupos").doc(nombreGrupo).get()
                .then((group) => {
                    var grupoCreado = group.data();//Extraer datos
                    if(!grupoCreado)
                    {
                        db.collection("grupos").doc(nombreGrupo).set({
                            integrantes: integrantesNombres,
                            carnet: integrantesID,
                            estado:integrantesEstado
                        })
                        .then((docRef) => { 
                            //Redireccionamiento a los grupos chat
                            db.collection("grupos").doc(nombreGrupo).collection("chatGrupal").add({
                                //Se crea el chat vacio
                            })
                            .then((chat) => {
                                //Rediccionamiento  a chat de Grupo
                                window.location.href = '../PantallaGrupo/gruposChat.html?usuario='+carne;
                            })
                            .catch((error) => {
                                console.log("Error al crear chat");
                            });
                        })
                    }
                    else{ 
                        //En caso de existir
                        //CAPTURADOR FALTA DE GRUPOS CON MENOS DE DOS INTEGRANTES
                        var tooltip = document.getElementById('tooltip');
                        tooltip.innerHTML = "¡EL NOMBRE DE SU GRUPO YA EXISTE EN LA BASE DE DATOS!";
                        tooltip.style.display = 'block';
                        setTimeout(function () 
                        {
                            tooltip.style.display = 'none';
                        }, 3000); // Ocultar el tooltip después de 3 segundos
                    }
                })
                .catch((error) => {
                    console.log("Error al crear un grupo "+ error);
                });

            }
            else
            {
                //CAPTURADOR FALTA DE GRUPOS CON MENOS DE DOS INTEGRANTES
                var tooltip = document.getElementById('tooltip');
                tooltip.innerHTML = "¡LOS GRUPOS SE COMPONEN POR MAS DE 2 INTEGRANTES!";
                tooltip.style.display = 'block';
                setTimeout(function () 
                {
                    tooltip.style.display = 'none';
                }, 3000); // Ocultar el tooltip después de 3 segundos
            }
        })
        .catch((error) => {
            console.log("No se pudo agregar tu usuario "+ error);
        });

        
    }
    else 
    {
        //CAPTURADOR FALTA DE GRUPO
        var tooltip = document.getElementById('tooltip');
        tooltip.innerHTML = "¡AGREGAR NOMBRE AL GRUPO!";
        tooltip.style.display = 'block';
        setTimeout(function () 
        {
            tooltip.style.display = 'none';
        }, 3000); // Ocultar el tooltip después de 3 segundos
    }

}