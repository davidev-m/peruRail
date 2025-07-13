<?php

// Carga de las dependencias de Composer
require_once __DIR__ . '/../vendor/autoload.php';

// Usar la clase Culqi para mayor legibilidad
use Culqi\Culqi;
use Culqi\CulqiException;

// La respuesta por defecto será un array vacío
$response_data = [];

try {
    // --- 1. Configuración ---
    // Asegúrate de que la clase Culqi exista antes de usarla
    if (!class_exists('Culqi\Culqi')) {
        throw new Exception('La librería de Culqi no se ha cargado correctamente.');
    }
    
    // Configura tu llave secreta (idealmente, cárgala desde una variable de entorno)
    $SECRET_KEY = "sk_test_xHJ0C3vO5Cw7ToFK";
    $culqi = new Culqi(['api_key' => $SECRET_KEY]);

    // --- 2. Validación de Datos de Entrada ---
    // Verifica que los datos necesarios hayan sido enviados desde el frontend
    if (!isset($_POST['token'], $_POST['email'], $_POST['amount'])) {
        throw new Exception("Datos incompletos para procesar el pago. Se requiere 'token', 'email' y 'amount'.");
    }

    $token       = $_POST['token'];
    $email       = $_POST['email'];
    $amount      = $_POST['amount']; // El monto ya viene en céntimos desde el frontend
    $description = $_POST['description'] ?? 'Venta de boletos de viaje';

    // --- 3. Creación del Cargo en Culqi ---
    // Se envía la información a la API de Culqi para procesar el pago
    $charge = $culqi->Charges->create([
        "amount"        => $amount * 100,
        "currency_code" => "PEN",
        "description"   => $description,
        "email"         => $email,
        "source_id"     => $token,
        "capture"       => true // Captura el pago inmediatamente
    ]);

    // Si el cargo es exitoso, preparamos la respuesta
    $response_data = $charge;

} catch (Exception $e) {
    // --- 4. Manejo de Errores ---
    // Si ocurre cualquier tipo de excepción, se captura y se formatea una respuesta de error.
    
    $merchant_message = "Ocurrió un error inesperado al procesar el pago.";
    $user_message = "No se pudo completar tu pago. Por favor, intenta de nuevo o contacta a soporte.";
    $error_type = 'unknown_error';

    // Si es una excepción específica de Culqi, usamos sus mensajes de error
    if ($e instanceof CulqiException) {
        $culqi_error = json_decode($e->getMessage(), true);
        if (json_last_error() === JSON_ERROR_NONE && isset($culqi_error['merchant_message'])) {
            $merchant_message = $culqi_error['merchant_message'];
            $user_message     = $culqi_error['user_message'] ?? $user_message;
            $error_type       = $culqi_error['type'] ?? 'culqi_api_error';
        } else {
            $merchant_message = "Error de Culqi: " . $e->getMessage();
        }
    } else {
        // Para otras excepciones (ej. datos incompletos)
        $merchant_message = "Error general del servidor: " . $e->getMessage();
    }

    // Se establece el código de respuesta HTTP a 400 (Bad Request)
    http_response_code(400);

    // Se prepara la respuesta de error en formato JSON
    $response_data = [
        'object'           => 'error',
        'type'             => $error_type,
        'merchant_message' => $merchant_message,
        'user_message'     => $user_message
    ];
}

// --- 5. Envío de la Respuesta Final ---
// Se envían los encabezados para indicar que la respuesta es JSON
header('Content-Type: application/json; charset=utf-8');

// Se imprime la respuesta (ya sea de éxito o de error) en formato JSON
echo json_encode($response_data);
exit();
