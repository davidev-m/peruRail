<!doctype html>
<html lang="en">
  <head>
    <!-- Required meta tags -->
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">

    <!-- Bootstrap CSS -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.6.2/dist/css/bootstrap.min.css" >
    <script src="https://checkout.culqi.com/js/v4"></script>
    <title>Pasarela de Pagos</title>
  </head>
  <body>
    
    <script>
        Culqi.publicKey = 'pk_test_MuNmwOi6ip1gVRE3';
        

        

        Culqi.options({
            style: {
                logo: 'https://culqi.com/LogoCulqi.png',
                bannerColor: '', // hexadecimal
                buttonBackground: '', // hexadecimal
                menuColor: '', // hexadecimal
                linksColor: '', // hexadecimal
                buttonText: '', // texto que tomará el botón
                buttonTextColor: '', // hexadecimal
                priceColor: '' // hexadecimal
            }
        });

        const btn_pagar = document.getElementById('btn_pagar');

            btn_pagar.addEventListener('click', function (e) {
                // Abre el formulario con la configuración en Culqi.settings y CulqiOptions
                Culqi.settings({
                    title: 'Culqi Store',
                    currency: 'PEN',  // Este parámetro es requerido para realizar pagos yape
                    amount: 1000,  // Este parámetro es requerido para realizar pagos yape
                    order: 'ord_live_0CjjdWhFpEAZlxlz', // Este parámetro es requerido para realizar pagos con pagoEfectivo, billeteras y Cuotéalo
                    xculqirsaid: 'Inserta aquí el id de tu llave pública RSA',
                    rsapublickey: 'Inserta aquí tu llave pública RSA',
                });

                Culqi.options({
                    lang: "auto",
                    installments: false, // Habilitar o deshabilitar el campo de cuotas
                    paymentMethods: {
                    tarjeta: true,
                    yape: true,
                    bancaMovil: true,
                    agente: true,
                    billetera: true,
                    cuotealo: true,
                    },
                    style: {
                        logo: "https://static.culqi.com/v2/v2/static/img/logo.png",
                    }
                });

                Culqi.open();
                e.preventDefault();
        })

        function culqi() {
        if (Culqi.token) {  // ¡Objeto Token creado exitosamente!
            const token = Culqi.token.id;
            const email = Culqi.token.email;
            console.log('Se ha creado un Token: ', token);
            //En esta linea de codigo debemos enviar el "Culqi.token.id"
            //hacia tu servidor con Ajax

            

            } else if (Culqi.order) {  // ¡Objeto Order creado exitosamente!
            const order = Culqi.order;
            console.log('Se ha creado el objeto Order: ', order);

            } else {
            // Mostramos JSON de objeto error en consola
            console.log('Error : ',Culqi.error);
            }
        };


    </script>

    <!-- Option 1: jQuery and Bootstrap Bundle (includes Popper) -->
    <script src="https://cdn.jsdelivr.net/npm/jquery@3.5.1/dist/jquery.min.js" ></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@4.6.2/dist/js/bootstrap.bundle.min.js" ></script>

  </body>
</html>