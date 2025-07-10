<?php
ini_set('session.cookie_path', '/');
ini_set('session.cookie_domain', '');
ini_set('session.cookie_secure', '0');
session_start();

header('content-Type:application/json');
header('Access-Control-Allow-Origin: http://localhost'); // CAMBIO AQUÍ
header('Access-Control-Allow-Credentials: true'); // AÑADIDO
header('Access-Control-Allow-Headers:Content-Type');

error_log("datos_personales_E.php -> Session ID: " . session_id());
error_log("datos_personales_E.php -> Contenido de SESSION: " . print_r($_SESSION, true));

try{
    $adultos = $_SESSION['adultos'] ?? 0; // Usar ?? para evitar Undefined index si no existe
    $ninos = $_SESSION['ninos'] ?? 0;
    $infantes = $_SESSION['infantes'] ?? 0; // Asumo que también querrías usar el valor de sesión si existe
    $resultado = [
        'Adulto' => $adultos,
        'Nino' => $ninos,
        'Infante' => $infantes
    ];
    echo json_encode($resultado);
}catch(Exception $error){
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error' => $error->getMessage()
    ]);
}
?>