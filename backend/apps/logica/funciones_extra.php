<?php
    require_once __DIR__ . '/../modelos/modelos.php';
    function verificar_documento($nombre,$apellido, $documento){
        $cliente = new Cliente();
        $datosCliente = $cliente->verificar_documento($documento);
        if(!$datosCliente){
            return true;
        }
        if($datosCliente['nombre'] != $nombre || $datosCliente['apellido'] != $apellido){
            return false;
        }
        return true;
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