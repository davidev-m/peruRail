<?php
// Habilitamos la visualización de errores para el diagnóstico.
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// --- CONFIGURACIÓN ---
// Apuntaremos directamente a la URL base de la API de Culqi.
$url_externa = 'https://api.culqi.com/v2/tokens'; // Usamos un endpoint real de Culqi.

echo "<h1 style='font-family: sans-serif;'>Prueba de Conexión Sencilla a API Externa (Culqi)</h1>";
echo "<p style='font-family: sans-serif;'>Intentando conectar a: <strong>" . htmlspecialchars($url_externa) . "</strong></p><hr>";

try {
    // Paso 1: Verificar si cURL existe.
    if (!function_exists('curl_init')) {
        throw new Exception("La extensión cURL de PHP no está instalada o habilitada. Es indispensable para conectar con APIs.");
    }

    // Paso 2: Inicializar y configurar la petición.
    $ch = curl_init();
    
    curl_setopt($ch, CURLOPT_URL, $url_externa);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true); // Queremos la respuesta como un string.
    curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 10);   // Tiempo de espera para conectar.
    curl_setopt($ch, CURLOPT_TIMEOUT, 15);          // Tiempo total de la petición.
    // Aunque sea una prueba, es bueno enviar el header que la API esperaría.
    curl_setopt($ch, CURLOPT_HTTPHEADER, array(
        'Content-Type: application/json',
        // Para una petición real, aquí iría tu llave de autorización.
        // 'Authorization: Bearer TU_LLAVE_SECRETA'
    ));

    // Paso 3: Ejecutar la petición.
    $respuesta = curl_exec($ch);

    // Paso 4: Verificar si hubo un error de CONEXIÓN.
    if (curl_errno($ch)) {
        // Esto atrapa errores como "Connection timed out", "Could not resolve host", etc.
        throw new Exception('Error de cURL al intentar conectar: ' . curl_error($ch));
    }

    // Si llegamos aquí, la conexión fue exitosa.
    $http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    // --- Muestra de Resultados ---
    echo "<h2 style='font-family: sans-serif; color: #28a745;'>¡ÉXITO! La conexión con el servidor de Culqi se realizó.</h2>";
    echo "<p style='font-family: sans-serif;'>Tu servidor SÍ puede comunicarse con APIs externas.</p>";
    echo "<p style='font-family: sans-serif;'><strong>Código HTTP recibido:</strong> " . $http_code . "</p>";
    
    // Un código 401 (No autorizado) o 405 (Método no permitido) es una RESPUESTA EXITOSA en esta prueba.
    // Significa que Culqi recibió tu petición y te respondió que te faltan permisos, lo cual es correcto.
    if ($http_code == 401 || $http_code == 405) {
        echo "<p style='font-family: sans-serif; color: #007bff;'><strong>Nota Importante:</strong> El código <strong>$http_code</strong> es una excelente señal. Confirma que tu servidor habló con Culqi y Culqi le respondió. El problema de tu integración no es de conectividad.</p>";
    }
    
    echo "<p style='font-family: sans-serif;'><strong>Respuesta del servidor de Culqi:</strong></p>";
    echo "<pre style='background-color: #f8f9fa; padding: 10px; border: 1px solid #dee2e6; border-radius: 5px;'>" . htmlspecialchars($respuesta) . "</pre>";


} catch (Exception $e) {
    // Si algo falló en el proceso, mostramos el error.
    echo "<h2 style='font-family: sans-serif; color: #dc3545;'>FALLO LA CONEXIÓN</h2>";
    echo "<p style='font-family: sans-serif;'>Tu servidor NO pudo comunicarse con la API externa.</p>";
    echo "<p style='font-family: sans-serif;'><strong>Mensaje de error:</strong> " . $e->getMessage() . "</p>";
    echo "<hr>";
    echo "<p style='font-family: sans-serif;'><strong>¿Qué significa esto?</strong><br>El problema está en la configuración de tu servidor (probablemente un firewall o la configuración de PHP/cURL). Debes contactar a tu proveedor de hosting con este mensaje de error para que te ayuden a solucionarlo.</p>";
}
?>
