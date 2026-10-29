// =====================================================
// ALMACÉN (compartido)
// Guarda los datos en localStorage Y en sessionStorage.
// Al leer, se usa la copia más reciente. Así los datos pasan de una
// página a otra aunque el navegador no comparta localStorage entre
// archivos abiertos con file:// (pasa en algunos navegadores).
// =====================================================

const prefijoDato = "dato:";

function leerCopia(almacen, clave) {
  try {
    const bruto = almacen.getItem(prefijoDato + clave);
    if (!bruto) {
      return null;
    }
    const copia = JSON.parse(bruto);
    if (copia && typeof copia.t === "number" && "v" in copia) {
      return copia;
    }
  } catch (error) {
    // Almacén no disponible o dato dañado: lo ignoramos
  }
  return null;
}

// Devuelve el valor guardado, o porDefecto si no hay nada
function leerDato(clave, porDefecto) {
  let mejor = null;

  [function () { return localStorage; }, function () { return sessionStorage; }].forEach(function (obtener) {
    try {
      const copia = leerCopia(obtener(), clave);
      if (copia && (!mejor || copia.t > mejor.t)) {
        mejor = copia;
      }
    } catch (error) {
      // Almacén bloqueado por el navegador
    }
  });

  if (mejor) {
    return mejor.v;
  }

  // Datos de versiones anteriores (guardados sin formato nuevo)
  try {
    const antiguo = JSON.parse(localStorage.getItem(clave));
    if (antiguo !== null) {
      return antiguo;
    }
  } catch (error) {
    // Nada que recuperar
  }

  return porDefecto;
}

function guardarDato(clave, valor) {
  const texto = JSON.stringify({ t: Date.now(), v: valor });

  try {
    localStorage.setItem(prefijoDato + clave, texto);
  } catch (error) {
    // Si falla, queda la copia de sessionStorage
  }

  try {
    sessionStorage.setItem(prefijoDato + clave, texto);
  } catch (error) {
    // Si falla, queda la copia de localStorage
  }
}
