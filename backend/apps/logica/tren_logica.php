<?php
include_once __DIR__ . '/../modelos/modelos.php';
session_start(); // Inicia una nueva sesión limpia



header('content-Type:application/json');
header('Access-Control-Allow-Origin: http://localhost');
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: POST, OPTIONS, GET');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

function duracion($hora_salida, $hora_llegada){
    $salida = new DateTime($hora_salida);
    $llegada = new DateTime($hora_llegada);
    return $salida->diff($llegada)->format('%H hr. %i min');
}

function formato($hora){
    $fecha = new DateTime($hora);
    return $fecha->format('H:i');
}

try{
    
    $datosR = json_decode(file_get_contents('php://input'),true);

    // Debugging the received data
    error_log("tren_logica.php -> Datos recibidos del frontend (\$datosR): " . print_r($datosR, true));

    $ruta = new Ruta();



    
    // Asegúrate de que estas claves existan antes de usarlas
    $origen = $datosR['origen'] ?? '';
    $destino = $datosR['destino'] ?? '';
    $fecha = $datosR['fechaIda'] ?? ''; // Usar 'fechaIda' como en tu JS

    if(empty($origen) || empty($destino) || empty($fecha)){
        throw new InvalidArgumentException("Datos de origen, destino o fecha de ida vacíos.");
    }

    // Datos guardados en sesion----------------------------
    // Asegúrate de que estas claves existan en $datosR antes de asignarlas a $_SESSION
    $_SESSION['adultos'] = (int)($datosR['adultos'] ?? 0);
    $_SESSION['ninos'] = (int)($datosR['ninos'] ?? 0); 
    $_SESSION['infantes'] = (int)($datosR['infantes'] ?? 0);

    error_log("tren_logica.php -> Contenido de SESSION DESPUÉS DE GUARDAR NUEVOS DATOS: " . print_r($_SESSION, true));
   //------------------------------------------------------


    $viaje = new Viaje();
    $resultado = $viaje->buscar($origen,$destino, $fecha);

    // Lógica antes del frontend
    $pasajeros = (int)($datosR['adultos'] ?? 0) + (int)($datosR['ninos'] ?? 0); 
    $j = 0;
    //Datos enviados al frondend----------------------------
    $jsonRetorna = [];
    foreach($resultado as $i => $datos_viaje){
        if(isset($datos_viaje['cap_disponible']) && $pasajeros < $datos_viaje['cap_disponible']){
            $bus = "Tren";
            if($datos_viaje['id_bus'] != null){
                $bus = "Bus + " . $bus;
            }
            $jsonRetorna[$j] = [
                "hora_salida" => formato($datos_viaje['hora_salida']),
                "hora_llegada" => formato($datos_viaje['hora_llegada']),
                "duracion" => duracion($datos_viaje['hora_salida'], $datos_viaje['hora_llegada']),
                "estaciones" => [$datos_viaje['est_origen'], $datos_viaje['est_destino']],
                "tren" => [
                    "nombre" => ($datos_viaje['nombre_clase'] . ' '.$datos_viaje['codigo'] ),
                    "precio" => $datos_viaje['precio_pasaje'],
                    "movilidad" => $bus,
                    "id_bus" => $datos_viaje['id_bus']
                ]
            ];
            $j++;
        }
    }
    echo json_encode($jsonRetorna);
    //------------------------------------------------------
}catch(Exception $error){
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error' => $error->getMessage()
    ]);
}
?>