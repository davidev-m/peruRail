<?php
    require_once __DIR__ . '/../conexion/conexion.php';
    class caso_base_CRUD{
        private $pdo;
        function __construct(){
            $this->pdo = database::getConexion();
        }
        private function validarTabla($tabla){

            //if (!preg_match('/^\w+$/', $tabla)) {
              //  throw new InvalidArgumentException("Nombre de tabla no válido.");
            //}
        }
        public function insertar($tabla, $datos){
            if(empty($tabla) || empty($datos)){
                throw new InvalidArgumentException("Datos vacios");
            }
            $this->validarTabla($tabla);
            
            try {
                $atributos = $this->pdo->prepare("SELECT * FROM ". $tabla." LIMIT 1;");
                $atributos->execute();
            } catch (\Throwable $th) {
                throw new RuntimeException("Tabla $tabla no existe o no se puede acceder");
            }
            $atributos = $atributos->fetch(PDO::FETCH_ASSOC);
            $columna = array_keys($atributos);

            if(count($columna) != count($datos)){
                throw new Exception("Numero de columna y de datos son distintos");
            }

            $espacio_insertar = array_map(function($colum){
                return ": $colum";
            },$columna);

            $sql = "INSERT INTO `$tabla` (`" . implode('`,`', $columna) . "`) VALUES (" . implode(',', $espacio_insertar) . ');' ;
            if(!$sentencia = $this->pdo->prepare($sql)){
                throw new RuntimeException("Problema de conexion", $this->pdo->errorCode());
            }
            $parametros = array_combine($espacio_insertar, $datos);
            if(!$sentencia->execute($parametros)){
                throw new RuntimeException("Problema de ejecución", $sentencia->errorCode());
            }

            $resultado = $this->pdo->lastInsertId();
            return $resultado;
        }

            //Condicional: Where, group by, having, etc
        public function buscar($tabla, $datosSeleccion = '*', $where = '', $datos = [], $innerJoin = [], $condicionalExtra = '', $leftJoin = []) {
            if (empty($tabla)) {
                throw new InvalidArgumentException("El nombre de la tabla no puede estar vacío.");
            }
            $this->validarTabla($tabla);

            $sql = "SELECT $datosSeleccion FROM $tabla";

            if (!empty($innerJoin)) {
                foreach ($innerJoin as $tablaJoin => $condicion) {
                    $this->validarTabla($tablaJoin); // Validar también las tablas del join
                    $sql .= " INNER JOIN $tablaJoin ON $condicion";
                }
            }

            if(!empty($leftJoin)){
                foreach ($leftJoin as $tablaJoin => $condicion) {
                    $this->validarTabla($tablaJoin); // Validar también las tablas del join
                    $sql .= " LEFT JOIN $tablaJoin ON $condicion";
                }
            }

            if (!empty($where)) {
                $sql .= " WHERE $where";
            }

            if (!empty($condicionalExtra)) {
                $sql .= " $condicionalExtra";
            }

            $sql .= ';';
            try {
                $sentencia = $this->pdo->prepare($sql);
                $sentencia->execute($datos);
                return $sentencia->fetchAll(PDO::FETCH_ASSOC);
            } catch (PDOException $e) {
                throw new RuntimeException("Error al buscar en la tabla $tabla: " . $e->getMessage());
            }
        }

    }

?>