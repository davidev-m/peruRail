<?php
    require_once __DIR__ . '/../modelos/modelos.php';
    require_once __DIR__ . '/config.php';
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: http://localhost');
header('Access-Control-Allow-Credentials:true');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Manejo de la petición pre-vuelo (pre-flight) OPTIONS
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}
try{
    $crud = new caso_base_CRUD();
    $tabla = CLASES_PERMITIDAS;
    $select = "COUNT(*) as total";
    $json_data = [];
    foreach($tabla as $entidad){
        $cantidad = $crud->buscar(tabla: $entidad,datosSeleccion: $select);
        $json_data[$entidad] = $cantidad[0]['total'];
    }
    echo json_encode(['success' => true, 'data' => $json_data]);
}catch(Exception $error){
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => "Ocurrio un error " . $error->getMessage()
    ]);
}

?>
