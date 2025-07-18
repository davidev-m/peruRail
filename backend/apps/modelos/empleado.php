<?php
    require_once __DIR__ . "/caso_base.php";
    class Empleado extends caso_base_CRUD{
        private $nombreTabla;
        function __construct(){
            parent::__construct(); 
            $this->nombreTabla = "Empleado";
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
        
        $condicional = "LIMIT 20";

        $resultadoPlano = $this->buscar(
            tabla: $tabla,
            datosSeleccion: $select,
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
                $trabajador['rol'] = 'Asesor de Venta';
            }

            $trabajadoresFormateados[] = $trabajador;
        }

        return $trabajadoresFormateados;
    }
}

?>