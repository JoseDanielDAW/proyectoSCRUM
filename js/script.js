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

// Reservas de tutorías: se guarda qué tutorías están reservadas
// La clave es "fila-día" (por ejemplo "2-0") y el valor es true
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

    // El botón de reservar solo se muestra al alumno
  btnReservarTutoria.classList.toggle("oculto", rolActual !== "alumno");

  // Quitamos las reservas de tutorías que ya no existen
  limpiarReservas();

  // Vaciamos la tabla por si ya tenía filas
  cuerpoHorario.innerHTML = "";

  // Creamos una fila por cada hora
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
      /**/
      // Si es el profesor y la clase es una tutoría, añadimos los botones
      if (rolActual === "profesor" && esTutoria(clase)) {
        // Si algún alumno ha reservado esta tutoría
        if (reservas[indiceFila + "-" + indiceDia]) {
          const etiqueta = document.createElement("div");
          etiqueta.className = "etiqueta-reservada";
          etiqueta.textContent = "(Reservada)";
          td.appendChild(etiqueta);
        }

        const acciones = document.createElement("div");
        acciones.className = "acciones-tutoria";

        const btnMod = document.createElement("button");
        btnMod.type = "button";
        btnMod.className = "btn-mini";
        btnMod.textContent = "Modificar";
        btnMod.addEventListener("click", function () {
          abrirModificarTutoria(indiceFila, indiceDia);
        });

        const btnCan = document.createElement("button");
        btnCan.type = "button";
        btnCan.className = "btn-mini btn-cancelar";
        btnCan.textContent = "Cancelar";
        btnCan.addEventListener("click", function () {
          cancelarTutoria(indiceFila, indiceDia);
        });

        acciones.appendChild(btnMod);
        acciones.appendChild(btnCan);
        td.appendChild(acciones);
      }

      /**/
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

/**/
// ===== Tutorías: cancelar y modificar =====
const vistaTutoria = document.getElementById("vista-tutoria");
const textoTutoria = document.getElementById("texto-tutoria");
const selectDiaTutoria = document.getElementById("dia-tutoria");
const selectHoraTutoria = document.getElementById("hora-tutoria");
const mensajeTutoria = document.getElementById("mensaje-tutoria");
const btnGuardarTutoria = document.getElementById("btn-guardar-tutoria");
const btnCancelarModTutoria = document.getElementById("btn-cancelar-mod-tutoria");

const nombresDias = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"];

// Posición (fila y día) de la tutoría que se está modificando
let tutoriaEnEdicion = null;

// Dice si el texto de una casilla es una tutoría
function esTutoria(texto) {
  return texto.trim().toLowerCase().startsWith("tutoría");
}

// Guarda el horario del profesor en el navegador
function guardarEnNavegador() {
  try {
    localStorage.setItem(claveHorarioProfesor, JSON.stringify(horarioProfesor));
  } catch (error) {
    // Si no se puede guardar, el cambio sigue valiendo mientras la página esté abierta
  }
}

// Cancelar una tutoría: se vacía su casilla
function cancelarTutoria(indiceFila, indiceDia) {
  const hora = horarioProfesor[indiceFila].hora;
  const dia = nombresDias[indiceDia];

  if (!confirm("¿Seguro que quieres cancelar la tutoría del " + dia + " (" + hora + ")?")) {
    return;
  }

  horarioProfesor[indiceFila].dias[indiceDia] = "";
  // Si estaba reservada, la reserva también se elimina
  delete reservas[indiceFila + "-" + indiceDia];
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
  vistaHorario.classList.add("oculto");
  vistaTutoria.classList.remove("oculto");
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

  const cambiaHueco = nuevaFila !== fila || nuevoDia !== dia;

  // No se puede mover a un hueco que ya tiene otra clase
  if (cambiaHueco && horarioProfesor[nuevaFila].dias[nuevoDia] !== "") {
    mensajeTutoria.textContent = "Ese hueco ya está ocupado por otra clase.";
    return;
  }

  // Si la tutoría estaba reservada, la reserva se mueve con ella
  const claveVieja = fila + "-" + dia;
  if (reservas[claveVieja]) {
    delete reservas[claveVieja];
    reservas[nuevaFila + "-" + nuevoDia] = true;
    guardarReservas();
  }

  horarioProfesor[fila].dias[dia] = "";
  horarioProfesor[nuevaFila].dias[nuevoDia] = texto;
  guardarEnNavegador();

  tutoriaEnEdicion = null;
  vistaTutoria.classList.add("oculto");
  mostrarHorario();
}

/**/
// ===== Reservar tutorías (alumno) =====
const btnReservarTutoria = document.getElementById("btn-reservar-tutoria");
const vistaReservar = document.getElementById("vista-reservar");
const listaTutorias = document.getElementById("lista-tutorias");
const mensajeReserva = document.getElementById("mensaje-reserva");
const btnVolverReservas = document.getElementById("btn-volver-reservas");

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

    if (typeof clase !== "string" || !esTutoria(clase)) {
      delete reservas[clave];
      hayCambios = true;
    }
  });

  if (hayCambios) {
    guardarReservas();
  }
}

// Reserva una tutoría libre o anula una ya reservada
function cambiarReserva(clave) {
  if (reservas[clave]) {
    delete reservas[clave];
    mensajeReserva.textContent = "Reserva anulada.";
  } else {
    reservas[clave] = true;
    mensajeReserva.textContent = "¡Tutoría reservada!";
  }
  mensajeReserva.className = "exito";

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

      const clave = indiceFila + "-" + indiceDia;
      const reservada = reservas[clave] === true;

      const item = document.createElement("div");
      item.className = "item-tutoria";

      const info = document.createElement("span");
      info.textContent = nombresDias[indiceDia] + " · " + fila.hora;
      if (reservada) {
        info.textContent += " (reservada)";
        info.className = "texto-reservada";
      }

      const boton = document.createElement("button");
      boton.type = "button";
      boton.className = reservada ? "btn-mini btn-cancelar" : "btn-mini";
      boton.textContent = reservada ? "Anular reserva" : "Reservar";
      boton.addEventListener("click", function () {
        cambiarReserva(clave);
      });

      item.appendChild(info);
      item.appendChild(boton);
      listaTutorias.appendChild(item);
    });
  });

  if (!hayTutorias) {
    listaTutorias.textContent = "No hay tutorías disponibles ahora mismo.";
  }
}

// Abre la pantalla de reservas
function abrirReservas() {
  // Solo el alumno puede reservar
  if (rolActual !== "alumno") {
    return;
  }

  mensajeReserva.textContent = "";
  mostrarListaTutorias();
  vistaHorario.classList.add("oculto");
  vistaReservar.classList.remove("oculto");
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

// Eventos para modificar una tutoría
btnGuardarTutoria.addEventListener("click", guardarTutoria);

btnCancelarModTutoria.addEventListener("click", function () {
  tutoriaEnEdicion = null;
  vistaTutoria.classList.add("oculto");
  vistaHorario.classList.remove("oculto");
});

// Eventos para reservar tutorías
btnReservarTutoria.addEventListener("click", abrirReservas);

btnVolverReservas.addEventListener("click", function () {
  vistaReservar.classList.add("oculto");
  vistaHorario.classList.remove("oculto");
});