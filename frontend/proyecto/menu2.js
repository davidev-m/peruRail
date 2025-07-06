// menu2.js
// Lógica de selección de trenes (Ida y Vuelta + Solo Ida)

// Espera a que el DOM cargue
document.addEventListener("DOMContentLoaded", function () {
    // ========================
    // OBTENER DATOS DEL FORMULARIO 1
    // ========================
    const datosForm1 = JSON.parse(sessionStorage.getItem("form1"));
    if (!datosForm1) {
        alert("No se encontraron datos de la búsqueda. Volviendo al paso 1.");
        return window.location.href = "menu.html";
    }

    const { origen, destino, tipo, fechaIda, fechaRet, adultos, ninos } = datosForm1;

    // ========================
    // REFERENCIAS A DOM
    // ========================
    const origenDestinoResumen = document.getElementById("origenDestinoResumen");
    const fechasResumen = document.getElementById("fechasResumen");
    const barraFechas = document.getElementById("barraFechas");
    const listaTrenes = document.getElementById("listaTrenes");
    const barraInferior = document.getElementById("barraInferior");
    const colIda = document.getElementById("colIda");
    const colRetorno = document.getElementById("colRetorno");
    const colTotal = document.getElementById("colTotal");

    // ========================
    // UTILS
    // ========================
    function capitalizar(txt) {
        return txt.split(" ").map(p => p[0].toUpperCase() + p.slice(1)).join(" ");
    }
    function parseFechaLocal(str) {
        const [year, month, day] = str.split("-").map(Number);
        return new Date(year, month - 1, day);
    }
    function formatearFecha(iso) {
        const d = parseFechaLocal(iso);
        return d.toLocaleDateString("es-PE", { weekday: "short", day: "numeric", month: "short" });
    }

    // Rellenar cabecera
    origenDestinoResumen.textContent = `${capitalizar(origen)} → ${capitalizar(destino)}`;
    fechasResumen.textContent = (tipo === "ida_vuelta")
        ? `${formatearFecha(fechaIda)} – ${formatearFecha(fechaRet)}`
        : formatearFecha(fechaIda);

    // Fase inicial
    let fase = (tipo === "ida_vuelta") ? "ida" : "solo_ida";
    let trenIda = null;
    let trenRetorno = null;

    // ========================
    // RENDERIZAR BARRA DE FECHAS [-2…+4]
    // ========================
    (function initBarraFechas() {
        barraFechas.innerHTML = "";
        const base = parseFechaLocal(fechaIda);
        for (let i = -2; i <= 4; i++) {
            const f = new Date(base);
            f.setDate(f.getDate() + i);
            const btn = document.createElement("button");
            btn.type = "button"; // evita submit involuntario
            btn.className = "boton-fecha";
            btn.textContent = formatearFecha(f.toISOString().split("T")[0]);
            btn.dataset.fecha = f.toISOString().split("T")[0];
            if (i === 0) btn.classList.add("activo");
            btn.addEventListener("click", () => onClickFecha(btn.dataset.fecha));
            barraFechas.appendChild(btn);
        }
    })();

    // ========================
    // CLICK FECHA  ---> se modificara con  el backend original
    // ========================
    function onClickFecha(fechaSel) {
        document.querySelectorAll(".boton-fecha").forEach(b => b.classList.remove("activo"));
        const activo = [...barraFechas.children].find(b => b.dataset.fecha === fechaSel);
        if (activo) activo.classList.add("activo");
        cargarTrenes(fechaSel, fase === "retorno");
    }

    // ========================
    // CARGAR TRENES DESDE BACKEND
    // ========================
    function cargarTrenes(fecha, esRetorno) {
        // si cambio a fase retorno/desocultar/id reset lista
        if (esRetorno) {
            barraFechas.style.display = "none";
            listaTrenes.innerHTML = "";
        } else {
            barraFechas.style.display = "flex";
        }
        const payload = {
            origen: esRetorno ? destino : origen,
            destino: esRetorno ? origen : destino,
            tipo,
            fechaIda: fecha,
            //fechaRet: esRetorno ? fecha : fechaRet,
            adultos,
            ninos
        };
        fetch("tren.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        })
            .then(r => r.json())
            .then(data => mostrarTrenes(data))
            .catch(() => listaTrenes.textContent = "Error al obtener trenes.");

        console.log("Enviando a tren.php:", payload);
    }

    // ========================
    // RENDER TRENES
    // ========================
    function mostrarTrenes(trenes) {
        listaTrenes.innerHTML = "";
        if (!Array.isArray(trenes) || trenes.length === 0) {
            return listaTrenes.textContent = "No hay trenes disponibles.";
        }

        // Agrupar trenes por hora de salida
        const grupos = {};
        trenes.forEach((t, i) => {
            if (!grupos[t.hora_salida]) grupos[t.hora_salida] = [];
            grupos[t.hora_salida].push({ ...t, _idx: i });
        });

        // Para cada hora de salida: crear una fila con 3 columnas
        Object.entries(grupos).forEach(([hora, trenesMismaHora]) => {
            const fila = document.createElement("div");
            fila.className = "tren-card";

            // Columna 1: horario general
            const info = trenesMismaHora[0]; // tomar cualquier tren del grupo
            const col1 = document.createElement("div");
            col1.className = "c-col horario";
            col1.innerHTML = `
          <div class="salida">${info.hora_salida}</div>
          <div><strong>Duración:</strong> ${info.duracion}</div>
          <div><strong>Estaciones:</strong> ${info.estaciones.join(" → ")}</div>
          <div class="llegada">${info.hora_llegada}</div>
        `;
            fila.appendChild(col1);


            // Columna 2 y 3: máximo 2 trenes diferentes
            trenesMismaHora.slice(0, 2).forEach((trenData, idx) => {
                const col = document.createElement("div");
                col.className = "c-col detalles";
                col.innerHTML = `
            <div class="nombre">${trenData.tren.nombre}</div>
            <div class="precio">USD ${trenData.tren.precio.toFixed(2)}</div>
          `;

                // detalle individual
                const detalle = document.createElement("div");
                detalle.className = "tren-detalle";
                detalle.id = `detalle-${hora}-${idx}`;
                detalle.style.display = "none";
                detalle.innerHTML = `<div>
            <div><strong>Ruta:</strong> ${trenData.estaciones[0]} → ${trenData.estaciones[1]}</div>
            <div><strong>Servicio:</strong> ${trenData.tren.nombre}</div>
            <div><strong>Precio:</strong> USD ${trenData.tren.precio.toFixed(2)}</div>
            <div><strong>Descripción:</strong> Asientos amplios, música, snacks.</div>
            </div>
          `;

                // evento click individual por tren
                col.addEventListener("click", () => {
                    const detalle = document.getElementById(`detalle-${hora}-${idx}`); /// modificado , agregado.
                    detalle.style.display = detalle.style.display === "block" ? "none" : "block";
                    if (fase === "solo_ida") {
                        trenIda = trenData;
                        actualizarBarraInferiorSoloIda();
                    } else if (fase === "ida") {
                        trenIda = trenData;
                        trenRetorno = null;
                        actualizarBarraInferiorIdaVuelta();
                    } else if (fase === "retorno") {
                        trenRetorno = trenData;
                        actualizarBarraInferiorIdaVuelta();
                    }
                });

                fila.appendChild(col);
                listaTrenes.appendChild(fila); // solo 1 vez por fila
                listaTrenes.appendChild(detalle);
            });

            //listaTrenes.appendChild(fila); // solo 1 vez por fila
        });
    }

    // ========================
    // BARRA INFERIOR SOLO IDA
    // ========================
    function actualizarBarraInferiorSoloIda() {
        if (!trenIda) return barraInferior.style.display = "none";
        barraInferior.style.display = "flex";
        colIda.innerHTML = `
        <strong>IDA</strong><br>
        ${trenIda.tren.nombre}<br>
        ${trenIda.hora_salida} - ${trenIda.hora_llegada}
      `;
        const total = trenIda.tren.precio.toFixed(2);
        const totalSoles = (trenIda.tren.precio * 3.55).toFixed(2);
        colTotal.innerHTML = `
        <strong>$ ${total}</strong><br>
        S/ ${totalSoles}<br>
        <button type="button">CONTINUAR &gt;</button>
      `;
    }

    // ========================
    // BARRA INFERIOR IDA & VUELTA
    // ========================
    function actualizarBarraInferiorIdaVuelta() {
        barraInferior.style.display = "flex";
        // Col 1: IDA
        colIda.innerHTML = trenIda ? `
        <strong>IDA</strong><br>
        ${trenIda.tren.nombre}<br>
        ${trenIda.hora_salida} - ${trenIda.hora_llegada}
      ` : `<em>Selecciona tren de ida</em>`;
        colIda.style.cursor = trenIda ? "pointer" : "default";
        colIda.onclick = trenIda ? () => {
            fase = "ida";
            cargarTrenes(fechaIda, false);
        } : null;
        // Col 2: Retorno

        if (trenIda && !trenRetorno && fase === "ida") {
            colRetorno.innerHTML = `<button type="button" class="btn-amarillo">Seleccionar retorno</button>`;
            colRetorno.querySelector("button").onclick = () => {
                fase = "retorno"; //  CAMBIAR FASE AQUÍ
                cargarTrenes(fechaRet, true); // cargar trenes de retorno
            };
        }
        else if (fase === "retorno" && trenRetorno) {
            colRetorno.innerHTML = `
          <strong>RETORNO</strong><br>
          ${trenRetorno.tren.nombre}<br>
          ${trenRetorno.hora_salida} - ${trenRetorno.hora_llegada}
        `;
        } else {
            colRetorno.innerHTML = `<em>Seleccione retorno</em>`;
        }


        // Col 3: Total + CONTINUAR
        if (trenIda && trenRetorno) {
            const totalUSD = (trenIda.tren.precio + trenRetorno.tren.precio).toFixed(2);
            const totalS = (totalUSD * 3.55).toFixed(2);
            colTotal.innerHTML = `
          <strong>Total</strong><br>
          $${totalUSD} / S/ ${totalS}<br>
          <button type="button">CONTINUAR &gt;</button>
        `;
        } else {
            // si aún falta retorno, dejamos espacio
            if (!trenRetorno) colTotal.innerHTML = `<em>Total...</em>`;
        }
    }

    // ========================
    // INICIALIZA CARGA INICIAL
    // ========================
    cargarTrenes(fechaIda, false);



});
