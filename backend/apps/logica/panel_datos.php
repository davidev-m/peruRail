<?php
    include_once __DIR__ . '/../modelos/modelos.php';
    include_once __DIR__ . '/config.php';
    header('Content-Type: application/json');
    header('Access-Control-Allow-Origin: http://localhost');
    header('Access-Control-Allow-Credentials:true');
    header('Access-Control-Allow-Methods: POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type');
    if($_SERVER['REQUEST_METHOD'] == 'OPTIONS'){
        http_response_code(200);
        exit();
    }

    $entidades = CLASES_PERMITIDAS;
    $datosR = json_decode(file_get_contents('php://input'), true);
    $clase = $datosR['tabla'];
    if(in_array($clase, $entidades)){
        $modelo = new $clase();
        $datos = $modelo->mostrarAdmin($clase);
        echo json_encode($datos);
    }else{
        http_response_code(400);
        echo json_encode([
            'error' => "Entidad no valida"
        ]);
    }
?>