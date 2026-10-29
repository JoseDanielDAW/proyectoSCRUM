// Página de login (profesor y alumno)
(function () {
  const rolElegido = obtenerRolElegido();

  // Si se entra aquí sin haber elegido rol, volvemos a la selección
  if (!rolElegido) {
    window.location.replace("seleccion.html");
    return;
  }

  const formulario = document.getElementById("formulario-login");
  const campoUsuario = document.getElementById("usuario");
  const campoClave = document.getElementById("clave");
  const mensaje = document.getElementById("mensaje");
  const tituloLogin = document.getElementById("titulo-login");
  const btnVolver = document.getElementById("btn-volver");

  // Los datos correctos para entrar
  const credenciales = {
    profesor: { usuario: "profesor", clave: "profesor" },
    alumno: { usuario: "alumno", clave: "alumno" }
  };

  tituloLogin.textContent = rolElegido === "profesor" ? "Acceso Profesor" : "Acceso Alumno";

  // Login (se activa con el botón o pulsando Enter)
  formulario.addEventListener("submit", function (evento) {
    evento.preventDefault();

    const usuario = campoUsuario.value.trim();
    const clave = campoClave.value.trim();

    try {
      if (usuario === "" || clave === "") {
        throw new Error("Por favor llena los dos campos.");
      }

      const correctas = credenciales[rolElegido];
      if (!correctas || usuario !== correctas.usuario || clave !== correctas.clave) {
        throw new Error("Usuario o contraseña incorrectos.");
      }

      guardarRol(rolElegido);
      window.location.href = "horario.html";
    } catch (error) {
      mensaje.textContent = error.message;
      mensaje.className = "error";
    }
  });

  btnVolver.addEventListener("click", function () {
    cerrarSesion();
    window.location.href = "seleccion.html";
  });
})();
