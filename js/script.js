// Pedimos el id de los elementos del HTML que vamos a necesitar
const formulario = document.getElementById("formulario-login");
const campoUsuario = document.getElementById("usuario");
const campoClave = document.getElementById("clave");
const mensaje = document.getElementById("mensaje");

// Elementos para vla vista
const vistaLanding = document.getElementById("vista-landing");
const vistaSeleccion = document.getElementById("vista-seleccion");
const vistaLogin = document.getElementById("vista-login");
const btnEmpezar = document.getElementById("btn-empezar");
const btnVolverLanding = document.getElementById("btn-volver-landing");
const btnRolProfesor = document.getElementById("btn-rol-profesor");
const btnRolAlumno = document.getElementById("btn-rol-alumno"); 
const btnVolver = document.getElementById("btn-volver");
const botonEntrar = document.getElementById("boton-entrar");
const tituloLogin = document.querySelector("#vista-login h1"); 

// Variable para saber el rol 
let rolActual = ""; 

// Los datos correctos para entrar como profesor
const usuarioCorrectoProfesor = "profesor"; 
const claveCorrectaProfesor = "profesor";  

// Los datos correctos para el alumno
const usuarioCorrectoAlumno = "alumno";
const claveCorrectaAlumno = "alumno";

// Eventos para ventana principal
btnEmpezar.addEventListener("click", function () {
  vistaLanding.classList.add("oculto");
  vistaSeleccion.classList.remove("oculto");
});

btnVolverLanding.addEventListener("click", function () {
  vistaSeleccion.classList.add("oculto");
  vistaLanding.classList.remove("oculto");
});

// Eventos para cambiar entre pantallas de rol y login
btnRolProfesor.addEventListener("click", function () {
  rolActual = "profesor"; // guardar rol
  tituloLogin.textContent = "Acceso Profesor"; 
  vistaSeleccion.classList.add("oculto");
  vistaLogin.classList.remove("oculto");
});

// Evento para cuando hacen clic en iniciar como alumno
btnRolAlumno.addEventListener("click", function () {
  rolActual = "alumno"; 
  tituloLogin.textContent = "Acceso Alumno"; 
  vistaSeleccion.classList.add("oculto");
  vistaLogin.classList.remove("oculto");
});

btnVolver.addEventListener("click", function () {
  vistaLogin.classList.add("oculto");
  vistaSeleccion.classList.remove("oculto");
  mensaje.textContent = "";
  campoUsuario.value = "";
  campoClave.value = "";
  rolActual = ""; // limpieza del rol 
});

// evento del bóton
botonEntrar.addEventListener("click", function (evento) {

  // Leemos usuario y clave
  const usuario = campoUsuario.value.trim();
  const clave = campoClave.value.trim();

  try {
    // comprovamos errores
    if (usuario === "" || clave === "") {
      throw new Error("Por favor llena los dos campos."); 
    }

    // Comparamos usuario y contraseña según el rol 
    if (rolActual === "profesor" && usuario === usuarioCorrectoProfesor && clave === claveCorrectaProfesor) {
      mensaje.textContent = "¡Bienvenido, profesor!";
      mensaje.className = "exito";
    } else if (rolActual === "alumno" && usuario === usuarioCorrectoAlumno && clave === claveCorrectaAlumno) {
      // Validación exitosa para el alumno
      mensaje.textContent = "¡Bienvenido, alumno!";
      mensaje.className = "exito";
    } else {
      throw new Error("Usuario o contraseña incorrectos.");
    }
  } catch (error) {
    mensaje.textContent = error.message;
    mensaje.className = "error";
  }
});