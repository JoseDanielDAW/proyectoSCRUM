// =====================================================
// SESIÓN (compartido por todas las páginas)
// Guarda quién ha iniciado sesión usando sessionStorage,
// así se mantiene al cambiar de página.
// =====================================================

const claveRolElegido = "rolElegido"; // rol elegido antes de hacer login
const claveRolActual = "rolActual";   // rol con el login ya hecho
const claveMensaje = "mensajeFlash";  // mensaje para mostrar en la siguiente página

function leerSesion(clave) {
  try {
    return sessionStorage.getItem(clave) || "";
  } catch (error) {
    return "";
  }
}

function escribirSesion(clave, valor) {
  try {
    sessionStorage.setItem(clave, valor);
  } catch (error) {
    // Si no se puede guardar, la sesión no se mantendrá entre páginas
  }
}

function borrarSesion(clave) {
  try {
    sessionStorage.removeItem(clave);
  } catch (error) {
    // Nada que hacer
  }
}

function obtenerRolElegido() {
  return leerSesion(claveRolElegido);
}

function guardarRolElegido(rol) {
  escribirSesion(claveRolElegido, rol);
}

function obtenerRol() {
  return leerSesion(claveRolActual);
}

function guardarRol(rol) {
  escribirSesion(claveRolActual, rol);
}

// Borra todo lo relacionado con la sesión
function cerrarSesion() {
  borrarSesion(claveRolElegido);
  borrarSesion(claveRolActual);
  borrarSesion(claveMensaje);
}

// Comprueba que hay sesión (y que es del rol indicado, si se indica).
// Si no, redirige y devuelve "". Si todo va bien, devuelve el rol.
function exigirRol(rolNecesario) {
  const rol = obtenerRol();

  if (!rol) {
    window.location.replace("seleccion.html");
    return "";
  }

  if (rolNecesario && rol !== rolNecesario) {
    window.location.replace("horario.html");
    return "";
  }

  return rol;
}

// Mensaje que se enseña una sola vez en la página siguiente
function guardarMensaje(texto) {
  escribirSesion(claveMensaje, texto);
}

function tomarMensaje() {
  const texto = leerSesion(claveMensaje);
  borrarSesion(claveMensaje);
  return texto;
}
