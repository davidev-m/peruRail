<?php
require __DIR__ . '/../modelos/ruta.php';
    function idaVuelta($Origen, $Destino){
        $ruta = new Ruta();
        $Origen = strtolower($Origen);
        $Destino = strtolower($Destino);
        if(!$ruta->existe($Origen,$Destino)){
            return null;
        }
        return $ruta->existe($Destino,$Origen);   
    }
    function fechaDisponible($Origen, $Destino){
        if(empty($Origen) || empty($Destino)){
            return null;
        }
        $ruta = new Ruta();
        $Origen = strtolower($Origen);
        $Destino = strtolower($Destino);
        if(!$ruta->existe($Origen,$Destino)){
            return null;
        }
        $fecha = $ruta->disponibilidad($Origen, $Destino);
        $resultado = $fecha["diasDisponibles"];
        if(!$fecha || !isset($fecha["diasDisponibles"])){
            return null;
        }
        return $resultado;
    }
    function destinos($origen){
        $ruta = new Ruta();
        $origen = strtolower($origen);
        $destino =  $ruta->buscarDestino($origen);
        if(count($destino) > 0){
            return array_column($destino, 'Destino');
        }else{
            return [];
        }
    }

?>