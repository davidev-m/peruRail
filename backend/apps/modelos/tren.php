<?php
    require_once __DIR__ . '/../conexion/conexion.php';
    class Tren{
        private PDO $pdo;
        public function __construct() {
            $this->pdo = database::getConexion();
        }
        public function id_tren($codigo, $nombre_clase){
            if(empty($codigo) || empty($nombre_clase)){
                throw new InvalidArgumentException("Datos invalidos");
            }
            $sql = "SELECT id_tren
            from Tren t
            inner join Clase c on t.id_clase = c.id_clase
            where t.codigo = :codigo and c.nombre_clase = :nombreClase";
            if(!$sentencia = $this->pdo->prepare($sql)){
                throw new RuntimeException("Problemas de conexion",$this->pdo->errorCode());
            }
            $sentencia->bindParam(":codigo",$codigo);
            $sentencia->bindParam(":nombreClase", $nombre_clase);
            if(!$sentencia->execute()){
                throw new RuntimeException("Error de ejecucion", $sentencia->errorCode());
            }
            $resultado = $sentencia->fetch(PDO::FETCH_ASSOC);
            if (!$resultado) {
                throw new RuntimeException("No se encontró el tren");
            }
            return $resultado['id_tren'];
        }

    }
?>