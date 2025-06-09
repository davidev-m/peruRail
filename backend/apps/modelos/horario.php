<?php
    require '../conexion/conexion.php';
    require '../interfaz/intefaz_horario.php';
    class Horario {
        private $conexion;
        public function __construct(){
            $this->conexion = crearConexion();
        }
        public function buscar($id){
            $query = "SELECT * FROM Horario WHERE ID_horario = ?";
            $sentencia = $this->conexion->prepare($query);
            $sentencia->bind_param('i',$id);
            $sentencia->execute();
            $result = $sentencia->get_result();
            if($result->num_rows > 0){
                $result = $sentencia->get_result();
                return $result->fetch_assoc();    
            }else{
                return [];
            }
        }
    };
?>