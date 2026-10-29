// Página de selección de rol
(function () {
  const btnRolProfesor = document.getElementById("btn-rol-profesor");
  const btnRolAlumno = document.getElementById("btn-rol-alumno");
  const btnVolverLanding = document.getElementById("btn-volver-landing");

  function elegirRol(rol) {
    cerrarSesion(); // por si había una sesión anterior
    guardarRolElegido(rol);
    window.location.href = "login.html";
  }

  btnRolProfesor.addEventListener("click", function () {
    elegirRol("profesor");
  });

  btnRolAlumno.addEventListener("click", function () {
    elegirRol("alumno");
  });

  btnVolverLanding.addEventListener("click", function () {
    window.location.href = "index.html";
  });
})();
