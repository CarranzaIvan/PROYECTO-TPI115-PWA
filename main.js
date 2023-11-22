// Función para mostrar/ocultar el menú del perfil
function mostrarMenu() {
    var menu = document.getElementById("desplegable");
    if (menu.style.display === "none" || menu.style.display === "") {
      menu.style.display = "block";
    } else {
      menu.style.display = "none";
    }
}

//texto de chat
function enviarTexto() {
    // Obtener el valor del input
    var texto = document.getElementById("inputMensaje").value;
  
    // Crear un elemento <p>
    var parrafo = document.createElement("p");
  
    // Asignar el texto al elemento <p>
    parrafo.innerText = texto;
  
    // Obtener el contenedor donde se va a agregar el párrafo
    var contenedor = document.getElementById("divMensajes");
  
    // Agregar el elemento <p> al contenedor
    contenedor.appendChild(parrafo);
    console.log(texto);
    document.getElementById("inputMensaje").value="";
  }
  