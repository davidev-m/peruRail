<?php
require_once __DIR__ . '/../modelos/ruta.php';
ini_set('session.cookie_path', '/');
ini_set('session.cookie_domain', '');
ini_set('session.cookie_secure', '0');
session_start();


session_unset();
session_destroy();

if (ini_get("session.use_cookies")) {
    $params = session_get_cookie_params();
    setcookie(session_name(), '', time() - 42000,
    $params["path"], $params["domain"],
    $params["secure"], $params["httponly"]
);
}
    function formatoLugar($texto) {
        $min = [' De ', ' Del ', ' La ', ' Las ', ' El ', ' Los '];
        $corregido = [' de ', ' del ', ' la ', ' las ', ' el ', ' los '];
        
        // Primero ponemos todo en minúsculas y aplicamos ucwords
        $texto = ucwords(strtolower($texto));
        
        // Luego corregimos preposiciones
        return str_replace($min, $corregido, $texto);
    }

    function idaVuelta($Origen, $Destino){
        $ruta = new Ruta();
        $Origen = formatoLugar($Origen);
        $Destino = formatoLugar($Destino);
        if(!$ruta->existe($Origen,$Destino)){
            return null;
        }
        return $ruta->existe($Destino,$Origen);   
    }
    function fechaDisponible($Origen, $Destino){
        if(empty($Origen) || empty($Destino)){
            return null;
        }
        $ruta = new Ruta();
        $Origen = formatoLugar($Origen);
        $Destino = formatoLugar($Destino);
        if(!$ruta->existe($Origen,$Destino)){
            echo $Origen . '----' . $Destino;
            return null;
        }
        $fecha = $ruta->disponibilidad($Origen, $Destino);
        $resultado = $fecha["dias_disponibles"];
        if(!$fecha || !isset($fecha["dias_disponibles"])){
            return null;
        }
        return $resultado;
    }
    function destinos($origen){
        $ruta = new Ruta();
        $origen = formatoLugar($origen);
        $destino =  $ruta->buscarDestino($origen);
        if(count($destino) > 0){
            return array_column($destino, 'destino');
        }else{
            return [];
        }
    }

?>