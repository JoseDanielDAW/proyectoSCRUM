// Página para reservar tutorías (solo alumno)
(function () {
  if (!exigirRol("alumno")) {
    return;
  }

  const listaTutorias = document.getElementById("lista-tutorias");
  const mensajeReserva = document.getElementById("mensaje-reserva");
  const btnIrMisTutorias = document.getElementById("btn-ir-mis-tutorias");
  const btnVolverReservas = document.getElementById("btn-volver-reservas");

  // Reserva una tutoría libre o anula una ya reservada
  function cambiarReserva(clave) {
    if (reservas[clave]) {
      delete reservas[clave];
      mensajeReserva.textContent = "Reserva anulada.";
    } else {
      reservas[clave] = { comentario: "" };
      mensajeReserva.textContent = "¡Tutoría reservada! Puedes añadir un comentario.";
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
        const reserva = reservas[clave];
        const reservada = Boolean(reserva);

        const item = document.createElement("div");
        item.className = "item-tutoria";

        const info = document.createElement("div");
        info.className = "info-tutoria";

        const texto = document.createElement("span");
        texto.textContent = nombresDias[indiceDia] + " · " + fila.hora;
        if (reservada) {
          texto.textContent += " (reservada)";
          texto.className = "texto-reservada";
        }
        info.appendChild(texto);

        if (reservada && reserva.comentario) {
          info.appendChild(crearComentario(reserva.comentario));
        }

        const botones = document.createElement("div");
        botones.className = "botones-item";
        if (reservada) {
          botones.appendChild(crearBotonMini(reserva.comentario ? "Editar comentario" : "Añadir comentario", false, function () {
            window.location.href = "comentario.html?clave=" + clave + "&origen=reservar";
          }));
        }
        botones.appendChild(crearBotonMini(reservada ? "Anular reserva" : "Reservar", reservada, function () {
          cambiarReserva(clave);
        }));

        item.appendChild(info);
        item.appendChild(botones);
        listaTutorias.appendChild(item);
      });
    });

    if (!hayTutorias) {
      listaTutorias.textContent = "No hay tutorías disponibles ahora mismo.";
    }
  }

  btnIrMisTutorias.addEventListener("click", function () {
    window.location.href = "mis-tutorias.html";
  });

  btnVolverReservas.addEventListener("click", function () {
    window.location.href = "horario.html";
  });

  mostrarListaTutorias();

  // Mensaje que viene de otra página (por ejemplo "Comentario guardado.")
  const mensajePendiente = tomarMensaje();
  if (mensajePendiente) {
    mensajeReserva.textContent = mensajePendiente;
    mensajeReserva.className = "mensaje-vista exito";
  }
})();
