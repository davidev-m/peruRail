<?php
    require_once __DIR__ . '/../modelos/modelos.php';

    /**
     * Valores de retorno:
     * 0 = si existe cliente con ese dni pero con nombre distinto. 
     * 1 = si existe cliente con datos iguales
     * 2 = no existe cliente con ese dni 
     */
    function verificar_documento($nombre,$apellido, $documento){
        $cliente = new Cliente();
        $datosCliente = $cliente->verificar_documento($documento);
        try {
            if(!$datosCliente){
                return 2;
            }
            if($datosCliente['nombre'] != $nombre || $datosCliente['apellido'] != $apellido){
                return 0;
            }
            return 1;
        } catch (Exception $error) {
            echo "Ocurrió un error controlado: " . $error->getMessage();
        }
    }

        /**
     * Valores de retorno:
     * 0 = si existe empresa con ese ruc pero con nombre distinto. 
     * 1 = si existe empresa con datos iguales
     * 2 = no existe empresa con ese ruc 
     */
    function verificar_ruc($ruc, $razon_social, $direccion){
        $claseEmpresa = new ClienteEmpresa();
        $empresa = $claseEmpresa->buscaEmpresa($ruc);
        if(empty($empresa)){
            return 2;
        }else{
            if($empresa['razon_social'] != $razon_social || $direccion != $empresa['direccion']){
                return 0;
            }else{
                return 1;
            }
        }
    }

    function separarNombreYNumero($nombreCompleto) {
    $nombre = $nombreCompleto; // Por defecto, el nombre es toda la cadena
    $codigo = null;            // Por defecto, no hay número
    // La expresión regular /\d+$/ busca dígitos (\d+) al final de la cadena ($)
    if (preg_match('/(\d+)$/', $nombreCompleto, $matches)) {
        // $matches[0] contendrá el número encontrado
        $codigo = (int)$matches[0];
        // Eliminamos el número y el espacio anterior del nombre original
        $nombre = trim(str_replace($matches[0], '', $nombreCompleto));
    }
    return [
        'nombre' => $nombre,
        'codigo' => $codigo
    ];
    }

?>