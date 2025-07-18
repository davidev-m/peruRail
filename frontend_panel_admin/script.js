document.addEventListener('DOMContentLoaded', () => {
    // --- Helper para acceder a propiedades anidadas de un objeto ---
    const getProperty = (obj, path) => {
        return path.split('.').reduce((o, i) => (o ? o[i] : undefined), obj);
    };

    // --- Configuración Central de Vistas ---
    // --- Rutas de la API ---
    const API_URL_DATOS = '../backend/apps/logica/panel_datos.php';
    const API_URL_CANTIDAD = '../backend/apps/logica/panel_cantidad.php';
    const API_URL_OPERACIONES = '../backend/apps/logica/panel_operaciones.php';
    const viewConfig = {
        dashboard: {},
        clientes: {
            tableName: 'Cliente',
            title: 'Gestión de Clientes',
            headers: ['N°', 'Nombre', 'Apellido', 'Documento', 'Estado'],
            dataFields: ['nombre', 'apellido', 'documento', 'estado'],
            idField: 'id_cliente',
            canAdd: false,
            fields: {
                id_cliente: { label: 'ID', type: 'hidden' },
                nombre: { label: 'Nombre', type: 'text', validationType: 'alpha' },
                apellido: { label: 'Apellido', type: 'text', validationType: 'alpha' },
                documento: { label: 'N° Documento', type: 'text', validationType: 'numeric', readOnly: true },
                tipo: { label: 'Tipo', type: 'text', readOnly: true }, // No se puede modificar
                correo: { label: 'Correo', type: 'email', dependsOn: { field: 'tipo', value: 'cliente_comprador' } },
                num_telf: { label: 'Teléfono', type: 'tel', validationType: 'numeric', dependsOn: { field: 'tipo', value: 'cliente_comprador' } },
                fecha_nacimiento: { label: 'Fecha Nacimiento', type: 'date' },
                genero: { label: 'Género (M/F)', type: 'text', validationType: 'alpha', readOnly: true },
                estado: { label: 'Estado', type: 'select', options: ['activo', 'inactivo'] }
            }
        },
        trabajadores: {
            tableName: 'Trabajador',
            title: 'Gestión de Trabajadores',
            headers: ['N°', 'Nombre', 'Apellido', 'Rol', 'Estado', 'Celular'],
            dataFields: ['nombre', 'apellido', 'rol', 'estado', 'celular'],
            idField: 'id_trabajador',
            fields: {
                id: { label: 'ID', type: 'hidden' },
                nombre: { label: 'Nombre', type: 'text', validationType: 'alpha' },
                apellido: { label: 'Apellido', type: 'text', validationType: 'alpha' },
                documento: { label: 'N° Documento', type: 'text', validationType: 'numeric' }, // Quitado readOnly
                correo: { label: 'Correo', type: 'email' },
                celular: { label: 'Celular', type: 'tel', validationType: 'numeric' },
                rol: { label: 'Rol', type: 'text', readOnly: true },
                estado: { label: 'Estado', type: 'select', options: ['activo', 'inactivo'] }
            }
        },
        rutas: {
            tableName: 'Ruta',
            title: 'Gestión de Rutas',
            headers: ['N°', 'Origen', 'Destino', 'Días Disponibles'],
            dataFields: ['origen', 'destino', 'dias_disponibles'],
            idField: 'id_ruta',
            fields: {
                id_ruta: { label: 'ID', type: 'hidden' },
                origen: { label: 'Origen', type: 'text' },
                destino: { label: 'Destino', type: 'text' },
                destino: { label: 'Días Disponibles', type: 'text' },
            }
        },
        estaciones: {
            tableName: 'Estacion',
            title: 'Gestión de Estaciones',
            headers: ['N°', 'Estación Origen', 'Estación Destino', 'Ruta Asignada'],
            dataFields: ['est_origen', 'est_destino', 'ruta'],
            idField: 'id_estacion',
            dependencies: {
                rutas: 'Ruta'
            },
            fields: {
                id_est: { label: 'ID', type: 'hidden' },
                'ruta.id_ruta': { label: 'Ruta', type: 'select', dependency: 'rutas', sourceKey: 'id_ruta', displayField: (item) => `${item.origen} - ${item.destino}` },
                'est origen': { label: 'Nombre de Estación de Origen', type: 'text' },
                'est Destino': { label: 'Nombre de Estación de Destino', type: 'text' }
            }
        },
        trenes: {
            tableName: 'Tren',
            title: 'Gestión de Trenes',
            headers: ['N°', 'Clase', 'Código', 'Capacidad'],
            dataFields: ['Clase.nombre_clase', 'codigo', 'cap_total'],
            idField: 'id_tren',
            fields: {
                id_tren: { label: 'ID', type: 'hidden' },
                'Clase.id_clase': {
                    label: 'Clase',
                    type: 'select',
                    optionsSource: 'self',
                    optionsPath: 'Clase',
                    optionValueKey: 'id_clase',
                    optionDisplayKey: 'nombre_clase'
                },
                codigo: { label: 'Código', type: 'text' },
                cap_total: { label: 'Capacidad Total', type: 'number', validationType: 'numeric' },
                estado: { label: 'Estado', type: 'select', options: ['activo', 'inactivo'] }
            }
        },
        viajes: {
            tableName: 'Viaje',
            title: 'Gestión de Viajes',
            headers: ['N°', 'Fecha Salida', 'Tren', 'Estación'],
            dataFields: ['fecha_salida', 'Tren.nombre', 'Estacion'],
            idField: 'id_viaje',
            dependencies: {
                trenes: 'Tren',
                estaciones: 'Estacion'
            },
            fields: {
                id_viaje: { label: 'ID', type: 'hidden' },
                'Tren.id_tren': { label: 'Tren', type: 'select', dependency: 'trenes', sourceKey: 'id_tren', displayField: (item) => `${item.Clase.nombre_clase} ${item.codigo}` },
                'Estacion.id_estacion': { label: 'Estación', type: 'select', dependency: 'estaciones', sourceKey: 'id_est', displayField: (item) => `${item['est origen']} - ${item['est Destino']}` },
                fecha_salida: { label: 'Fecha Salida', type: 'date' },
                precio_pasaje: { label: 'Precio S/', type: 'number', validationType: 'numeric' }
            }
        }
    };

    const contentArea = document.getElementById('content-area');
    const sidebarLinks = document.querySelectorAll('.sidebar-link');
    const formModal = document.getElementById('form-modal');
    const confirmModal = document.getElementById('confirm-modal');

    let currentView = 'dashboard';
    let currentData = [];
    let currentDependencies = {};
    let currentItemId = null;
    let originalItemData = null; // Para guardar los datos originales al editar

    async function fetchAPIData(url, payload) {
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `Error del servidor: ${response.status}`);
            }

            const result = await response.json();
            if (result.success) {
                return result.data;
            } else {
                throw new Error(result.error || 'La respuesta del backend no fue exitosa.');
            }
        } catch (error) {
            console.error(`Error al llamar a la API (${url}):`, error);
            // Devolvemos un array vacío o un objeto vacío para que el resto del script no falle
            return payload && Array.isArray(payload.tabla) ? [] : {};
        }
    }

    const renderContent = async (view) => {
        currentView = view;
        contentArea.innerHTML = '<p>Cargando...</p>';

        sidebarLinks.forEach(link => {
            link.classList.toggle('active', link.dataset.view === view);
        });

        if (view === 'dashboard') {
            renderDashboard();
            return;
        }

        const config = viewConfig[view];
        if (!config) {
            renderPlaceholder(view);
            return;
        }

        const dataPromises = [fetchAPIData(API_URL_DATOS, { tabla: config.tableName })];
        const dependencyKeys = config.dependencies ? Object.keys(config.dependencies) : [];

        dependencyKeys.forEach(key => {
            const dependencyTableName = config.dependencies[key];
            dataPromises.push(fetchAPIData(API_URL_DATOS, { tabla: dependencyTableName }));
        });

        const allData = await Promise.all(dataPromises);

        currentData = allData[0] || [];
        currentDependencies = {};
        dependencyKeys.forEach((key, index) => {
            currentDependencies[key] = allData[index + 1] || [];
        });

        if (currentData.length === 0 && view !== 'dashboard') {
            renderPlaceholder(view, `No se encontraron datos en <strong>${config.fileName}</strong>.`);
            return;
        }

        renderTableLayout(config);
        populateTableRows(config, currentData, currentDependencies);
    };

    const renderDashboard = async () => {
        try {
            const counts = await fetchAPIData(API_URL_CANTIDAD, {}); // Payload vacío para cantidad

            contentArea.innerHTML = `
                <div class="content-header"><h1>Dashboard</h1></div>
                <div class="dashboard-grid">
                    <div class="dashboard-card">
                        <div class="card-icon-wrapper" style="background-color: #eaf4fc;">
                            <span class="card-icon" id="icon-clientes"></span>
                        </div>
                        <div class="card-text">
                           <p class="card-title">Clientes</p>
                           <p class="card-value">${counts.Cliente || 0}</p>
                        </div>
                    </div>
                    <div class="dashboard-card">
                        <div class="card-icon-wrapper" style="background-color: #f3e8ff;">
                            <span class="card-icon" id="icon-trabajadores"></span>
                        </div>
                        <div class="card-text">
                           <p class="card-title">Trabajadores</p>
                           <p class="card-value">${counts.Trabajador || 0}</p>
                        </div>
                    </div>
                     <div class="dashboard-card">
                        <div class="card-icon-wrapper" style="background-color: #fff4e5;">
                            <span class="card-icon" id="icon-rutas"></span>
                        </div>
                        <div class="card-text">
                           <p class="card-title">Rutas</p>
                           <p class="card-value">${counts.Ruta || 0}</p>
                        </div>
                    </div>
                     <div class="dashboard-card">
                        <div class="card-icon-wrapper" style="background-color: #e0f2f1;">
                            <span class="card-icon" id="icon-estaciones"></span>
                        </div>
                        <div class="card-text">
                           <p class="card-title">Estaciones</p>
                           <p class="card-value">${counts.Estacion || 0}</p>
                        </div>
                    </div>
                    <div class="dashboard-card">
                        <div class="card-icon-wrapper" style="background-color: #e9f7ef;">
                            <span class="card-icon" id="icon-trenes"></span>
                        </div>
                        <div class="card-text">
                           <p class="card-title">Trenes</p>
                           <p class="card-value">${counts.Tren || 0}</p>
                        </div>
                    </div>
                    <div class="dashboard-card">
                        <div class="card-icon-wrapper" style="background-color: #fffde7;">
                            <span class="card-icon" id="icon-viajes"></span>
                        </div>
                        <div class="card-text">
                           <p class="card-title">Viajes</p>
                           <p class="card-value">${counts.Viaje || 0}</p>
                        </div>
                    </div>
                </div>
            `;
        } catch (error) {
            contentArea.innerHTML = `<p style="color: red;">Error al cargar los datos del dashboard.</p>`;
            console.error(error);
        }
    };

    const renderPlaceholder = (viewName, message = '') => {
        const capitalizedView = viewName.charAt(0).toUpperCase() + viewName.slice(1);
        const defaultMessage = `La funcionalidad para gestionar <strong>${capitalizedView}</strong> aún no ha sido implementada.`;
        contentArea.innerHTML = `
            <div class="content-header"><h1>Gestión de ${capitalizedView}</h1></div>
            <div class="placeholder">
                <p>${message || defaultMessage}</p>
            </div>
        `;
    };

    const renderTableLayout = (config) => {
        contentArea.innerHTML = `
            <div class="content-header">
                <h1>${config.title}</h1>
                ${config.canAdd !== false ? '<button class="add-btn btn btn-primary">Agregar Nuevo</button>' : ''}
            </div>
            <div class="search-container">
                <input type="text" id="search-input" placeholder="Buscar en la tabla...">
                <button id="clear-search-btn" class="btn btn-secondary">Limpiar</button>
            </div>
            <div class="table-container">
                <div class="table-wrapper">
                    <table class="data-table">
                        <thead>
                            <tr>
                                ${config.headers.map(h => `<th>${h}</th>`).join('')}
                                <th style="text-align: center;">Acciones</th>
                            </tr>
                        </thead>
                        <tbody></tbody>
                    </table>
                </div>
            </div>`;
    };

    const populateTableRows = (config, data, dependencies) => {
        const tableBody = contentArea.querySelector('.data-table tbody');
        if (!tableBody) return;

        let rowsHTML = '';
        data.forEach((item, index) => {
            rowsHTML += `<tr data-id="${getProperty(item, config.idField)}">`;
            rowsHTML += `<td>${index + 1}</td>`;

            config.dataFields.forEach(fieldKey => {
                let cellContent;

                if (currentView === 'viajes' && fieldKey === 'Estacion') {
                    const estacionObj = getProperty(item, 'Estacion');
                    cellContent = estacionObj ? `${estacionObj.est_origen} - ${estacionObj.est_destino}` : 'N/A';
                } else if (fieldKey.includes('.')) {
                    cellContent = getProperty(item, fieldKey) || '';
                } else if (fieldKey.includes(' ')) {
                    cellContent = item[fieldKey] || '';
                } else if (fieldKey === 'ruta') {
                    const rutaObj = getProperty(item, 'ruta');
                    cellContent = rutaObj ? `${rutaObj.origen} - ${rutaObj.destino}` : 'N/A';
                } else {
                    cellContent = item[fieldKey] || '';
                }

                if (fieldKey === 'tipo' || fieldKey === 'rol' || fieldKey === 'estado') {
                    let style = 'display: inline-block; padding: 3px 10px; border-radius: 12px; font-size: 0.8rem; font-weight: 500; text-transform: capitalize;';
                    const lowerCaseContent = cellContent.toString().toLowerCase();
                    if (lowerCaseContent.includes('comprador') || lowerCaseContent.includes('asesor') || lowerCaseContent === 'activo') {
                        style += ' background-color: #e8f5e9; color: #2e7d32;';
                    } else {
                        style += ' background-color: #e3f2fd; color: #1565c0;';
                    }
                    cellContent = `<span style="${style}">${cellContent}</span>`;
                }

                rowsHTML += `<td>${cellContent}</td>`;
            });

            rowsHTML += `
                <td class="actions">
                    <button class="edit-btn btn-action" title="Modificar">&#9998;</button>
                    <button class="delete-btn btn-action" title="Eliminar">&#10006;</button>
                </td>
            </tr>`;
        });

        tableBody.innerHTML = rowsHTML;
    };

    const showModal = (title, item = {}) => {
        const config = viewConfig[currentView];
        originalItemData = item;
        document.getElementById('modal-title').textContent = title;
        const formFields = document.getElementById('form-fields');
        formFields.innerHTML = '';
        currentItemId = getProperty(item, config.idField) || null;

        for (const key in config.fields) {
            const fieldConfig = config.fields[key];
            if (fieldConfig.type === 'hidden') continue;

            let fieldHTML = '';
            const value = getProperty(item, key) || '';
            const inputName = key.replace(/\./g, '_').replace(/ /g, '_');
            const isDependent = !!fieldConfig.dependsOn;

            // PATCH: rol editable solo al insertar y con opciones específicas
            let readOnlyAttr = fieldConfig.readOnly ? 'readonly' : '';
            if (config.tableName === 'Trabajador' && key === 'rol') {
                if (!currentItemId) {
                    // Insertar: mostrar select con opciones
                    fieldHTML = `
                        <div class="form-group" data-dependency-key="${key}">
                            <label for="${inputName}">${fieldConfig.label}</label>
                            <select id="${inputName}" name="${inputName}" required>
                                <option value="">-- Seleccione --</option>
                                <option value="Trabajador" ${value === 'Trabajador' ? 'selected' : ''}>Trabajador</option>
                                <option value="Asesor_venta" ${value === 'Asesor_venta' ? 'selected' : ''}>Asesor de venta</option>
                            </select>
                        </div>
                    `;
                } else {
                    // Modificar: solo lectura
                    readOnlyAttr = 'readonly';
                    fieldHTML = `
                        <div class="form-group" data-dependency-key="${key}">
                            <label for="${inputName}">${fieldConfig.label}</label>
                            <input type="text" id="${inputName}" name="${inputName}" value="${value}" ${readOnlyAttr} required>
                        </div>
                    `;
                }
            } else if (config.tableName === 'Trabajador' && key === 'documento') {
                // PATCH: documento solo editable al insertar
                if (!currentItemId) {
                    readOnlyAttr = '';
                } else {
                    readOnlyAttr = 'readonly';
                }
                fieldHTML = `
                    <div class="form-group" data-dependency-key="${key}">
                        <label for="${inputName}">${fieldConfig.label}</label>
                        <input type="${fieldConfig.type}" id="${inputName}" name="${inputName}" value="${value}" ${readOnlyAttr} required>
                    </div>
                `;
            } else if (fieldConfig.type === 'select') {
                let optionsHTML = '<option value="">-- Seleccione --</option>';
                let optionsSource = [];

                if (fieldConfig.optionsSource === 'self') {
                    const uniqueOptions = new Map();
                    currentData.forEach(dataItem => {
                        const optionObj = getProperty(dataItem, fieldConfig.optionsPath);
                        if (optionObj && !uniqueOptions.has(optionObj[fieldConfig.optionValueKey])) {
                            uniqueOptions.set(optionObj[fieldConfig.optionValueKey], optionObj);
                        }
                    });
                    optionsSource = Array.from(uniqueOptions.values());
                } else {
                    optionsSource = fieldConfig.dependency ? currentDependencies[fieldConfig.dependency] : fieldConfig.options;
                }

                if (optionsSource) {
                    optionsSource.forEach(option => {
                        let optionValue, optionText;
                        if (fieldConfig.dependency || fieldConfig.optionsSource === 'self') {
                            optionValue = option[fieldConfig.sourceKey || fieldConfig.optionValueKey];
                            optionText = (fieldConfig.displayField) ? fieldConfig.displayField(option) : option[fieldConfig.optionDisplayKey];
                        } else {
                            optionValue = option;
                            optionText = option;
                        }
                        const selectedAttr = optionValue == value ? 'selected' : '';
                        optionsHTML += `<option value="${optionValue}" ${selectedAttr}>${optionText}</option>`;
                    });
                }
                fieldHTML = `
                    <div class="form-group" data-dependency-key="${key}" ${isDependent ? 'style="display: none;"' : ''}>
                        <label for="${inputName}">${fieldConfig.label}</label>
                        <select id="${inputName}" name="${inputName}" required>${optionsHTML}</select>
                    </div>
                `;
            } else {
                fieldHTML = `
                    <div class="form-group" data-dependency-key="${key}" ${isDependent ? 'style="display: none;"' : ''}>
                        <label for="${inputName}">${fieldConfig.label}</label>
                        <input type="${fieldConfig.type}" id="${inputName}" name="${inputName}" value="${value}" ${readOnlyAttr} required>
                    </div>
                `;
            }

            formFields.insertAdjacentHTML('beforeend', fieldHTML);

            if (fieldConfig.validationType) {
                setInputValidation(inputName, fieldConfig.validationType);
            }
        }

        handleDependentFields(item);

        formModal.classList.remove('hidden');
        setTimeout(() => formModal.classList.add('visible'), 10);
    };

    const handleDependentFields = (item) => {
        const config = viewConfig[currentView];
        const dependencyControllers = Object.keys(config.fields).filter(key => {
            const fieldConfig = config.fields[key];
            return (fieldConfig.type === 'select' || fieldConfig.readOnly) && Object.values(config.fields).some(f => f.dependsOn && f.dependsOn.field === key);
        });

        dependencyControllers.forEach(controllerKey => {
            const inputName = controllerKey.replace(/\./g, '_').replace(/ /g, '_');
            const controllerInput = document.getElementById(inputName);
            if (controllerInput) {
                const updateVisibility = () => {
                    const selectedValue = controllerInput.value;
                    for (const key in config.fields) {
                        const fieldConfig = config.fields[key];
                        if (fieldConfig.dependsOn && fieldConfig.dependsOn.field === controllerKey) {
                            const dependentElement = document.querySelector(`[data-dependency-key="${key}"]`);
                            if (dependentElement) {
                                dependentElement.style.display = selectedValue === fieldConfig.dependsOn.value ? '' : 'none';
                            }
                        }
                    }
                };
                controllerInput.addEventListener('change', updateVisibility);
                updateVisibility();
            }
        });
    };

    const setInputValidation = (inputId, validationType) => {
        const input = document.getElementById(inputId);
        if (!input) return;

        input.addEventListener('input', (e) => {
            let value = e.target.value;
            if (validationType === 'alpha') {
                e.target.value = value.replace(/[^a-zA-Z\s]/g, '');
            } else if (validationType === 'numeric') {
                e.target.value = value.replace(/[^0-9]/g, '');
            }
        });
    };

    const hideModal = (modalElement) => {
        modalElement.classList.remove('visible');
        setTimeout(() => modalElement.classList.add('hidden'), 300);
    };

    const showConfirmModal = (id) => {
        currentItemId = id;
        confirmModal.classList.remove('hidden');
        setTimeout(() => confirmModal.classList.add('visible'), 10);
    };

    sidebarLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            renderContent(e.currentTarget.dataset.view);
        });
    });

    contentArea.addEventListener('click', (e) => {
        const target = e.target.closest('button');
        if (!target) return;

        const config = viewConfig[currentView];
        const row = target.closest('tr');
        const id = row ? row.dataset.id : null;

        if (target.classList.contains('add-btn')) {
            showModal(`Agregar ${config.title.split(' ')[2]}`);
        }
        if (target.classList.contains('edit-btn')) {
            const item = currentData.find(i => getProperty(i, config.idField) == id);
            showModal(`Modificar ${config.title.split(' ')[2]}`, item);
        }
        if (target.classList.contains('delete-btn')) {
            showConfirmModal(id);
        }
        if (target.id === 'clear-search-btn') {
            document.getElementById('search-input').value = '';
            populateTableRows(config, currentData, currentDependencies);
        }
    });

    const recursiveSearch = (obj, term) => {
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                const value = obj[key];
                if (typeof value === 'object' && value !== null) {
                    if (recursiveSearch(value, term)) {
                        return true;
                    }
                } else if (value !== null && value.toString().toLowerCase().includes(term)) {
                    return true;
                }
            }
        }
        return false;
    };

    contentArea.addEventListener('input', (e) => {
        if (e.target.id === 'search-input') {
            const searchTerm = e.target.value.toLowerCase();
            const config = viewConfig[currentView];

            const filteredData = currentData.filter(item => {
                return recursiveSearch(item, searchTerm);
            });

            populateTableRows(config, filteredData, currentDependencies);
        }
    });

    document.getElementById('modal-close-btn').addEventListener('click', () => hideModal(formModal));

    document.getElementById('entity-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const config = viewConfig[currentView];
        const formData = new FormData(e.target);
        const data = {};
        formData.forEach((value, key) => {
            const originalKey = key.replace(/_/g, '.');
            data[originalKey] = value;
        });

        let payload = {};

        if (currentItemId) { // Modificar
            const modifiedData = {};
            for (const key in config.fields) {
                // Usamos hasOwnProperty para asegurarnos de que no estamos iterando sobre propiedades heredadas
                if (Object.prototype.hasOwnProperty.call(config.fields, key)) {
                    const originalValue = getProperty(originalItemData, key);
                    const currentValue = data[key];
                    if (String(originalValue) != String(currentValue)) {
                        modifiedData[key.split('.').pop()] = currentValue; // Enviamos solo el nombre final de la columna
                    }
                }
            }

            payload = {
                accion: 'modificar',
                tabla: config.tableName,
                datos: modifiedData,
                condicion: { [config.idField]: currentItemId }
            };

        } else { // Insertar
            payload = {
                accion: 'insertar',
                tabla: config.tableName,
                datos: data
            };
        }

        // Llamamos a la API de operaciones
        fetchAPIData(API_URL_OPERACIONES, payload)
            .then(response => {
                alert(response.message || 'Operación realizada con éxito.');
                hideModal(formModal);
                renderContent(currentView); // Recargamos la tabla para ver los cambios
            })
            .catch(error => {
                alert(`Error: ${error.message}`);
            });
    });

    document.getElementById('confirm-cancel-btn').addEventListener('click', () => hideModal(confirmModal));

    // --- EVENT LISTENER MODIFICADO PARA ELIMINAR ---
    document.getElementById('confirm-delete-btn').addEventListener('click', () => {
        const config = viewConfig[currentView];
        const payload = {
            accion: 'eliminar',
            tabla: config.tableName,
            condicion: { [config.idField]: currentItemId }
        };

        // Llamamos a la API de operaciones
        fetchAPIData(API_URL_OPERACIONES, payload)
            .then(response => {
                alert(response.message || 'Registro desactivado con éxito.');
                hideModal(confirmModal);
                renderContent(currentView); // Recargamos la tabla
            })
            .catch(error => {
                alert(`Error: ${error.message}`);
            });
    });
});
