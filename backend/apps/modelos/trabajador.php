<?php
    require_once __DIR__ . "/caso_base.php";
    class Trabajador extends caso_base_CRUD{
        private $nombreTabla;
        protected $filtroEstado = true;
        function __construct(){
            parent::__construct(); 
            $this->nombreTabla = "Trabajador";
        }
    public function mostrarAdmin($nombre_tabla) {
        $tabla = 'Trabajador t'; 

        $select = "
            t.id_trabajador,
            t.nombre,
            t.apellido,
            t.correo,
            t.documento,
            t.estado,
            t.celular,
            c.id_trabajador AS es_chofer,
            a.id_trabajador AS es_asesor
        ";

        $leftJoins = [
            'Chofer c' => 't.id_trabajador = c.id_trabajador',
            'Asesor_venta a' => 'a.id_trabajador = t.id_trabajador'
        ];
        $where = 'estado = :estado';
        $dato = [':estado' => 'activo'];
        $condicional = "LIMIT 20";

        $resultadoPlano = $this->buscar(
            tabla: $tabla,
            datosSeleccion: $select,
            where:$where,
            datos: $dato,
            leftJoins: $leftJoins,
            condicionalExtra: $condicional
        );

        $trabajadoresFormateados = [];
        foreach ($resultadoPlano as $fila) {
            
            $trabajador = [
                'id_trabajador'    => (int)$fila['id_trabajador'],
                'nombre'           => $fila['nombre'],
                'apellido'         => $fila['apellido'], 
                'correo'           => $fila['correo'],
                'documento'        => $fila['documento'],
                'celular'          => $fila['celular'],
                'estado'           => $fila['estado'],
                'rol'              => 'Trabajador' 
            ];
            if (!is_null($fila['es_chofer'])) {
                $trabajador['rol'] = 'Chofer';
            } elseif (!is_null($fila['es_asesor'])) {
                $trabajador['rol'] = 'Asesor_venta';
            }

            $trabajadoresFormateados[] = $trabajador;
        }

        return $trabajadoresFormateados;
    }

        public function insertar($tabla, $datos) {
        if (!isset($datos['rol']) || empty($datos['rol'])) {
            throw new InvalidArgumentException("El 'rol' del trabajador es obligatorio.");
        }

        $rol = strtolower($datos['rol']);
        unset($datos['rol']); 

        $this->pdo->beginTransaction();

        try {
            $idTrabajador = parent::insertar('Trabajador', $datos);

            $tablaRol = '';
            if ($rol === 'chofer') {
                $tablaRol = 'Chofer';
            } elseif ($rol === 'asesor') {
                $tablaRol = 'Asesor_venta';
            } else {
                throw new InvalidArgumentException("El rol '$rol' no es un rol de trabajador válido.");
            }

            parent::insertar($tablaRol, ['id_trabajador' => $idTrabajador]);

            $this->pdo->commit();

            return $idTrabajador;

        } catch (Exception $e) {
            $this->pdo->rollBack();
            throw new RuntimeException("No se pudo insertar el trabajador: " . $e->getMessage());
        }
    }
}

?>