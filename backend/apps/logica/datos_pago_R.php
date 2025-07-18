<?php
require_once __DIR__ . '/funciones_extra.php';
require_once __DIR__ . '/../modelos/modelos.php';
require_once __DIR__ . '/../conexion/conexion.php';

session_start();
header('Content-Type: application/json');

function enviarRespuestaError($mensaje, $codigoHttp = 500) {
    http_response_code($codigoHttp);
    echo json_encode(['error' => $mensaje]);
    exit;
}

$confirmacion = json_decode(file_get_contents('php://input'), true);

if (!empty($confirmacion['verificacion']) && $confirmacion['verificacion'] === true) {
    
    $pdo = database::getConexion();

    $pdo->beginTransaction();

    try {
        $tren = new Tren();
        $estacion = new Estacion();
        $viaje = new Viaje();
        $idViajes = [];

        $trenIdaInfo = $_SESSION["trenes_seleccionados"]["trenIda"];
        $nombreTrenIda = separarNombreYNumero($trenIdaInfo['tren']["nombre"]);
        $idTrenIda = $tren->BuscarIdTren($nombreTrenIda['codigo'], $nombreTrenIda['nombre']);

        $idEstacionIda = $estacion->obtenerIdEstacion($trenIdaInfo["estaciones"][0], $trenIdaInfo["estaciones"][1]);
        if (!$idEstacionIda || !$idTrenIda) {
            throw new Exception("Error en la obtencion de id tren o estacion");
        }

        $idBusIda = !empty($trenIdaInfo["tren"]["id_bus"]) ? $trenIdaInfo["tren"]["id_bus"] : null;
        $fechaIda = $_SESSION['trenes_seleccionados']['fechaIda'];
        $idViajeIda = $viaje->obtenerIdViaje($idTrenIda, $idBusIda, $idEstacionIda, $fechaIda);
        if (!$idViajeIda) {
            throw new Exception("No se pudo encontrar un viaje valido para el trayecto de ida.");
        }
        $idViajes[] = $idViajeIda;


        if ($_SESSION['trenes_seleccionados']['tipo'] == "ida_vuelta") {
            $trenRetornoInfo = $_SESSION["trenes_seleccionados"]["trenRetorno"];
            $nombreTrenRetorno = separarNombreYNumero($trenRetornoInfo['tren']["nombre"]);
            $idTrenRetorno = $tren->BuscarIdTren($nombreTrenRetorno['codigo'], $nombreTrenRetorno['nombre']);

            if (!$idEstacionIda) {
                throw new Exception("TREN IDA: Datos de id no encontrados o falsos ");
            }
            $idEstacionRetorno = $estacion->obtenerIdEstacion($trenRetornoInfo["estaciones"][0], $trenRetornoInfo["estaciones"][1]);
            if (!$idTrenRetorno) {
                throw new Exception("TREN RETORNO: Datos de id no encontrados o falsos ");
            }
            

            $idBusRetorno = !empty($trenRetornoInfo["tren"]["id_bus"]) ? $trenRetornoInfo["tren"]["id_bus"] : null;
            $fechaRetorno = $_SESSION['trenes_seleccionados']['fechaRet'] ?? null;
            if(!$fechaRetorno){
                throw new Exception("Fallo en la recoleccion de fecha ");
            }
            
            $idViajeRetorno = $viaje->obtenerIdViaje($idTrenRetorno, $idBusRetorno, $idEstacionRetorno, $fechaRetorno);
            if(!$idViajeRetorno ){
                throw new Exception("Fallo en la recoleccion de fehca ");
            }
            $idViajes[] = $idViajeRetorno;
        }
        
        $empresa = $_SESSION['empresa'] ?? [];
        $idEmpresa = null; // Usar null en lugar de -1
        if (!empty($empresa)) {
            $claseEmpresa = new ClienteEmpresa();
            $ruc = $empresa['ruc'];
            $razon_social = $empresa['razon_social'];
            $direccion = $empresa['direccion'];
            
            if (isset($empresa['existe']) && $empresa['existe'] == 1) {
                $empresaExistente = $claseEmpresa->buscaEmpresa($ruc);
                $idEmpresa = $empresaExistente ? $empresaExistente['id_cliente_e'] : null;
            } else {
                $idEmpresa = $claseEmpresa->insertarEmpresa($ruc, $razon_social, $direccion);
            }
            if (!$idEmpresa) {
                throw new Exception("No se pudo procesar la información de la empresa.");
            }
        }

        $claseCliente = new Cliente();
        $claseClienteComprador = new ClienteComprador();
        $documento = new tipo_documento();
        $clasePago = new Pago();
        
        $adultos = $_SESSION["pasajeros"]["adultos"] ?? [];
        $ninos = $_SESSION["pasajeros"]["ninos"] ?? [];
        $compradorInfo = $_SESSION["comprador"];
        $clientes = array_merge($adultos, $ninos);
        $idsClientes = [];
        $idPago = null;

        foreach ($clientes as $client) {
            $idDocumento = $documento->buscarDocumento($client['tipo_doc']);
            if (!$idDocumento) throw new Exception("Tipo de documento no válido: " . $client['tipo_doc']);

            $nuevoIdCliente = $claseCliente->insertarCliente($idDocumento, $client["nombre"], $client["apellidos"], $client["genero"], $client["num_doc"], $client["fecha_nac"]);
            $idsClientes[] = $nuevoIdCliente;

            if (isset($client["es_comprador"]) && $client["es_comprador"] == 1) {
                $idComprador = $claseClienteComprador->insertarClienteComprador($nuevoIdCliente, $compradorInfo['email'], $compradorInfo['telefono'], $idEmpresa);
                $montoTotal = $_SESSION['monto_total'];
                $idPago = $clasePago->insertarPago($idComprador, $montoTotal, "tarjeta");
            }
        }

        if (!$idPago) {
            throw new Exception("No se pudo procesar el pago o no se designó un comprador.");
        }

        // --- 4. INSERTAR RESERVAS (LÓGICA CORREGIDA) ---
        $claseReserva = new reserva();
        $cantCliente = count($clientes);

        // Reserva para el viaje de IDA
        $idViajeIda = $idViajes[0];
        $fechaIda = $_SESSION["trenes_seleccionados"]['fechaIda'];
        for ($i = 0; $i < $cantCliente; $i++) {
            $client = $clientes[$i];
            $infante = (isset($client['con_infante']) && $client['con_infante'] == 1) ? 1 : 0;
            $claseReserva->insertarReserva($idViajeIda, $idPago, $fechaIda, $idsClientes[$i], $infante);
        }

        // Reserva para el viaje de VUELTA (si existe)
        if (isset($idViajes[1])) {
            $idViajeRetorno = $idViajes[1];
            $fechaRetorno = $_SESSION["trenes_seleccionados"]['fechaRet'];
            for ($i = 0; $i < $cantCliente; $i++) {
                $client = $clientes[$i];
                $infante = (isset($client['con_infante']) && $client['con_infante'] == 1) ? 1 : 0;
                $claseReserva->insertarReserva($idViajeRetorno, $idPago, $fechaRetorno, $idsClientes[$i], $infante);
            }
        }

        $pdo->commit();

        echo json_encode([
            "success" => true,
            "message" => "La reserva se ha completado con éxito."
        ]);

    } catch (Exception $e) {

        $pdo->rollBack();
        error_log("Error en la transacción de reserva: " . $e->getMessage());
        enviarRespuestaError("No se pudo completar la reserva. Por favor, inténtelo de nuevo. Error: " . $e->getMessage());
    }
} else {
    enviarRespuestaError("Verificación fallida.", 400);
}
?>
