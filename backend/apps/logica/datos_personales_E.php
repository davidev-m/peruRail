<?php

session_start(); // Asegúrate de que session_start() sea la primera línea ejecutada

header('content-Type:application/json');
header('Access-Control-Allow-Origin: http://localhost');
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Headers:Content-Type');

// Log de depuración: ID de sesión y contenido de la sesión al inicio
error_log("datos_personales_E.php -> Session ID: " . session_id());
error_log("datos_personales_E.php -> Contenido de SESSION: " . print_r($_SESSION, true));

try{
    // Obtener los valores de la sesión, usando 0 como valor por defecto si no existen
    $adultos = $_SESSION['adultos'] ?? 0;
    $ninos = $_SESSION['ninos'] ?? 0;
    $infantes = $_SESSION['infantes'] ?? 0;

    $resultado = [
        'Adulto' => $adultos,
        'Nino' => $ninos,
        'Infante' => $infantes
    ];

    echo json_encode($resultado);
    exit(); // Asegura que el script termina aquí y no hay salida adicional
}catch(Exception $error){
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error' => $error->getMessage()
    ]);
    exit(); // Asegura que el script termina aquí en caso de error
}
?>
