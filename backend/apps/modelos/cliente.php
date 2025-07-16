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
}
?>
