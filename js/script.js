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

// Elementos para el horario
const vistaHorario = document.getElementById("vista-horario");
const subtituloHorario = document.getElementById("subtitulo-horario");
const cuerpoHorario = document.getElementById("cuerpo-horario");
const btnCerrarSesion = document.getElementById("btn-cerrar-sesion");

// Elementos para editar el horario
const vistaEditar = document.getElementById("vista-editar");
const cuerpoEditar = document.getElementById("cuerpo-editar");
const btnEditarHorario = document.getElementById("btn-editar-horario");
const btnGuardarHorario = document.getElementById("btn-guardar-horario");
const btnCancelarEdicion = document.getElementById("btn-cancelar-edicion");

// Variable para saber el rol 
let rolActual = ""; 

// Los datos correctos para entrar como profesor
const usuarioCorrectoProfesor = "profesor"; 
const claveCorrectaProfesor = "profesor";  

// Los datos correctos para el alumno
const usuarioCorrectoAlumno = "alumno";
const claveCorrectaAlumno = "alumno";

// Horario del profesor (los datos son de ejemplo)
// Cada fila es una hora y sus 5 días, de lunes a viernes
let horarioProfesor = [
  { hora: "08:00 - 09:00", dias: ["Matemáticas 1ºA", "", "Matemáticas 1ºB", "", "Matemáticas 2ºA"] },
  { hora: "09:00 - 10:00", dias: ["", "Matemáticas 2ºA", "", "Matemáticas 1ºA", ""] },
  { hora: "10:00 - 11:00", dias: ["Tutoría", "", "", "Matemáticas 1ºB", "Tutoría"] },
  { hora: "11:30 - 12:30", dias: ["Matemáticas 2ºB", "Matemáticas 2ºB", "", "", "Matemáticas 1ºA"] }
];

// Si el profesor ya guardó cambios antes, usamos ese horario en vez del de ejemplo
const claveHorarioProfesor = "horarioProfesor";
try {
  const horarioGuardado = JSON.parse(localStorage.getItem(claveHorarioProfesor));
  if (Array.isArray(horarioGuardado)) {
    horarioProfesor = horarioGuardado;
  }
} catch (error) {
  // Si los datos guardados no son válidos, seguimos con el horario de ejemplo
}

// Horario del alumno (los datos son de ejemplo)
const horarioAlumno = [
  { hora: "08:00 - 09:00", dias: ["Matemáticas", "Lengua", "Matemáticas", "Inglés", "Lengua"] },
  { hora: "09:00 - 10:00", dias: ["Lengua", "Matemáticas", "Ciencias", "Matemáticas", "Inglés"] },
  { hora: "10:00 - 11:00", dias: ["Inglés", "Ciencias", "Lengua", "Ciencias", "Matemáticas"] },
  { hora: "11:30 - 12:30", dias: ["Educación Física", "Música", "Inglés", "Lengua", "Tutoría"] }
];

// Función que rellena la tabla según el rol
function mostrarHorario() {
  // Elegimos el horario según el rol
  let horario;
  if (rolActual === "profesor") {
    horario = horarioProfesor;
    subtituloHorario.textContent = "Horario del profesor";
  } else {
    horario = horarioAlumno;
    subtituloHorario.textContent = "Horario del alumno";
  }

  // El botón de editar solo se muestra al profesor
  btnEditarHorario.classList.toggle("oculto", rolActual !== "profesor");

  // Vaciamos la tabla por si ya tenía filas
  cuerpoHorario.innerHTML = "";

  // Creamos una fila por cada hora
  horario.forEach(function (fila) {
    const tr = document.createElement("tr");

    const tdHora = document.createElement("td");
    tdHora.textContent = fila.hora;
    tr.appendChild(tdHora);

    // Una celda por cada día (si está vacío ponemos un guion)
    fila.dias.forEach(function (clase) {
      const td = document.createElement("td");
      td.textContent = clase === "" ? "-" : clase;
      tr.appendChild(td);
    });

    cuerpoHorario.appendChild(tr);
  });

  // Pasamos de la vista de login a la del horario
  vistaLogin.classList.add("oculto");
  vistaHorario.classList.remove("oculto");
}

// Función que abre la vista de edición con una casilla por cada clase
function abrirEdicion() {
  // Solo el profesor puede editar
  if (rolActual !== "profesor") {
    return;
  }

  cuerpoEditar.innerHTML = "";

  horarioProfesor.forEach(function (fila) {
    const tr = document.createElement("tr");

    const tdHora = document.createElement("td");
    tdHora.textContent = fila.hora;
    tr.appendChild(tdHora);

    // Una casilla de texto por cada día
    fila.dias.forEach(function (clase) {
      const td = document.createElement("td");
      const casilla = document.createElement("input");
      casilla.type = "text";
      casilla.maxLength = 30;
      casilla.value = clase;
      td.appendChild(casilla);
      tr.appendChild(td);
    });

    cuerpoEditar.appendChild(tr);
  });

  vistaHorario.classList.add("oculto");
  vistaEditar.classList.remove("oculto");
}

// Función que lee las casillas y guarda el nuevo horario
function guardarHorario() {
  const filas = cuerpoEditar.querySelectorAll("tr");

  filas.forEach(function (tr, indiceFila) {
    const casillas = tr.querySelectorAll("input");
    casillas.forEach(function (casilla, indiceDia) {
      horarioProfesor[indiceFila].dias[indiceDia] = casilla.value.trim();
    });
  });

  // Guardamos en el navegador para que no se pierda al recargar
  try {
    localStorage.setItem(claveHorarioProfesor, JSON.stringify(horarioProfesor));
  } catch (error) {
    // Si no se puede guardar, el cambio sigue valiendo mientras la página esté abierta
  }

  vistaEditar.classList.add("oculto");
  mostrarHorario();
}

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
      mostrarHorario();
    } else if (rolActual === "alumno" && usuario === usuarioCorrectoAlumno && clave === claveCorrectaAlumno) {
      // Validación exitosa para el alumno
      mostrarHorario();
    } else {
      throw new Error("Usuario o contraseña incorrectos.");
    }

    // Limpiamos el formulario para que no queden los datos escritos
    mensaje.textContent = "";
    campoUsuario.value = "";
    campoClave.value = "";
  } catch (error) {
    mensaje.textContent = error.message;
    mensaje.className = "error";
  }
});

// Evento para cerrar sesión
btnCerrarSesion.addEventListener("click", function () {
  vistaHorario.classList.add("oculto");
  vistaSeleccion.classList.remove("oculto");
  rolActual = ""; // limpieza del rol
});

// Eventos para editar el horario
btnEditarHorario.addEventListener("click", abrirEdicion);
btnGuardarHorario.addEventListener("click", guardarHorario);

btnCancelarEdicion.addEventListener("click", function () {
  vistaEditar.classList.add("oculto");
  vistaHorario.classList.remove("oculto");
});