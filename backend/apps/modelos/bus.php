<?php
    class bus{
        private PDO $conexion ;
        public function __construct(){
            $this->conexion = database::getConexion();
        }
        public function id_Bus($placa){
            if(empty($placa)){
                throw new InvalidArgumentException("Datos vacios");
            }
            $sql = "SELECT id_bus
            from Bus
            where placa = :placa";
            
            if (!$sentencia = $this->conexion->prepare($sql)) {
                throw new RuntimeException("Sentencia errorea", $this->conexion->errorCode());
            }

            $sentencia->bindParam(':placa', $placa);
            if (!$sentencia->execute()) {
                throw new RuntimeException('Error en la peticion de consulta', $sentencia->errorCode());
            }
            $result = $sentencia->fetch(PDO::FETCH_ASSOC);
            if (!$result) {
                throw new RuntimeException("No se encontró ruta con el ID proporcionado.");
            }

            return $result;
        }
    }
?>