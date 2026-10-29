// Página del horario (profesor y alumno)
(function () {
  const rolActual = exigirRol();
  if (!rolActual) {
    return;
  }

  const subtituloHorario = document.getElementById("subtitulo-horario");
  const cuerpoHorario = document.getElementById("cuerpo-horario");
  const btnCerrarSesion = document.getElementById("btn-cerrar-sesion");
  const btnEditarHorario = document.getElementById("btn-editar-horario");
  const btnReservarTutoria = document.getElementById("btn-reservar-tutoria");
  const btnMisTutorias = document.getElementById("btn-mis-tutorias");

  // Cancelar una tutoría: se vacía su casilla
  function cancelarTutoria(indiceFila, indiceDia) {
    const hora = horarioProfesor[indiceFila].hora;
    const dia = nombresDias[indiceDia];

    if (!confirm("¿Seguro que quieres cancelar la tutoría del " + dia + " (" + hora + ")?")) {
      return;
    }

    horarioProfesor[indiceFila].dias[indiceDia] = "";
    // Si estaba reservada, la reserva (y su comentario) también se elimina
    delete reservas[crearClave(indiceFila, indiceDia)];
    guardarReservas();
    guardarEnNavegador();
    mostrarHorario();
  }

  // Rellena la tabla según el rol
  function mostrarHorario() {
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

    cuerpoHorario.innerHTML = "";

    horario.forEach(function (fila, indiceFila) {
      const tr = document.createElement("tr");

      const tdHora = document.createElement("td");
      tdHora.textContent = fila.hora;
      tr.appendChild(tdHora);

      fila.dias.forEach(function (clase, indiceDia) {
        const td = document.createElement("td");
        td.textContent = clase === "" ? "-" : clase;

        // Si es el profesor y la clase es una tutoría, añadimos los botones
        if (rolActual === "profesor" && esTutoria(clase)) {
          const reserva = reservas[crearClave(indiceFila, indiceDia)];
          if (reserva) {
            const etiqueta = document.createElement("div");
            etiqueta.className = "etiqueta-reservada";
            etiqueta.textContent = "(Reservada)";
            td.appendChild(etiqueta);

            if (reserva.comentario) {
              td.appendChild(crearComentario(reserva.comentario));
            }
          }

          const acciones = document.createElement("div");
          acciones.className = "acciones-tutoria";
          acciones.appendChild(crearBotonMini("Modificar", false, function () {
            window.location.href = "modificar-tutoria.html?fila=" + indiceFila + "&dia=" + indiceDia;
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
  }

  btnEditarHorario.addEventListener("click", function () {
    window.location.href = "editar-horario.html";
  });

  btnReservarTutoria.addEventListener("click", function () {
    window.location.href = "reservar.html";
  });

  btnMisTutorias.addEventListener("click", function () {
    window.location.href = "mis-tutorias.html";
  });

  btnCerrarSesion.addEventListener("click", function () {
    cerrarSesion();
    window.location.href = "seleccion.html";
  });

  mostrarHorario();
})();
