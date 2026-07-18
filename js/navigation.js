/**
 * navigation.js
 * -----------------------------------------------------------
 * Responsable únicamente de la navegación del sitio:
 *  - Apertura/cierre del menú en móvil.
 *  - Cierre del menú al elegir una sección.
 *  - Resaltado del enlace correspondiente a la sección visible
 *    (scrollspy), incluyendo el botón "Explorar" del hero.
 * -----------------------------------------------------------
 */

document.addEventListener('DOMContentLoaded', () => {
  const botonMenu = document.getElementById('navToggle');
  const menuNavegacion = document.getElementById('navMenu');
  const enlacesNavegacion = document.querySelectorAll('.navbar__link');
  const secciones = document.querySelectorAll('main section[id]');

  inicializarMenuMovil(botonMenu, menuNavegacion, enlacesNavegacion);
  inicializarScrollSpy(secciones, enlacesNavegacion);
});

/**
 * Controla la apertura y cierre del menú hamburguesa en
 * pantallas pequeñas, y lo cierra automáticamente al elegir
 * una sección.
 */
function inicializarMenuMovil(botonMenu, menuNavegacion, enlacesNavegacion) {
  if (!botonMenu || !menuNavegacion) return;

  botonMenu.addEventListener('click', () => {
    const estaAbierto = menuNavegacion.classList.toggle('is-open');
    botonMenu.classList.toggle('is-active', estaAbierto);
    botonMenu.setAttribute('aria-expanded', String(estaAbierto));
  });

  enlacesNavegacion.forEach((enlace) => {
    enlace.addEventListener('click', () => {
      menuNavegacion.classList.remove('is-open');
      botonMenu.classList.remove('is-active');
      botonMenu.setAttribute('aria-expanded', 'false');
    });
  });
}

/**
 * Observa qué sección está actualmente visible en pantalla y
 * marca el enlace de navegación correspondiente como activo,
 * simulando el "estado" de un nodo dentro del recorrido.
 */
function inicializarScrollSpy(secciones, enlacesNavegacion) {
  if (!('IntersectionObserver' in window) || secciones.length === 0) return;

  const opcionesObservador = {
    root: null,
    rootMargin: '-45% 0px -50% 0px',
    threshold: 0,
  };

  const observador = new IntersectionObserver((entradas) => {
    entradas.forEach((entrada) => {
      if (!entrada.isIntersecting) return;

      const idSeccionVisible = entrada.target.getAttribute('id');
      marcarEnlaceActivo(idSeccionVisible, enlacesNavegacion);
    });
  }, opcionesObservador);

  secciones.forEach((seccion) => observador.observe(seccion));
}

/**
 * Quita la clase "is-active" de todos los enlaces y la agrega
 * únicamente al que corresponde a la sección visible.
 */
function marcarEnlaceActivo(idSeccion, enlacesNavegacion) {
  enlacesNavegacion.forEach((enlace) => {
    const perteneceASeccion = enlace.dataset.section === idSeccion;
    enlace.classList.toggle('is-active', perteneceASeccion);
  });
}
