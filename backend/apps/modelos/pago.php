<?php
    require_once __DIR__ . '/modelos.php';

    class Pago extends caso_base_CRUD{
        private $nombreClase;
        function __construct(){
            parent::__construct(); 
            $this->nombreClase = "Pago";
        }

        public function insertarPago($idCliente, $monto, $metodo){
            $from = $this->nombreClase;
            $datos = [
                "id_cliente" => $idCliente,
                "monto_total" => $monto,
                "metodo" => $metodo
            ];

            $resultado = $this->insertar($from,$datos);
            return $resultado;
        }
    }

?>