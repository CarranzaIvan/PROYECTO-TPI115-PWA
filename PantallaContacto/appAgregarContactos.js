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
    window.location.href = '../PantallasChat/chat.html?usuario='+carne;
  }
//--------------------------------------------------------------------------------------------

//--------------------------------------------------------------------------------------------
// FUNCIÓN RECUPERACIÓN DE USUARIOS Y INSERTADO EN TABLA
window.addEventListener('load', function() {
    actualizarUsuarios();
});
//--------------------------------------------------------------------------------------------

//--------------------------------------------------------------------------------------------
//FUNCIÓN RECARGAR TABLA
function actualizarUsuarios()
{
    //Conexión a base de datos
    const db = firebase.firestore();

    //Obtenemos el carnet
    const params = new URLSearchParams(window.location.search);
    const carne = params.get('usuario');

    //Tabla insertada
    const tabla = document.getElementById('UsuarioActivos');

    //Limpiamos la tabla para evitar repetición de datos
    while (tabla.rows.length > 0) {
        tabla.deleteRow(0);
    }

    //Capturador de nombre
    var nombreCompleto;
    
    //Setencia de recuperación de datos
    db.collection("usuarios")
    .where("estado", "==", "Activo")
    .get()
    .then((activos) => {
        activos.forEach((doc) => {
            var usuario = doc.data();
            if(doc.id !=carne)
            {
                db.collection("usuarios").doc(carne).collection("amigos").doc(doc.id).get()
                .then((contacto) => {
                    if (contacto.exists) 
                    {
                        var amistad = contacto.data().amistad;

                        if(amistad=="Si")
                        {
                            //Agrego a amigos
                            var nuevaFila = document.createElement('tr');// Crear un nueva fila
                            //Extraemos nombre completo
                            nombreCompleto = usuario.nombre+" "+usuario.apellido;//Extraemos nombre completo
                            var foto = usuario.imagen; //Obtenemos foto
                            nuevaFila.id = nombreCompleto;//ID nuevo a fila

                            if(foto && foto!="")
                            {
                                //Nueva fila con foto y amigo
                                nuevaFila.innerHTML = '<td><img src="'+foto+'"></td><td>'+nombreCompleto+'</td><td><button class="btnACto" id="'+doc.id+'" onclick="agregarUsuario(this)" disabled>Agregar</button></td>';
                            }
                            else
                            {
                                //Nueva fila sin foto y amigo
                                nuevaFila.innerHTML = '<td><img src="../Recursos/perfil-b.png"></td><td>'+nombreCompleto+'</td><td><button class="btnACto" id="'+doc.id+'" onclick="agregarUsuario(this)" disabled>Agregar</button></td>';
                            }

                            //Agregamos a tabla la nueva fila
                            tabla.appendChild(nuevaFila);
                        }
                        else
                        {
                            //Agrego a no amigos
                            var nuevaFila = document.createElement('tr');// Crear un nueva fila
                            nombreCompleto = usuario.nombre+" "+usuario.apellido;//Extraemos nombre completo
                            var foto = usuario.imagen; //Obtenemos foto
                            //Agregado de id a la fila
                            nuevaFila.id = nombreCompleto;

                            if(foto && foto!="")
                            {
                                //Nueva fila con foto y no amigo
                                nuevaFila.innerHTML = '<td><img src="'+foto+'"></td><td>'+nombreCompleto+'</td><td><button class="btnACto" id="'+doc.id+'" onclick="agregarUsuario(this)">Agregar</button></td>';
                            }
                            else
                            {
                                //Nueva fila sin foto y no amigo
                                nuevaFila.innerHTML = '<td><img src="../Recursos/perfil-b.png"></td><td>'+nombreCompleto+'</td><td><button class="btnACto" id="'+doc.id+'" onclick="agregarUsuario(this)">Agregar</button></td>';
                            }
                            
                            //Agregamos a tabla la nueva fila
                            tabla.appendChild(nuevaFila);
                        }
                    }
                    else
                    {
                        // Las relaciones de contacto nuevos
                        db.collection("usuarios").doc(carne).collection("amigos").doc(doc.id).set(
                            { amistad: "No",
                              conversaron: "No" },
                            { merge: true })
                        .then(() => {
                            //Nuevos contactos
                            // Crear un nueva fila (tr)
                            var nuevaFila = document.createElement('tr');
                            //Extraemos nombre completo
                            nombreCompleto = usuario.nombre+" "+usuario.apellido;
                            //Agregado de id a la fila
                            nuevaFila.id = nombreCompleto;
                            //Creamos las celdas de la nueva fila (td)
                            nuevaFila.innerHTML = '<td><img src="../Recursos/perfil-b.png"></td><td>'+nombreCompleto+'</td><td><button class="btnACto" id="'+doc.id+'" onclick="agregarUsuario(this)">Agregar</button></td>';
                            //Agregamos a tabla la nueva fila
                            tabla.appendChild(nuevaFila);
                        })
                        .catch((error) => {
                            console.error("Error al actualizar o agregar contacto", error);
                        });
                    }
                })
                .catch((error) => {
                    console.log("No se agrego amistad"+error);
                });
            }
        });
    })
    .catch((error) => {
        console.error("Error al obtener usuarios activos: ", error);
    });
}
//--------------------------------------------------------------------------------------------

//--------------------------------------------------------------------------------------------
//FUNCIÓN BUSCADOR DE USUARIOS
function buscarUsuario()
{
    //Tabla insertada
    const tabla = document.getElementById('UsuarioActivos');
    // Obtener todas las filas de la tabla
    const filas = tabla.getElementsByTagName('tr');

    // Obtener el usuario a buscar
    const usuarioBuscado = document.getElementById('entradaBuscador').value;

    //Validamos si esta vacio
    if(usuarioBuscado == "")
    {
       //Restauramos la tabla
       for (let i = 0; i < filas.length; i++) {
        filas[i].style.display = 'table-row';// Activar fila
      }
    }
    else
    {
        // Recorrer las filas y eliminar aquellas que cumplen con la condición
        for (let i = 0; i < filas.length; i++) {
            // Obtener la primera celda de cada fila
            const primeraCelda = filas[i].getElementsByTagName('td')[1]; 
            // Verificar si la primera celda contiene texto similar a la condición
            if (!(primeraCelda && primeraCelda.textContent.includes(usuarioBuscado))) {
                filas[i].style.display = 'none';// Eliminar la fila que cumple con la condición
            }
            else
            {
                filas[i].style.display = 'table-row';// Activar fila
            }
                
        }
    }
}
//--------------------------------------------------------------------------------------------

//--------------------------------------------------------------------------------------------
//FUNCIÓN AGREGAR USUARIOS/HACER AMISTAD
function agregarUsuario(btnAgregado){

    //Desactivo botón
    btnAgregado.disabled = true;
    //Obtenemos carnet del usuario actual
    const params = new URLSearchParams(window.location.search);
    const carne = params.get('usuario');

    //Conexión a base de datos
    const db = firebase.firestore();

    db.collection("usuarios").doc(carne).collection("amigos").doc(btnAgregado.id).update({ 
        amistad: "Si"
    })
    .catch((error) => {
        console.log("No se agrego amistad");
    });
}
//--------------------------------------------------------------------------------------------