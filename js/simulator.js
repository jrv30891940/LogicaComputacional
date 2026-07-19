/**
 * simulator.js
 * -----------------------------------------------------------
 * Responsable únicamente de ejecutar, en el navegador, la misma
 * lógica que describe el pseudocódigo de la sección "Pseudocódigo":
 * simula la venta de asientos entre servidores bajo los tres
 * modelos de consistencia (fuerte, eventual, débil) y muestra el
 * resultado como si fuera la consola de PSeInt.
 *
 * El generador de números "aleatorios" es el mismo generador
 * congruencial lineal (LCG) usado en el pseudocódigo, para ser
 * fiel al algoritmo original (no usa Math.random()).
 * -----------------------------------------------------------
 */

document.addEventListener('DOMContentLoaded', () => {
  const botonEjecutar = document.getElementById('btnEjecutarSimulacion');
  const selectorModelo = document.getElementById('modeloConsistencia');
  const contenedorSalida = document.getElementById('simulatorOutput');

  if (!botonEjecutar || !selectorModelo || !contenedorSalida) return;

  botonEjecutar.addEventListener('click', () => {
    const tipoConsistencia = selectorModelo.value;
    const lineasDeSalida = ejecutarSimulacion(tipoConsistencia);
    renderizarSalida(contenedorSalida, lineasDeSalida);
  });
});

/**
 * Genera el siguiente número pseudoaleatorio a partir de una
 * semilla, usando el mismo generador congruencial lineal (LCG)
 * que el pseudocódigo: semilla <- (semilla * 9301 + 49297) MOD 233280
 * Devuelve un objeto con la nueva semilla para encadenar llamadas.
 */
function siguienteValorPseudoaleatorio(semillaActual) {
  return (semillaActual * 9301 + 49297) % 233280;
}

/**
 * Ejecuta la simulación completa para un modelo de consistencia
 * dado y devuelve un arreglo de líneas de salida, cada una con
 * un tipo ('normal', 'exito', 'alerta', 'titulo', 'separador')
 * para que renderizarSalida() les dé el estilo correspondiente.
 */
