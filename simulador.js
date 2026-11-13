"use strict";

const form = document.querySelector("#parametros");
const aviso = document.querySelector("#aviso");
const resultados = document.querySelector("#resultados");
const formato = new Intl.NumberFormat("es-BO", { maximumFractionDigits: 4 });
const numero = (n) => formato.format(n);
const cumple = (f) => f.errorV < 0.5 && f.errorY < 5;

function completar(datos) {
  for (const [clave, valor] of Object.entries(datos)) form.elements[clave].value = valor;
}

function llenarTabla(id, filas) {
  const cuerpo = document.querySelector(id + " tbody");
  cuerpo.replaceChildren(...filas.map((valores) => {
    const fila = document.createElement("tr");
    for (const valor of valores) fila.insertCell().textContent = typeof valor === "number" ? numero(valor) : valor;
    return fila;
  }));
}

function graficar(id, filas, numerica, exacta) {
  const destino = document.getElementById(id);
  const w = 470, h = 205, izq = 63, sup = 12, der = w - 20, inf = h - 26;
  const tMax = filas.at(-1).t;
  const min = Math.min(0, ...filas.map(f => Math.min(f[numerica], f[exacta])));
  const max = Math.max(1e-12, ...filas.map(f => Math.max(f[numerica], f[exacta])));
  const x = (t) => izq + (der - izq) * (t / tMax);
  const y = (v) => inf - (inf - sup) * ((v - min) / (max - min));
  const puntos = (clave) => filas.map(f => x(f.t).toFixed(2) + "," + y(f[clave]).toFixed(2)).join(" ");
  let rejilla = "";
  for (let i = 0; i <= 4; i++) {
    const t = i / 4 * tMax, v = min + i / 4 * (max - min);
    rejilla += '<line x1="' + izq + '" x2="' + der + '" y1="' + y(v) + '" y2="' + y(v) + '" stroke="#e4e2db"/>' +
      '<text x="' + (izq - 6) + '" y="' + (y(v) + 4) + '" text-anchor="end">' + numero(v) + '</text>' +
      '<text x="' + x(t) + '" y="' + (inf + 17) + '" text-anchor="middle">' + numero(t) + '</text>';
  }
  const etiqueta = id === "altura" ? "Altura en función del tiempo" : "Velocidad en función del tiempo";
  destino.innerHTML = '<svg viewBox="0 0 ' + w + ' ' + h + '" role="img" aria-label="' + etiqueta + ' con Euler y solución exacta">' +
    '<g fill="#4e4d45" font-size="11">' + rejilla + '</g><path d="M' + izq + ' ' + sup + 'V' + inf + 'H' + der + '" fill="none" stroke="#54544a"/>' +
    '<polyline points="' + puntos(exacta) + '" stroke="#252522" stroke-width="2.4" fill="none"/>' +
    '<polyline points="' + puntos(numerica) + '" stroke="#646457" stroke-width="2.4" stroke-dasharray="6 4" fill="none"/></svg>';
}

function actualizar() {
  aviso.hidden = true;
  const datos = Object.fromEntries([...form.querySelectorAll("input")].map(c => [c.name, c.valueAsNumber]));
  try {
    const filas = Euler.simular(datos);
    const f = filas.at(-1);
    document.getElementById("resumen").textContent =
      "A los " + numero(f.t) + " s, Euler da " + numero(f.v) + " m/s y " + numero(f.y) +
      " m. La solución exacta da " + numero(f.exactaV) + " m/s y " + numero(f.exactaY) +
      " m. El paso seleccionado " + (cumple(f) ? "cumple" : "queda fuera de") + " las tolerancias.";
    graficar("velocidad", filas, "v", "exactaV");
    graficar("altura", filas, "y", "exactaY");
    llenarTabla("#iteraciones", filas.map(r => [r.t, r.v, r.exactaV, r.errorV, r.y, r.exactaY, r.errorY]));
    const comparacion = [datos.paso, datos.paso / 2, datos.paso / 4].map(paso => {
      if (Math.ceil(datos.tiempo / paso) > 1000) return [paso, "Más de 1000", "—", "—", "—", "—", "—"];
      const historial = Euler.simular({ ...datos, paso });
      const r = historial.at(-1);
      return [paso, historial.length - 1, r.v, r.errorV, r.y, r.errorY, cumple(r) ? "Sí" : "No"];
    });
    llenarTabla("#comparacion", comparacion);
    resultados.hidden = false;
  } catch (error) {
    resultados.hidden = true;
    aviso.textContent = error.message;
    aviso.hidden = false;
  }
}

form.addEventListener("submit", (event) => { event.preventDefault(); actualizar(); });
document.querySelector("#restaurar").addEventListener("click", () => { completar(Euler.base); actualizar(); });
completar(Euler.base);
actualizar();
