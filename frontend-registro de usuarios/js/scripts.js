// Valida que E‑mail y su confirmación coincidan antes de enviar
const form = document.getElementById('ejemplo');
form.addEventListener('submit', function(e) {
  const email = form.email.value.trim();
  const confirm = form.email_confirmacion.value.trim();
  if (email !== confirm) {
    e.preventDefault();
    alert('Los correos electrónicos no coinciden.');
    form.email_confirmacion.focus();
  }
});

document.addEventListener("DOMContentLoaded", async () => {
  try {
    const response = await fetch("pasajeros.json"); // El archivo JSON
    const data = await response.json();

    const contenedor = document.getElementById("form-container");

    let index = 1;

    // Agregar cliente comprador (siempre 1)
    contenedor.appendChild(crearFormularioPasajero(index++, "Comprador"));

    // Agregar adultos
    for (let i = 0; i < data.Cliente_Adulto; i++) {
      contenedor.appendChild(crearFormularioPasajero(index++, "Adulto"));
    }

    // Agregar niños
    for (let i = 0; i < data.Cliente_Niño; i++) {
      contenedor.appendChild(crearFormularioPasajero(index++, "Niño"));
    }

    // Agregar infantes
    for (let i = 0; i < data.Cliente_Infante; i++) {
      contenedor.appendChild(crearFormularioPasajero(index++, "Infante"));
    }

  } catch (error) {
    console.error("Error al cargar pasajeros.json:", error);
  }
});


function crearFormularioPasajero(numero, tipo) {
  const div = document.createElement("div");
  div.classList.add("pasajero");

  div.innerHTML = `
    <h2>Pasajero ${numero} - ${tipo}</h2>
    <p>Nombre: <input name="nombre_${numero}" required></p>
    <p>Apellidos: <input name="apellidos_${numero}" required></p>
    <p>País: <select name="pais_${numero}" required>
      <option value="">Selecciona</option>
      <option value="Perú">Perú</option>
      <option value="Argentina">Argentina</option>
      <option value="México">México</option>
      <!-- ...otros países -->
    </select></p>
    <p>Tipo de Documento: 
      <select name="documento_tipo_${numero}" required>
        <option value="">Selecciona</option>
        <option value="DNI">DNI</option>
        <option value="Pasaporte">Pasaporte</option>
        <option value="Carnet de Extranjería">Carnet de Extranjería</option>
      </select>
    </p>
    <p>Numero de Documento: <input name="documento_num_${numero}" required></p>
    <p>Fecha de Nacimiento: <input type="date" name="nacimiento_${numero}" required></p>
    <p>Teléfono: <input name="telefono_${numero}"></p>
    <p>Email: <input name="email_${numero}" type="email"></p>
    <p>Confirmar Email: <input name="confirmar_email_${numero}" type="email"></p>
    <hr>
  `;
  return div;
}
