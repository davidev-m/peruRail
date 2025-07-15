<?php
    require_once __DIR__ . '/../conexion/conexion.php';
    require_once __DIR__ . '/caso_base.php';
    class reserva extends caso_base_CRUD{
        private $nombreTabla;
        function __construct(){
            parent::__construct(); 
            $this->nombreTabla = "Reserva";
        }
        public function insertarReserva( $id_viaje, $id_pago, $fecha, $id_cliente, $infante){
            $name_tabla = "Reserva";
            $datos = [
                'id_viaje' => $id_viaje,            
                'id_pago' => $id_pago,             
                'fecha' => $fecha,           
                'id_cliente' => $id_cliente,       
                'infante' => $infante
            ];
            $this->insertar($name_tabla, $datos);
        }
    }
?>