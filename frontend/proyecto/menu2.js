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
        trenes.forEach((t, idx) => {
            const { hora_salida, hora_llegada, duracion, estaciones, tren } = t;
            const card = document.createElement("div");
            card.className = "tren-card";
            card.innerHTML = `
          <div class="c-col horario">
            <div class="salida">${hora_salida}</div>
            <div><strong>Duración:</strong> ${duracion}</div>
            <div><strong>Estaciones:</strong> ${estaciones.join(" → ")}</div>
            <div class="llegada">${hora_llegada}</div>
          </div>
          <div class="c-col detalles">
            <div class="nombre">${tren.nombre}</div>
            <div class="precio">USD ${tren.precio.toFixed(2)}</div>
          </div>
        `;
            // detalle
            const detalle = document.createElement("div");
            detalle.className = "tren-detalle";
            detalle.id = `detalle-${idx}`;
            detalle.style.display = "none";
            detalle.innerHTML = `
          <div><strong>Ruta:</strong> ${estaciones[0]} → ${estaciones[1]}</div>
          <div><strong>Servicio:</strong> ${tren.nombre}</div>
          <div><strong>Precio:</strong> USD ${tren.precio.toFixed(2)}</div>
          <div><strong>Descripción:</strong> Asientos amplios, música y snacks.</div>
        `;
            card.addEventListener("click", () => {
                // alternar detalle
                detalle.style.display = detalle.style.display === "block" ? "none" : "block";
                // asignar selecciones y actualizar barra inferior
                if (fase === "solo_ida") {
                    trenIda = t;
                    actualizarBarraInferiorSoloIda();
                } else if (fase === "ida") {
                    trenIda = t;
                    trenRetorno = null;
                    //fase = "retorno";
                    actualizarBarraInferiorIdaVuelta();
                } else if (fase === "retorno") {
                    trenRetorno = t;
                    actualizarBarraInferiorIdaVuelta();
                }

            });
            listaTrenes.appendChild(card);
            listaTrenes.appendChild(detalle);
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
