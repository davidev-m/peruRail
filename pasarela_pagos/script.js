// script.js
let montoTotalParaPagar = 0;

// Espera a que el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    Culqi.publicKey = 'pk_test_MuNmwOi6ip1gVRE3';

    Culqi.options({
        style: {
            logo: 'https://www.perurail.com/wp-content/uploads/2024/07/logo-perurail-0.5x-25anos-v2-300x45.png',
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
                amount: Math.round(montoTotalParaPagar * 100),
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
            success: function (response) {
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
            error: function (xhr) {
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

    totalAmount.textContent = `S/ ${datos.total}`;
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
            // --- 5. Mostrar botón PDF ---
            console.log('Reserva guardada con éxito. Mostrando botón PDF...');
            sessionStorage.setItem('pagoConfirmado', JSON.stringify(datosPago));
            // Mostrar el botón PDF
            const btnPdf = document.getElementById('btn-descargar-pdf');
            if (btnPdf) btnPdf.style.display = 'block';
        } else {
            throw new Error(result.error || 'Ocurrió un error desconocido al guardar la reserva.');
        }
    } catch (error) {
        console.error('Error en guardarReservaYRedirigir:', error);
        mostrarMensaje(`Error Crítico: Tu pago fue procesado, pero no se pudo guardar tu reserva. Por favor, contacta a soporte.`, 'error');
    }
}



// --- jsPDF: Generador de PDF ---
document.addEventListener('DOMContentLoaded', () => {
    const btnPdf = document.getElementById('btn-descargar-pdf');
    if (btnPdf) {
        btnPdf.addEventListener('click', async () => {
            // Cargar datos del resumen
            let datos;
            try {
                const response = await fetch('../backend/apps/logica/datos_pago_E.php');
                datos = await response.json();
                console.log(datos.pasajeros)
            } catch {
                alert('No se pudo obtener los datos para el PDF.');
                return;
            }
            // Los datos de los pasajeros ya incluyen todos los campos personales necesarios
            // Cargar jsPDF si no está
            if (typeof window.jspdf === 'undefined' && typeof window.jsPDF === 'undefined') {
                const script = document.createElement('script');
                script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
                document.body.appendChild(script);
                await new Promise(res => { script.onload = res; });
            }
            const { jsPDF } = window.jspdf || window;
            const doc = new jsPDF();

            // --- Colores premium ---
            const azulOscuro = [10, 30, 80];
            const amarillo = [238, 182, 0];
            const dorado = [191, 158, 72];
            const naranja = [243, 156, 18];
            const grisClaro = [245, 247, 250];
            const grisBorde = [220, 220, 220];

            // --- Fondo general ---
            doc.setFillColor(...grisClaro);
            doc.rect(0, 0, 210, 297, 'F');

            // --- Header premium (rectángulo, ancho completo) ---
            doc.setFillColor(...azulOscuro);
            doc.rect(0, 10, 210, 38, 'F');
            // Logo alineado a la izquierda
            let logoWidth = 50, logoHeight = 16;
            try {
                const logoUrl = doc.addImage('Imagenes/perurail.png');
                const logoResp = await fetch(logoUrl);
                const logoBlob = await logoResp.blob();
                const reader = new FileReader();
                const base64 = await new Promise((resolve, reject) => {
                    reader.onloadend = () => resolve(reader.result);
                    reader.onerror = reject;
                    reader.readAsDataURL(logoBlob);
                });
                doc.addImage(base64, 'PNG', 12, 15, logoWidth, logoHeight);
            } catch (e) {
                // ...
            }
            // Estado y datos alineados a la derecha
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(13);
            doc.setTextColor(...amarillo);
            doc.text('ESTADO: CONFIRMADO', 140, 22);
            doc.setFontSize(10);
            doc.setTextColor(255, 255, 255);
            doc.text(`Boleto: PRR-${new Date().getFullYear()}-${Math.floor(Math.random() * 90000 + 10000)}`, 140, 29);
            doc.text(`Clase: PREMIUM`, 140, 35);

            // --- Ribbon amarillo (rectángulo, ancho completo) ---
            doc.setFillColor(...amarillo);
            doc.rect(0, 48, 210, 10, 'F');
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(10);
            doc.setTextColor(60, 60, 60);
            doc.text('INCLUYE: Lounge VIP · Wi-Fi Premium · Menú Gourmet', 15, 55);

            let y = 65;

            // --- Sección RUTA DEL VIAJE (timeline visual) ---
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(13);
            doc.setTextColor(...azulOscuro);
            doc.text('RUTA DEL VIAJE', 18, y);
            // Tipo de ruta (ida/vuelta)
            let tipoRuta = 'Solo ida';
            if (datos.viajes.length > 1) {
                tipoRuta = 'Ida y vuelta';
            }
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(15);
            doc.setTextColor(...dorado);
            doc.text(`Tipo de ruta: ${tipoRuta}`, 140, y);
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(10);
            doc.setTextColor(80, 80, 80);
            doc.text(`Duración total: ${datos.viajes.length > 1 ? 'Ver detalles' : '---'}`, 18, y + 5);
            y += 10;

            // Timeline y detalles de tren
            let timelineY = y + 5;
            let timelineX = 28;
            let step = 32;
            datos.viajes.forEach((viaje, idx) => {
                // Línea vertical
                if (idx < datos.viajes.length - 1) {
                    doc.setDrawColor(...azulOscuro);
                    doc.setLineWidth(2);
                    doc.line(timelineX, timelineY + 2, timelineX, timelineY + step + 2);
                }
                // Círculo
                doc.setFillColor(...(idx === 0 ? amarillo : idx === datos.viajes.length - 1 ? naranja : dorado));
                doc.circle(timelineX, timelineY, 4, 'F');
                // Hora salida
                doc.setFont('helvetica', 'bold');
                doc.setFontSize(11);
                doc.setTextColor(...azulOscuro);
                doc.text(viaje.ida.split(' ')[1] || viaje.ida, timelineX + 10, timelineY + 2);
                // Estación
                doc.setFont('helvetica', 'normal');
                doc.setFontSize(10);
                doc.setTextColor(33, 33, 33);
                doc.text(viaje.ruta, timelineX + 38, timelineY + 2);
                // Descripción tren y transporte
                doc.setFontSize(9);
                doc.setTextColor(80, 80, 80);
                doc.text(`Tren: ${viaje.tren} | Transporte: ${viaje.transporte}`, timelineX + 38, timelineY + 8);
                // Horario salida/llegada
                doc.setFontSize(9);
                doc.setTextColor(...azulOscuro);
                doc.text(`Salida: ${viaje.ida} | Llegada: ${viaje.llegada}`, timelineX + 38, timelineY + 14);
                // Monto
                doc.setFontSize(9);
                doc.setTextColor(...dorado);
                doc.text(`Monto: S/ ${viaje.monto}`, timelineX + 38, timelineY + 20);
                timelineY += step;
            });
            y = y + 5 + step * datos.viajes.length + 5;

            // Línea de separación antes de información de pasajeros
            doc.setDrawColor(...grisBorde);
            doc.setLineWidth(0.7);
            doc.line(15, y, 195, y);
            y += 7;
            // --- Información de pasajeros (sin recuadro) ---
            let yPas = y;
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(12);
            doc.setTextColor(...azulOscuro);
            doc.text('INFORMACIÓN DE PASAJEROS', 18, yPas);
            yPas += 8;
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(10);
            doc.setTextColor(33, 33, 33);
            const adultos = datos.pasajeros.filter(p => p.tarifa.toLowerCase().includes('adulto'));
            const ninos = datos.pasajeros.filter(p => p.tarifa.toLowerCase().includes('niño') || p.tarifa.toLowerCase().includes('nino'));
            const infantes = datos.pasajeros.filter(p => p.tarifa.toLowerCase().includes('infante'));
            if (adultos.length) {
                doc.setFont('helvetica', 'bold');
                doc.text('ADULTOS:', 18, yPas);
                doc.setFont('helvetica', 'normal');
                adultos.forEach(p => {
                    yPas += 7;
                    doc.text(`NOMBRE COMPLETO: ${p.nombre}`, 24, yPas);
                    doc.text(`DOCUMENTO(DNI): ${p.documento}`, 110, yPas);
                    doc.text(`NACIONALIDAD: ${p.pais || '-'}`, 24, yPas + 5);
                    doc.text(`TELÉFONO: ${p.telefono || '-'}`, 110, yPas + 5);
                    doc.text(`EMAIL: ${p.email || '-'}`, 24, yPas + 10);
                    yPas += 15;
                });
                yPas += 2;
            }
            if (ninos.length) {
                doc.setFont('helvetica', 'bold');
                doc.text('NIÑOS:', 18, yPas);
                doc.setFont('helvetica', 'normal');
                ninos.forEach(p => {
                    yPas += 7;
                    doc.text(`NOMBRE COMPLETO: ${p.nombre}`, 24, yPas);
                    doc.text(`DOCUMENTO: ${p.documento}`, 110, yPas);
                    doc.text(`NACIONALIDAD: ${p.pais || '-'}`, 24, yPas + 5);
                    yPas += 10;
                });
                yPas += 2;
            }
            if (infantes.length) {
                doc.setFont('helvetica', 'bold');
                doc.text('INFANTES:', 18, yPas);
                doc.setFont('helvetica', 'normal');
                infantes.forEach(p => {
                    yPas += 7;
                    doc.text(`NOMBRE COMPLETO: ${p.nombre}`, 24, yPas);
                    doc.text(`DOCUMENTO: ${p.documento}`, 110, yPas);
                    doc.text(`NACIONALIDAD: ${p.pais || '-'}`, 24, yPas + 5);
                    yPas += 10;
                });
                yPas += 2;
            }
            // Contacto solo para adultos en sección de contactos
            let contactos = adultos.map(p => p.email).filter(Boolean);
            y = yPas + 5;
            // Línea de separación antes de detalles de trenes
            doc.setDrawColor(...grisBorde);
            doc.setLineWidth(0.7);
            doc.line(15, y, 195, y);
            y += 7;

            // --- Detalles de cada tren (sin vagón) ---
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(12);
            doc.setTextColor(...azulOscuro);
            doc.text('DETALLES DE TRENES', 18, y);
            y += 7;
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(10);
            doc.setTextColor(33, 33, 33);
            datos.viajes.forEach((viaje, idx) => {
                doc.text(`Trayecto ${idx + 1}: ${viaje.titulo}`, 18, y);
                doc.text(`Servicio: ${viaje.tren}`, 80, y);
                y += 6;
                doc.text(`Salida: ${viaje.ida}`, 18, y);
                doc.text(`Llegada: ${viaje.llegada}`, 80, y);
                doc.text(`Política de equipaje: 1 maleta (max 7kg)`, 140, y);
                y += 8;
            });

            // Línea de separación antes de detalles de trenes
            doc.setDrawColor(...grisBorde);
            doc.setLineWidth(0.7);
            doc.line(15, y, 195, y);
            y += 7;

            // --- Total pagado (más abajo y más grande) ---
            y += 10;
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(20);
            doc.setTextColor(...dorado);
            doc.text(`Total pagado: S/ ${datos.total}`, 18, y);
            y += 18;

            // --- Footer: notas y contacto ---
            doc.setDrawColor(...grisBorde);
            doc.setLineWidth(0.5);
            doc.line(15, y, 195, y);
            y += 7;
            // --- Código de barras simulado (centrado) ---
            let barcodeW = 100, barcodeH = 16, barcodeX = 55, barcodeY = y;
            doc.setFillColor(40, 40, 40);
            for (let i = 0; i < 50; i++) {
                let barW = Math.random() > 0.7 ? 2 : 1;
                let barH = barcodeH - Math.floor(Math.random() * 4);
                let x = barcodeX + i * 2;
                doc.rect(x, barcodeY, barW, barH, 'F');
            }
            y += barcodeH + 4;
            // --- Footer notas y contacto ---
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(9);
            doc.setTextColor(120, 120, 120);
            doc.text('Notas importantes:', 18, y);
            doc.text('• Presentarse 30 min antes. • Llevar documento oficial. • No reembolsable.', 18, y + 5);
            if (contactos.length > 0) {
                doc.text(`Contactos: ${contactos.join(', ')}`, 18, y + 11);
            } else {
                doc.text('Contacto: soporte@perurail.com | +51 987 654 321', 18, y + 11);
            }

            // --- Guardar PDF ---
            doc.save('boleto_perurail.pdf');
        });
    }
});
