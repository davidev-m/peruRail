<?php
    require_once __DIR__ . '/../conexion/conexion.php';
    
    class Viaje{
        private PDO $pdo;
        public function __construct() {
            $this->pdo = database::getConexion();
        }
        public function buscar($origen,$destino,$fech_salida){
            if(empty($origen) || empty($destino) || empty($fech_salida)){
                throw new InvalidArgumentException("Datos errones");
            }
            $sql = "SELECT 
                        v.hora_salida, v.hora_llegada, v.precio_pasaje,v.id_viaje, 
                        e.est_origen,e.est_destino, 
                        c.nombre_clase, 
                        t.codigo,
                        v.id_bus,
                        (t.cap_total - count(reser.id_reserva)) as cap_disponible
                    from Viaje v
                    inner join Estacion e on v.id_estacion= e.id_estacion
                    inner join Ruta r on r.id_ruta = e.id_ruta
                    inner join Tren t on t.id_tren = v.id_tren
                    inner join Clase c on c.id_clase = t.id_clase
                    left join Bus b on v.id_bus = b.id_bus
                    left join Reserva reser on reser.id_viaje = v.id_viaje
                    where r.origen = :origen and r.destino = :destino and fecha_salida = :fecha_salida
                    group by id_viaje;

                ;";
            if(!$sentencia = $this->pdo->prepare($sql)){
                throw new RuntimeException("Sentencia errorea", $this->pdo->errorCode());
            }
            $sentencia->bindParam(':origen', $origen);
            $sentencia->bindParam(':destino', $destino);
            $sentencia->bindParam(':fecha_salida', $fech_salida);
            if(!$sentencia->execute()){
                throw new RuntimeException('Error en la peticion de consulta', $sentencia->errorCode());
            }
            $resultado = $sentencia->fetchAll(PDO::FETCH_ASSOC);
            //$this->horario = ;
            return $resultado;
        }
        public function buscarID($id_tren, $id_bus,$id_estacion){
            if(empty($id_tren) || empty($id_bus) || empty($id_estacion)){
                throw new InvalidArgumentException("Datos vacios");
            }
            $sql = "SELECT id_viaje
            from Viaje
            where id_tren = :tren and id_bus = :bus and id_estacion = :estacion";
            
            if (!$sentencia = $this->pdo->prepare($sql)) {
                throw new RuntimeException("Sentencia errorea", $this->pdo->errorCode());
            }

            $sentencia->bindParam(':tren', $id_tren);
            $sentencia->bindParam(':bus', $id_bus);
            $sentencia->bindParam(':estacion', $id_estacion);
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