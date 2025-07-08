<?php
    session_start();
    header('content-Type:application/json');
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Headers:Content-Type');
    try{
        $adultos = $_SESSION['adultos'];
        $niños = $_SESSION['niños'];
        $infantes = $_SESSION['infantes'];
        if(empty($adultos) || empty($niños) || empty($infantes)){
            throw new InvalidArgumentException("Datos invalidos");
        }
        $resultado = [
            "adultos" => $adultos,
            "niños" => $niños,
            "infantes" => $infantes
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