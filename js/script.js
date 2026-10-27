/* JavaScript */

// =====================================================
// 1. ELEMENTOS DEL HTML (todos juntos arriba)
// =====================================================

// Login
const formulario = document.getElementById("formulario-login");
const campoUsuario = document.getElementById("usuario");
const campoClave = document.getElementById("clave");
const mensaje = document.getElementById("mensaje");
const tituloLogin = document.querySelector("#vista-login h1");

// Vistas
const vistaLanding = document.getElementById("vista-landing");
const vistaSeleccion = document.getElementById("vista-seleccion");
const vistaLogin = document.getElementById("vista-login");
const vistaHorario = document.getElementById("vista-horario");
const vistaEditar = document.getElementById("vista-editar");
const vistaTutoria = document.getElementById("vista-tutoria");
const vistaReservar = document.getElementById("vista-reservar");
const vistaMisTutorias = document.getElementById("vista-mis-tutorias");

// Botones de navegación inicial
const btnEmpezar = document.getElementById("btn-empezar");
const btnVolverLanding = document.getElementById("btn-volver-landing");
const btnRolProfesor = document.getElementById("btn-rol-profesor");
const btnRolAlumno = document.getElementById("btn-rol-alumno");
const btnVolver = document.getElementById("btn-volver");

// Horario
const subtituloHorario = document.getElementById("subtitulo-horario");
const cuerpoHorario = document.getElementById("cuerpo-horario");
const btnCerrarSesion = document.getElementById("btn-cerrar-sesion");
const btnEditarHorario = document.getElementById("btn-editar-horario");
const btnReservarTutoria = document.getElementById("btn-reservar-tutoria");
const btnMisTutorias = document.getElementById("btn-mis-tutorias");

// Editar horario (profesor)
const cuerpoEditar = document.getElementById("cuerpo-editar");
const btnGuardarHorario = document.getElementById("btn-guardar-horario");
const btnCancelarEdicion = document.getElementById("btn-cancelar-edicion");

// Modificar tutoría (profesor)
const textoTutoria = document.getElementById("texto-tutoria");
const selectDiaTutoria = document.getElementById("dia-tutoria");
const selectHoraTutoria = document.getElementById("hora-tutoria");
const mensajeTutoria = document.getElementById("mensaje-tutoria");
const btnGuardarTutoria = document.getElementById("btn-guardar-tutoria");
const btnCancelarModTutoria = document.getElementById("btn-cancelar-mod-tutoria");

// Reservar tutoría (alumno)
const listaTutorias = document.getElementById("lista-tutorias");
const mensajeReserva = document.getElementById("mensaje-reserva");
const btnIrMisTutorias = document.getElementById("btn-ir-mis-tutorias");
const btnVolverReservas = document.getElementById("btn-volver-reservas");

// Mis tutorías (alumno)
const resumenMisTutorias = document.getElementById("resumen-mis-tutorias");
const listaMisTutorias = document.getElementById("lista-mis-tutorias");
const mensajeMisTutorias = document.getElementById("mensaje-mis-tutorias");
const btnReservarOtra = document.getElementById("btn-reservar-otra");
const btnVolverMisTutorias = document.getElementById("btn-volver-mis-tutorias");

// =====================================================
// 2. DATOS
// =====================================================

// Variable para saber el rol
let rolActual = "";

// Los datos correctos para entrar
const usuarioCorrectoProfesor = "profesor";
const claveCorrectaProfesor = "profesor";
const usuarioCorrectoAlumno = "alumno";
const claveCorrectaAlumno = "alumno";

const nombresDias = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"];

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

// Reservas de tutorías: la clave es "fila-día" (por ejemplo "2-0") y el valor es true
const claveReservas = "reservasTutorias";
let reservas = {};
try {
  const reservasGuardadas = JSON.parse(localStorage.getItem(claveReservas));
  if (reservasGuardadas && typeof reservasGuardadas === "object" && !Array.isArray(reservasGuardadas)) {
    reservas = reservasGuardadas;
  }
} catch (error) {
  // Si los datos guardados no son válidos, empezamos sin reservas
}

