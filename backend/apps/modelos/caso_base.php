<?php

use Culqi\Orders;
require_once __DIR__ . '/../conexion/conexion.php';


class caso_base_CRUD {
    protected PDO $pdo;

    public function __construct() {
        $this->pdo = database::getConexion();
    }

    private function validarNombre($nombre) {
        
    }

    public function insertar($tabla, $datos) {
        if (empty($tabla) || empty($datos) || !is_array($datos)) {
            throw new InvalidArgumentException("Datos  no pueden estar vacíos.");
        }
        $this->validarNombre($tabla);

        $columnas = array_keys($datos);

        $placeholders = array_map(fn($col) => ":$col", $columnas);


        $sql = "INSERT INTO `$tabla` (`" . implode('`, `', $columnas) . "`) VALUES (" . implode(', ', $placeholders) . ")";
        

        try {
            $sentencia = $this->pdo->prepare($sql);
            
            foreach ($datos as $columna => &$valor) {
                $sentencia->bindValue(":$columna", $valor);
            }

            $sentencia->execute();

            return $this->pdo->lastInsertId();
        } catch (PDOException $e) {
            throw new RuntimeException("Error al insertar en la tabla `$tabla`: " . $e->getMessage());
        }
    }

    public function buscar($tabla, $datosSeleccion = '*', $where = '', $datos = [], $innerJoins = [], $condicionalExtra = '', $leftJoins = []) {
        if (empty($tabla)) {
            throw new InvalidArgumentException("El nombre de la tabla no puede estar vacío.");
        }

        $formatearTabla = function($tablaCompleta) {
            $partes = explode(' ', trim($tablaCompleta));
            $nombreReal = $partes[0];
            $this->validarNombre($nombreReal);
            $alias = $partes[1] ?? '';
            return "`$nombreReal`" . ($alias ? " $alias" : '');
        };

        $sql = "SELECT $datosSeleccion FROM " . $formatearTabla($tabla);

        if (!empty($innerJoins)) {
            foreach ($innerJoins as $tablaJoin => $condicion) {
                $sql .= " INNER JOIN " . $formatearTabla($tablaJoin) . " ON $condicion";
            }
        }

        if (!empty($leftJoins)) {
            foreach ($leftJoins as $tablaJoin => $condicion) {
                $sql .= " LEFT JOIN " . $formatearTabla($tablaJoin) . " ON $condicion";
            }
        }

        if (!empty($where)) {
            $sql .= " WHERE $where";
        }

        if (!empty($condicionalExtra)) {
            $sql .= " $condicionalExtra";
        }

        try {
            $sentencia = $this->pdo->prepare($sql);
            $sentencia->execute($datos);
            return $sentencia->fetchAll(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            throw new RuntimeException("Error al ejecutar la búsqueda: " . $e->getMessage() . " [Consulta: $sql]");
        }
    }

    public function mostrarAdmin($Nombretabla) {
        $order = "id_";
        $order .= strtolower($Nombretabla);
        $condicionalExtra = "LIMIT 20 ORDER BY ". $order;
        
        $datos = $this->buscar(tabla: $Nombretabla, condicionalExtra: $condicionalExtra);
        return $datos;
    }

    public function eliminar($tabla, $datoId) {
        if (empty($tabla) || empty($datoId) || !is_array($datoId) || count($datoId) !== 1) {
            throw new InvalidArgumentException("Se requiere la tabla y un array con una sola clave/valor para la condición de eliminación.");
        }
        $this->validarNombre($tabla);

        $columnaCondicion = array_key_first($datoId); 
        $valorCondicion = $datoId[$columnaCondicion];  

        $sql = "UPDATE `$tabla` SET `estado` = :estado WHERE `$columnaCondicion` = :id_condicion";

        try {
            $sentencia = $this->pdo->prepare($sql);

            $sentencia->bindValue(':estado', 'inactivo');
            $sentencia->bindValue(':id_condicion', $valorCondicion);

            $sentencia->execute();  

        } catch (PDOException $e) {
            throw new RuntimeException("Error al eliminar (desactivar) en la tabla `$tabla`: " . $e->getMessage());
        }
    }

        public function modificar($tabla, $datos, $condicion) {
        if (empty($tabla) || empty($datos) || !is_array($datos) || empty($condicion) || !is_array($condicion) || count($condicion) !== 1) {
            throw new InvalidArgumentException("Argumentos no válidos para la modificación.");
        }
        $this->validarNombre($tabla);

        $setParts = [];
        foreach (array_keys($datos) as $columna) {
            $setParts[] = "`$columna` = :$columna";
        }
        $setClause = implode(', ', $setParts);

        $columnaCondicion = array_key_first($condicion);
        $whereClause = "`$columnaCondicion` = :condicion_$columnaCondicion";

        $sql = "UPDATE `$tabla` SET $setClause WHERE $whereClause";

        try {
            $sentencia = $this->pdo->prepare($sql);

            foreach ($datos as $columna => &$valor) {
                $sentencia->bindValue(":$columna", $valor);
            }

            $valorCondicion = $condicion[$columnaCondicion];
            $sentencia->bindValue(":condicion_$columnaCondicion", $valorCondicion);

            $sentencia->execute();

            return $sentencia->rowCount();

        } catch (PDOException $e) {
            throw new RuntimeException("Error al modificar la tabla `$tabla`: " . $e->getMessage());
        }
    }


}
?>
