<?php
    ini_set('display_errors', 1);
    ini_set('display_startup_errors', 1);
    error_reporting(E_ALL);

    require_once __DIR__  . '/../modelos/modelos.php';
    
    
    $documento = new tipo_documento();
    $resultado = $documento->buscarDocumento("DNI");
    if($resultado == null){
        echo 'wa';
    }else{
        echo "documento: " . $resultado;
    }
    
?>