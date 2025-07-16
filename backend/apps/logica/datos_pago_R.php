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

        //BUSCAR ID VIAJE-------------------------------------------------
        $trenIda = $_SESSION["trenes_seleccionados"]["trenIda"];
        $nombreTren = separarNombreYNumero($trenIda['tren']["nombre"]);
        
        $tren = new Tren();
        $idTren[] = $tren->BuscarIdTren($nombreTren['codigo'],$nombreTren['nombre']);
        
        $estacion = new Estacion();
        $NombreEstacion = $trenIda["estaciones"];
        $idEstacion[] = $estacion->obtenerIdEstacion($NombreEstacion[0], $NombreEstacion[1]);

        if(isset($trenIda["tren"]["id_bus"])){
            $idBus[] = $trenIda["tren"]["id_bus"]; 
        }else{
            $idBus[] = null;
        }
        $viaje = new Viaje();

        if($_SESSION['trenes_seleccionados']['tipo'] == "ida_vuelta"){
            $tipoTren = "trenRetorno";
            $trenRetorno = $_SESSION["trenes_seleccionados"][$tipoTren];
            $nombreTren = separarNombreYNumero($trenRetorno['tren']["nombre"]);
            
            $tren = new Tren();
            $idTren[] = $tren->BuscarIdTren($nombreTren['codigo'],$nombreTren['nombre']);  
        
            $NombreEstacion = $trenRetorno["estaciones"];
            $idEstacion[] = $estacion->obtenerIdEstacion($NombreEstacion[0], $NombreEstacion[1]);

            if(isset($trenRetorno["tren"]["id_bus"])){
                $idBus[] = $trenRetorno["tren"]["id_bus"]; 
            }else{
                $idBus[] = null;
            }
        }

        $fecha[] = $_SESSION['trenes_seleccionados']['fechaIda'];
        if($_SESSION['trenes_seleccionados']['fechaRet']){
            $fecha[] = $_SESSION['trenes_seleccionados']['fechaRet'];
        }
        for($i = 0; $i < count($idBus); $i++){
            $idViaje[] = $viaje->obtenerIdViaje($idTren[$i], $idBus[$i], $idEstacion[$i], $fecha[$i]);
        }


        
        //----------------------------------------------



        
        
        //CASO DE CLIENTE EMPRESA
        $empresa = $_SESSION['empresa'];
        $empresa = $_SESSION['empresa'];
        $claseEmpresa = new ClienteEmpresa();
        $idEmpresa = -1;
        if(!empty($empresa)){
            $ruc = $empresa['ruc'];
            $razon_social = $empresa['razon_social'];
            $direccion = $empresa['direccion'];
            if($empresa['existe'] == 1){
                $idEmpresa = ($claseEmpresa->buscaEmpresa($empresa['ruc']))['id_cliente_e'];
            }else{
                $idEmpresa = $claseEmpresa->insertarEmpresa($ruc,$razon_social,$direccion);
            }
        }
        
        
        
        //CASO DE RESERVA
        $claseCliente = new Cliente();
        $claseClienteComprador = new ClienteComprador();
        $documento = new tipo_documento();
        $clasePago = new Pago();
        
        $adultos = $_SESSION["pasajeros"]["adultos"];
        $ninos = $_SESSION['pasajeros']['ninos'];
        $comprador = $_SESSION["comprador"];


        $clientes = array_merge($adultos, $ninos);
        $cantCliente = count($clientes);
        foreach ($clientes as $client) {
            //INSERTAR CLIENTE---------------------------------
            $num_doc = $client["num_doc"];

            //CLIENTE
            //Existe cliente -- Buscar su Id
            // if($client['existe'] == 1){
            //     $idCliente[] = $claseCliente->buscarId($num_doc);
            // }
            // //No existe cliente -- Insertar
            // else{
            //     $idDocumento = $documento->buscarDocumento($client['tipo_doc']);
            //     $nombre = $client["nombre"];
            //     $apellidos = $client["apellidos"];
            //     $genero = $client["genero"];
            //     $pais = $client["pais"];
            //     $tipo_doc = $client["tipo_doc"];
            //     $fecha_nac = $client["fecha_nac"];
    
            //     $idCliente[] = $claseCliente->insertarCliente($idDocumento,$nombre,$apellidos,$genero,$num_doc,$fecha_nac);
            // }
            // //---------------------------------------------------
   
            $idDocumento = $documento->buscarDocumento($client['tipo_doc']);
            $nombre = $client["nombre"];
            $apellidos = $client["apellidos"];
            $genero = $client["genero"];
            $pais = $client["pais"];
            $tipo_doc = $client["tipo_doc"];
            $fecha_nac = $client["fecha_nac"];

            $idCliente[] = $claseCliente->insertarCliente($idDocumento,$nombre,$apellidos,$genero,$num_doc,$fecha_nac);

            if(isset($client["es_comprador"]) && $client["es_comprador"] == 1){

                //INSERTAR COMPRADOR
                if(false && $client['existe'] == 1){
                    $idComprador = $claseCliente->buscarId($num_doc);
                }else{ 
                    // if($idEmpresa == -1){
                    //     $idComprador = $claseClienteComprador->insertarClienteComprador(id_cliente: end($idCliente),email:$comprador['email'], telefono:$comprado['telefono']);
                    // }else{
                    //     $idComprador = $claseClienteComprador->insertarClienteComprador(end($idCliente), $idEmpresa, $comprador['email'], $comprador['telefono']);
                    // }   
                    $idComprador = $claseClienteComprador->insertarClienteComprador(end($idCliente), $comprador['email'], $comprador['telefono'], null);
                }

                //INSERTAR PAGO
                $montoTotal = $_SESSION['monto_total'];
                $idPago = $clasePago->insertarPago($idComprador,$montoTotal, "tarjeta");
            }
   
        }

        $claseReserva = new reserva(); 
        $fecha = $_SESSION["trenes_seleccionados"]['fechaIda'];
        for($i = 0; $i < $cantCliente; $i++){
            $client = $clientes[$i]; 
            //Existe con_infante y no es nulo
            $infante = 0;
            if(isset($client['con_infante']) && $client['con_infante'] == 1){
                $infante = 1;
            }
            $claseReserva->insertarReserva($idViaje[0],$idPago,$fecha,$idCliente[$i],$infante);
        }
        if(count($idViaje) > 1){
            for($i = 0; $i < $cantCliente; $i++){
            $client = $clientes[$i]; 
            //Existe con_infante y no es nulo
            $infante = 0;
            if(isset($client['con_infante']) && $client['con_infante'] == 1){
                $infante = 1;
            }
            $claseReserva->insertarReserva($idViaje[1],$idPago,$fecha,$idCliente[$i],$infante);
        }
        }
    }

    echo json_encode(
        ["success" => true, 
        "message" => "Datos de trenes seleccionados guardados en sesión."]);

?>