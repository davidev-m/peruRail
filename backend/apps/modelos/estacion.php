<?php
    require_once __DIR__ . '/../conexion/conexion.php'; 

    class Estacion{
        private PDO $conexion ;
        public function __construct(){
            $this->conexion = database::getConexion();
        }
        public function retornaID($estOrigen, $estDestino){
            $sql = "SELECT id_estacion
            from Estacion
            where est_origen = :origen and est_destino = :destino";
            
            if (!$sentencia = $this->conexion->prepare($sql)) {
                throw new RuntimeException("Sentencia errorea", $this->conexion->errorCode());
            }

            $sentencia->bindParam(':origen', $estOrigen);
            $sentencia->bindParam(':destino', $estDestino);
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