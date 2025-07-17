<?php
    ini_set('display_errors', 1);
    ini_set('display_startup_errors', 1);
    error_reporting(E_ALL);

    require_once __DIR__  . '/../modelos/modelos.php';
    require_once __DIR__ . '/funciones_extra.php';
    require_once __DIR__ . '/viaje_logica.php';
    $nombre = "Estacion";
    $viaje= new $nombre();
    $datos = $viaje->mostrarAdmin($nombre);
    foreach($datos as $dato){
        print_r($dato);
        echo '<br>';
    }

?>