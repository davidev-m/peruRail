// Espera a que todo el contenido del DOM esté cargado
document.addEventListener('DOMContentLoaded', () => {

    const tableBody = document.getElementById('train-data-body');
    let trainsData = []; // Almacenará los datos de los trenes para fácil acceso

    /**
     * Recorre las filas visibles de la tabla y reasigna el número de la primera columna.
     */
    function renumerarFilas() {
        const todasLasFilas = tableBody.querySelectorAll('tr');
        todasLasFilas.forEach((fila, index) => {
            // La primera celda (td) de cada fila contiene el número.
            const celdaNumero = fila.querySelector('td:first-child');
            if (celdaNumero) {
                celdaNumero.textContent = index + 1;
            }
        });
    }

    /**
     * Carga los datos de los trenes desde un archivo JSON y los muestra en la tabla.
     */
    async function loadTrainData() {
        try {
            const response = await fetch('gestion.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            // Almacena los datos en la variable global para usarlos después
            trainsData = await response.json();

            tableBody.innerHTML = '';

            trainsData.forEach((train, index) => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${index + 1}</td>
                    <td>${train.clase}</td>
                    <td>${train.codigo}</td>
                    <td>${train.capacidad}</td>
                    <td><button class="btn-delete" data-codigo="${train.codigo}">Eliminar</button></td>
                `;
                tableBody.appendChild(row);
            });

        } catch (error) {
            console.error("Error al cargar los datos de los trenes:", error);
            tableBody.innerHTML = `<tr><td colspan="5" style="text-align:center; color:red;">No se pudieron cargar los datos.</td></tr>`;
        }
    }

    /**
     * Envía los datos del tren eliminado al backend.
     * @param {object} trainObject - El objeto del tren a eliminar.
     */
    async function sendDataToBackend(trainObject) {
        const backendUrl = 'eliminar_tren.php';

        console.log('Enviando al backend:', JSON.stringify(trainObject, null, 2));

        try {
            const response = await fetch(backendUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(trainObject),
            });

            if (!response.ok) {
                throw new Error(`Respuesta del backend no fue exitosa. Status: ${response.status}`);
            }

            const result = await response.json(); 
            console.log('Respuesta del backend:', result);
            
            return result.success;

        } catch (error) {
            console.error('Error al enviar datos al backend:', error);
            alert('No se pudo comunicar con el servidor para eliminar el registro.');
            return false;
        }
    }


    // Usamos delegación de eventos para manejar los clics en los botones
    tableBody.addEventListener('click', async (event) => {
        if (event.target && event.target.classList.contains('btn-delete')) {
            
            const userConfirmed = confirm('¿Estás seguro de que deseas eliminar este registro?');

            if (userConfirmed) {
                const button = event.target;
                const rowToDelete = button.closest('tr');
                const trainCode = button.dataset.codigo;

                const trainToDelete = trainsData.find(train => train.codigo == trainCode);

                if (trainToDelete) {
                    button.disabled = true;
                    button.textContent = 'Eliminando...';

                    const success = await sendDataToBackend(trainToDelete);

                    if (success) {
                        rowToDelete.remove();
                        console.log(`Registro con código ${trainCode} eliminado exitosamente.`);
                        
                        // --- ¡NUEVO PASO! ---
                        // Llamamos a la función para reordenar los números de la tabla.
                        renumerarFilas();

                    } else {
                        alert('El backend no pudo eliminar el registro. Inténtalo de nuevo.');
                        button.disabled = false;
                        button.textContent = 'Eliminar';
                    }
                }
            }
        }
    });

    // Carga inicial de datos
    loadTrainData();
});
