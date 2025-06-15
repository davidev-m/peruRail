<?php

require __DIR__ . '/../conexion/conexion.php';
require __DIR__ . '/../interfaz/interfaz_ruta.php';
class Ruta implements interfaz_ruta{
    private $conexion;
    /**
     * Consturcto de la clase Ruta
     * Crea la conexion a la base de datos
     */
    public function __construct(){
        $this->conexion = crearConexion();
    }


    /**
     * Verificamos si la existencia de la ruta
     * @param string $origen Ciudad de origen.
     * @param string $destino Ciudad de destino.
     * @return bool True si la ruta existe, False si no.
     */
    public function existe($origen, $destino){
        $query = "SELECT * FROM Ruta WHERE origen = ? AND destino = ?";
        $sentencia = $this->conexion->prepare($query);
        $sentencia->bind_param("ss", $origen, $destino);
        $sentencia->execute();
        $resultado = $sentencia->get_result();
        //Comprobamos si hay datos en la tabla
        if($resultado->num_rows > 0){
            return true;
        }else{
            return false;
        }
    }


    /**
     * Busca todos los destinos posibles desde un origen dado.
     *
     * @param string $origen Ciudad de origen.
     * @return array Arreglo de destinos (cada uno como un array asociativo).
     */
    public function buscarDestino($origen){
        $query = "SELECT destino FROM Ruta WHERE origen = ?";
        $sentencia = $this->conexion->prepare($query);
        $sentencia->bind_param('s', $origen);
        $sentencia->execute();
        $result = $sentencia->get_result();
        return $result->fetch_all(MYSQLI_ASSOC); 
    }


    /**
     * Obtiene los días disponibles para una ruta específica.
     *
     * @param string $origen Ciudad de origen.
     * @param string $destino Ciudad de destino.
     * @return array|null Días disponibles como array asociativo o null si no se encuentra.
     */
    public function disponibilidad($origen, $destino){
        $query = "SELECT dias_disponibles FROM Ruta WHERE origen=? AND destino =?";
        $sentencia = $this->conexion->prepare($query);
        $sentencia->bind_param('ss', $origen, $destino);
        $sentencia->execute();
        $result = $sentencia->get_result();
        return $result->fetch_assoc();
    }

    public function devolverID($origen, $destino): ?int{
        if(empty($origen) || empty($destino)){
            throw new InvalidArgumentException("Origen y destion no pueden estar vacios");
        }
        $query = "SELECT id_ruta FROM Ruta WHERE origen = ? AND destino = ?";
        
        if(!$sentencia = $this->conexion->prepare($query)){
            throw new RuntimeException("Error en la preparacion ". $this->conexion->error);
        }
        $sentencia->bind_param('ss', $origen,$destino);
        if(!$sentencia->execute()){
            throw new RuntimeException("Error en la ejecucion". $sentencia->error);
        }
        $resul = $sentencia->get_result();
        if($resul->num_rows === 0){
            return null;
        }
        $fila = $resul->fetch_assoc();
        return (int)$fila['id_ruta'];
    }
};

?>