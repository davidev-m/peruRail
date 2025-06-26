<?php
// Establecer el tipo de contenido de la respuesta como JSON
header("Content-Type: application/json");

// Incluir el archivo PHP que contiene la lógica de negocio de las rutas de viaje
require_once __DIR__ . '/../pruebas/logica/viaje_logica.php';

// Obtener la acción enviada por la URL. Si no existe, se asigna una cadena vacía.
$accion = $_GET['accion'] ?? '';

// Ejecutar diferentes funciones según el valor de "accion"
switch ($accion) {

    // Caso 1: Verificar si existe ida y vuelta entre origen y destino
    case 'idaVuelta':
        $origen = $_GET['origen'] ?? '';    // Obtener el origen desde la URL
        $destino = $_GET['destino'] ?? '';  // Obtener el destino desde la URL
        echo json_encode(idaVuelta($origen, $destino)); // Retornar el resultado en formato JSON
        break;

    // Caso 2: Obtener los días disponibles para viajar entre origen y destino
    case 'fechaDisponible':
        $origen = $_GET['origen'] ?? '';    // Obtener el origen desde la URL
        $destino = $_GET['destino'] ?? '';  // Obtener el destino desde la URL
        echo json_encode(fechaDisponible($origen, $destino)); // Retornar el resultado en formato JSON
        break;

    // Caso 3: Obtener los destinos disponibles para un origen determinado
    case 'destinos':
        $origen = $_GET['origen'] ?? '';    // Obtener el origen desde la URL
        echo json_encode(destinos($origen)); // Retornar el resultado en formato JSON
        break;

    // Caso por defecto: si no se reconoce la acción, se devuelve un error
    default:
        echo json_encode(["error" => "Acción no válida"]);
        break;
}
?>
