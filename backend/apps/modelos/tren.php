<?php
    require_once __DIR__ . '/../conexion/conexion.php';
    require_once __DIR__ . '/caso_base.php';
    class Tren extends caso_base_CRUD{
        private $nombre_tabla;

        function __construct(){
            parent::__construct(); 
            $this->nombre_tabla = "Tren";
        }
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
    public function eliminarTren($idTren){
        $from = $this->nombre_tabla;
        $datos = [
            "id_tren" => $idTren
        ];
        $this->eliminar($from, $datos);
    }

    public function buscarTrenes(){
        $from = $this->nombre_tabla;
        $select = "*";
        $condicionalExtra = "LIMIT 10";
        $resultado = $this->buscar(
            tabla: $from,
            datosSeleccion:$select, 
            condicionalExtra: $condicionalExtra);
        return $resultado;
    }
    public function mostrarAdmin($nombre_tabla){
        $nombre_tabla .= " t ";
        $join = [
            "Clase c" => "t.id_clase = c.id_clase"
        ];
        $condicinal = " LIMIT 20";
        $datos = $this->buscar(tabla:$nombre_tabla, innerJoins: $join, condicionalExtra:$condicinal);
        
        $tren = [];    
        foreach($datos as $dato){
            $tren[] = [
                "id_tren" => (int)$dato['id_tren'],
                "codigo" => $dato['codigo'],
                "cap_total" => $dato['cap_total'],
                "Clase" => [
                    "id_clase" => (int)$dato['id_clase'],
                    "nombre_clase" => $dato['nombre_clase']
                ],
                "Trabajador" =>[
                    "id_trabajador" => $dato['id_trabajador']
                ],
                "estado" => $dato['id_trabajador'] ?? ''
            ];
        }
        return $tren;
    }
}
?>