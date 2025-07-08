<?php
    class Cliente{
        private PDO $conexion ;
        public function __construct(){
            $this->conexion = database::getConexion();
        }
        public function verificar_documento($documento){
            $sql = "SELECT nombre, apellido
            from Cliente
            where documento = :documento;
            ";
            if (!$sentencia = $this->conexion->prepare($sql)) {
                throw new RuntimeException("Sentencia errorea", $this->conexion->errorCode());
            }
            $sentencia->bindParam(':documento', $documento);
            if (!$sentencia->execute()) {
                throw new RuntimeException('Error en la peticion de consulta', $sentencia->errorCode());
            }
            $result = $sentencia->fetch(PDO::FETCH_ASSOC);
            if(!$result){
                return false;
            }
            return $result;
        } 
    }
?>
