<?php
    require_once __DIR__ . '/../modelos/modelos.php';
    function verificar_documento($nombre,$apellido, $documento){
        $cliente = new Cliente();
        $datosCliente = $cliente->verificar_documento($documento);
        if(!$datosCliente){
            return true;
        }
        if($datosCliente['nombre'] != $nombre || $datosCliente['apellido'] != $apellido){
            return false;
        }
        return true;
    }

?>