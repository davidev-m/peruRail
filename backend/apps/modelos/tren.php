<?php
    require_once __DIR__ . '/../conexion/conexion.php';
    require_once __DIR__ . '/caso_base.php';
    class Tren extends caso_base_CRUD{
        public function BuscarIdTren($codigo, $nombre_clase) {
        // 1. Validación de entradas (esto es lógica de negocio y se queda aquí)
        if (empty($codigo) || empty($nombre_clase)) {
            throw new InvalidArgumentException("El código y el nombre de la clase no pueden estar vacíos.");
        }

        // 2. "Traducimos" la consulta SQL a los parámetros del método buscar()
        $select = 't.id_tren';
        $from = 'Tren t';
        $innerJoin = [
            'Clase c' => 't.id_clase = c.id_clase'
        ];
        $where = 't.codigo = :codigo AND c.nombre_clase = :nombreClase';
        $datos = [
            ':codigo' => $codigo,
            ':nombreClase' => $nombre_clase
        ];

        // 3. Llamamos al método de la clase base. ¡Eso es todo!
        $resultado = $this->buscar($from, $select, $where, $datos, $innerJoin);

        // 4. Procesamos la respuesta (lógica de negocio)
        if (!empty($resultado)) {
            // buscar() devuelve un array de resultados, tomamos el primero.
            return $resultado[0]['id_tren'];
        }

        // Si no se encontró nada, devolvemos null.
        return null;
    }

    }
?>