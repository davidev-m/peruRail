// Ocultar o mostrar el campo de fecha de retorno según el tipo de viaje seleccionado
function toggleRetorno(mostrar) {
    document.getElementById("retorno_div").style.display = mostrar ? "block" : "none";
}

/**
 * Actualiza el campo <select> de destino en base al origen seleccionado.
 * Llama a PHP para obtener los destinos válidos y los agrega dinámicamente.
 */
function actualizarDestino() {
    const origen = document.getElementById("origen").value;
    const destino = document.getElementById("destino");

    // Limpiar las opciones anteriores
    destino.innerHTML = '<option value="">DESTINO</option>';

    // Obtener destinos desde el backend
    obtenerDestinosDesdePHP(origen).then(destinos => {
        if (Array.isArray(destinos)) {
            destinos.forEach(dest => {
                const option = document.createElement("option");
                option.value = dest.toLowerCase();
                option.textContent = dest.toUpperCase();
                destino.appendChild(option);
            });
        }
    });
}

// Evento que se activa cuando se cambia el destino seleccionado
document.getElementById("destino").addEventListener("change", function () {
    const origen = document.getElementById("origen").value;
    const destinoSeleccionado = this.value;
    actualizarCamposFormulario(origen, destinoSeleccionado);
});

/**
 * Muestra u oculta campos del formulario según las reglas de origen y destino.
 * También llama a funciones auxiliares para configurar calendario y verificar ida/vuelta.
 */
function actualizarCamposFormulario(origenValor, destinoValor) {
    const campoTren = document.getElementById("campoTren");
    const retornoFecha = document.getElementById("retorno_div");
    const pasajeros = document.getElementById("pasajeros");
    const ida_retorno = document.getElementById("ida_retorno");

    const origen = origenValor.toLowerCase();
    const destino = destinoValor.toLowerCase();

    // Reglas de visibilidad de campos según ruta
    if (
        (origen === "arequipa" && (destino === "ciudad de cusco" || destino === "puno")) ||
        (origen === "puno" && destino === "arequipa")
    ) {
        campoTren.style.display = "none";
        retornoFecha.style.display = "none";
        pasajeros.style.display = "none";
        ida_retorno.style.display = "none";
    } else if (origen === "puno" && destino === "ciudad de cusco") {
        campoTren.style.display = "block";
        retornoFecha.style.display = "none";
        pasajeros.style.display = "none";
        ida_retorno.style.display = "none";
    } else if (origen === "ciudad de cusco" && destino === "puno") {
        campoTren.style.display = "block";
        retornoFecha.style.display = "none";
        pasajeros.style.display = "none";
        ida_retorno.style.display = "none";
    } else if (origen === "ciudad de cusco" && destino === "arequipa") {
        campoTren.style.display = "none";
        retornoFecha.style.display = "none";
        pasajeros.style.display = "none";
        ida_retorno.style.display = "none";
    } else if (
        ((["ciudad de cusco", "urubamba", "ollantaytambo", "hidroelectrica"].includes(origen)) && destino === "machu picchu") ||
        (origen === "machu picchu" && ["ciudad de cusco", "urubamba", "ollantaytambo", "hidroelectrica"].includes(destino))
    ) {
        campoTren.style.display = "none";
        retornoFecha.style.display = "block";
        pasajeros.style.display = "block";
        ida_retorno.style.display = "block";
    } else {
        campoTren.style.display = "block";
        retornoFecha.style.display = "block";
        pasajeros.style.display = "block";
        ida_retorno.style.display = "block";
    }

    // Verificar si hay ruta de ida y vuelta
    verificarIdaVuelta(origen, destino).then((puedeVolver) => {
        if (!puedeVolver) {
            retornoFecha.style.display = "none";
            ida_retorno.style.display = "none";
        }
    });

    // Obtener días válidos desde PHP y configurar el calendario
    obtenerFechasDesdePHP(origen, destino).then((dias) => {
        if (Array.isArray(dias) && dias.length > 0) {
            configurarCalendarioDesdePHP(dias);
        }
    });
}

// Instancias globales para los calendarios
let flatpickrIda = null;
let flatpickrRetorno = null;

/**
 * Configura los calendarios Flatpickr para las fechas de ida y retorno
 * según los días permitidos recibidos desde el backend.
 */
