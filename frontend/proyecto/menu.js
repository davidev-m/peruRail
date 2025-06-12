
// acultar fecha de retorno
function toggleRetorno(mostrar) {
    document.getElementById("retorno_div").style.display = mostrar ? "block" : "none";

}


// Destinos posibles por origen
const destinosPorOrigen = {
    "ciudad de cusco": ["AREQUIPA", "MACHUPICCHU", "PUNO"],
    "machupicchu": ["CIUDAD DE CUSCO", "OLLANTAYTAMBO", "HIDROELECTRICA", "URUBAMBA"],
    "urubamba": ["MACHUPICCHU"],
    "ollantaytambo": ["MACHUPICCHU"],
    "hidroelectrica": ["MACHUPICCHU"],
    "puno": ["CIUDAD DE CUSCO", "AREQUIPA"],
    "arequipa": ["CIUDAD DE CUSCO", "PUNO"]
};

function actualizarDestino() {
    const origen = document.getElementById("origen").value;
    const destino = document.getElementById("destino");

    // Limpiar opciones anteriores
    destino.innerHTML = '<option value="">DESTINO</option>';

    if (origen && destinosPorOrigen[origen]) {
        destinosPorOrigen[origen].forEach(dest => {
            const option = document.createElement("option");
            option.value = dest.toLowerCase();
            option.textContent = dest;
            destino.appendChild(option);
        });
    }

    // Evento cuando el destino cambia
    destino.addEventListener("change", function () {
        const destinoSeleccionado = destino.value;
        actualizarCamposFormulario(origen, destinoSeleccionado);
    });
}

function actualizarCamposFormulario(origenValor, destinoValor) {
    const campoTren = document.getElementById("campoTren");
    const retornoFecha = document.getElementById("retorno_div");
    const pasajeros = document.getElementById("pasajeros");
    const ida_retorno = document.getElementById("ida_retorno");

    // Convertir valores a minúsculas
    origenValor = origenValor.toLowerCase();
    destinoValor = destinoValor.toLowerCase();

    // Lógica específica basada en combinaciones origen-destino
    if (
        (origenValor === "arequipa" && (destinoValor === "ciudad de cusco" || destinoValor === "puno")) ||
        (origenValor === "puno" && destinoValor === "arequipa")
    ) {
        // Ocultar todo
        campoTren.style.display = "none";
        retornoFecha.style.display = "none";
        pasajeros.style.display = "none";
        ida_retorno.style.display = "none";
    } else if (origenValor === "puno" && destinoValor === "ciudad de cusco") {
        // Mostrar tren, ocultar los demás
        campoTren.style.display = "block";
        retornoFecha.style.display = "none";
        pasajeros.style.display = "none";
        ida_retorno.style.display = "none";
    } else if (origenValor === "ciudad de cusco" && destinoValor === "puno") {
        campoTren.style.display = "block";
        retornoFecha.style.display = "none";
        pasajeros.style.display = "none";
        ida_retorno.style.display = "none";
    } else if (origenValor === "ciudad de cusco" && destinoValor === "arequipa") {
        // Mostrar tren, ocultar los demás
        campoTren.style.display = "none";
        retornoFecha.style.display = "none";
        pasajeros.style.display = "none";
        ida_retorno.style.display = "none";
    } else if (((origenValor === "ciudad de cusco" || origenValor === "urubamba" || origenValor === "ollantaytambo" || origenValor == "hidroelectrica") && destinoValor === "machupicchu") ||
        (origenValor === "machupicchu" && (destinoValor === "ciudad de cusco" || destinoValor === "urubamba" || destinoValor === "ollantaytambo" || destinoValor === "hidroelectrica"))) {
        // Mostrar tren, ocultar los demás
        campoTren.style.display = "none";
        retornoFecha.style.display = "block";
        pasajeros.style.display = "block";
        ida_retorno.style.display = "block";

    }
    else {
        // Mostrar todos los campos por defecto
        campoTren.style.display = "block";
        retornoFecha.style.display = "block";
        pasajeros.style.display = "block";
        ida_retorno.style.display = "block";
    }


    actualizarCalendario(origenValor, destinoValor); // Actualizar el calendario con las fechas disponibles

}



// calidar cantidad de pasajeros.

let adultos = 1;
let ninos = 0;

function mostrarSelectorPasajeros() {
    document.getElementById("selectorPasajeros").style.display = "block";
}

function cerrarSelector() {
    document.getElementById("selectorPasajeros").style.display = "none";
}

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

    // Actualizar  valores en la interfaz
    document.getElementById("adultosCount").innerText = adultos;
    document.getElementById("ninosCount").innerText = ninos;
    document.getElementById("resumenPasajeros").value = `${adultos} Adulto${adultos > 1 ? 's' : ''}, ${ninos} Niños${ninos !== 1 ? 's' : ''}`;

    //Actualizar input ocultos
    document.getElementById("adultosInput").value = adultos;
    document.getElementById("ninosInput").value = ninos;

}

// Ocultar si se hace clic fuera del cuadro

document.addEventListener("click", function (event) {
    const selector = document.getElementById("selectorPasajeros");
    const resumen = document.getElementById("resumenPasajeros");
    if (selector && resumen) {
        if (!selector.contains(event.target) && event.target !== resumen) {
            cerrarSelector();
        }
    }
});

// fechas de ida y retorno ----------------

const fechasDisponibles = {
    //funcion importante no usada , no borrar
};

let flatpickrInstance = null;


function actualizarCalendario(origen, destino) {
    const key = `${origen}|${destino}`;
    // const fechas = fechasDisponibles[key] || [];  ---> funcion que es util para fechas no borrra ----> 

    // Destruir instancia anterior si existe
    if (flatpickrInstance) {
        flatpickrInstance.destroy();
    }

    // Determinar días permitidos por origen
    let diasPermitidos = [];
    switch (origen) {
        case "puno":
            diasPermitidos = [5]; // viernes
            break;
        case "arequipa":
            diasPermitidos = [0]; // domingo
            break;
        case "ciudad de cusco":
            //diasPermitidos = [4]; // jueves
            if (origen === "ciudad de cusco" && destino === "machupicchu") {
                diasPermitidos = [0, 1, 2, 3, 4, 5, 6]; // todos los días
            } else {
                diasPermitidos = [4]; // jueves
            }
            break;
        case "machupicchu":
            diasPermitidos = [0, 1, 2, 3, 4, 5, 6]; // todos los días
            break;
        default:
            diasPermitidos = [0, 1, 2, 3, 4, 5, 6]; // por defecto permitir todos
            break;
    }

    // Generar fechas válidas hasta fin de año
    const hoy = new Date();
    const finDeAnio = new Date("2025-12-31"); //puede modificar el año según sea necesario
    const fechasValidas = [];

    for (let d = new Date(hoy); d <= finDeAnio; d.setDate(d.getDate() + 1)) {
        if (diasPermitidos.includes(d.getDay())) {
            fechasValidas.push(new Date(d));
        }
    }

    flatpickrInstance = flatpickr("#fecha_ida", {
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

    flatpickrInstance = flatpickr("#fecha_retorno", {
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