function ejecutarSimulacion(tipoConsistencia) {
  const numServidores = 4;
  const numAsientos = 10;
  const umbralIA = 0.7;
  let semilla = 7919;
  let totalVentasExitosas = 0;
  let totalVentasDobles = 0;

  const latenciaServidor = [null]; // índice 0 sin usar, servidores van de 1 a 4
  const prioridadIA = [null];

  // estadoAsientos y bitacoraVentas: matrices [servidor][asiento], 1-indexadas
  const estadoAsientos = crearMatriz(numServidores + 1, numAsientos + 1, 0);
  const bitacoraVentas = crearMatriz(numServidores + 1, numAsientos + 1, 0);

  const lineas = [];

  // INICIALIZACIÓN DE ARREGLOS
  for (let i = 1; i <= numServidores; i++) {
    semilla = siguienteValorPseudoaleatorio(semilla);
    latenciaServidor[i] = 20 + (semilla % (300 - 20 + 1));

    semilla = siguienteValorPseudoaleatorio(semilla);
    const valorTemp = 1 + (semilla % 100);
    prioridadIA[i] = valorTemp / 100;
  }

  lineas.push({ texto: '====================================================', tipo: 'titulo' });
  lineas.push({ texto: '  SIMULACIÓN: CONSISTENCIA EN SISTEMAS DISTRIBUIDOS', tipo: 'titulo' });
  lineas.push({ texto: '====================================================', tipo: 'titulo' });
  lineas.push({ texto: `Modelo seleccionado: ${tipoConsistencia}`, tipo: 'normal' });
  lineas.push({ texto: '----------------------------------------------------', tipo: 'separador' });

  // SIMULACIÓN DE SOLICITUDES DE COMPRA DE ASIENTOS
  for (let k = 1; k <= numAsientos; k++) {
    const asientoSolicitado = k;
    let hayConflicto = false;

    semilla = siguienteValorPseudoaleatorio(semilla);
    let servidorGanador = 1 + (semilla % numServidores);

    semilla = siguienteValorPseudoaleatorio(semilla);
    let servidorPerdedor = 1 + (semilla % numServidores);

    while (servidorPerdedor === servidorGanador) {
      semilla = siguienteValorPseudoaleatorio(semilla);
      servidorPerdedor = 1 + (semilla % numServidores);
    }

    const latenciaMs = (latenciaServidor[servidorGanador] + latenciaServidor[servidorPerdedor]) / 2;

    semilla = siguienteValorPseudoaleatorio(semilla);
    const valorTemp = 1 + (semilla % 100);
    const probabilidadConflicto = valorTemp / 100;

    lineas.push({ texto: '', tipo: 'espacio' });
    lineas.push({
      texto: `Asiento #${asientoSolicitado} solicitado por Servidor ${servidorGanador} y Servidor ${servidorPerdedor}`,
      tipo: 'normal',
    });
    lineas.push({ texto: `Latencia de red promedio: ${latenciaMs} ms`, tipo: 'normal' });

    if (tipoConsistencia === 'FUERTE') {
      procesarConsistenciaFuerte(
        estadoAsientos, bitacoraVentas, servidorGanador, servidorPerdedor,
        asientoSolicitado, lineas
      );
    } else if (tipoConsistencia === 'EVENTUAL') {
      hayConflicto = probabilidadConflicto > umbralIA;
    }

    if (tipoConsistencia === 'FUERTE') {
      if (bitacoraVentas[servidorGanador][asientoSolicitado] === 1) {
        totalVentasExitosas++;
      }
    } else if (tipoConsistencia === 'EVENTUAL') {
      if (hayConflicto) {
        if (prioridadIA[servidorGanador] >= prioridadIA[servidorPerdedor]) {
          estadoAsientos[servidorGanador][asientoSolicitado] = 1;
          estadoAsientos[servidorPerdedor][asientoSolicitado] = 1;
          bitacoraVentas[servidorGanador][asientoSolicitado] = 1;
          totalVentasExitosas++;
          lineas.push({ texto: `-> Conflicto detectado. IA bloqueo al Servidor ${servidorPerdedor}`, tipo: 'exito' });
          lineas.push({ texto: `   Venta asignada al Servidor ${servidorGanador}`, tipo: 'exito' });
        } else {
          estadoAsientos[servidorGanador][asientoSolicitado] = 1;
          estadoAsientos[servidorPerdedor][asientoSolicitado] = 1;
          bitacoraVentas[servidorPerdedor][asientoSolicitado] = 1;
          totalVentasExitosas++;
          lineas.push({ texto: `-> Conflicto detectado. IA bloqueo al Servidor ${servidorGanador}`, tipo: 'exito' });
          lineas.push({ texto: `   Venta asignada al Servidor ${servidorPerdedor}`, tipo: 'exito' });
        }
      } else {
        estadoAsientos[servidorGanador][asientoSolicitado] = 1;
        bitacoraVentas[servidorGanador][asientoSolicitado] = 1;
        totalVentasExitosas++;
        lineas.push({ texto: `-> Sin conflicto detectado. Venta procesada por Servidor ${servidorGanador}`, tipo: 'exito' });
        lineas.push({ texto: '(los demás nodos se sincronizaran eventualmente)', tipo: 'normal' });
      }
    } else {
      // DEBIL: nunca hay verificación, siempre hay venta doble
      estadoAsientos[servidorGanador][asientoSolicitado] = 1;
      estadoAsientos[servidorPerdedor][asientoSolicitado] = 1;
      bitacoraVentas[servidorGanador][asientoSolicitado] = 1;
      bitacoraVentas[servidorPerdedor][asientoSolicitado] = 1;
      totalVentasDobles++;
      lineas.push({ texto: '-> Consistencia DEBIL: no hubo verificacion entre nodos.', tipo: 'alerta' });
      lineas.push({
        texto: `   ALERTA: Asiento ${asientoSolicitado} vendido por AMBOS servidores (venta doble).`,
        tipo: 'alerta',
      });
    }
  }

  // REPORTE FINAL
  lineas.push({ texto: '', tipo: 'espacio' });
  lineas.push({ texto: '====================================================', tipo: 'titulo' });
  lineas.push({ texto: '                REPORTE FINAL', tipo: 'titulo' });
  lineas.push({ texto: '====================================================', tipo: 'titulo' });
  lineas.push({ texto: `Modelo de consistencia usado: ${tipoConsistencia}`, tipo: 'normal' });
  lineas.push({ texto: `Total de asientos procesados: ${numAsientos}`, tipo: 'normal' });
  lineas.push({ texto: `Ventas exitosas sin conflicto: ${totalVentasExitosas}`, tipo: 'normal' });
  lineas.push({ texto: `Ventas dobles detectadas: ${totalVentasDobles}`, tipo: totalVentasDobles > 0 ? 'alerta' : 'normal' });

  if (totalVentasDobles === 0) {
    lineas.push({ texto: 'Resultado: el sistema mantuvo la consistencia correctamente.', tipo: 'exito' });
  } else {
    lineas.push({ texto: 'Resultado: se detectaron fallas de consistencia en el sistema.', tipo: 'alerta' });
  }

  lineas.push({ texto: '', tipo: 'espacio' });
  lineas.push({ texto: 'Bitacora final de ventas por servidor y asiento:', tipo: 'normal' });

  for (let i = 1; i <= numServidores; i++) {
    lineas.push({ texto: `Servidor ${i}: `, tipo: 'normal' });
    for (let j = 1; j <= numAsientos; j++) {
      if (bitacoraVentas[i][j] === 1) {
        lineas.push({ texto: `   Asiento ${j} -> VENDIDO por este servidor`, tipo: 'normal' });
      }
    }
  }

  lineas.push({ texto: '', tipo: 'espacio' });
  lineas.push({ texto: 'Fin de la simulacion.', tipo: 'normal' });

  return lineas;
}

