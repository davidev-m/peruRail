<?php
require_once __DIR__ . '/../modelos/modelos.php';
require_once __DIR__ . '/config.php';

// --- Cabeceras HTTP ---
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: http://localhost');
header('Access-Control-Allow-Credentials:true');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Manejo de la petición pre-vuelo (pre-flight) OPTIONS
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

// --- Lógica Principal del Controlador ---
try {
    $datosRecibidos = json_decode(file_get_contents('php://input'), true);

    // 1. Validar que los datos básicos existan
    if (!$datosRecibidos || !isset($datosRecibidos['accion']) || !isset($datosRecibidos['tabla'])) {
        throw new InvalidArgumentException("La solicitud es inválida. Faltan 'accion' o 'tabla'.");
    }

    $accion = $datosRecibidos['accion'];
    $tabla = $datosRecibidos['tabla'];
    $nombreClase = ucfirst($tabla);

    // 2. Verificar que la entidad solicitada sea válida
    if (!in_array($nombreClase, CLASES_PERMITIDAS)) {
        throw new InvalidArgumentException("La entidad '$nombreClase' no es válida.");
    }

    $modelo = new $nombreClase();
    $respuesta = [];

    // 4. Ejecutar la acción solicitada
    switch ($accion) {
        case 'insertar':
            if (!isset($datosRecibidos['datos'])) {
                throw new InvalidArgumentException("No se proporcionaron datos para insertar.");
            }
            $nuevoId = $modelo->insertar($tabla, $datosRecibidos['datos']);
            $respuesta = [
                'message' => 'Registro insertado con éxito.',
                'id' => $nuevoId
            ];
            break;

        case 'modificar':
            if (!isset($datosRecibidos['datos'])) {
                throw new InvalidArgumentException("No se proporcionaron 'datos' para modificar.");
            }
            
            // Lógica robusta para extraer la condición (ID)
            $condicionArray = $datosRecibidos;
            unset($condicionArray['accion'], $condicionArray['tabla'], $condicionArray['datos']);
            
            if (count($condicionArray) !== 1) {
                throw new InvalidArgumentException("La solicitud de modificación debe contener exactamente una clave de ID (ej: 'id_tren').");
            }

            $filasAfectadas = $modelo->modificar($tabla, $datosRecibidos['datos'], $condicionArray['condicion']);
            $respuesta = [
                'message' => 'Registro modificado con éxito.',
                'filas_afectadas' => $filasAfectadas
            ];
            break;

        case 'eliminar':
            // Lógica robusta para extraer la condición (ID)
            $condicionArray = $datosRecibidos;
            unset($condicionArray['accion'], $condicionArray['tabla']);

            if (count($condicionArray) !== 1) {
                throw new InvalidArgumentException("La solicitud de eliminación debe contener exactamente una clave de ID (ej: 'id_tren').");
            }
            
            $modelo->eliminar($tabla, $condicionArray['condicion']);
            $respuesta = ['message' => 'Registro desactivado con éxito.'];
            break;
        
        default:
            throw new InvalidArgumentException("La acción '$accion' no es válida.");
    }

    // 5. Enviar respuesta de éxito
    echo json_encode(['success' => true, 'data' => $respuesta]);

} catch (Exception $e) {
    // Si cualquier cosa dentro del 'try' falla, este bloque se ejecutará.
    error_log("Error en panel_operaciones.php: " . $e->getMessage());

    $codigoError = ($e instanceof InvalidArgumentException) ? 400 : 500;
    http_response_code($codigoError);

    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}
?>