// Posición (fila y día) de la tutoría que se está modificando
let tutoriaEnEdicion = null;

// =====================================================
// 3. FUNCIONES AUXILIARES
// =====================================================

// Todas las vistas, para poder mostrar una y ocultar el resto
const todasLasVistas = [
  vistaLanding, vistaSeleccion, vistaLogin, vistaHorario,
  vistaEditar, vistaTutoria, vistaReservar, vistaMisTutorias
];

// Muestra solo la vista indicada
function mostrarVista(vista) {
  todasLasVistas.forEach(function (v) {
    v.classList.toggle("oculto", v !== vista);
  });
}

// Crea la clave de una casilla del horario, por ejemplo "2-0"
function crearClave(indiceFila, indiceDia) {
  return indiceFila + "-" + indiceDia;
}

// Dice si el texto de una casilla es una tutoría
function esTutoria(texto) {
  return typeof texto === "string" && texto.trim().toLowerCase().startsWith("tutoría");
}

// Guarda el horario del profesor en el navegador
function guardarEnNavegador() {
  try {
    localStorage.setItem(claveHorarioProfesor, JSON.stringify(horarioProfesor));
  } catch (error) {
    // Si no se puede guardar, el cambio sigue valiendo mientras la página esté abierta
  }
}

// Guarda las reservas en el navegador
function guardarReservas() {
  try {
    localStorage.setItem(claveReservas, JSON.stringify(reservas));
  } catch (error) {
    // Si no se puede guardar, las reservas siguen valiendo mientras la página esté abierta
  }
}

// Borra las reservas de casillas que ya no son una tutoría
function limpiarReservas() {
  let hayCambios = false;

  Object.keys(reservas).forEach(function (clave) {
    const partes = clave.split("-");
    const fila = horarioProfesor[Number(partes[0])];
    const clase = fila ? fila.dias[Number(partes[1])] : undefined;

    if (!esTutoria(clase)) {
      delete reservas[clave];
      hayCambios = true;
    }
  });

  if (hayCambios) {
    guardarReservas();
  }
}

// Crea un botón pequeño (se usa en varias listas)
function crearBotonMini(texto, esCancelar, accion) {
  const boton = document.createElement("button");
  boton.type = "button";
  boton.className = esCancelar ? "btn-mini btn-cancelar" : "btn-mini";
  boton.textContent = texto;
  boton.addEventListener("click", accion);
  return boton;
}

// =====================================================
// 4. HORARIO
// =====================================================

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

  // Cada botón solo se muestra al rol que lo necesita
  btnEditarHorario.classList.toggle("oculto", rolActual !== "profesor");
  btnReservarTutoria.classList.toggle("oculto", rolActual !== "alumno");
  btnMisTutorias.classList.toggle("oculto", rolActual !== "alumno");

  // Quitamos las reservas de tutorías que ya no existen
  limpiarReservas();

  // Contador de reservas en el botón del alumno
  const totalReservas = Object.keys(reservas).length;
  btnMisTutorias.textContent = totalReservas > 0 ? "Mis tutorías (" + totalReservas + ")" : "Mis tutorías";

  // Vaciamos la tabla por si ya tenía filas
  cuerpoHorario.innerHTML = "";

  // Creamos una fila por cada hora
  horario.forEach(function (fila, indiceFila) {
    const tr = document.createElement("tr");

    const tdHora = document.createElement("td");
    tdHora.textContent = fila.hora;
    tr.appendChild(tdHora);

    // Una celda por cada día (si está vacío ponemos un guion)
    fila.dias.forEach(function (clase, indiceDia) {
      const td = document.createElement("td");
      td.textContent = clase === "" ? "-" : clase;

      // Si es el profesor y la clase es una tutoría, añadimos los botones
      if (rolActual === "profesor" && esTutoria(clase)) {
        // Si algún alumno ha reservado esta tutoría
        if (reservas[crearClave(indiceFila, indiceDia)]) {
          const etiqueta = document.createElement("div");
          etiqueta.className = "etiqueta-reservada";
          etiqueta.textContent = "(Reservada)";
          td.appendChild(etiqueta);
        }

        const acciones = document.createElement("div");
        acciones.className = "acciones-tutoria";
        acciones.appendChild(crearBotonMini("Modificar", false, function () {
          abrirModificarTutoria(indiceFila, indiceDia);
        }));
        acciones.appendChild(crearBotonMini("Cancelar", true, function () {
          cancelarTutoria(indiceFila, indiceDia);
        }));
        td.appendChild(acciones);
      }

      tr.appendChild(td);
    });

    cuerpoHorario.appendChild(tr);
  });

  mostrarVista(vistaHorario);
}

