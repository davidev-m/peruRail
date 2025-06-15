<?php

/**
 * Interface interfaz_ruta
 * Define los métodos necesarios para gestionar rutas en la aplicación.
 */
interface interfaz_ruta {

    /**
     * Verifica si existe una ruta entre un origen y un destino.
     *
     * @param string $origen  Ciudad de origen (ej: 'cuzco')
     * @param string $destino Ciudad de destino (ej: 'puno')
     * @return bool Retorna true si existe la ruta, false en caso contrario
     */
    public function existe($origen, $destino);

    /**
     * Obtiene todos los destinos posibles desde un origen.
     *
     * @param string $origen Ciudad de origen
     * @return array Arreglo asociativo con los destinos (ej: [['Destino' => 'puno'], ...])
     */
    public function buscarDestino($origen);

    /**
     * Obtiene los días disponibles para una ruta específica.
     *
     * @param string $origen  Ciudad de origen
     * @param string $destino Ciudad de destino
     * @return array|null Arreglo asociativo con la clave 'diasDisponibles' o null si no se encuentra
     */
    public function disponibilidad($origen, $destino);


    /**
     * Summary of devolverID
     * @param $origen Ciudad de origen
     * @param $destino Ciudad de destino
     * @return int Entero con la clave id de la ruta
     */
    public function devolverID($origen,$destino);
};

?>
