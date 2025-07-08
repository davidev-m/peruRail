<?php
// --- INICIO: CÓDIGO DE DEPURACIÓN ---
// Muestra todos los errores de PHP para ayudarnos a encontrar el problema.
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
// --- FIN: CÓDIGO DE DEPURACIÓN ---

// Iniciar el buffer de salida para capturar cualquier salida inesperada.
ob_start();

// Definir una variable para la respuesta
$response_data = [];

try {
    // --- CARGA DE LIBRERÍAS CON COMPOSER ---
    // Este es el ÚNICO archivo que necesitas incluir cuando usas Composer.
    // Se asume que la carpeta 'vendor' está en el directorio raíz, un nivel arriba de 'culqi'.
    require_once dirname(__FILE__) . '/../vendor/autoload.php';

    // --- LÓGICA DE PAGO ---
    $SECRET_KEY = "sk_test_xHJ0C3vO5Cw7ToFK";
    $culqi = new Culqi\Culqi(array('api_key' => $SECRET_KEY));

    if (!isset($_POST['token']) || !isset($_POST['email']) || !isset($_POST['amount'])) {
        throw new Exception("Datos incompletos para procesar el pago.");
    }

    $token = $_POST['token'];
    $email = $_POST['email'];
    $amount = $_POST['amount'];
    $description = isset($_POST['description']) ? $_POST['description'] : 'Venta de prueba';

    $charge = $culqi->Charges->create(
        array(
            "amount" => $amount,
            "currency_code" => "PEN",
            "description" => $description,
            "email" => $email,
            "source_id" => $token,
            "capture" => true
        )
    );

    $response_data = $charge;

} catch (Exception $e) {
    $response_data = array(
        'object' => 'error',
        'merchant_message' => $e->getMessage()
    );
}

// Limpiar cualquier salida que se haya generado.
ob_end_clean();

// Establecer la cabecera JSON y enviar la respuesta.
header('Content-Type: application/json');
echo json_encode($response_data);
exit();
?>