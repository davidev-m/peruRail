<?php
// Habilitar la visualización de errores para desarrollo
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Establecer la cabecera para indicar que la respuesta es JSON
header('Content-Type: application/json');

// Iniciar la sesión para poder guardar datos en ella.
session_start();

// Verificar que la petición sea por el método POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405); // Method Not Allowed
    echo json_encode(['success' => false, 'error' => 'Método no permitido.']);
    exit();
}

try {
    // 1. Leer el cuerpo de la petición (que contiene el JSON)
    $json_data = file_get_contents('php://input');

    // 2. Decodificar el JSON a un array asociativo de PHP
    $datos_reserva = json_decode($json_data, true);

    // Verificar si el JSON es válido
    if (json_last_error() !== JSON_ERROR_NONE) {
        throw new Exception('JSON inválido recibido.');
    }

    // 3. Guardar el array completo en la sesión
    $_SESSION['datos_reserva'] = $datos_reserva;

    // 4. Enviar una respuesta de éxito al cliente
    echo json_encode(['success' => true, 'message' => 'Datos de la reserva guardados correctamente.']);

} catch (Exception $e) {
    // En caso de cualquier error, enviar una respuesta de error
    http_response_code(400); // Bad Request
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}

?>
