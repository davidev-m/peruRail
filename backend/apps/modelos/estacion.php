<?php
require_once __DIR__ . '/caso_base.php';

class Estacion extends caso_base_CRUD {
    private $nombreTabla;
    
    function __construct(){
        parent::__construct(); 
        $this->nombreTabla = "Estacion";
    }

    public function obtenerIdEstacion($estOrigen, $estDestino, $id_ruta = null) {
        // 1. Validación de los datos de entrada
        if (empty($estOrigen) || empty($estDestino)) {
            throw new InvalidArgumentException("El origen y el destino no pueden estar vacíos.");
        }

        // 2. Preparamos los parámetros para el método buscar()
        $select = 'id_estacion';
        $from = $this->nombreTabla;
        
        // La condición WHERE y los datos cambian si se proporciona un id_ruta
        $where = 'est_origen = :origen AND est_destino = :destino';
        $datos = [
            ':origen' => $estOrigen,
            ':destino' => $estDestino
        ];

        // Si el usuario nos da un id_ruta, lo añadimos a la búsqueda para ser más precisos.
        // ¡Esta es la forma más segura de hacerlo!
        if ($id_ruta !== null) {
            $where .= ' AND id_ruta = :idRuta';
            $datos[':idRuta'] = $id_ruta;
        }

        // 3. Llamamos al método buscar() de la clase padre.
        $resultado = $this->buscar(
                     $from, 
            $select, 
                     $where, 
                     $datos
        );

        // 4. Procesamos el resultado
        if (!empty($resultado)) {
            // Devolvemos el ID del primer resultado encontrado.
            return $resultado[0]['id_estacion'];
        }

        return null; // No se encontró ninguna estación con esos criterios.
    }
}
?>
