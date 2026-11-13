/* Ascenso vertical con masa y empuje constantes y resistencia lineal. */
(function () {
  "use strict";
  const base = Object.freeze({ masa: 1000, empuje: 15000, gravedad: 9.81, resistencia: 100, tiempo: 20, paso: 2 });

  function simular(datos) {
    const { masa, empuje, gravedad, resistencia, tiempo, paso } = datos;
    if (![masa, empuje, gravedad, resistencia, tiempo, paso].every(Number.isFinite) ||
        masa <= 0 || empuje <= 0 || gravedad < 0 || resistencia < 0 || tiempo <= 0 || paso <= 0)
      throw new Error("Revisa los parámetros. La masa, el empuje, el tiempo y el paso deben ser mayores que cero.");
    const a = empuje / masa - gravedad;
    if (!Number.isFinite(a) || a <= 0) throw new Error("Para simular el despegue, el empuje debe superar al peso.");
    const b = resistencia / masa;
    const n = Math.ceil(tiempo / paso);
    if (n > 1000) throw new Error("Elige un paso mayor o un tiempo menor. El límite es de 1000 iteraciones.");
    let v = 0, y = 0, t = 0;
    const filas = [];
    for (let i = 0; i <= n; i++) {
      const z = b * t;
      const f = -Math.expm1(-z);
      const exactaV = z === 0 ? a * t : a * t * f / z;
      // Serie cerca de cero para evitar restar cantidades casi iguales.
      const exactaY = z < 1e-4
        ? a * t * t * (0.5 - z / 6 + z * z / 24 - z * z * z / 120)
        : a * t * t * (1 - f / z) / z;
      if (![v, y, exactaV, exactaY].every(Number.isFinite))
        throw new Error("Los valores desbordan el cálculo. Revisa la escala de los parámetros.");
      filas.push({ t, v, y, exactaV, exactaY, errorV: Math.abs(v - exactaV), errorY: Math.abs(y - exactaY) });
      if (i === n) break;
      const siguiente = Math.min((i + 1) * paso, tiempo);
      const dt = siguiente - t;
      if (dt * b > 1) throw new Error("Reduce el paso. Con estos parámetros, Euler puede producir oscilaciones.");
      y += dt * v;
      v += dt * (a - b * v);
      t = siguiente;
    }
    return filas;
  }

  const api = { base, simular };
  if (typeof module !== "undefined") module.exports = api;
  else window.Euler = api;
})();
