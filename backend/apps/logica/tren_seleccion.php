<?php

session_start(); // Asegúrate de que session_start() sea la primera línea ejecutada

header('content-Type:application/json');
// CAMBIO CLAVE: Cambiar * por el origen exacto de tu frontend
header('Access-Control-Allow-Origin: http://localhost'); 
header('Access-Control-Allow-Credentials: true'); // Necesario cuando Access-Control-Allow-Origin no es * y usas credentials: 'include'
header('Access-Control-Allow-Methods: POST, OPTIONS, GET'); // Asegúrate de incluir todos los métodos HTTP que uses
header('Access-Control-Allow-Headers: Content-Type'); 

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}
    header('Content-Type:application/json');
    $datos = json_decode(file_get_contents('php://input'), true);
   
       error_log("tren_seleccion.php -> Contenido de SESSION: " . print_r($_SESSION, true));

    if(json_last_error() !== JSON_ERROR_NONE){
        http_response_code(400);
        echo json_encode(["success" => false, "error" =>"JSON inválido"]);
        exit(); // Anadir exit() después de enviar una respuesta de error
    }     
    $_SESSION['trenes_seleccionados'] = $datos;

    error_log("tren_seleccion.php -> Contenido de SESSION DESPUÉS DE GUARDAR TRENES: " . print_r($_SESSION, true));

    echo json_encode(["success" => true, "message" => "Datos de trenes seleccionados guardados en sesión."]);
?>
