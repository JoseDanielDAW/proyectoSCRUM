// Página para modificar una tutoría (solo profesor)
// Recibe la posición por la URL: modificar-tutoria.html?fila=2&dia=0
(function () {
  if (!exigirRol("profesor")) {
    return;
  }

  const params = new URLSearchParams(window.location.search);
  const fila = parseInt(params.get("fila"), 10);
  const dia = parseInt(params.get("dia"), 10);

  // Si la posición no existe o ya no es una tutoría, volvemos al horario
  if (!horarioProfesor[fila] || !esTutoria(horarioProfesor[fila].dias[dia])) {
    window.location.replace("horario.html");
    return;
  }

  const textoTutoria = document.getElementById("texto-tutoria");
  const selectDiaTutoria = document.getElementById("dia-tutoria");
  const selectHoraTutoria = document.getElementById("hora-tutoria");
  const mensajeTutoria = document.getElementById("mensaje-tutoria");
  const btnGuardarTutoria = document.getElementById("btn-guardar-tutoria");
  const btnCancelarModTutoria = document.getElementById("btn-cancelar-mod-tutoria");

  // Rellenamos el formulario con los datos actuales
  textoTutoria.value = horarioProfesor[fila].dias[dia];

  nombresDias.forEach(function (nombre, i) {
    selectDiaTutoria.add(new Option(nombre, i));
  });
  selectDiaTutoria.value = dia;

  horarioProfesor.forEach(function (filaHorario, i) {
    selectHoraTutoria.add(new Option(filaHorario.hora, i));
  });
  selectHoraTutoria.value = fila;

  // Guardar los cambios de la tutoría (texto, día y/o hora)
  function guardarTutoria() {
    const texto = textoTutoria.value.trim();
    const nuevaFila = Number(selectHoraTutoria.value);
    const nuevoDia = Number(selectDiaTutoria.value);

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

    // Si la tutoría estaba reservada, la reserva (con su comentario) se mueve con ella
    const claveVieja = crearClave(fila, dia);
    if (reservas[claveVieja]) {
      const reservaMovida = reservas[claveVieja];
      delete reservas[claveVieja];
      reservas[crearClave(nuevaFila, nuevoDia)] = reservaMovida;
      guardarReservas();
    }

    horarioProfesor[fila].dias[dia] = "";
    horarioProfesor[nuevaFila].dias[nuevoDia] = texto;
    guardarEnNavegador();

    window.location.href = "horario.html";
  }

  btnGuardarTutoria.addEventListener("click", guardarTutoria);
  btnCancelarModTutoria.addEventListener("click", function () {
    window.location.href = "horario.html";
  });
})();