function configurarCalendarioDesdePHP(diasPermitidos) {
    // Destruir instancias anteriores si existen
    if (flatpickrIda) flatpickrIda.destroy();
    if (flatpickrRetorno) flatpickrRetorno.destroy();

    const hoy = new Date();
    const finDeAnio = new Date("2025-12-31");
    const fechasValidas = [];

    for (let d = new Date(hoy); d <= finDeAnio; d.setDate(d.getDate() + 1)) {
        if (diasPermitidos.includes(d.getDay())) {
            fechasValidas.push(new Date(d));
        }
    }

    // Inicializar calendario de ida
    flatpickrIda = flatpickr("#fecha_ida", {
        dateFormat: "Y-m-d",
        minDate: "today",
        maxDate: "2025-12-31",
        enable: fechasValidas,
        locale: {
            firstDayOfWeek: 1,
            weekdays: {
                shorthand: ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"],
                longhand: ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"]
            },
            months: {
                shorthand: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"],
                longhand: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"]
            }
        }
    });

    // Inicializar calendario de retorno
    flatpickrRetorno = flatpickr("#fecha_retorno", {
        dateFormat: "Y-m-d",
        minDate: "today",
        maxDate: "2025-12-31",
        enable: fechasValidas,
        locale: {
            firstDayOfWeek: 1,
            weekdays: {
                shorthand: ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"],
                longhand: ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"]
            },
            months: {
                shorthand: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"],
                longhand: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"]
            }
        }
    });
}

/**
 * Verifica si existe una ruta de ida y vuelta entre dos ciudades.
 * Llama a la API que consulta la base de datos vía PHP.
 */
async function verificarIdaVuelta(origen, destino) {
    try {
        const response = await fetch(`api_rutas.php?accion=idaVuelta&origen=${encodeURIComponent(origen)}&destino=${encodeURIComponent(destino)}`);
        const data = await response.json();
        console.log("¿Existe ruta de ida y vuelta?:", data);
        return data;
    } catch (error) {
        console.error("Error al verificar ida y vuelta:", error);
        return false;
    }
}

// ========================
// MANEJO DE PASAJEROS
// ========================

let adultos = 1;
let ninos = 0;

/**
 * Muestra el selector de cantidad de pasajeros.
 */
function mostrarSelectorPasajeros() {
    document.getElementById("selectorPasajeros").style.display = "block";
}

/**
 * Cierra el selector de pasajeros.
 */
function cerrarSelector() {
    document.getElementById("selectorPasajeros").style.display = "none";
}

/**
 * Incrementa o disminuye el número de pasajeros (adultos o niños)
 * según el tipo y el valor del cambio.
 */
function cambiarPasajero(tipo, cambio) {
    let total = adultos + ninos;

    if (tipo == 'adultos') {
        if ((adultos + cambio >= 1) && (adultos + cambio + ninos <= 11)) {
            adultos += cambio;
        }
    } else if (tipo === 'ninos') {
        if ((ninos + cambio >= 0) && (adultos + ninos + cambio <= 11)) {
            ninos += cambio;
        }
    }

    // Actualizar interfaz
    document.getElementById("adultosCount").innerText = adultos;
    document.getElementById("ninosCount").innerText = ninos;
    document.getElementById("resumenPasajeros").value = `${adultos} Adulto${adultos > 1 ? 's' : ''}, ${ninos} Niños${ninos !== 1 ? 's' : ''}`;
    document.getElementById("adultosInput").value = adultos;
    document.getElementById("ninosInput").value = ninos;
}

// Oculta el selector de pasajeros al hacer clic fuera de él
document.addEventListener("click", function (event) {
    const selector = document.getElementById("selectorPasajeros");
    const resumen = document.getElementById("resumenPasajeros");
    if (selector && resumen && !selector.contains(event.target) && event.target !== resumen) {
        cerrarSelector();
    }
});

// ========================
// FUNCIONES AUXILIARES PARA CONSULTAS A PHP
// ========================

/**
 * Consulta a la API PHP para obtener los destinos válidos según el origen.
 */
function obtenerDestinosDesdePHP(origen) {
    return fetch(`api_rutas.php?accion=destinos&origen=${encodeURIComponent(origen)}`)
        .then(response => response.json());
}

/**
 * Consulta los días disponibles según la ruta, y los convierte a índices de día (0=Domingo, ..., 6=Sábado).
 */
function obtenerFechasDesdePHP(origen, destino) {
    return fetch(`api_rutas.php?accion=fechaDisponible&origen=${encodeURIComponent(origen)}&destino=${encodeURIComponent(destino)}`)
        .then(response => response.json())
        .then(data => {
            const mapaDias = {
                "domingo": 0,
                "lunes": 1,
                "martes": 2,
                "miércoles": 3,
                "jueves": 4,
                "viernes": 5,
                "sábado": 6,
                "todos los dias": [0, 1, 2, 3, 4, 5, 6]
            };
            if (typeof data === "string") {
                const dias = data.toLowerCase().split(/,\s*/).flatMap(d => mapaDias[d.trim()] ?? []);
                return [...new Set(dias)];
            }
            return [];
        });
}


// Llamar a idaVuelta desde PHP
function verificarIdaVuelta(origen, destino) {
    return fetch(`api_rutas.php?accion=idaVuelta&origen=${encodeURIComponent(origen)}&destino=${encodeURIComponent(destino)}`)
        .then(response => response.json());
}

