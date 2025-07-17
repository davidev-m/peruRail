<?php
require_once __DIR__ . '/caso_base.php';

/**
 * Maneja la lógica de negocio para la tabla Viaje.
 * Hereda de caso_base_CRUD para las operaciones de base de datos.
 */
class Viaje extends caso_base_CRUD {

    function __construct(){
        parent::__construct(); 
    }
    public function buscarViajesDisponibles($origen, $destino, $fecha_salida) {
        // 1. Validación de los datos de entrada.
        if (empty($origen) || empty($destino) || empty($fecha_salida)) {
            throw new InvalidArgumentException("Origen, destino y fecha no pueden estar vacíos.");
        }

        $select = "v.hora_salida, v.hora_llegada, v.precio_pasaje, v.id_viaje, 
                   e.est_origen, e.est_destino, 
                   c.nombre_clase, 
                   t.codigo,
                   v.id_bus,
                   (t.cap_total - COUNT(reser.id_reserva)) as cap_disponible";

        $from = "Viaje v";

        $joins = [
            "Estacion e"      => "v.id_estacion = e.id_estacion",
            "Ruta r"          => "r.id_ruta = e.id_ruta",
            "Tren t"          => "t.id_tren = v.id_tren",
            "Clase c"         => "c.id_clase = t.id_clase"
        ];

        $leftJoins = [
            "Bus b"           => "v.id_bus = b.id_bus",
            "Reserva reser"   => "reser.id_viaje = v.id_viaje"
        ];

        $where = "r.origen = :origen AND r.destino = :destino AND v.fecha_salida = :fecha_salida";
        
        $datos = [
            ':origen' => $origen,
            ':destino' => $destino,
            ':fecha_salida' => $fecha_salida
        ];

        $condicionalExtra = "GROUP BY v.id_viaje";

        return $this->buscar(
            $from,
            $select,
            $where,
            $datos,
            $joins, // Pasamos el array completo de joins
            $condicionalExtra,
            $leftJoins
        );
    }

    public function obtenerIdViaje($id_tren, $id_bus, $id_estacion, $fecha) {
        // 1. Validación de los datos de entrada.
        if (empty($id_tren) || empty($id_estacion) || empty($fecha)) {
            throw new InvalidArgumentException("Los IDs de tren, bus y estación no pueden estar vacíos.");
        }

        // 2. Preparamos los parámetros para el método buscar().
        $select = 'id_viaje';
        $from = 'Viaje';
        $where = 'id_tren = :tren AND id_estacion = :estacion AND fecha_salida = :fecha_salida';
        if($id_bus != null){
            $datos[':bus'] = $id_bus;
            $where .= " AND id_bus = :bus ";
        }else{
            $where .= " AND id_bus is null ";
        }
        $datos = [
            ':tren' => $id_tren,
            ':estacion' => $id_estacion,
            ':fecha_salida' => $fecha
        ];
        // 3. Llamamos al método de la clase padre para ejecutar la consulta.
        $resultado = $this->buscar(
            $from,
            $select,
            $where,
            $datos
        );

        // 4. Procesamos el resultado.
        if (!empty($resultado)) {
            // Devolvemos el valor de la columna 'id_viaje' del primer resultado.
            return $resultado[0]['id_viaje'];
        }

        return null; // No se encontró ningún viaje con esa combinación de IDs.
    }

    public function mostrarAdmin($Nombretabla){
        $Nombretabla  .= " v ";
        $inner = [
            "Tren t " => "v.id_tren = t.id_tren",
            "Estacion e" => "v.id_estacion = e.id_estacion"
        ];
        $left = [
            "Bus b" => "b.id_bus = v.id_bus"
        ];
        $condicionalExtra = " LIMIT 20";
    }
}
?>
