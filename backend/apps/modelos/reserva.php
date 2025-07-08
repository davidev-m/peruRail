<?php
    require_once __DIR__ . '/../conexion/conexion.php';
    class reserva{
        public function capacidadDisponible($fecha_salida, $origen, $destino){
            $sql = "SELECT v.id_tren, COUNT(id_reserva) AS reservas, t.cap_total
            FROM Reserva r
            INNER JOIN Viaje v ON r.id_viaje = v.id_viaje
            INNER JOIN Tren t ON r.id_tren = t.id_tren
            WHERE v.fecha_salida = :fecha_salida
            GROUP BY v.id_tren, t.cap_total
            ";
        }
    }
?>