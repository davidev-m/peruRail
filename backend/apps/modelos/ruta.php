<?php

require_once __DIR__ . '/caso_base.php';

class Ruta extends caso_base_CRUD {

    public function __construct() {
        parent::__construct();
    }


    public function existe($origen, $destino) {
        if (empty($origen) || empty($destino)) {
            throw new InvalidArgumentException("Origen y destino son requeridos.");
        }

        $resultado = $this->buscar(
            tabla: 'Ruta',
            datosSeleccion: 'id_ruta',
            where: 'origen = :origen AND destino = :destino',
            datos: [':origen' => $origen, ':destino' => $destino]
        );

        return !empty($resultado);
    }

    public function buscarDestino($origen) {
        if (empty($origen)) {
            throw new InvalidArgumentException("Origen es requerido.");
        }

        return $this->buscar(
            tabla: 'Ruta',
            datosSeleccion: 'destino',
            where: 'origen = :origen',
            datos: [':origen' => $origen]
        );
    }

    public function buscarPorID($id) {
        if (empty($id)) {
            throw new InvalidArgumentException("ID requerido.");
        }

        $resultado = $this->buscar(
            tabla: 'Ruta',
            datosSeleccion: 'origen, destino',
            where: 'id_ruta = :id',
            datos: [':id' => $id]
        );

        if (empty($resultado)) {
            return null; 
        }

        return $resultado[0];
    }

    public function disponibilidad($origen, $destino) {
        if (empty($origen) || empty($destino)) {
            throw new InvalidArgumentException("Origen y destino son requeridos.");
        }

        $resultado = $this->buscar(
            tabla: 'Ruta',
            datosSeleccion: 'dias_disponibles',
            where: 'origen = :origen AND destino = :destino',
            datos: [':origen' => $origen, ':destino' => $destino]
        );

        if (empty($resultado)) {
            return null;
        }

        return $resultado[0];
    }

    public function devuelveID($origen, $destino) {
        if (empty($origen) || empty($destino)) {
            throw new InvalidArgumentException("Origen y destino son requeridos.");
        }
        
        $resultado = $this->buscar(
            tabla: 'Ruta',
            datosSeleccion: 'id_ruta',
            where: 'origen = :origen AND destino = :destino',
            datos: [':origen' => $origen, ':destino' => $destino]
        );

        if (empty($resultado)) {
            return null;
        }

        return (int)$resultado[0]['id_ruta'];
    }
}
?>
