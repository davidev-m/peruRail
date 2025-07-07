document.addEventListener("DOMContentLoaded", async () => {
  const container = document.getElementById("form-container");

  // --- Inyectar estilos para los formularios desplegables y controles ---
  const newStyles = `
    .formulario-dinamico > h3 {
        cursor: pointer;
        display: flex;
        justify-content: space-between;
        align-items: center;
        user-select: none;
    }
    .toggle-arrow {
        font-size: 1em;
        transition: transform 0.2s;
    }
    .form-content {
        padding-top: 16px;
        border-top: 1px solid #eee;
        margin-top: 10px;
    }
    .top-controls {
        display: flex;
        justify-content: flex-end;
        gap: 20px;
        padding-bottom: 16px;
        margin-bottom: 16px;
        border-bottom: 1px solid #eee;
    }
    .control-group {
        display: flex;
        align-items: center;
        gap: 8px;
    }
    .control-group label {
        font-weight: normal;
        margin-bottom: 0;
    }
    .control-group input[type="radio"], .control-group input[type="checkbox"] {
        width: auto;
    }
    .collapsed .form-content {
        display: none;
    }
    .collapsed .toggle-arrow {
        transform: rotate(-90deg);
    }
    .buyer-fields {
        display: none;
        margin-top: 16px;
        padding-top: 16px;
        border-top: 1px solid #eee;
    }
  `;
  const styleSheet = document.createElement("style");
  styleSheet.innerText = newStyles;
  document.head.appendChild(styleSheet);


  // Cargar datos desde pasajeros.json con el nuevo formato
  let datosPasajeros;
  try {
    const res = await fetch("pasajeros.json");
    if (!res.ok) throw new Error("HTTP " + res.status);
    datosPasajeros = await res.json();
  } catch (e) {
    console.error("Error cargando pasajeros.json:", e);
    // Valores por defecto si falla la carga
    datosPasajeros = {
      "Adulto": 1,
      "Nino": 0,
      "Infante": 0
    };
  }

  // Guardamos las cantidades del nuevo JSON
  const infantesDisponibles = datosPasajeros.Infante || 0;
  const tipos = [
    { key: "Adulto", label: "Adulto" },
    { key: "Nino",   label: "Niño" }
  ];

  const form = document.createElement("form");
  form.id = "pasajeros-form";
  form.method = "POST";
  form.action = "procesa_formulario.php";

  tipos.forEach(({ key, label }) => {
    const cantidad = datosPasajeros[key] || 0;
    for (let i = 1; i <= cantidad; i++) {
      const bloque = document.createElement("div");
      bloque.className = "formulario-dinamico";
      
      // --- Crear el encabezado clickeable (solo título y flecha) ---
      const header = document.createElement('h3');
      header.innerHTML = `
        <span class="form-title">${label}${cantidad > 1 ? ` ${i}` : ""}</span>
        <span class="toggle-arrow">▼</span>
      `;
      
      // --- Contenido del formulario ---
      const contentWrapper = document.createElement('div');
      contentWrapper.className = 'form-content';

      // --- Div para los controles (dentro del contenido desplegable) ---
      const topControlsDiv = document.createElement('div');
      topControlsDiv.className = 'top-controls';

      // Control de Género (para todos)
      const genderGroup = document.createElement('div');
      genderGroup.className = 'control-group';
      genderGroup.innerHTML = `
        <label>Género:</label>
        <label><input type="radio" name="${key}_genero_${i}" value="M" required> M</label>
        <label><input type="radio" name="${key}_genero_${i}" value="F"> F</label>
      `;
      topControlsDiv.appendChild(genderGroup);

      // Controles solo para Adultos
      if (key === "Adulto") {
        const buyerGroup = document.createElement('div');
        buyerGroup.className = 'control-group';
        buyerGroup.innerHTML = `
            <input type="checkbox" class="buyer-checkbox" id="comprador_${i}" name="Adulto_es_comprador_${i}">
            <label for="comprador_${i}">Comprador</label>
        `;
        topControlsDiv.appendChild(buyerGroup);
        
        if (infantesDisponibles > 0) {
            const infantGroup = document.createElement('div');
            infantGroup.className = 'control-group';
            infantGroup.innerHTML = `
                <input type="checkbox" class="infant-checkbox" id="infante_para_adulto_${i}" name="Adulto_con_infante_${i}">
                <label for="infante_para_adulto_${i}">Con Infante</label>
            `;
            topControlsDiv.appendChild(infantGroup);
        }
      }
      
      // Añadir controles al inicio del contenido
      contentWrapper.appendChild(topControlsDiv);

      // --- Campos de texto del formulario ---
      const fieldsDiv = document.createElement('div');
      fieldsDiv.innerHTML = `
        <div class="form-row">
          <div class="form-group">
            <label for="${key}_nombre_${i}">Nombre *</label>
            <input type="text" id="${key}_nombre_${i}" name="${key}_nombre_${i}" required>
          </div>
          <div class="form-group">
            <label for="${key}_apellidos_${i}">Apellidos *</label>
            <input type="text" id="${key}_apellidos_${i}" name="${key}_apellidos_${i}" required>
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label for="${key}_pais_${i}">País *</label>
            <select id="${key}_pais_${i}" name="${key}_pais_${i}" required>
              <option value="">-- Seleccione un país --</option>
              <option value="Perú">Perú</option>
              <option value="Chile">Chile</option>
              <option value="Argentina">Argentina</option>
              <option value="Colombia">Colombia</option>
              <option value="Ecuador">Ecuador</option>
              <option value="Brasil">Brasil</option>
            </select>
          </div>
          <div class="form-group">
            <label for="${key}_tipo_doc_${i}">Tipo de Documento *</label>
            <select id="${key}_tipo_doc_${i}" name="${key}_tipo_doc_${i}" required>
              <option value="">-- Seleccione tipo --</option>
              <option value="DNI">DNI</option>
              <option value="Pasaporte">Pasaporte</option>
              <option value="Carnet de extranjería">Carnet de extranjería</option>
            </select>
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label for="${key}_num_doc_${i}">Número de Documento *</label>
            <input type="text" id="${key}_num_doc_${i}" name="${key}_num_doc_${i}" required>
          </div>
          <div class="form-group">
            <label for="${key}_fecha_nac_${i}">Fecha de Nacimiento *</label>
            <input type="date" id="${key}_fecha_nac_${i}" name="${key}_fecha_nac_${i}" required>
          </div>
        </div>
      `;
      contentWrapper.appendChild(fieldsDiv);
      
      if (key === "Adulto") {
        const buyerFieldsDiv = document.createElement('div');
        buyerFieldsDiv.className = 'buyer-fields';
        buyerFieldsDiv.id = `buyer_fields_${i}`;
        buyerFieldsDiv.innerHTML = `
          <div class="form-row">
            <div class="form-group">
              <label for="Adulto_telefono_${i}">Teléfono</label>
              <input type="tel" id="Adulto_telefono_${i}" name="Adulto_telefono_${i}">
            </div>
            <div class="form-group">
              <label for="Adulto_email_${i}">E‑mail *</label>
              <input type="email" id="Adulto_email_${i}" name="Adulto_email_${i}">
            </div>
            <div class="form-group">
              <label for="Adulto_email_conf_${i}">Confirmar E‑mail *</label>
              <input type="email" id="Adulto_email_conf_${i}" name="Adulto_email_conf_${i}">
            </div>
          </div>
        `;
        contentWrapper.appendChild(buyerFieldsDiv);
      }

      bloque.appendChild(header);
      bloque.appendChild(contentWrapper);
      form.appendChild(bloque);
    }
  });

  // --- SECCIÓN PARA DATOS DE LA EMPRESA ---
  const empresaDiv = document.createElement("div");
  empresaDiv.className = "formulario-dinamico";
  const empresaHeader = document.createElement('h3');
  empresaHeader.innerHTML = `Datos de la Empresa (Opcional) <span class="toggle-arrow">▼</span>`;
  const empresaContent = document.createElement('div');
  empresaContent.className = 'form-content';
  empresaContent.innerHTML = `
    <div class="form-row">
      <div class="form-group">
        <label for="empresa_ruc">RUC</label>
        <input type="text" id="empresa_ruc" name="empresa_ruc" maxlength="11" pattern="\\d{11}" title="El RUC debe contener 11 dígitos numéricos.">
      </div>
      <div class="form-group">
        <label for="empresa_razon_social">Razón Social</label>
        <input type="text" id="empresa_razon_social" name="empresa_razon_social">
      </div>
    </div>
    <div class="form-row">
        <div class="form-group">
            <label for="empresa_direccion">Dirección</label>
            <input type="text" id="empresa_direccion" name="empresa_direccion">
        </div>
    </div>
  `;
  empresaDiv.appendChild(empresaHeader);
  empresaDiv.appendChild(empresaContent);
  form.appendChild(empresaDiv);


  const submitDiv = document.createElement("div");
  submitDiv.className = "actions";
  submitDiv.innerHTML = `<button type="submit">Enviar</button>`;
  form.appendChild(submitDiv);

  container.appendChild(form);

  // --- LÓGICA DE EVENTOS ---

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
          if (input.type === 'email') input.required = true;
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

  // 3. Control para la validación del NÚMERO DE DOCUMENTO
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
      // Colapsar todos menos el primero por defecto
      if (index > 0) {
          formBlock.classList.add('collapsed');
      }
      header.addEventListener('click', () => {
          formBlock.classList.toggle('collapsed');
      });
  });
});
