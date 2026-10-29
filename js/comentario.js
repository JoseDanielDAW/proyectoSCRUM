// Página para añadir o editar el comentario de una reserva (solo alumno)
// Recibe los datos por la URL: comentario.html?clave=2-0&origen=reservar
(function () {
  if (!exigirRol("alumno")) {
    return;
  }

  const params = new URLSearchParams(window.location.search);
  const clave = params.get("clave") || "";
  const origen = params.get("origen") === "reservar" ? "reservar" : "mis";
  const paginaVuelta = origen === "reservar" ? "reservar.html" : "mis-tutorias.html";

  limpiarReservas();

  // La clave debe tener el formato "fila-día" y existir como reserva
  const claveValida = /^\d+-\d+$/.test(clave) && Object.prototype.hasOwnProperty.call(reservas, clave);
  if (!claveValida) {
    window.location.replace(paginaVuelta);
    return;
  }

  const subtituloComentario = document.getElementById("subtitulo-comentario");
  const textoComentario = document.getElementById("texto-comentario");
  const btnGuardarComentario = document.getElementById("btn-guardar-comentario");
  const btnCancelarComentario = document.getElementById("btn-cancelar-comentario");

  const partes = clave.split("-");
  subtituloComentario.textContent =
    nombresDias[Number(partes[1])] + " · " + horarioProfesor[Number(partes[0])].hora;
  textoComentario.value = reservas[clave].comentario || "";
  textoComentario.focus();

  function guardarComentario() {
    reservas[clave].comentario = textoComentario.value.trim();
    guardarReservas();
    guardarMensaje("Comentario guardado.");
    window.location.href = paginaVuelta;
  }

  btnGuardarComentario.addEventListener("click", guardarComentario);
  btnCancelarComentario.addEventListener("click", function () {
    window.location.href = paginaVuelta;
  });
})();
