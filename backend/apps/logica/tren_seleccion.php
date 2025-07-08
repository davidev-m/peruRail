<?php
    session_start();
    header('Content-Type:application/json');
    $datos = json_decode(file_get_contents('php://input'), true);
    if(json_last_error() !== JSON_ERROR_NONE){
        http_response_code(400);
        echo json_encode(["success" => false, "error" =>"JSON inválido"]);
    }     
    $_SESSION['trenes_seleccionados'] = $datos;
?>