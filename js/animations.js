/**
 * animations.js
 * -----------------------------------------------------------
 * Responsable únicamente de las animaciones de aparición al
 * hacer scroll. Usa IntersectionObserver para agregar la
 * clase "is-visible" a los elementos marcados con ".reveal"
 * cuando entran en el viewport, dejando que animations.css
 * controle el efecto visual (fade + slide up).
 * -----------------------------------------------------------
 */

document.addEventListener('DOMContentLoaded', () => {
  const elementosAnimables = document.querySelectorAll('.reveal');
  activarReveladoAlHacerScroll(elementosAnimables);
});

/**
 * Observa cada elemento animable y, cuando aparece en
 * pantalla, agrega la clase que dispara la transición CSS.
 * Una vez revelado, deja de observarlo para no repetir la
 * animación innecesariamente.
 */
function activarReveladoAlHacerScroll(elementos) {
  if (elementos.length === 0) return;

  // Si el navegador no soporta IntersectionObserver, se
  // muestran los elementos directamente sin animación.
  if (!('IntersectionObserver' in window)) {
    elementos.forEach((elemento) => elemento.classList.add('is-visible'));
    return;
  }

  const opcionesObservador = {
    root: null,
    rootMargin: '0px 0px -5% 0px',
    threshold: 0,
  };

  const observador = new IntersectionObserver((entradas, observadorActual) => {
    entradas.forEach((entrada) => {
      if (!entrada.isIntersecting) return;

      entrada.target.classList.add('is-visible');
      observadorActual.unobserve(entrada.target);
    });
  }, opcionesObservador);

  elementos.forEach((elemento) => observador.observe(elemento));
}
