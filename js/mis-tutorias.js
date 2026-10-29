// Página "Mis tutorías" (solo alumno): consultar lo que ya ha reservado
(function () {
  if (!exigirRol("alumno")) {
    return;
  }

  const resumenMisTutorias = document.getElementById("resumen-mis-tutorias");
  const listaMisTutorias = document.getElementById("lista-mis-tutorias");
  const mensajeMisTutorias = document.getElementById("mensaje-mis-tutorias");
  const btnReservarOtra = document.getElementById("btn-reservar-otra");
  const btnVolverMisTutorias = document.getElementById("btn-volver-mis-tutorias");

  // Anula una reserva desde esta pantalla
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
        const reserva = reservas[clave];
        if (!reserva) {
          return;
        }
        total++;

        const item = document.createElement("div");
        item.className = "item-tutoria";

        const info = document.createElement("div");
        info.className = "info-tutoria";

        const texto = document.createElement("span");
        texto.textContent = nombreDia + " · " + fila.hora;
        info.appendChild(texto);

        if (reserva.comentario) {
          info.appendChild(crearComentario(reserva.comentario));
        }

        const botones = document.createElement("div");
        botones.className = "botones-item";
        botones.appendChild(crearBotonMini(reserva.comentario ? "Editar comentario" : "Añadir comentario", false, function () {
          window.location.href = "comentario.html?clave=" + clave + "&origen=mis";
        }));
        botones.appendChild(crearBotonMini("Anular reserva", true, function () {
          anularDesdeMisTutorias(clave);
        }));

        item.appendChild(info);
        item.appendChild(botones);
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

  btnReservarOtra.addEventListener("click", function () {
    window.location.href = "reservar.html";
  });

  btnVolverMisTutorias.addEventListener("click", function () {
    window.location.href = "horario.html";
  });

  mostrarMisTutorias();

  // Mensaje que viene de otra página (por ejemplo "Comentario guardado.")
  const mensajePendiente = tomarMensaje();
  if (mensajePendiente) {
    mensajeMisTutorias.textContent = mensajePendiente;
    mensajeMisTutorias.className = "mensaje-vista exito";
  }
})();
