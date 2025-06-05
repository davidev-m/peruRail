<?php
    //Definiendo los valores de la base de datos
    $host = "localhost";
    $user = "root";
    $contraseña = "";
    $base_datos = "perurail"; 

    //Conectando
    $conexion = new mysqli($host, $user, $contraseña, $base_datos);
    
    //Verificacion
    if($conexion ->connect_error){
        die("Error". $conexion->connect_error);
    }
    echo "base de datos conectado";
?>