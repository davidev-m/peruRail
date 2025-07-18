<?php
require_once __DIR__ . '/../modelos/modelos.php';
require_once __DIR__ . '/config.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: http://localhost'); // Asegúrate que el puerto coincida si lo usas
header('Access-Control-Allow-Credentials:true');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

try {
    $datosRecibidos = json_decode(file_get_contents('php://input'), true);

    if (!isset($datosRecibidos['tabla'])) {
        throw new InvalidArgumentException("No se especificó la entidad a consultar.");
    }
    
    $nombreClase = $datosRecibidos['tabla'];

    if (in_array($nombreClase, CLASES_PERMITIDAS)) {
        
        $modelo = new $nombreClase();

        $datos = $modelo->mostrarAdmin($nombreClase);
        
        echo json_encode([
            'success' => true,
            'data' => $datos
        ]);

    } else {
        http_response_code(400); // Bad Request
        throw new InvalidArgumentException("La entidad '$nombreClase' no es válida.");
    }

} catch (Exception $e) {
   error_log("Error en panel_datos.php: " . $e->getMessage());
    
    if ($e instanceof InvalidArgumentException) {
        http_response_code(400);
    } else {
        http_response_code(500);
    }

    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}
?>