// =====================================================
// 5. EDITAR HORARIO (profesor)
// =====================================================

// Abre la vista de edición con una casilla por cada clase
function abrirEdicion() {
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

  mostrarVista(vistaEditar);
}

// Lee las casillas y guarda el nuevo horario
function guardarHorario() {
  const filas = cuerpoEditar.querySelectorAll("tr");

  filas.forEach(function (tr, indiceFila) {
    const casillas = tr.querySelectorAll("input");
    casillas.forEach(function (casilla, indiceDia) {
      horarioProfesor[indiceFila].dias[indiceDia] = casilla.value.trim();
    });
  });

  guardarEnNavegador();
  mostrarHorario();
}

// =====================================================
// 6. TUTORÍAS: CANCELAR Y MODIFICAR (profesor)
// =====================================================

// Cancelar una tutoría: se vacía su casilla
function cancelarTutoria(indiceFila, indiceDia) {
  const hora = horarioProfesor[indiceFila].hora;
  const dia = nombresDias[indiceDia];

  if (!confirm("¿Seguro que quieres cancelar la tutoría del " + dia + " (" + hora + ")?")) {
    return;
  }

  horarioProfesor[indiceFila].dias[indiceDia] = "";
  // Si estaba reservada, la reserva también se elimina
  delete reservas[crearClave(indiceFila, indiceDia)];
  guardarReservas();
  guardarEnNavegador();
  mostrarHorario();
}

// Abrir la pantalla para modificar una tutoría
function abrirModificarTutoria(indiceFila, indiceDia) {
  tutoriaEnEdicion = { fila: indiceFila, dia: indiceDia };

  textoTutoria.value = horarioProfesor[indiceFila].dias[indiceDia];

  selectDiaTutoria.innerHTML = "";
  nombresDias.forEach(function (nombre, i) {
    selectDiaTutoria.add(new Option(nombre, i));
  });
  selectDiaTutoria.value = indiceDia;

  selectHoraTutoria.innerHTML = "";
  horarioProfesor.forEach(function (fila, i) {
    selectHoraTutoria.add(new Option(fila.hora, i));
  });
  selectHoraTutoria.value = indiceFila;

  mensajeTutoria.textContent = "";
  mostrarVista(vistaTutoria);
}

