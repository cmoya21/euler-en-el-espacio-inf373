# Euler en el espacio

Trabajo individual de **Carlos Angel Moya Choque** para Métodos Numéricos (INF 373).
Docente Brígida Alexandra Carvajal Blanco.

[Simulador en GitHub Pages](https://cmoya21.github.io/euler-en-el-espacio-inf373/)

El ejercicio representa el ascenso vertical de un cohete ficticio durante 20 s. La
masa, el empuje, la gravedad y la resistencia lineal se consideran constantes.
El contexto histórico se inspira en la película *Talentos ocultos* (*Hidden Figures*).

## Ejecución

Descarga el repositorio y abre `index.html` en el navegador. La aplicación funciona
sin instalación ni dependencias externas. Modifica los datos y pulsa **Simular**.

## Modelo y resultados

Con velocidad y altura iniciales cero, el modelo usa `v' = T/m - g - (k/m)v` y
`y' = v`. Euler explícito actualiza ambas variables con la velocidad del inicio del
paso. La solución analítica se evalúa en esos mismos instantes.

Con los datos del enunciado y h = 2 s, a los 20 s Euler da 46,3273 m/s y
574,7272 m. La referencia analítica da 44,8761 m/s y 589,2390 m. Con h = 0,5 s,
los errores absolutos bajan a 0,3541 m/s y 3,5412 m.

- `modelo.js` calcula Euler y la referencia analítica.
- `simulador.js` vincula entradas, resultados, tablas y gráficas.
- `index.html` y `estilo.css` contienen la interfaz.

[Consigna compartida](https://chatgpt.com/share/6af31905-d5ec-83ea-ab3d-6f97975acffe)
