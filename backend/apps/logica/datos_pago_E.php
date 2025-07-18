<?php
    session_start();
    header('content-Type:application/json');
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Headers:Content-Type');


    error_log("datos_personales_E.php -> Contenido de SESSION: " . print_r($_SESSION, true));
    //Antes de iniciar comprobamos los datos  de SESSION
    if (!isset($_SESSION['trenes_seleccionados']) || !isset($_SESSION['pasajeros'])) {
        http_response_code(400);
        echo json_encode(["error" => "Datos de sesión no encontrados"]);
        exit;
    }

    $trenes = $_SESSION['trenes_seleccionados'];

    $tipo = "Ida";
    $transporte = "SERVICIO REGULAR(TREN)";

    $tren_retorno = isset($trenes["trenRetorno"]);
    if($tren_retorno){
        $tipo .= " y Retorno";
        $transporte = "SERVICIO BIMODAL(BUS + TREN)";
    }

    $montoIda = $trenes['trenIda']['tren']['precio'];
    $resultado = [
        'tipo' => $tipo,
        "viajes" => [
            [
                "titulo" => "TREN DE IDA",
                "ruta" => $trenes['trenIda']['estaciones'][0] . " - ". $trenes['trenIda']['estaciones'][1],
                "tren" => $trenes["trenIda"]["tren"]["nombre"],
                "transporte" => $transporte,
                "ida" => $trenes['fechaIda'] . " " .$trenes['trenIda']['hora_salida'],
                "llegada" => $trenes['fechaRet'] . " " .$trenes['trenIda']['hora_llegada'],
                "monto" => $montoIda
            ]
        ]
    ];

    if($tren_retorno){
        $montoRetorno = $trenes['trenRetorno']['tren']['precio'];
        $resultado['viajes'][] = [
            "titulo" => "TREN DE RETORNO",
                    "ruta" => $trenes['trenRetorno']['estaciones'][0] . " - ". $trenes['trenRetorno']['estaciones'][1],
                    "tren" => $trenes["trenRetorno"]["tren"]["nombre"],
                    "transporte" => $transporte,
                    "ida" => $trenes['fechaIda'] . " " .$trenes['trenRetorno']['hora_salida'],
                    "llegada" => $trenes['fechaRet'] . " " .$trenes['trenRetorno']['hora_llegada'],
                    "monto" => $montoRetorno
        ];
    }
    $pasajeros = $_SESSION['pasajeros'];
    $monto_total = 0;
    
    //GUARDAR DATOS PASAJEROS---------------------------------------------------
    //GUARDAR DATOS DE ADULTOS
    $cantAdultos = count($pasajeros['adultos']);
    for($i = 0; $i < $cantAdultos; $i++){
        $telefono = isset($pasajeros["adultos"][$i]['telefono']) ? $pasajeros["adultos"][$i]['telefono'] : '-';
        $email = isset($pasajeros["adultos"][$i]['email']) ? $pasajeros["adultos"][$i]['email'] : '-';
        if (isset($pasajeros["adultos"][$i]['es_comprador']) && $pasajeros["adultos"][$i]['es_comprador'] == 1 && isset($_SESSION['comprador'])) {
            $telefono = isset($_SESSION['comprador']['telefono']) ? $_SESSION['comprador']['telefono'] : $telefono;
            $email = isset($_SESSION['comprador']['email']) ? $_SESSION['comprador']['email'] : $email;
        }
        $resultado['pasajeros'][] = [
            "nombre" => $pasajeros["adultos"][$i]['nombre'] ." " . $pasajeros["adultos"][$i]['apellidos'],
            "documento" => $pasajeros["adultos"][$i]['num_doc'],
            "tarifa" => "ADULTO",
            "pais" => isset($pasajeros["adultos"][$i]['pais']) ? $pasajeros["adultos"][$i]['pais'] : '-',
            "telefono" => $telefono,
            "email" => $email,
            "nacionalidad" => isset($pasajeros["adultos"][$i]['nacionalidad']) ? $pasajeros["adultos"][$i]['nacionalidad'] : (isset($pasajeros["adultos"][$i]['pais']) ? $pasajeros["adultos"][$i]['pais'] : '-')
        ];
        $monto_total += (int)$montoIda;
        if($tren_retorno){
            $monto_total += (int)$montoRetorno; 
        }
    }
    
    if(isset($pasajeros['ninos'])){
        //GUARDAR DATOS DE NIÑO
        $cantninos = count($pasajeros['ninos']);
        for($i = 0; $i < $cantninos; $i++){
            $resultado['pasajeros'][] = [
                "nombre" => $pasajeros["ninos"][$i]['nombre'] ." " . $pasajeros["ninos"][$i]['apellidos'],
                "documento" => $pasajeros["ninos"][$i]['num_doc'],
                "tarifa" => "NIÑO",
                "pais" => isset($pasajeros["ninos"][$i]['pais']) ? $pasajeros["ninos"][$i]['pais'] : '-',
                "telefono" => isset($pasajeros["ninos"][$i]['telefono']) ? $pasajeros["ninos"][$i]['telefono'] : '-',
                "email" => isset($pasajeros["ninos"][$i]['email']) ? $pasajeros["ninos"][$i]['email'] : '-',
                "nacionalidad" => isset($pasajeros["ninos"][$i]['nacionalidad']) ? $pasajeros["ninos"][$i]['nacionalidad'] : (isset($pasajeros["ninos"][$i]['pais']) ? $pasajeros["ninos"][$i]['pais'] : '-')
            ];
            $monto_total += (int)$montoIda;
            if($tren_retorno){
                $monto_total += (int)$montoRetorno; 
            }
        }
    }
    $resultado['total'] = $monto_total;
    $_SESSION['monto_total'] = $monto_total;
    //--------------------------------------------------------------------
        
    error_log("datos_pago_E.php -> Contenido de SESSION: " . print_r($resultado, true));
    echo json_encode($resultado);

?>