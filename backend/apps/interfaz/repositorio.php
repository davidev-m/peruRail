<?php 
    interface repositorio{
        public function buscar($id);
        public function guardarDatos(array $datos);
        public function actualizar(array $datos);
        public function eliminar(array $datos);
    }

?>
