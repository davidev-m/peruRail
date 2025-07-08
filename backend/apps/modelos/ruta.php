<?php

use LDAP\Result;

require_once __DIR__ . '/../conexion/conexion.php';
class Ruta{
    private PDO $conexion ;
    public function __construct(){
        $this->conexion = database::getConexion();
    }

public function existe($origen, $destino) {
    if (empty($origen) || empty($destino)) {
        throw new InvalidArgumentException("Origen y destino son requeridos.");
    }

    $query = "SELECT id_ruta FROM Ruta WHERE origen = :origen AND destino = :destino";
    $sentencia = $this->conexion->prepare($query);
    if (!$sentencia) {
        throw new RuntimeException("Error al preparar la consulta: " . implode(", ", $this->conexion->errorInfo()));
    }

    $sentencia->bindParam(':origen', $origen);
    $sentencia->bindParam(':destino', $destino);

    if (!$sentencia->execute()) {
        throw new RuntimeException("Error al ejecutar la consulta: " . implode(", ", $sentencia->errorInfo()));
    }

    $resultado = $sentencia->fetch(PDO::FETCH_ASSOC);
    return !empty($resultado);
}

public function buscarDestino($origen) {
    if (empty($origen)) {
        throw new InvalidArgumentException("Origen es requerido.");
    }

    $query = "SELECT destino FROM Ruta WHERE origen = :origen";
    $sentencia = $this->conexion->prepare($query);
    if (!$sentencia) {
        throw new RuntimeException("Error al preparar la consulta: " . implode(", ", $this->conexion->errorInfo()));
    }

    $sentencia->bindParam(':origen', $origen);

    if (!$sentencia->execute()) {
        throw new RuntimeException("Error al ejecutar la consulta: " . implode(", ", $sentencia->errorInfo()));
    }

    return $sentencia->fetchAll(PDO::FETCH_ASSOC);
}

public function buscarPorID($id) {
    if (empty($id)) {
        throw new InvalidArgumentException("ID requerido.");
    }

    $query = "SELECT origen, destino FROM Ruta WHERE id_ruta = :id";
    $sentencia = $this->conexion->prepare($query);
    if (!$sentencia) {
        throw new RuntimeException("Error al preparar la consulta: " . implode(", ", $this->conexion->errorInfo()));
    }

    $sentencia->bindParam(':id', $id, PDO::PARAM_INT);

    if (!$sentencia->execute()) {
        throw new RuntimeException("Error al ejecutar la consulta: " . implode(", ", $sentencia->errorInfo()));
    }

    $result = $sentencia->fetch(PDO::FETCH_ASSOC);
    if (!$result) {
        throw new RuntimeException("No se encontró ruta con el ID proporcionado.");
    }

    return $result;
}

public function disponibilidad($origen, $destino) {
    if (empty($origen) || empty($destino)) {
        throw new InvalidArgumentException("Origen y destino son requeridos.");
    }

    $query = "SELECT dias_disponibles FROM Ruta WHERE origen = :origen AND destino = :destino";
    $sentencia = $this->conexion->prepare($query);
    if (!$sentencia) {
        throw new RuntimeException("Error al preparar la consulta: " . implode(", ", $this->conexion->errorInfo()));
    }

    $sentencia->bindParam(':origen', $origen);
    $sentencia->bindParam(':destino', $destino);

    if (!$sentencia->execute()) {
        throw new RuntimeException("Error al ejecutar la consulta: " . implode(", ", $sentencia->errorInfo()));
    }

    $result = $sentencia->fetch(PDO::FETCH_ASSOC);
    if (!$result) {
        throw new RuntimeException("No se encontró disponibilidad para la ruta indicada.");
    }

    return $result;
}

    public function devuelveID($origen, $destino){
        $query = "SELECT id_ruta FROM Ruta WHERE origen = :origen AND destino = :destino";
        if(!$sentencia = $this->conexion->prepare($query)){
            throw new RuntimeException('Sentencia erroena',$this->conexion->errorCode());
        }
        $sentencia->bindParam(':origen', $origen);
        $sentencia->bindParam(':destino', $destino);
        if(!$sentencia->execute()){
            throw new RuntimeException($sentencia->errorInfo(), $sentencia->errorCode());
        }
        $resultado = $sentencia->fetch(PDO::FETCH_ASSOC);
        return $resultado['id_ruta'];
    }

};

?>