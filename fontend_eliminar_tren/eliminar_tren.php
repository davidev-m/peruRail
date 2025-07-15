<?php

/**
 * eliminar_tren.php
 *
 * Script de backend para manejar la eliminación de un registro de tren.
 * Recibe un objeto JSON, procesa la eliminación (simulada en este caso)
 * y devuelve una respuesta JSON.
 */

// 1. Establecer la cabecera de la respuesta a JSON.
// Esto le dice al cliente (el navegador) que la respuesta que se envía es en formato JSON.
header('Content-Type: application/json');

// 2. Obtener el método de la petición (GET, POST, etc.).
$method = $_SERVER['REQUEST_METHOD'];

// 3. Verificar que la petición sea de tipo POST.
// Por seguridad y buenas prácticas, las operaciones que modifican datos deben usar POST.
if ($method !== 'POST') {
    // Si no es POST, envía un error 405 (Método no permitido) y termina el script.
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'message' => 'Método no permitido. Se esperaba POST.'
    ]);
    exit;
}

// 4. Leer el cuerpo de la petición.
// 'php://input' es un flujo de solo lectura que permite leer datos crudos del cuerpo de la petición.
// Es la forma correcta de obtener el JSON enviado por fetch().
$json_data = file_get_contents('php://input');

// 5. Decodificar la cadena JSON a un objeto de PHP.
// El segundo parámetro 'true' lo convertiría en un array asociativo. Lo dejamos como objeto.
$data = json_decode($json_data);

// 6. Validar los datos recibidos.
// Verificamos si el JSON es válido y si contiene la propiedad 'codigo'.
if (json_last_error() !== JSON_ERROR_NONE || !isset($data->codigo)) {
    // Si hay un error, envía un error 400 (Petición incorrecta) y termina.
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'Datos JSON inválidos o código de tren no proporcionado.'
    ]);
    exit;
}

// 7. Procesar la eliminación (Aquí iría la lógica de tu base de datos).
$codigo_tren = $data->codigo;

// --- SIMULACIÓN DE LA LÓGICA DE BASE DE DATOS ---
// En un caso real, aquí te conectarías a tu base de datos (MySQL, PostgreSQL, etc.)
// y ejecutarías una consulta para eliminar el registro.
/*
    // Ejemplo con PDO (PHP Data Objects) para MySQL:
    try {
        $pdo = new PDO("mysql:host=localhost;dbname=tu_base_de_datos", "tu_usuario", "tu_contraseña");
        $stmt = $pdo->prepare("DELETE FROM trenes WHERE codigo = ?");
        $stmt->execute([$codigo_tren]);

        // Si la consulta afectó a una fila, la eliminación fue exitosa.
        if ($stmt->rowCount() > 0) {
            $eliminacion_exitosa = true;
        } else {
            $eliminacion_exitosa = false;
        }

    } catch (PDOException $e) {
        // Manejar errores de conexión o de la consulta
        $eliminacion_exitosa = false;
        // Podrías registrar el error: error_log($e->getMessage());
    }
*/
// Para este ejemplo, vamos a simular que la eliminación siempre es exitosa.
$eliminacion_exitosa = true;
// --- FIN DE LA SIMULACIÓN ---


// 8. Enviar la respuesta final al frontend.
if ($eliminacion_exitosa) {
    // Si la eliminación fue exitosa, envía un código 200 (OK).
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'message' => "Tren con código {$codigo_tren} eliminado correctamente."
    ]);
} else {
    // Si algo falló en la base de datos, envía un error 500 (Error interno del servidor).
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => "Error en el servidor al intentar eliminar el tren con código {$codigo_tren}."
    ]);
}

?>
