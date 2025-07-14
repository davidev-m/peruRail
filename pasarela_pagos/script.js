// script.js
let montoTotalParaPagar = 0;

// Espera a que el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    Culqi.publicKey = 'pk_test_MuNmwOi6ip1gVRE3';

    Culqi.options({
        style: {
            logo: 'https://culqi.com/LogoCulqi.png',
        }
    });

    cargarYRenderizarDatos();

    const btn_pagar = document.getElementById('btn-pagar');
    btn_pagar.addEventListener('click', (e) => {
        e.preventDefault();

        if (montoTotalParaPagar > 0) {
            Culqi.settings({
                title: 'Reserva de Viaje',
                currency: 'PEN',
                amount: Math.round(montoTotalParaPagar),
            });
            Culqi.open();
        } else {
            mostrarMensaje('Error: El monto a pagar no es válido.', 'error');
        }
    });
});

// Función que recibe el token luego de Culqi.open()
function culqi() {
    if (Culqi.token) {
        const token = Culqi.token.id;
        const email = Culqi.token.email;
        const amount = Math.round(montoTotalParaPagar);

        console.log('Token de Culqi creado:', token);

        $.ajax({
            url: 'culqi/procesar_pago.php',
            type: 'POST',
            dataType: 'json',
            data: {
                token: token,
                email: email,
                amount: amount,
                description: 'Venta de boletos de viaje'
            },
            success: function(response) {
                console.log('Respuesta del servidor:', response);
                let verificacionJson;

                if (response.object == 'charge') {
                    mostrarMensaje('¡Pago exitoso! Gracias por tu compra.', 'success');
                    guardarReservaYRedirigir(response);

                } else {
                    mostrarMensaje(`Error en el pago: ${response.user_message || response.merchant_message}`, 'error');
                    verificacionJson = { "verificacion": "false" };
                }
                // Mostrar el JSON de verificación en la consola
                console.log("JSON de Verificación:", verificacionJson);

            },
            error: function(xhr) {
                console.error('Error al conectar con el servidor. Respuesta completa:', xhr.responseText);
                mostrarMensaje('Hubo un error al procesar tu pago. Revisa la consola.', 'error');
                
                // Crear y mostrar el JSON de verificación fallida
                const verificacionJson = { "verificacion": "false" };
                console.log("JSON de Verificación:", verificacionJson);
            }
        });

    } else if (Culqi.order) {
        console.log('Objeto Order creado:', Culqi.order);
    } else {
        console.error('Error de Culqi:', Culqi.error);
        mostrarMensaje(`Error de Culqi: ${Culqi.error.user_message}`, 'error');
    }
}

function mostrarMensaje(texto, tipo) {
    const container = document.getElementById('payment-message');
    container.textContent = texto;

    container.className = 'fixed top-5 right-5 p-4 rounded-lg shadow-lg border-l-4';
    if (tipo === 'success') {
        container.classList.add('bg-green-100', 'text-green-800', 'border-green-500');
    } else {
        container.classList.add('bg-red-100', 'text-red-800', 'border-red-500');
    }

    container.classList.remove('hidden');
    setTimeout(() => {
        container.classList.add('hidden');
    }, 5000);
}

async function cargarYRenderizarDatos() {
    try {
        const response = await fetch('../backend/apps/logica/datos_pago_E.php');
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const datos = await response.json();
        renderizarDetalles(datos);
    } catch (error) {
        console.error('Error al cargar los datos del viaje:', error);
        document.body.innerHTML = `
            <div class="text-center p-8">
                <h2 class="text-xl font-bold text-red-600">Error al Cargar Datos</h2>
                <p class="text-gray-600 mt-2">No se pudieron cargar los detalles del pago.</p>
            </div>
        `;
    }
}

