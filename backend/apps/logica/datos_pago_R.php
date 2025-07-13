<?php
    session_start();
    header('content-Type:application/json');
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Headers:Content-Type');
    $confirmacion = json_decode(file_get_contents('php://input'), true);     
    if($confirmacion['verificacion']){

    }
    echo json_encode(["success" => true, "message" => "Datos de trenes seleccionados guardados en sesión."]);

?>