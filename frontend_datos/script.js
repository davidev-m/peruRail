document.addEventListener("DOMContentLoaded", async () => {
  const container = document.getElementById("form-container");

  // --- Inyectar estilos para los formularios desplegables y controles ---
  const newStyles = `
    .formulario-dinamico > h3 { cursor: pointer; display: flex; justify-content: space-between; align-items: center; user-select: none; }
    .toggle-arrow { font-size: 1em; transition: transform 0.2s; }
    .form-content { padding-top: 16px; border-top: 1px solid #eee; margin-top: 10px; }
    .top-controls { display: flex; justify-content: flex-end; gap: 20px; padding-bottom: 16px; margin-bottom: 16px; border-bottom: 1px solid #eee; }
    .control-group { display: flex; align-items: center; gap: 8px; }
    .control-group label { font-weight: normal; margin-bottom: 0; }
    .control-group input[type="radio"], .control-group input[type="checkbox"] { width: auto; }
    .collapsed .form-content { display: none; }
    .collapsed .toggle-arrow { transform: rotate(-90deg); }
    .buyer-fields { display: none; margin-top: 16px; padding-top: 16px; border-top: 1px solid #eee; }
    /* Estilo para campos inválidos */
    input:invalid { border-color: #e53e3e; }
  `;
  const styleSheet = document.createElement("style");
  styleSheet.innerText = newStyles;
  document.head.appendChild(styleSheet);

  let datosPasajeros;
  try {
    const res = await fetch("../backend/apps/logica/datos_personales_E.php",{
      credentials: 'include'
    });
    if (!res.ok) throw new Error("HTTP " + res.status);
    datosPasajeros = await res.json();
    console.log(datosPasajeros);
  } catch (e) { 
    console.error("Error cargando pasajeros.json:", e);
    datosPasajeros = { "Adulto": 1, "Nino": 0, "Infante": 0 };
  }

  const infantesDisponibles = datosPasajeros.Infante || 0;
  const tipos = [
    { key: "Adulto", label: "Adulto", total: datosPasajeros.Adulto || 0 },
    { key: "Nino",   label: "Nino", total: datosPasajeros.Nino || 0 }
  ];

  const form = document.createElement("form");
  form.id = "pasajeros-form";
  form.action = "../backend/apps/logica/datos_personales_R.php";
  form.method = "POST";

  tipos.forEach(({ key, label, total }) => {
    for (let i = 1; i <= total; i++) {
      const bloque = document.createElement("div");
      bloque.className = "formulario-dinamico";
      bloque.dataset.type = key;
      bloque.dataset.index = i;
      
      const header = document.createElement('h3');
      header.innerHTML = `<span class="form-title">${label}${total > 1 ? ` ${i}` : ""}</span><span class="toggle-arrow">▼</span>`;
      
      const contentWrapper = document.createElement('div');
      contentWrapper.className = 'form-content';

      const topControlsDiv = document.createElement('div');
      topControlsDiv.className = 'top-controls';
      topControlsDiv.innerHTML = `
        <div class="control-group">
          <label>Género:</label>
          <label><input type="radio" name="${key}_genero_${i}" value="M" required> M</label>
          <label><input type="radio" name="${key}_genero_${i}" value="F"> F</label>
        </div>
      `;
      if (key === "Adulto") {
        topControlsDiv.innerHTML += `
          <div class="control-group">
            <input type="checkbox" class="buyer-checkbox" id="comprador_${i}" name="Adulto_es_comprador_${i}">
            <label for="comprador_${i}">Comprador</label>
          </div>
        `;
        if (infantesDisponibles > 0) {
            topControlsDiv.innerHTML += `
              <div class="control-group">
                <input type="checkbox" class="infant-checkbox" id="infante_para_adulto_${i}" name="Adulto_con_infante_${i}">
                <label for="infante_para_adulto_${i}">Con Infante</label>
              </div>
            `;
        }
      }
      contentWrapper.appendChild(topControlsDiv);

      const fieldsDiv = document.createElement('div');
      fieldsDiv.innerHTML = `
        <div class="form-row">
          <div class="form-group"><label for="${key}_nombre_${i}">Nombre *</label><input type="text" id="${key}_nombre_${i}" name="${key}_nombre_${i}" required></div>
          <div class="form-group"><label for="${key}_apellidos_${i}">Apellidos *</label><input type="text" id="${key}_apellidos_${i}" name="${key}_apellidos_${i}" required></div>
        </div>
        <div class="form-row">
          <div class="form-group"><label for="${key}_pais_${i}">País *</label><select id="${key}_pais_${i}" name="${key}_pais_${i}" required><option value="">-- Seleccione un país --</option><option value="Perú">Perú</option><option value="Chile">Chile</option><option value="Argentina">Argentina</option><option value="Colombia">Colombia</option><option value="Ecuador">Ecuador</option><option value="Brasil">Brasil</option></select></div>
          <div class="form-group"><label for="${key}_tipo_doc_${i}">Tipo de Documento *</label><select id="${key}_tipo_doc_${i}" name="${key}_tipo_doc_${i}" required><option value="">-- Seleccione tipo --</option><option value="DNI">DNI</option><option value="Pasaporte">Pasaporte</option><option value="Carnet de extranjería">Carnet de extranjería</option></select></div>
        </div>
        <div class="form-row">
          <div class="form-group"><label for="${key}_num_doc_${i}">Número de Documento *</label><input type="text" id="${key}_num_doc_${i}" name="${key}_num_doc_${i}" required></div>
          <div class="form-group"><label for="${key}_fecha_nac_${i}">Fecha de Nacimiento *</label><input type="date" id="${key}_fecha_nac_${i}" name="${key}_fecha_nac_${i}" required></div>
        </div>
      `;
      contentWrapper.appendChild(fieldsDiv);
      
      // --- INICIO: VALIDACIÓN DE DOCUMENTO CONTRA BASE DE DATOS ---
      const numDocInput = fieldsDiv.querySelector(`#${key}_num_doc_${i}`);
      const nombreInput = fieldsDiv.querySelector(`#${key}_nombre_${i}`);
      const apellidosInput = fieldsDiv.querySelector(`#${key}_apellidos_${i}`);
      const tipoDocSelect = fieldsDiv.querySelector(`#${key}_tipo_doc_${i}`);

      // Función para ejecutar la validación
      const validarDocumento = async () => {
        const docType = tipoDocSelect.value;
        const docTypesToValidate = ['DNI', 'Pasaporte', 'Carnet de extranjería'];

        // Solo validar si el tipo de documento está en la lista y los campos requeridos tienen valor
        if (docTypesToValidate.includes(docType) && numDocInput.value && nombreInput.value && apellidosInput.value) {
          try {
            const formData = new FormData();
            formData.append('nombre', nombreInput.value);
            formData.append('apellido', apellidosInput.value);
            formData.append('documento', numDocInput.value);

            const response = await fetch('../backend/apps/logica/funciones_extra.php', {
              method: 'POST',
              body: formData
            });

            if (!response.ok) throw new Error(`Error del servidor: ${response.status}`);
            
            const result = await response.json(); // Se espera una respuesta como { "valid": true/false }

            if (result.valid === false) {
              // Si el PHP retorna false, significa que el documento existe con otros datos.
              numDocInput.setCustomValidity('El documento ya está registrado con un nombre o apellido diferente.');
            } else {
              // Si es válido, se limpia el mensaje de error.
              numDocInput.setCustomValidity('');
            }
          } catch (error) {
            console.error('Error al verificar el documento:', error);
            // Opcional: No bloquear el formulario si falla la API, pero sí notificar en consola.
            numDocInput.setCustomValidity(''); // No bloquear si la API falla
          }
        } else {
          // Si no es un tipo de documento a validar o faltan datos, se asegura de que no haya error de validación.
          numDocInput.setCustomValidity('');
        }
      };

      // Añadir listeners para que la validación se dispare cuando el usuario deja los campos.
      numDocInput.addEventListener('blur', validarDocumento);
      nombreInput.addEventListener('blur', validarDocumento);
      apellidosInput.addEventListener('blur', validarDocumento);
      // También validar si cambia el tipo de documento
      tipoDocSelect.addEventListener('change', validarDocumento);
      // --- FIN: VALIDACIÓN DE DOCUMENTO CONTRA BASE DE DATOS ---

      if (key === "Adulto") {
        const buyerFieldsDiv = document.createElement('div');
        buyerFieldsDiv.className = 'buyer-fields';
        buyerFieldsDiv.id = `buyer_fields_${i}`;
        buyerFieldsDiv.innerHTML = `
          <div class="form-row">
            <div class="form-group"><label for="Adulto_telefono_${i}">Teléfono</label><input type="tel" id="Adulto_telefono_${i}" name="Adulto_telefono_${i}"></div>
            <div class="form-group"><label for="Adulto_email_${i}">E‑mail *</label><input type="email" id="Adulto_email_${i}" name="Adulto_email_${i}"></div>
            <div class="form-group"><label for="Adulto_email_conf_${i}">Confirmar E‑mail *</label><input type="email" id="Adulto_email_conf_${i}" name="Adulto_email_conf_${i}"></div>
          </div>
        `;
        contentWrapper.appendChild(buyerFieldsDiv);

        // --- INICIO: NUEVA LÓGICA DE VALIDACIÓN DE EMAIL ---
        const emailInput = buyerFieldsDiv.querySelector(`#Adulto_email_${i}`);
        const emailConfInput = buyerFieldsDiv.querySelector(`#Adulto_email_conf_${i}`);

        const validateEmails = () => {
          if (emailInput.value !== emailConfInput.value) {
            // Establece un mensaje de error de validación personalizado.
            // El navegador mostrará este mensaje y evitará el envío del formulario.
            emailConfInput.setCustomValidity("El E-mail y su confirmación no coinciden.");
          } else {
            // Si coinciden, se limpia el mensaje de error.
            emailConfInput.setCustomValidity("");
          }
        };

        // Se añaden los listeners para que la validación se ejecute mientras el usuario escribe.
        emailInput.addEventListener('input', validateEmails);
        emailConfInput.addEventListener('input', validateEmails);
        // --- FIN: NUEVA LÓGICA DE VALIDACIÓN DE EMAIL ---
      }
      bloque.appendChild(header);
      bloque.appendChild(contentWrapper);
      form.appendChild(bloque);
    }
  });

  const empresaDiv = document.createElement("div");
  empresaDiv.className = "formulario-dinamico";
  empresaDiv.innerHTML = `<h3>Datos de la Empresa (Opcional) <span class="toggle-arrow">▼</span></h3><div class="form-content"><div class="form-row"><div class="form-group"><label for="empresa_ruc">RUC</label><input type="text" id="empresa_ruc" name="empresa_ruc" maxlength="11" pattern="\\d{11}" title="El RUC debe contener 11 dígitos numéricos."></div><div class="form-group"><label for="empresa_razon_social">Razón Social</label><input type="text" id="empresa_razon_social" name="empresa_razon_social"></div></div><div class="form-row"><div class="form-group"><label for="empresa_direccion">Dirección</label><input type="text" id="empresa_direccion" name="empresa_direccion"></div></div></div>`;
  form.appendChild(empresaDiv);

  const submitDiv = document.createElement("div");
  submitDiv.className = "actions";
  submitDiv.innerHTML = `<button type="submit">Siguiente</button>`;
  form.appendChild(submitDiv);
  container.appendChild(form);

  // --- LÓGICA DE EVENTOS (VALIDACIONES, DESPLEGABLES, ETC.) ---
  
  // 1. Control para la selección del COMPRADOR ÚNICO
  const buyerCheckboxes = document.querySelectorAll('.buyer-checkbox');
  buyerCheckboxes.forEach(checkbox => {
    checkbox.addEventListener('change', (e) => {
      const currentCheckbox = e.target;
      const adultIndex = currentCheckbox.id.split('_')[1];
      const fieldsDiv = document.getElementById(`buyer_fields_${adultIndex}`);
      const fieldInputs = fieldsDiv.querySelectorAll('input');

      if (currentCheckbox.checked) {
        fieldsDiv.style.display = 'block';
        fieldInputs.forEach(input => {
          if (input.type === 'email' || input.type === 'tel') input.required = true;
        });
        buyerCheckboxes.forEach(otherCheckbox => {
          if (otherCheckbox !== currentCheckbox) otherCheckbox.disabled = true;
        });
      } else {
        fieldsDiv.style.display = 'none';
        fieldInputs.forEach(input => input.required = false);
        buyerCheckboxes.forEach(otherCheckbox => otherCheckbox.disabled = false);
      }
    });
  });

  // 2. Control para la asignación de INFANTES
  if (infantesDisponibles > 0) {
    const infantCheckboxes = document.querySelectorAll('.infant-checkbox');
    const handleInfantSelection = () => {
      const checkedCount = document.querySelectorAll('.infant-checkbox:checked').length;
      infantCheckboxes.forEach(checkbox => {
        checkbox.disabled = !checkbox.checked && checkedCount >= infantesDisponibles;
      });
    };
    infantCheckboxes.forEach(checkbox => checkbox.addEventListener('change', handleInfantSelection));
  }

  // 3. Control para la validación del NÚMERO DE DOCUMENTO (formato)
  document.querySelectorAll('.formulario-dinamico').forEach(formBlock => {
      const tipoDocSelect = formBlock.querySelector("select[id*='_tipo_doc_']");
      const numDocInput = formBlock.querySelector("input[id*='_num_doc_']");
      if (tipoDocSelect && numDocInput) {
          tipoDocSelect.addEventListener('change', (e) => {
              const selectedType = e.target.value;
              numDocInput.value = ""; 
              numDocInput.removeAttribute('pattern');
              if (selectedType === 'DNI') {
                  numDocInput.maxLength = 8;
                  numDocInput.pattern = "\\d{8}";
              } else if (selectedType === 'Pasaporte' || selectedType === 'Carnet de extranjería') {
                  numDocInput.maxLength = 12;
              } else {
                  numDocInput.removeAttribute('maxLength');
              }
          });
          numDocInput.addEventListener('input', (e) => {
              if (tipoDocSelect.value === 'DNI') e.target.value = e.target.value.replace(/\D/g, '');
          });
      }
  });

  // 4. Control para la validación del RUC
  const rucInput = document.getElementById('empresa_ruc');
  if (rucInput) {
      rucInput.addEventListener('input', (e) => e.target.value = e.target.value.replace(/\D/g, ''));
  }

  // 5. Control para FORMULARIOS DESPLEGABLES
  const allHeaders = document.querySelectorAll('.formulario-dinamico > h3');
  allHeaders.forEach((header, index) => {
      const formBlock = header.parentElement;
      if (index > 0) {
          formBlock.classList.add('collapsed');
      }
      header.addEventListener('click', () => {
          formBlock.classList.toggle('collapsed');
      });
  });

  // --- LÓGICA DE ENVÍO CON JSON ---
  form.addEventListener('submit', async (event) => {
    event.preventDefault(); 
    
    // El navegador se encargará de mostrar los mensajes de error de validación
    // (tanto para email como para DNI) antes de permitir el envío.
    // Si form.checkValidity() es false, el evento 'submit' no se debería disparar
    // o se detiene por el navegador.
    if (!form.checkValidity()) {
        form.reportValidity(); // Muestra todos los errores de validación pendientes
        return;
    }

    const statusMessage = document.getElementById('status-message');
    
    // --- VALIDACIÓN FINAL ANTES DE ENVIAR ---
    const buyerCheckbox = document.querySelector('.buyer-checkbox:checked');
    
    // Primero, verificar si se ha seleccionado un comprador.
    if (!buyerCheckbox) {
        statusMessage.textContent = 'Debe seleccionar un pasajero como comprador.';
        statusMessage.style.color = 'red';
        return; // Detiene el envío
    }
    
    // Si hay comprador, verificar la coincidencia de emails.
    const i = buyerCheckbox.id.split('_')[1];
    const emailInput = document.getElementById(`Adulto_email_${i}`);
    const emailConfInput = document.getElementById(`Adulto_email_conf_${i}`);

    if (emailInput.value !== emailConfInput.value) {
        statusMessage.textContent = 'Error: El E-mail y su confirmación no coinciden.';
        statusMessage.style.color = 'red';
        emailConfInput.focus(); // Pone el foco en el campo incorrecto
        return; // Detiene el envío
    }

    // Si todas las validaciones pasan, se procede con el envío.
    statusMessage.textContent = 'Enviando datos...';
    statusMessage.style.color = 'orange';

    const reservaData = {
        pasajeros: { adultos: [], ninos: [] },
        comprador: {},
        empresa: {}
    };

    document.querySelectorAll('.formulario-dinamico[data-type="Adulto"]').forEach(bloque => {
        const i = bloque.dataset.index;
        const esComprador = document.getElementById(`comprador_${i}`).checked;
        const adulto = {
            nombre: document.getElementById(`Adulto_nombre_${i}`).value,
            apellidos: document.getElementById(`Adulto_apellidos_${i}`).value,
            genero: form.querySelector(`input[name="Adulto_genero_${i}"]:checked`)?.value || '',
            pais: document.getElementById(`Adulto_pais_${i}`).value,
            tipo_doc: document.getElementById(`Adulto_tipo_doc_${i}`).value,
            num_doc: document.getElementById(`Adulto_num_doc_${i}`).value,
            fecha_nac: document.getElementById(`Adulto_fecha_nac_${i}`).value,
            es_comprador: esComprador,
            con_infante: document.getElementById(`infante_para_adulto_${i}`)?.checked || false
        };
        reservaData.pasajeros.adultos.push(adulto);

        if (esComprador) {
            reservaData.comprador = {
                nombre: adulto.nombre,
                apellidos: adulto.apellidos,
                telefono: document.getElementById(`Adulto_telefono_${i}`).value,
                email: document.getElementById(`Adulto_email_${i}`).value
            };
        }
    });

    document.querySelectorAll('.formulario-dinamico[data-type="Nino"]').forEach(bloque => {
        const i = bloque.dataset.index;
        reservaData.pasajeros.ninos.push({
            nombre: document.getElementById(`Nino_nombre_${i}`).value,
            apellidos: document.getElementById(`Nino_apellidos_${i}`).value,
            genero: form.querySelector(`input[name="Nino_genero_${i}"]:checked`)?.value || '',
            pais: document.getElementById(`Nino_pais_${i}`).value,
            tipo_doc: document.getElementById(`Nino_tipo_doc_${i}`).value,
            num_doc: document.getElementById(`Nino_num_doc_${i}`).value,
            fecha_nac: document.getElementById(`Nino_fecha_nac_${i}`).value
        });
    });

    const ruc = document.getElementById('empresa_ruc').value;
    if (ruc) {
        reservaData.empresa = {
            ruc: ruc,
            razon_social: document.getElementById('empresa_razon_social').value,
            direccion: document.getElementById('empresa_direccion').value
        };
    }

    console.log('Enviando los siguientes datos:', reservaData);

    try {
        const response = await fetch('../backend/apps/logica/datos_personales_R.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(reservaData)
        });

        if (!response.ok) throw new Error(`Error del servidor: ${response.status}`);
        
        const result = await response.json();
        
        console.log('Respuesta del servidor:', result);

        if (result.success) {
            statusMessage.textContent = '¡Reserva guardada con éxito!';
            statusMessage.style.color = 'green';
            // Redirección si todo es correcto
            window.location.href = "../pasarela_pagos/menu4.html";
        } else {
            throw new Error(result.error || 'Ocurrió un error desconocido.');
        }

    } catch (error) {
        console.error('Error en el envío fetch:', error);
        statusMessage.textContent = `Error al enviar: ${error.message}`;
        statusMessage.style.color = 'red';
    }
  });
});