function renderizarDetalles(datos) {
    const viajesContainer = document.getElementById('viajes-container');
    const pasajerosBody = document.getElementById('pasajeros-body');
    const totalAmount = document.getElementById('total-amount');

    viajesContainer.innerHTML = '';
    pasajerosBody.innerHTML = '';

    datos.viajes.forEach(viaje => {
        const viajeHtml = `
            <div class="mb-8">
                <div class="bg-gray-200 p-3 rounded-t-lg">
                    <h2 class="text-sm font-bold text-gray-600">${viaje.titulo}</h2>
                </div>
                <div class="overflow-x-auto responsive-table-container">
                    <table class="w-full text-sm text-left text-gray-500">
                        <thead class="text-sm font-semibold text-white uppercase bg-custom-blue">
                            <tr>
                                <th scope="col" class="px-6 py-3">Ruta</th>
                                <th scope="col" class="px-6 py-3">Tren</th>
                                <th scope="col" class="px-6 py-3">Transporte</th>
                                <th scope="col" class="px-6 py-3">Salida</th>
                                <th scope="col" class="px-6 py-3">Llegada</th>
                                <th scope="col" class="px-6 py-3 text-right">Monto</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr class="bg-white border-b">
                                <td data-label="Ruta" class="px-6 py-4 font-medium text-gray-900">${viaje.ruta}</td>
                                <td data-label="Tren" class="px-6 py-4">${viaje.tren}</td>
                                <td data-label="Transporte" class="px-6 py-4">${viaje.transporte}</td>
                                <td data-label="Salida" class="px-6 py-4">${viaje.ida}</td>
                                <td data-label="Llegada" class="px-6 py-4">${viaje.llegada}</td>
                                <td data-label="Monto" class="px-6 py-4 text-right font-semibold">S/ ${viaje.monto}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        `;
        viajesContainer.innerHTML += viajeHtml;
    });

    datos.pasajeros.forEach(pasajero => {
        const pasajeroHtml = `
            <tr class="bg-white border-b">
                <td data-label="Nombre Completo" class="px-6 py-4 font-medium text-gray-900">${pasajero.nombre}</td>
                <td data-label="Número de Documento" class="px-6 py-4">${pasajero.documento}</td>
                <td data-label="Tarifa" class="px-6 py-4">${pasajero.tarifa}</td>
            </tr>
        `;
        pasajerosBody.innerHTML += pasajeroHtml;
    });

    totalAmount.textContent = `S/ ${datos.total *100}`;
    montoTotalParaPagar = parseFloat(datos.total);
}


async function guardarReservaYRedirigir(datosPago) {
    // --- 4. Guardado de Datos de la Reserva ---
    const reservaData = {
        verificacion: true,
        datos_pago: datosPago // Incluye todos los detalles del cargo (ID, monto, fecha, etc.)
    };

    console.log("Enviando datos de reserva al backend:", reservaData);

    try {
        const response = await fetch('../backend/apps/logica/datos_pago_R.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(reservaData)
        });

        if (!response.ok) {
            throw new Error(`Error del servidor al guardar la reserva: ${response.status}`);
        }
        
        const result = await response.json();
        console.log('Respuesta del servidor (guardar reserva):', result);

        if (result.success) {
            // --- 5. Redirección ---
            console.log('Reserva guardada con éxito. Redirigiendo...');
            
            // Guarda la información del pago en sessionStorage para usarla en la siguiente página.
            sessionStorage.setItem('pagoConfirmado', JSON.stringify(datosPago));
            
            // Redirige al usuario a la página de confirmación.
            window.location.href = "../frontend/proyecto/menu.html";
        } else {
            throw new Error(result.error || 'Ocurrió un error desconocido al guardar la reserva.');
        }
    } catch (error) {
        console.error('Error en guardarReservaYRedirigir:', error);
        mostrarMensaje(`Error Crítico: Tu pago fue procesado, pero no se pudo guardar tu reserva. Por favor, contacta a soporte.`, 'error');
    }
}
