// menu2.js
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

    // ========================
    // RELLENAR CABECERA
    // ========================
    function capitalizar(txt) {
        return txt.split(" ").map(p => p[0].toUpperCase() + p.slice(1)).join(" ");
    }
    function formatearFecha(iso) {
        const d = new Date(iso);
        return d.toLocaleDateString("es-PE", { weekday: "short", day: "numeric", month: "short" });
    }

    origenDestinoResumen.textContent = `${capitalizar(origen)} → ${capitalizar(destino)}`;
    fechasResumen.textContent = (tipo === "ida_vuelta")
        ? `${formatearFecha(fechaIda)} – ${formatearFecha(fechaRet)}`
        : formatearFecha(fechaIda);

    // ========================
    // RENDERIZAR BARRA DE FECHAS [-2 … +4]
    // ========================
    (function initBarraFechas() {
        const base = new Date(fechaIda);
        for (let i = -2; i <= 4; i++) {
            const f = new Date(base);
            f.setDate(f.getDate() + i);
            const btn = document.createElement("button");
            btn.className = "boton-fecha";
            btn.textContent = formatearFecha(f.toISOString().split("T")[0]);
            btn.dataset.fecha = f.toISOString().split("T")[0];
            if (i === 0) btn.classList.add("activo");
            btn.addEventListener("click", onClickFecha);
            barraFechas.appendChild(btn);
        }
    })();

    // ========================
    // HANDLER : CLICK EN UNA FECHA
    // ========================
    function onClickFecha(evt) {
        // 1) Marcar activo
        document.querySelectorAll(".boton-fecha").forEach(b => b.classList.remove("activo"));
        evt.currentTarget.classList.add("activo");

        // 2) Pedir trenes al backend para esta fecha
        const selFecha = evt.currentTarget.dataset.fecha;
        fetch("tren.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                origen, destino, tipo,
                fechaIda: selFecha,
                fechaRet: (tipo === "ida_vuelta" ? fechaRet : null),
                adultos, ninos
            })
        })
            .then(r => r.json())
            .then(data => {
                sessionStorage.setItem("trenes", JSON.stringify(data));
                mostrarTrenes(data);
            })
            .catch(err => {
                console.error("Error al cargar trenes:", err);
                listaTrenes.textContent = "Error al obtener trenes.";
            });
    }

    // ========================
    // FUNCIÓN: MOSTRAR TRENES
    // ========================
    function mostrarTrenes(trenes) {
        listaTrenes.innerHTML = "";
        if (!Array.isArray(trenes) || trenes.length === 0) {
            return listaTrenes.textContent = "No hay trenes disponibles.";
        }

        trenes.forEach((t, idx) => {
            const { hora_salida, hora_llegada, duracion, estaciones, tren } = t;
            const { nombre, precio } = tren;

            // tarjeta contenedora
            const card = document.createElement("div");
            card.className = "tren-card";

            // columna 1: horario
            const col1 = document.createElement("div");
            col1.className = "c-col horario";
            col1.innerHTML = `
          <div class="salida">${hora_salida}</div>
          <div><strong>Estaciones:</strong> ${estaciones.join(" → ")}</div>
          <div class="llegada">${hora_llegada}</div>
        `;
            card.appendChild(col1);

            // columna 2: nombre + precio
            const col2 = document.createElement("div");
            col2.className = "c-col detalles";
            col2.innerHTML = `
          <div class="nombre">${nombre}</div>
          <div class="precio">USD ${precio.toFixed(2)}</div>
        `;
            card.appendChild(col2);

            // click para desplegar detalle
            card.addEventListener("click", () => {
                const det = document.getElementById(`detalle-${idx}`);
                det.style.display = (det.style.display === "block") ? "none" : "block";
            });

            // bloque de detalle (inicialmente oculto)
            const detalle = document.createElement("div");
            detalle.className = "tren-detalle";
            detalle.id = `detalle-${idx}`;
            detalle.style.display = "none";
            detalle.innerHTML = `
          <div><strong>Ruta:</strong> ${estaciones[0]} → ${estaciones[1]}</div>
          <div><strong>Servicio:</strong> ${nombre}</div>
          <div><strong>Precio:</strong> USD ${precio.toFixed(2)}</div>
          <div><strong>Descripcion:</strong> <p>Asientos amplios y cómodos
            Música ambiental
            Venta de alimentos y bebidas a bordo
            Equipaje de mano a bordo de 8 kg y 115cm lineales
            Cómodas salas de espera en Cusco y Ollantaytambo (1)
            Almacenamiento de equipaje adicional (2)</p> </div>
        `;

            listaTrenes.appendChild(card);
            listaTrenes.appendChild(detalle);
        });
    }

    // ========================
    // AL CARGAR POR PRIMERA VEZ: disparar click en la fecha activa
    // ========================
    document.querySelector(".boton-fecha.activo")?.click();

    // ========================
    // SCROLL BARRA DE FECHAS
    // ========================
    window.anteriorFecha = () => barraFechas.scrollBy({ left: -100, behavior: "smooth" });
    window.siguienteFecha = () => barraFechas.scrollBy({ left: 100, behavior: "smooth" });
});
