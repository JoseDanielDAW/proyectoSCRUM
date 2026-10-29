// =====================================================
// DATOS (compartido por las páginas con horario y tutorías)
// Cada página carga estos datos desde localStorage al abrirse.
// =====================================================

const nombresDias = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"];

const claveHorarioProfesor = "horarioProfesor";
const claveReservas = "reservasTutorias";

// Horario del profesor (los datos son de ejemplo)
// Cada fila es una hora y sus 5 días, de lunes a viernes
const horarioProfesorEjemplo = [
  { hora: "08:00 - 09:00", dias: ["Matemáticas 1ºA", "", "Matemáticas 1ºB", "", "Matemáticas 2ºA"] },
  { hora: "09:00 - 10:00", dias: ["", "Matemáticas 2ºA", "", "Matemáticas 1ºA", ""] },
  { hora: "10:00 - 11:00", dias: ["Tutoría", "", "", "Matemáticas 1ºB", "Tutoría"] },
  { hora: "11:30 - 12:30", dias: ["Matemáticas 2ºB", "Matemáticas 2ºB", "", "", "Matemáticas 1ºA"] }
];

// Horario del alumno (los datos son de ejemplo)
const horarioAlumno = [
  { hora: "08:00 - 09:00", dias: ["Matemáticas", "Lengua", "Matemáticas", "Inglés", "Lengua"] },
  { hora: "09:00 - 10:00", dias: ["Lengua", "Matemáticas", "Ciencias", "Matemáticas", "Inglés"] },
  { hora: "10:00 - 11:00", dias: ["Inglés", "Ciencias", "Lengua", "Ciencias", "Matemáticas"] },
  { hora: "11:30 - 12:30", dias: ["Educación Física", "Música", "Inglés", "Lengua", "Tutoría"] }
];

// Si el profesor ya guardó cambios antes, usamos ese horario en vez del de ejemplo
function cargarHorarioProfesor() {
  const guardado = leerDato(claveHorarioProfesor, null);
  if (Array.isArray(guardado)) {
    return guardado;
  }
  // Si no hay nada guardado (o no es válido), seguimos con el horario de ejemplo
  return horarioProfesorEjemplo;
}

// Reservas: la clave es "fila-día" (por ejemplo "2-0") y el valor es { comentario: "..." }
function cargarReservas() {
  let cargadas = {};

  const guardadas = leerDato(claveReservas, null);
  if (guardadas && typeof guardadas === "object" && !Array.isArray(guardadas)) {
    cargadas = guardadas;
  }

  // Las reservas antiguas (true) se convierten al nuevo formato
  Object.keys(cargadas).forEach(function (clave) {
    const valor = cargadas[clave];
    if (valor === true) {
      cargadas[clave] = { comentario: "" };
    } else if (!valor || typeof valor !== "object") {
      delete cargadas[clave];
    }
  });

  return cargadas;
}

let horarioProfesor = cargarHorarioProfesor();
let reservas = cargarReservas();

// ---------- Funciones auxiliares ----------

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
  guardarDato(claveHorarioProfesor, horarioProfesor);
}

// Guarda las reservas en el navegador
function guardarReservas() {
  guardarDato(claveReservas, reservas);
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
