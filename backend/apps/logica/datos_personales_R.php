<?php
    session_start();
    header('Content-Type:application/json');
    $datos_cliente = json_decode(file_get_contents('php://input'), true);     
 
    $_SESSION['pasajeros'] = $datos_cliente['pasajeros'];
    $_SESSION['comprador'] = $datos_cliente['comprador'];
    
    if (!isset($_SESSION['pasajeros']) || !isset($_SESSION['comprador'])) {
        http_response_code(400);
        echo json_encode(["error" => "Faltan datos en sesión."]);
        exit;
    }
    
    if(isset($datos_cliente["empresa"])){
        $_SESSION['empresa'] = $datos_cliente['empresa'];
    }
    echo json_encode(['success' => true, 'message' => 'Datos de la reserva guardados correctamente.']);

?>