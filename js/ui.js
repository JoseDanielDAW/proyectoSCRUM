// =====================================================
// UI (pequeños elementos que se repiten en varias páginas)
// =====================================================

// Crea un botón pequeño (se usa en varias listas)
function crearBotonMini(texto, esCancelar, accion) {
  const boton = document.createElement("button");
  boton.type = "button";
  boton.className = esCancelar ? "btn-mini btn-cancelar" : "btn-mini";
  boton.textContent = texto;
  boton.addEventListener("click", accion);
  return boton;
}

// Crea el texto del comentario de una reserva (con textContent, sin riesgo de HTML)
function crearComentario(texto) {
  const comentario = document.createElement("div");
  comentario.className = "comentario-tutoria";
  comentario.textContent = "«" + texto + "»";
  return comentario;
}
