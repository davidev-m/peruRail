<?php
    session_start();
    header('content-Type:application/json');
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Headers:Content-Type');
    $confirmacion = json_decode(file_get_contents('php://input'), true);     
    if($confirmacion){
        
    }
?>