// Guardar los cambios de la tutoría (texto, día y/o hora)
function guardarTutoria() {
  const texto = textoTutoria.value.trim();
  const nuevaFila = Number(selectHoraTutoria.value);
  const nuevoDia = Number(selectDiaTutoria.value);
  const { fila, dia } = tutoriaEnEdicion;

  if (texto === "") {
    mensajeTutoria.textContent = "Escribe el nombre de la tutoría.";
    return;
  }

  // Si el nombre no empieza por "Tutoría", dejaría de ser una tutoría y se perdería
  if (!esTutoria(texto)) {
    mensajeTutoria.textContent = "El nombre debe empezar por «Tutoría».";
    return;
  }

  const cambiaHueco = nuevaFila !== fila || nuevoDia !== dia;

  // No se puede mover a un hueco que ya tiene otra clase
  if (cambiaHueco && horarioProfesor[nuevaFila].dias[nuevoDia] !== "") {
    mensajeTutoria.textContent = "Ese hueco ya está ocupado por otra clase.";
    return;
  }

  // Si la tutoría estaba reservada, la reserva se mueve con ella
  const claveVieja = crearClave(fila, dia);
  if (reservas[claveVieja]) {
    delete reservas[claveVieja];
    reservas[crearClave(nuevaFila, nuevoDia)] = true;
    guardarReservas();
  }

  horarioProfesor[fila].dias[dia] = "";
  horarioProfesor[nuevaFila].dias[nuevoDia] = texto;
  guardarEnNavegador();

  tutoriaEnEdicion = null;
  mostrarHorario();
}

// =====================================================
// 7. RESERVAR TUTORÍAS (alumno)
// =====================================================

// Reserva una tutoría libre o anula una ya reservada
function cambiarReserva(clave) {
  if (reservas[clave]) {
    delete reservas[clave];
    mensajeReserva.textContent = "Reserva anulada.";
  } else {
    reservas[clave] = true;
    mensajeReserva.textContent = "¡Tutoría reservada!";
  }
  mensajeReserva.className = "mensaje-vista exito";

  guardarReservas();
  mostrarListaTutorias();
}

// Rellena la lista con las tutorías que ofrece el profesor
function mostrarListaTutorias() {
  limpiarReservas();
  listaTutorias.innerHTML = "";
  let hayTutorias = false;

  horarioProfesor.forEach(function (fila, indiceFila) {
    fila.dias.forEach(function (clase, indiceDia) {
      if (!esTutoria(clase)) {
        return;
      }
      hayTutorias = true;

      const clave = crearClave(indiceFila, indiceDia);
      const reservada = reservas[clave] === true;

      const item = document.createElement("div");
      item.className = "item-tutoria";

      const info = document.createElement("span");
      info.textContent = nombresDias[indiceDia] + " · " + fila.hora;
      if (reservada) {
        info.textContent += " (reservada)";
        info.className = "texto-reservada";
      }

      item.appendChild(info);
      item.appendChild(crearBotonMini(reservada ? "Anular reserva" : "Reservar", reservada, function () {
        cambiarReserva(clave);
      }));
      listaTutorias.appendChild(item);
    });
  });

  if (!hayTutorias) {
    listaTutorias.textContent = "No hay tutorías disponibles ahora mismo.";
  }
}

// Abre la pantalla de reservas
function abrirReservas() {
  if (rolActual !== "alumno") {
    return;
  }

  mensajeReserva.textContent = "";
  mostrarListaTutorias();
  mostrarVista(vistaReservar);
}

// =====================================================
// 8. MIS TUTORÍAS (alumno): consultar lo que ya ha reservado
// =====================================================

// Anula una reserva desde la pantalla "Mis tutorías"
function anularDesdeMisTutorias(clave) {
  if (!confirm("¿Seguro que quieres anular esta reserva?")) {
    return;
  }

  delete reservas[clave];
  guardarReservas();
  mostrarMisTutorias();
  mensajeMisTutorias.textContent = "Reserva anulada.";
  mensajeMisTutorias.className = "mensaje-vista exito";
}

