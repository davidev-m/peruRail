    <?php
        require_once __DIR__ . '/caso_base.php';
        class tipo_documento extends caso_base_CRUD{
            private $nombreTabla;

            function __construct(){
                parent::__construct(); 
                $this->nombreTabla = "Tipo_documento";
            }

            public function buscarDocumento($tipo_document){
                // Ejemplo de uso:
                // $this->buscar(
                //     $tabla:             "",
                //     $datosSeleccion:    "*",
                //     $where:             "",
                //     $datos:             [],
                //     $innerJoin:         [],
                //     $condicionalExtra:  ""
                // );
                $select = 'id_documento ';
                $from = $this->nombreTabla;
                $where = "nombre_documento = :documento";
                $ArregloDatos = [
                    ":documento" => $tipo_document
                ];
                
                $resultado = $this->buscar(
                    $from, $select, $where, $ArregloDatos
                );
                if (!empty($resultado)) {
                    return $resultado[0]['id_documento'];
                }

                return null;    

            }
        };
    ?>