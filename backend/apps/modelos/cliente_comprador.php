<?php
    require_once __DIR__ . '/caso_base.php';
    class ClienteComprador extends caso_base_CRUD{
        private $nombreTabla;
        function __construct(){
            parent::__construct();  
            $this->nombreTabla = "Cliente_comprador";
        }
        public function insertarClienteComprador($id_cliente, $email, $telefono, $idEmpresa = null){
            $from = $this->nombreTabla;
            $datos = [
                "id_Cliente" => $id_cliente,
                "id_cliente_e" => $idEmpresa,
                "correo" => $email,
                "num_telf" => $telefono
            ];
            $this->insertar($from, $datos);

            return $id_cliente;
            }
    }
?>