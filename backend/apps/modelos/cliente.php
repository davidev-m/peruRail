<?php
require_once __DIR__ . '/caso_base.php';

/**
 * Maneja la lógica de negocio para la tabla Cliente.
 * Hereda de caso_base_CRUD para las operaciones de base de datos.
 */
class Cliente extends caso_base_CRUD {
    private $nombreTabla;
    public function __construct(){
        parent::__construct(); 
        $this->nombreTabla = "Cliente";
    }
    public function verificar_documento($documento) {

        $select = 'nombre, apellido';
        $from = $this->nombreTabla;
        $where = 'documento = :documento';
        $datos = [':documento' => $documento];

        // Usamos el método heredado para ejecutar la búsqueda.
        $resultado = $this->buscar($from, $select, $where, $datos);

        if (!empty($resultado)) {
            // Devolvemos solo la primera fila encontrada.
            return $resultado[0];
        }

        return false; // No se encontró ningún cliente con ese documento.
    }

    public function insertarCliente($id_documento, $nombre, $apellido, $genero, $documento, $fecha_nacimiento) {
        
        // El método insertar() de la clase base requiere un array asociativo.
        // Las claves deben ser los nombres exactos de las columnas en la tabla.
        $datos = [
            'id_documento' => $id_documento,
            'nombre' => $nombre,
            'apellido' => $apellido,
            'genero' => $genero,
            'documento' => $documento,
            'fecha_nacimiento' => $fecha_nacimiento
        ];
        $idCliente = $this->insertar("Cliente", $datos);
        if(!$idCliente){
            throw new Exception("Erro en obtencion de idCliente");
        }
        return $idCliente;
    }
    public function buscarId($documento){
        $select = "id_cliente";
        $from = $this->nombreTabla;
        $where = "documento = :documento";
        $datos = [
            ":documento" => $documento
        ];
        $resultado = $this->buscar($from,$select,$where,$datos);
        return $resultado[0]['id_cliente'];
    }

    public function mostrarAdmin($nombre_tabla) {
        $tabla = 'Cliente c'; 

        $select = "
            c.id_cliente,
            c.nombre,
            c.apellido,
            c.genero,
            c.documento,
            c.fecha_nacimiento,
            c.estado,
            cc.correo,
            cc.num_telf
        ";

        // Definimos el LEFT JOIN. Esto unirá Cliente_comprador (con alias 'cc')
        // a Cliente donde los IDs coincidan.
        $leftJoins = [
            'Cliente_comprador cc' => 'c.id_cliente = cc.id_cliente'
        ];
        
        $where = 'estado = :estado';
        $dato = [':estado' => 'activo'];
        $condicional = "LIMIT 20";

        // 2. Ejecutamos UNA SOLA consulta eficiente que trae toda la información.
        $resultadoPlano = $this->buscar(
            tabla: $tabla,
            datosSeleccion: $select,
            where: $where,
            datos:$dato,
            leftJoins: $leftJoins,
            condicionalExtra: $condicional
        );

        // 3. Procesamos el resultado con UN SOLO bucle.
        $clientesFormateados = [];
        foreach ($resultadoPlano as $fila) {
            // Creamos la estructura base del cliente.
            $cliente = [
                'id_cliente'       => (int)$fila['id_cliente'],
                'nombre'           => $fila['nombre'],
                'apellido'         => $fila['apellido'], 
                'genero'           => $fila['genero'],
                'documento'        => $fila['documento'],
                'fecha_nacimiento' => $fila['fecha_nacimiento'],
                'estado'           => $fila['estado'],
                'rol'              => 'Pasajero'
            ];

            if (!is_null($fila['correo'])) {
                $cliente['rol'] = 'Comprador';
                $cliente['correo'] = $fila['correo'];
                $cliente['num_telf'] = $fila['num_telf'];
            }

            $clientesFormateados[] = $cliente;
        }

        return $clientesFormateados;
    }

}
?>
