<?php
ini_set('session.cookie_path', '/');
ini_set('session.cookie_domain', '');
ini_set('session.cookie_secure', '0');
session_start();

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
    session_start();
    header('Content-Type:application/json');
    $datos = json_decode(file_get_contents('php://input'), true);
    if(json_last_error() !== JSON_ERROR_NONE){
        http_response_code(400);
        echo json_encode(["success" => false, "error" =>"JSON inválido"]);
    }     
    $_SESSION['trenes_seleccionados'] = $datos;
?>