<?php
    require_once __DIR__ . "/caso_base.php";
    class ClienteEmpresa extends caso_base_CRUD{
        private $nombreTabla;
        function __construct(){
            parent::__construct(); 
            $this->nombreTabla = "Cliente_empresa";
        }

        public function buscaEmpresa($ruc){
            $from = $this->nombreTabla;
            $select = "id_cliente_e";
            $where = "ruc = :ruc";
            $datos = [
                "ruc" => $ruc
            ];
            $resultado = $this->buscar($from,$select,$where,$datos);
            return $resultado[0];
        }

        public function insertarEmpresa($ruc, $razon_social, $direccion){
            $from = $this->nombreTabla;
            $datos = [
                "ruc" => $ruc,
                "razon_social" => $razon_social,
                "direccion" => $direccion
            ];

            $resultado = $this->insertar($from, $datos);
            return $resultado;
        }
    }

?>