/**
 * Aplica la lógica de consistencia fuerte para un asiento: si ya
 * está vendido, rechaza la solicitud; si no, confirma la venta
 * en todos los nodos de una vez.
 */
function procesarConsistenciaFuerte(estadoAsientos, bitacoraVentas, servidorGanador, servidorPerdedor, asientoSolicitado, lineas) {
  if (estadoAsientos[servidorGanador][asientoSolicitado] === 0) {
    estadoAsientos[servidorGanador][asientoSolicitado] = 1;
    estadoAsientos[servidorPerdedor][asientoSolicitado] = 1;
    bitacoraVentas[servidorGanador][asientoSolicitado] = 1;
    lineas.push({ texto: '-> Consistencia FUERTE: venta confirmada en todos los nodos.', tipo: 'exito' });
    lineas.push({ texto: `   Asiento vendido correctamente por Servidor ${servidorGanador}`, tipo: 'exito' });
  } else {
    lineas.push({ texto: '-> Asiento ya vendido previamente, solicitud rechazada.', tipo: 'alerta' });
  }
}

/**
 * Crea una matriz de "filas" x "columnas" inicializada con un
 * mismo valor por defecto, imitando el Dimension + inicialización
 * del pseudocódigo.
 */
function crearMatriz(filas, columnas, valorInicial) {
  const matriz = [];
  for (let f = 0; f < filas; f++) {
    matriz.push(new Array(columnas).fill(valorInicial));
  }
  return matriz;
}

/**
 * Pinta el arreglo de líneas dentro del contenedor de salida,
 * asignando una clase CSS distinta según el tipo de línea para
 * que se distingan los mensajes de éxito, alerta y títulos.
 */
function renderizarSalida(contenedor, lineas) {
  contenedor.innerHTML = '';

  lineas.forEach((linea) => {
    const elementoLinea = document.createElement('p');
    elementoLinea.classList.add('simulator__line');

    if (linea.tipo === 'espacio') {
      elementoLinea.classList.add('simulator__line--espacio');
      elementoLinea.innerHTML = '&nbsp;';
    } else {
      elementoLinea.classList.add(`simulator__line--${linea.tipo}`);
      elementoLinea.textContent = linea.texto;
    }

    contenedor.appendChild(elementoLinea);
  });

  contenedor.scrollTop = 0;
}
