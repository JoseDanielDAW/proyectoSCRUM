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
const btnVolver = document.getElementById("btn-volver");
const botonEntrar = document.getElementById("boton-entrar");

// Los datos correctos para entrar
const usuarioCorrecto = "profesor";
const claveCorrecta = "profesor";

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
  vistaSeleccion.classList.add("oculto");
  vistaLogin.classList.remove("oculto");
});

btnVolver.addEventListener("click", function () {
  vistaLogin.classList.add("oculto");
  vistaSeleccion.classList.remove("oculto");
  mensaje.textContent = "";
  campoUsuario.value = "";
  campoClave.value = "";
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

    // Comparamos usuario y contraseña
    if (usuario === usuarioCorrecto && clave === claveCorrecta) {
      mensaje.textContent = "¡Bienvenido, profesor!";
      mensaje.className = "exito";

      
    } else {
      throw new Error("Usuario o contraseña incorrectos.");
    }
  } catch (error) {
    mensaje.textContent = error.message;
    mensaje.className = "error";
  }
});