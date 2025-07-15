<?php
    require_once __DIR__ . '/../conexion/conexion.php';
    require_once __DIR__ . '/caso_base.php';
    class reserva extends caso_base_CRUD{
        private $pdo;
        public function insertarReserva($datos){
            $name_tabla = "Reserva";
            if(count($datos) <= 0){
                throw new Exception("Datos a ingresa Vacios");
            }
            $this->insertar($name_tabla, $datos);
        }
    }
?>