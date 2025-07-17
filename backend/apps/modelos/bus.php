<?php
    require_once __DIR__ . 'caso_base.php';
    class bus extends caso_base_CRUD{
        private $nombreTabla;
        public function __construct(){
            parent::__construct();
            $this->nombreTabla = 'Bus';
        }

        public function id_Bus($placa) {
        if (empty($placa)) {
            throw new InvalidArgumentException("La placa no puede estar vacía.");
        }

        $tabla = 'Bus';
        $datosSeleccion = 'id_bus';
        $where = 'placa = :placa';
        $datos = [':placa' => $placa];

        $resultado = $this->buscar($tabla, $datosSeleccion, $where, $datos);
        if (!empty($resultado)) {
            return $resultado[0]['id_bus'];
        }

        return null;
    }
    }
?>