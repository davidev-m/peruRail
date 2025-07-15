<?php
    require_once __DIR__ . '/funciones_extra.php';
    require_once __DIR__ . '/../modelos/modelos.php';
    session_start();
    header('content-Type:application/json');
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Headers:Content-Type');
    $confirmacion = json_decode(file_get_contents('php://input'), true);     
    
    error_log("tren_seleccion.php -> Contenido de SESSION DESPUÉS DE GUARDAR TRENES: " . print_r($_SESSION, true));

    if($confirmacion['verificacion']){

        $cliente = new Cliente();
        $adultos = $_SESSION["pasajeros"]["adultos"];
        $cantAdultos = count($adultos);
        for($i = 0; $i < $cantAdultos; $i++){
            $nombre = $adultos["nombre"];
            $apellidos = $adultos["apellidos"];
            $genero = $adultos["genero"];
            $pais = $adultos["pais"];
            $tipo_doc = $adultos["tipo_doc"];
            $num_doc = $adultos["num_doc"];
            $con_infante = $adultos["con_infante"];
            $fecha_nac = $adultos["fecha_nac"];

            $cliente->insertarCliente(2,$nombre,$apellidos,$genero,$num_doc,$fecha_nac);
        }



        //BUSCAR ID VIAJE-------------------------------------------------
        $trenIda = $_SESSION["trenes_seleccionados"]["trenIda"];
        $nombreTren = separarNombreYNumero($trenIda['tren']["nombre"]);
        
        $tren = new Tren();
        $idTren = [$tren->BuscarIdTren($nombreTren['codigo'],$nombreTren['nombre'])];
        
        $estacion = new Estacion();
        $NombreEstacion = $trenIda["estaciones"];
        $idEstacion = [$estacion->obtenerIdEstacion($NombreEstacion[0], $NombreEstacion[1])];

        $idBus = [$trenIda["tren"]["id_bus"]];

        $viaje = new Viaje();

        if($_SESSION['trenes_seleccionados']['tipo'] == "ida_vuelta"){
            $tipoTren = "trenRetorno";
            $trenRetorno = $_SESSION["trenes_seleccionados"][$tipoTren];
            $nombreTren = separarNombreYNumero($trenRetorno['tren']["nombre"]);
            
            $tren = new Tren();
            $idTren[] = [$tren->BuscarIdTren($nombreTren['codigo'],$nombreTren['nombre'])];  
        
            $NombreEstacion = $trenRetorno["estaciones"];
            $idEstacion[] = [$estacion->obtenerIdEstacion($NombreEstacion[0], $NombreEstacion[1])];

            $idBus[] = $trenIda["tren"]["id_bus"];
        }

        for($i = 0; $i < count($idBus); $i++){
            $idViaje[] = $viaje->obtenerIdViaje($idTren[$i], $idBus[$i], $idEstacion[$i]);
        }
        //----------------------------------------------

        
    }
    echo json_encode(["success" => true, "message" => "Datos de trenes seleccionados guardados en sesión."]);

?>