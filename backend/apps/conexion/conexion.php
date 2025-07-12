<?php
    class database{
        private static ?PDO $conexion = null;
        public static function getConexion():PDO{
            if(self::$conexion === null){
                $host = "localhost";
                $base_datos = "perurail"; 
                $user = "root";
                $contrasena = "";
                $dns = "mysql:host=$host; dbname=$base_datos; charset=utf8mb4";
                self::$conexion = new PDO(
                    $dns,
                    $user,
                    $contrasena,
                    [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
                );
            }
            return self::$conexion;
        }
    }
?>