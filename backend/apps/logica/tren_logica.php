<?php
    session_start();
    require_once __DIR__ . '/../modelos/modelos.php';
    
    
//Sola la primera vez pide mas datos después solo fecha IMPORTANTE
    /**
     * origen, destino, fechaIda fechaRetorno
     * fecha => [
     * ida => 00
     * retorno =>]
     */
    function duracion($hora_salida, $hora_llegada){
        $salida = new DateTime($hora_salida);
        $llegada = new DateTime($hora_llegada);
        return $salida->diff($llegada)->format('%H hr. %i min');
    }

    function formato($hora){
        $fecha = new DateTime($hora);
        return $fecha->format('H:i');
    }

    header('content-Type:application/json');
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: POST, OPTIONS');
    header('Access-Control-Allow-Headers:Content-Type');
    if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(response_code: 200);
    exit();
    }
    try{
        $datosR = json_decode(file_get_contents('php://input'),true);
        $ruta = new Ruta();
        
        $origen = $datosR['origen'];
        $destino = $datosR['destino'];
        $fecha = $datosR['fecha_salida'];
        if(empty($origen) || empty($destino) || empty($fecha)){
            throw new InvalidArgumentException("Datos vacios");
        }
        //Datos guardados en sesion----------------------------
        //Si no se inicializó los datos de SESSION se guarda
        if (!isset($_SESSION["adultos"])) $_SESSION["adultos"] = (int)$datosR["adultos"];
        if (!isset($_SESSION["niños"])) $_SESSION["niños"] = (int)$datosR["niños"];
        if (!isset($_SESSION["infantes"])) $_SESSION["infantes"] = (int)$datosR["infantes"];

        //------------------------------------------------------
        
        
        $viaje = new Viaje();
        $resultado = $viaje->buscar($origen,$destino, $fecha);
        
        //Logica antes de antes del frondend
        $pasajeros = (int)$datosR["adultos"] + (int)$datosR["niños"]; 
        $j = 0;
        //Datos enviados al frondend----------------------------
        $jsonRetorna = [];
        foreach($resultado as $i => $datos_viaje){
            if(isset($datos_viaje['cap_disponible']) && $pasajeros < $datos_viaje['cap_disponible']){
                $bus = "Tren";
                if($datos_viaje['id_bus'] != null){
                    $bus = "Bus + $bus";
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
        if(empty($jsonRetorna)){
            echo json_encode(["mensaje" => "No hay disponibilidad para los pasajeros seleccionados."]);
        }else{
            echo json_encode($jsonRetorna);
        }
        //------------------------------------------------------
    }catch(Exception $error){
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'error' => $error->getMessage()
        ]);
    }
?>