// Rellena la lista con las tutorías reservadas, ordenadas por día y hora
function mostrarMisTutorias() {
  limpiarReservas();
  listaMisTutorias.innerHTML = "";
  mensajeMisTutorias.textContent = "";
  let total = 0;

  nombresDias.forEach(function (nombreDia, indiceDia) {
    horarioProfesor.forEach(function (fila, indiceFila) {
      const clave = crearClave(indiceFila, indiceDia);
      if (reservas[clave] !== true) {
        return;
      }
      total++;

      const item = document.createElement("div");
      item.className = "item-tutoria";

      const info = document.createElement("span");
      info.textContent = nombreDia + " · " + fila.hora;

      item.appendChild(info);
      item.appendChild(crearBotonMini("Anular reserva", true, function () {
        anularDesdeMisTutorias(clave);
      }));
      listaMisTutorias.appendChild(item);
    });
  });

  if (total === 0) {
    resumenMisTutorias.textContent = "Todavía no has reservado ninguna tutoría";
    listaMisTutorias.textContent = "No tienes tutorías reservadas.";
  } else {
    resumenMisTutorias.textContent = total === 1 ? "Tienes 1 tutoría reservada" : "Tienes " + total + " tutorías reservadas";
  }
}

// Abre la pantalla de "Mis tutorías"
function abrirMisTutorias() {
  if (rolActual !== "alumno") {
    return;
  }

  mostrarMisTutorias();
  mostrarVista(vistaMisTutorias);
}

// =====================================================
// 9. EVENTOS
// =====================================================

// Pantalla de inicio y selección de rol
btnEmpezar.addEventListener("click", function () {
  mostrarVista(vistaSeleccion);
});

btnVolverLanding.addEventListener("click", function () {
  mostrarVista(vistaLanding);
});

btnRolProfesor.addEventListener("click", function () {
  rolActual = "profesor";
  tituloLogin.textContent = "Acceso Profesor";
  mostrarVista(vistaLogin);
});

btnRolAlumno.addEventListener("click", function () {
  rolActual = "alumno";
  tituloLogin.textContent = "Acceso Alumno";
  mostrarVista(vistaLogin);
});

btnVolver.addEventListener("click", function () {
  mostrarVista(vistaSeleccion);
  mensaje.textContent = "";
  campoUsuario.value = "";
  campoClave.value = "";
  rolActual = "";
});

// Login (se activa con el botón o pulsando Enter)
formulario.addEventListener("submit", function (evento) {
  evento.preventDefault();

  const usuario = campoUsuario.value.trim();
  const clave = campoClave.value.trim();

  try {
    if (usuario === "" || clave === "") {
      throw new Error("Por favor llena los dos campos.");
    }

    const esProfesor = rolActual === "profesor" && usuario === usuarioCorrectoProfesor && clave === claveCorrectaProfesor;
    const esAlumno = rolActual === "alumno" && usuario === usuarioCorrectoAlumno && clave === claveCorrectaAlumno;

    if (!esProfesor && !esAlumno) {
      throw new Error("Usuario o contraseña incorrectos.");
    }

    // Limpiamos el formulario para que no queden los datos escritos
    mensaje.textContent = "";
    campoUsuario.value = "";
    campoClave.value = "";

    mostrarHorario();
  } catch (error) {
    mensaje.textContent = error.message;
    mensaje.className = "error";
  }
});

// Cerrar sesión
btnCerrarSesion.addEventListener("click", function () {
  mostrarVista(vistaSeleccion);
  rolActual = "";
});

// Editar el horario
btnEditarHorario.addEventListener("click", abrirEdicion);
btnGuardarHorario.addEventListener("click", guardarHorario);
btnCancelarEdicion.addEventListener("click", function () {
  mostrarVista(vistaHorario);
});

// Modificar una tutoría
btnGuardarTutoria.addEventListener("click", guardarTutoria);
btnCancelarModTutoria.addEventListener("click", function () {
  tutoriaEnEdicion = null;
  mostrarVista(vistaHorario);
});

// Reservar tutorías
btnReservarTutoria.addEventListener("click", abrirReservas);
btnIrMisTutorias.addEventListener("click", abrirMisTutorias);
btnVolverReservas.addEventListener("click", mostrarHorario);

// Mis tutorías
btnMisTutorias.addEventListener("click", abrirMisTutorias);
btnReservarOtra.addEventListener("click", abrirReservas);
btnVolverMisTutorias.addEventListener("click", mostrarHorario);