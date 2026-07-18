/**
 * main.js
 * -----------------------------------------------------------
 * Punto de entrada del sitio. Se encarga únicamente de la
 * inicialización general que no pertenece a navegación ni
 * a animaciones (por ejemplo, datos dinámicos simples como
 * el año del pie de página).
 * -----------------------------------------------------------
 */

document.addEventListener('DOMContentLoaded', () => {
  actualizarAnioFooter();
});

/**
 * Actualiza el año mostrado en el pie de página con el año
 * actual, para no tener que editarlo manualmente cada ciclo.
 */
function actualizarAnioFooter() {
  const elementoAnio = document.getElementById('footerYear');
  if (!elementoAnio) return;

  const anioActual = new Date().getFullYear();
  elementoAnio.textContent = anioActual;
}
