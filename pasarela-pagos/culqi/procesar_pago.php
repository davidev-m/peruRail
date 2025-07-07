<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
ob_start();

// 1. Incluir el autoload de Composer
require_once __DIR__ . '/../vendor/autoload.php';

try {
    // 2. Configurar la llave secreta de prueba de Culqi
    $culqi = new Culqi\Culqi([
        'api_key' => 'sk_test_xHJ0C3vO5Cw7ToFK'
    ]);

    // 3. Validar datos recibidos desde el frontend
    if (empty($_POST['token']) || empty($_POST['email']) || empty($_POST['amount'])) {
        throw new Exception("Datos incompletos para procesar el pago.");
    }

    // 4. Preparar y enviar el cargo a la API de Culqi
    $charge = $culqi->Charges->create([
        'amount'        => intval($_POST['amount']),
        'currency_code' => 'PEN',
        'description'   => $_POST['description'] ?? 'Venta de boletos de viaje',
        'email'         => $_POST['email'],
        'source_id'     => $_POST['token'],
        'capture'       => true,
    ]);

    // 5. Preparar respuesta exitosa
    $response = $charge;

} catch (Exception $e) {
    // 6. Preparar respuesta de error
    $response = [
        'object'           => 'error',
        'merchant_message' => $e->getMessage(),
    ];
}

ob_end_clean();
header('Content-Type: application/json');
echo json_encode($response);
exit();
