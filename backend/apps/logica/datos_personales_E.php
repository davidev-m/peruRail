<?php

session_start(); // Asegúrate de que session_start() sea la primera línea ejecutada

header('content-Type:application/json');
header('Access-Control-Allow-Origin: http://localhost');
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Headers:Content-Type');

// Log de depuración: ID de sesión y contenido de la sesión al inicio

try{
    // Obtener los valores de la sesión, usando 0 como valor por defecto si no existen
    $adultos = $_SESSION['adultos'];
    $ninos = $_SESSION['ninos'];
    $infantes = $_SESSION['infantes'];

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
