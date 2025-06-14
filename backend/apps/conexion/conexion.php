<?php
    function crearConexion(){
        //Definiendo los valores de la base de datos
        $host = "localhost";
        $user = "root";
        $contraseña = "";
        $base_datos = "peruRail"; 
        $puerto = "3306";
    
        //Conectando
        $conexion = new mysqli($host, $user, $contraseña, $base_datos, $puerto);
        
        //Verificacion
        if($conexion ->connect_error){
            die("Error". $conexion->connect_error);
        }
        return $conexion;
    }
?>