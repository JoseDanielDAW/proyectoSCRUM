// Página para editar el horario (solo profesor)
(function () {
  if (!exigirRol("profesor")) {
    return;
  }

  const cuerpoEditar = document.getElementById("cuerpo-editar");
  const btnGuardarHorario = document.getElementById("btn-guardar-horario");
  const btnCancelarEdicion = document.getElementById("btn-cancelar-edicion");

  // Crea una casilla por cada clase
  function crearCasillas() {
    cuerpoEditar.innerHTML = "";

    horarioProfesor.forEach(function (fila) {
      const tr = document.createElement("tr");

      const tdHora = document.createElement("td");
      tdHora.textContent = fila.hora;
      tr.appendChild(tdHora);

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
    window.location.href = "horario.html";
  }

  btnGuardarHorario.addEventListener("click", guardarHorario);
  btnCancelarEdicion.addEventListener("click", function () {
    window.location.href = "horario.html";
  });

  crearCasillas();
})();
