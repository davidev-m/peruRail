document.addEventListener('DOMContentLoaded', function () {
    // ========================
    // VARIABLES GLOBALES
    // ========================
    // Instancias de Flatpickr para los calendarios de ida y retorno
    let flatpickrIda = null;
    let flatpickrRetorno = null;
    // Contadores de pasajeros
    let adultos = 1;
    let ninos = 0;
    let infantes = 0; // Agregado para manejar infantes

    // ========================
    // FUNCIONES PRINCIPALES
    // ========================

    /**
     * toggleRetorno
     * Muestra u oculta el campo de fecha de retorno según el tipo de viaje.
     * @param {boolean} mostrar - `true` muestra el campo, `false` lo oculta.
     */
    function toggleRetorno(mostrar) {
        document.getElementById("retorno_div").style.display = mostrar ? "block" : "none";
    }

    /*
     * actualizarDestino
     * Limpia el <select> de destino y solicita al backend los destinos válidos
     * para el origen elegido, agregándolos al DOM.
     */
    function actualizarDestino() {
        const origen = document.getElementById("origen").value;
        const destino = document.getElementById("destino");

        // Reiniciar opciones de destino
        destino.innerHTML = '<option value="">DESTINO</option>';

        // Obtener destinos desde el servidor PHP
        obtenerDestinosDesdePHP(origen).then(destinos => {
            if (Array.isArray(destinos)) {
                destinos.forEach(dest => {
                    const opt = document.createElement("option");
                    opt.value = dest.toLowerCase();        // valor en minúsculas
                    opt.textContent = dest.toUpperCase();  // texto en mayúsculas
                    destino.appendChild(opt);
                });
            }
        });
    }

    /**
     * actualizarCamposFormulario
     * Controla la visibilidad de los bloques del formulario (tren, fechas, pasajeros)
     * según la lógica de origen y destino, y luego lanza la configuración del
     * calendario y la verificación de ruta de ida y vuelta.
     * @param {string} origenValor - Ciudad de origen seleccionada.
     * @param {string} destinoValor - Ciudad de destino seleccionada.
     */
    function actualizarCamposFormulario(origenValor, destinoValor) {
        const campoTren = document.getElementById("campoTren");
        const retornoFecha = document.getElementById("retorno_div");
        const pasajeros = document.getElementById("pasajeros");
        const ida_retorno = document.getElementById("ida_retorno");

        // Normalizar cadenas a minúsculas para comparación
        const origen = origenValor.toLowerCase();
        const destino = destinoValor.toLowerCase();

        // ====================
        // LÓGICA DE VISIBILIDAD
        // ====================
        if (
            (origen === "arequipa" && ["ciudad de cusco", "puno"].includes(destino)) ||
            (origen === "puno" && destino === "arequipa")
        ) {
            // Rutas no válidas: ocultar todo
            [campoTren, retornoFecha, pasajeros, ida_retorno].forEach(el => el.style.display = "none");

        } else if (
            (origen === "puno" && destino === "ciudad de cusco") ||
            (origen === "ciudad de cusco" && ["puno", "arequipa"].includes(destino))
        ) {
            // Solo tren sin pasajeros ni retorno
            campoTren.style.display = "block";
            [retornoFecha, pasajeros, ida_retorno].forEach(el => el.style.display = "none");

        } else if (
            (["ciudad de cusco", "urubamba", "ollantaytambo", "hidroelectrica"].includes(origen) && destino === "machu picchu") ||
            (origen === "machu picchu" && ["ciudad de cusco", "urubamba", "ollantaytambo", "hidroelectrica"].includes(destino))
        ) {
            // Ida y vuelta con pasajeros
            campoTren.style.display = "none";
            [retornoFecha, pasajeros, ida_retorno].forEach(el => el.style.display = "block");

        } else {
            // Caso general: mostrar todo
            [campoTren, retornoFecha, pasajeros, ida_retorno].forEach(el => el.style.display = "block");
        }

        // ====================
        // VERIFICAR IDA Y VUELTA
        // ====================
        verificarIdaVuelta(origen, destino).then(puedeVolver => {
            if (!puedeVolver) {
                // Si no hay ruta de vuelta, ocultar campos de retorno
                retornoFecha.style.display = "none";
                ida_retorno.style.display = "none";
            }
        });

        // ====================
        // CONFIGURAR CALENDARIO
        // ====================
        obtenerFechasDesdePHP(origen, destino).then(dias => {
            if (Array.isArray(dias) && dias.length) {
                configurarCalendarioDesdePHP(dias);
            }
        });
    }

    /**
     * configurarCalendarioDesdePHP
     * Inicializa Flatpickr en los inputs de fecha de ida y retorno,
     * habilitando solo los días permitidos que provienen del backend.
     * @param {number[]} diasPermitidos - Índices de días válidos (0-6).
     */
    function configurarCalendarioDesdePHP(diasPermitidos) {
        // Destruir instancias previas
        if (flatpickrIda) flatpickrIda.destroy();
        if (flatpickrRetorno) flatpickrRetorno.destroy();

        // Rango desde hoy hasta fin de ano
        const hoy = new Date(), fin = new Date("2025-12-31");
        const habilitadas = [];
        for (let d = new Date(hoy); d <= fin; d.setDate(d.getDate() + 1)) {
            if (diasPermitidos.includes(d.getDay())) {
                habilitadas.push(new Date(d));
            }
        }

        // Inicializar Flatpickr en ida
        flatpickrIda = flatpickr("#fecha_ida", {
            dateFormat: "Y-m-d",
            minDate: "today",
            maxDate: "2025-12-31",
            enable: habilitadas,
            locale: getFlatpickrLocale()
        });

        // Inicializar Flatpickr en retorno
        flatpickrRetorno = flatpickr("#fecha_retorno", {
            dateFormat: "Y-m-d",
            minDate: "today",
            maxDate: "2025-12-31",
            enable: habilitadas,
            locale: getFlatpickrLocale()
        });
    }

    // ========================
    // FUNCIONES AUXILIARES
    // ========================

    /**
     * Devuelve la configuración de locale para Flatpickr en espanol.
     */
    function getFlatpickrLocale() {
        return {
            firstDayOfWeek: 1,
            weekdays: {
                shorthand: ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"],
                longhand: ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"]
            },
            months: {
                shorthand: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"],
                longhand: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"]
            }
        };
    }

    // ========================
    // MANEJO DE PASAJEROS
    // ========================

    /**
     * Muestra el selector de pasajeros.
     */
    function mostrarSelectorPasajeros() {
        document.getElementById("selectorPasajeros").style.display = "block";
    }

    /**
     * Oculta el selector de pasajeros.
     */
    function cerrarSelector() {
        document.getElementById("selectorPasajeros").style.display = "none";
    }

    /**
     * Ajusta la cantidad de adultos o ninos respetando los límites.
     * Actualiza la interfaz y campos ocultos.
     * @param {string} tipo - 'adultos' o 'ninos'.
     * @param {number} cambio - +1 o -1.
     */
    function cambiarPasajero(tipo, cambio) {
        const total = adultos + ninos + infantes + cambio;

        if (tipo === 'adultos' && adultos + cambio >= 1 && total <= 11) {
            adultos += cambio;

            // Si después de reducir adultos hay más infantes que adultos, ajustamos
            if (infantes > adultos) {
                infantes = adultos;
            }
        }

        if (tipo === 'ninos' && ninos + cambio >= 0 && total <= 11) {
            ninos += cambio;
        }

        if (tipo === 'infantes') {
            const nuevosInfantes = infantes + cambio;
            if (
                nuevosInfantes >= 0 &&
                nuevosInfantes <= adultos && // <-- aquí se impone la restricción
                total <= 11
            ) {
                infantes = nuevosInfantes;
            } else if (nuevosInfantes > adultos) {
                alert("No puede haber más infantes que adultos.");
            }
        }

        document.getElementById("adultosCount").innerText = adultos;
        document.getElementById("ninosCount").innerText = ninos;
        document.getElementById("infantesCount").innerText = infantes;

        document.getElementById("resumenPasajeros").value =
            `${adultos} Adultos, ` +
            `${ninos} Ninos, ` +
            `${infantes} Infantes`;

        document.getElementById("adultosInput").value = adultos;
        document.getElementById("ninosInput").value = ninos;
        document.getElementById("infantesInput").value = infantes;
    }



    // Cerrar selector al hacer clic fuera
    document.addEventListener("click", event => {
        const sel = document.getElementById("selectorPasajeros");
        const res = document.getElementById("resumenPasajeros");
        if (sel && res && !sel.contains(event.target) && event.target !== res) cerrarSelector();
    });

    // ========================
    // PETICIONES AL BACKEND
    // ========================
    const API = 'api_rutas.php';

    /**
     * Obtiene destinos válidos desde el backend.
     * @param {string} origen
     * @returns {Promise<string[]>}
     */
    function obtenerDestinosDesdePHP(origen) {
        return fetch(`${API}?accion=destinos&origen=${encodeURIComponent(origen)}`)
            .then(r => r.json());
    }

    /**
     * Obtiene días disponibles desde el backend y los convierte
     * a índices numéricos (0=domingo,...).
     */
    function obtenerFechasDesdePHP(origen, destino) {
        return fetch(`${API}?accion=fechaDisponible&origen=${encodeURIComponent(origen)}&destino=${encodeURIComponent(destino)}`)
            .then(r => r.json())
            .then(data => {
                const mapa = { domingo: 0, lunes: 1, martes: 2, miércoles: 3, jueves: 4, viernes: 5, sábado: 6, "todos los días": [0, 1, 2, 3, 4, 5, 6] };
                if (typeof data === 'string') {
                    return [...new Set(
                        data.toLowerCase().split(/,\s*/).flatMap(d => Array.isArray(mapa[d.trim()]) ? mapa[d.trim()] : [mapa[d.trim()]])
                    )];
                }
                return [];
            });
    }

    /**
     * Verifica si existe ruta de ida y vuelta en el backend.
     */
    async function verificarIdaVuelta(origen, destino) {
        try {
            const resp = await fetch(`${API}?accion=idaVuelta&origen=${encodeURIComponent(origen)}&destino=${encodeURIComponent(destino)}`);
            return await resp.json();
        } catch { return false; }
    }

    // ========================
    // EVENTOS DE USUARIO
    // ========================
    document.getElementById("origen")?.addEventListener("change", actualizarDestino);
    document.getElementById("destino")?.addEventListener("change", function () {
        actualizarCamposFormulario(
            document.getElementById("origen").value,
            this.value
        );
    });

    /**
     * Envío del formulario principal a tren.php.
     * Guarda datos en sessionStorage y redirige a menu2.html.
     */
    const form = document.getElementById('formularioReserva');
    if (form) form.addEventListener('submit', async e => {
        e.preventDefault();
        const datos = {
            origen: document.getElementById('origen').value,
            destino: document.getElementById('destino').value,
            tipo: document.querySelector('input[name="tipo_viaje"]:checked').value,
            fechaIda: document.getElementById('fecha_ida').value,
            fechaRet: document.getElementById('fecha_retorno').value,
            adultos: parseInt(document.getElementById('adultosInput').value), //modificado
            ninos: parseInt(document.getElementById('ninosInput').value), // modificado
            infantes: parseInt(document.getElementById('infantesInput').value)
        };
        try {
            // ANADIDO: credentials: 'include' para asegurar que la cookie de sesión se envíe
            const res = await fetch('../../backend/apps/logica/tren_logica.php', { 
                method: 'POST', 
                headers: { 'Content-Type': 'application/json' }, 
                body: JSON.stringify(datos),
                credentials: 'include' // <-- ¡ESTO ES CRÍTICO!
            });
            const out = await res.json();
            sessionStorage.setItem('form1', JSON.stringify(datos));
            sessionStorage.setItem('trenes', JSON.stringify(out));
            window.location.href = 'menu2.html';
        } catch (err) {
            console.error('Error al enviar datos:', err);
        }
    });

    // ========================
    // EXPONER FUNCIONES PARA HTML INLINE
    // ========================
    window.toggleRetorno = toggleRetorno;
    window.mostrarSelectorPasajeros = mostrarSelectorPasajeros;
    window.cerrarSelector = cerrarSelector;
    window.cambiarPasajero = cambiarPasajero;
});
