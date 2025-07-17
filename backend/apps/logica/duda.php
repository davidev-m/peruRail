<?php
    ini_set('display_errors', 1);
    ini_set('display_startup_errors', 1);
    error_reporting(E_ALL);

    require_once __DIR__  . '/../modelos/modelos.php';
    require_once __DIR__ . '/funciones_extra.php';
    

    $wa = "Cliente";
    $da = new $wa();
    $resultado = $da->verificar_documento("1230987465");
    print_r($resultado);
    
?>