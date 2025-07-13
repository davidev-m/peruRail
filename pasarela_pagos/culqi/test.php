<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

echo "<h1>Prueba de Conexión Directa con cURL</h1>";

$url = "https://api.culqi.com/v2/charges";

// 1. Inicializar cURL
$ch = curl_init();

// 2. Configurar las opciones
// Le decimos que se conecte a la URL de Culqi
curl_setopt($ch, CURLOPT_URL, $url);
// Le pedimos que nos devuelva el resultado como un string en lugar de imprimirlo
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
// Le damos un tiempo de espera de 10 segundos
curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 10);
// Habilitamos la salida de depuración para ver todo lo que hace cURL
curl_setopt($ch, CURLOPT_VERBOSE, true);

// 3. Ejecutar la petición
echo "<p>Intentando conectar a: <strong>{$url}</strong>...</p>";
$response = curl_exec($ch);

// 4. Verificar si hubo errores
if (curl_errno($ch)) {
    // Si hay un error de cURL, lo mostramos
    $error_msg = curl_error($ch);
    echo "<p style='color:red; font-weight:bold;'>Error de cURL: " . htmlspecialchars($error_msg) . "</p>";
    echo "<p><strong>Diagnóstico:</strong> Esto confirma que PHP no puede establecer una conexión de red con el exterior. La causa más probable es una política de SELinux o una regla del Firewall.</p>";
} else {
    // Si la conexión es exitosa, mostramos la respuesta
    echo "<p style='color:green; font-weight:bold;'>¡Conexión Exitosa!</p>";
    echo "<p><strong>Respuesta del servidor de Culqi (esto es lo esperado):</strong></p>";
    echo "<pre>" . htmlspecialchars($response) . "</pre>";
    echo "<p><strong>Diagnóstico:</strong> Si ves esto, significa que PHP sí puede conectarse, y el problema está en cómo la librería de Culqi está manejando la conexión.</p>";
}

// 5. Cerrar la conexión
curl_close($ch);
