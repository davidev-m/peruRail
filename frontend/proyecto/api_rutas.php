<?php
header("Content-Type: application/json");
require_once __DIR__ . '/../pruebas/logica/viaje_logica.php';

$accion = $_GET['accion'] ?? '';

switch ($accion) {
    case 'idaVuelta':
        $origen = $_GET['origen'] ?? '';
        $destino = $_GET['destino'] ?? '';
        echo json_encode(idaVuelta($origen, $destino));
        break;

    case 'fechaDisponible':
        $origen = $_GET['origen'] ?? '';
        $destino = $_GET['destino'] ?? '';
        echo json_encode(fechaDisponible($origen, $destino));
        break;

    case 'destinos':
        $origen = $_GET['origen'] ?? '';
        echo json_encode(destinos($origen));
        break;

    default:
        echo json_encode(["error" => "Acción no válida"]);
        break;
}
?> 
 
