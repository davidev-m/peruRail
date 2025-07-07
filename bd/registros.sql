USE perurail;

INSERT IGNORE INTO Nacionalidad(nombre_nacionalidad) VALUES
('Peru'),
('Colombia'),
('Venezuela');

INSERT IGNORE INTO Tipo_documento(id_nacionalidad, nombre_documento) VALUES
(1, 'DNI'),
(2, 'Pasaporte'),
(3, 'Carnet');

INSERT IGNORE INTO Cliente(id_documento, documento, nombre, apellido, genero, fecha_nacimiento)VALUES
(1,'76852884','Edgar', 'Leyva', 'M', '2001-04-15'),
(2,'1234567890','Carlos', 'Martinez', 'M', '2000-05-11'),
(3,'1230987465','Maria', 'Linares', 'F', '2002-05-11');

INSERT IGNORE INTO Cliente_empresa(ruc, razon_social, direccion) VALUES
('1029421', 'importadora awa.sac', 'miraflores');

INSERT IGNORE INTO Cliente_comprador(id_cliente, id_cliente_e, correo, num_telf) VALUES
(1, NULL, 'ejleyvag@unjbg.edu.pe', '9999999'),
(2, NULL, 'carlos@gmail.com', '998124212'),
(3, 1, 'maria@gmail.com', '23298129');



INSERT IGNORE INTO Infante(id_infante, id_cliente, existe) VALUES
(1, 1, 0),
(1, 2, 1),
(1, 3, 0);

INSERT IGNORE INTO Trabajador(nombre, apellido, correo, documento, celular) VALUES
('Omar', 'Gomez', 'omargomez@gmail.com', '998762341', '561245712'),
('Jean', 'Martinez', 'jeanmartinez@gmail.com', '124215611', '145875421'),
('Juan', 'Perez', 'juanperez@gmail.com', '987431531', '145784512'),
('Maria','Jimenez', 'mariajimenez@gmail.com', '923412563', '124575621'),
('Carlos', 'Rodriguez', 'carlosrodriguez@gmail.com', '912345678', '912345678'),
('Ana', 'Lopez', 'analopez@gmail.com', '987654321', '987654321'),
('Luis', 'Fernandez', 'luisfernandez@gmail.com', '998877665', '998877665'),
('Sofia', 'Garcia', 'sofiagarcia@gmail.com', '955443322', '955443322'),
('Javier', 'Mendoza', 'javiermendoza@gmail.com', '987123456', '987123456'),
('Isabella', 'Cruz', 'isabellacruz@gmail.com', '976543210', '976543210'),
('David', 'Ortiz', 'davidortiz@gmail.com', '965432109', '965432109'),
('Valentina', 'Reyes', 'valentinareyes@gmail.com', '954321098', '954321098'),
('Daniel', 'Gutierrez', 'danielgutierrez@gmail.com', '943210987', '943210987'),
('Camila', 'Morales', 'camilamorales@gmail.com', '932109876', '932109876'),
('Martin', 'Soto', 'martinsoto@gmail.com', '921098765', '921098765'),
('Lucia', 'Rojas', 'luciarojas@gmail.com', '910987654', '910987654'),
('Diego', 'Torres', 'diegotorres@gmail.com', '922110099', '922110099'),
('Andrés', 'Flores', 'andresflores@gmail.com', '988776655', '988776655'),
('Valeria', 'Castillo', 'valeriacastillo@gmail.com', '977665544', '977665544'),
('Ricardo', 'Paredes', 'ricardoparedes@gmail.com', '966554433', '966554433'),
('Paula', 'Navarro', 'paulanavarro@gmail.com', '955443322', '955443322'),
('Sebastian', 'Rios', 'sebastianrios@gmail.com', '944332211', '944332211'),
('Gabriela', 'Espinoza', 'gabrielaespinoza@gmail.com', '933221100', '933221100'),
('Mateo', 'Castro', 'mateocastro@gmail.com', '922110099', '922110099'),
('Jimena', 'Aguilar', 'jimenaaguilar@gmail.com', '911009988', '911009988'),
('Emilio', 'Chavez', 'emiliochavez@gmail.com', '900998877', '900998877'),
('Renata', 'Diaz', 'renatadiaz@gmail.com', '989878765', '989878765'),
('Adriana', 'Guzman', 'adrianaguzman@gmail.com', '910203041', '910203041'),
('Bruno', 'Peralta', 'brunoperalta@gmail.com', '910203042', '910203042'),
('Clara', 'Salazar', 'clarasalazar@gmail.com', '910203043', '910203043'),
('Dario', 'Cabrera', 'dariocabrera@gmail.com', '910203044', '910203044'),
('Elisa', 'Vega', 'elisavega@gmail.com', '910203045', '910203045'),
('Fabian', 'Molina', 'fabianmolina@gmail.com', '910203046', '910203046'),
('Gloria', 'Campos', 'gloriacampos@gmail.com', '910203047', '910203047'),
('Hector', 'Rivas', 'hectorrivas@gmail.com', '910203048', '910203048'),
('Irene', 'Benitez', 'irenebenitez@gmail.com', '910203049', '910203049'),
('Julian', 'Herrera', 'julianherrera@gmail.com', '910203050', '910203050'),
('Karla', 'Medina', 'karlamedina@gmail.com', '910203051', '910203051'),
('Leonardo', 'Silva', 'leonardosilva@gmail.com', '910203052', '910203052'),
('Monica', 'Acosta', 'monicaacosta@gmail.com', '910203053', '910203053'),
('Nicolas', 'Figueroa', 'nicolasfigueroa@gmail.com', '910203054', '910203054'),
('Olivia', 'Delgado', 'oliviadelgado@gmail.com', '910203055', '910203055'),
('Patricio', 'Santana', 'patriciosantana@gmail.com', '910203056', '910203056'),
('Quintina', 'Ibarra', 'quintinaibarra@gmail.com', '910203057', '910203057'),
('Roberto', 'Gimenez', 'robertogimenez@gmail.com', '910203058', '910203058'),
('Silvia', 'Coronel', 'silviacoronel@gmail.com', '910203059', '910203059'),
('Tomas', 'Luna', 'tomasluna@gmail.com', '910203060', '910203060'),
('Ursula', 'Ponce', 'ursulaponce@gmail.com', '910203061', '910203061'),
('Victor', 'Escobar', 'victorescobar@gmail.com', '910203062', '910203062'),
('Ximena', 'Soria', 'ximenasoria@gmail.com', '910203063', '910203063');

INSERT IGNORE INTO Chofer(id_trabajador) VALUES
(1),
(2),
(3),
(4),
(5),
(6),
(7),
(8),
(9),
(10),
(11),
(12),
(13),
(14),
(15),
(16),
(17),
(18),
(19),
(20),
(21),
(22),
(23),
(24),
(25),
(26),
(27),
(28),
(29),
(30),
(31),
(32),
(33),
(34),
(35),
(36),
(37),
(38),
(39),
(40),
(41),
(42),
(43),
(44),
(45),
(46),
(47);

INSERT IGNORE INTO Asesor_venta(id_trabajador) VALUES
(48),
(49);

INSERT IGNORE Ruta(destino, origen, dias_disponibles) VALUES
('Ciudad de Cusco', 'Machu Picchu', 'Todos los días'),
('Ciudad de Cusco', 'Puno', 'Jueves'),
('Ciudad de Cusco', 'Arequipa', 'Jueves'),
('Machu Picchu', 'Ciudad de Cusco', 'Todos los días'),
('Machu Picchu', 'Ollantaytambo', 'Todos los días'),
('Machu Picchu', 'Hidroeléctica', 'Todos los días'),
('Machu Picchu', 'Urubamba', 'Todos los dias'),
('Urubamba', 'Machu Picchu', 'Todos los dias'),
('Ollantaytambo', 'Machu Picchu', 'Todos los dias'),
('Hidroelectica', 'Machu Picchu', 'Todos los dias'),
('Puno', 'Ciudad de Cusco', 'Sabado'),
('Puno', 'Arequipa', 'Viernes'),
('Arequipa', 'Ciudad de Cusco', 'Domingo'),
('Arequipa', 'Puno', 'Domingo');

INSERT IGNORE Estacion(id_ruta, est_origen, est_destino) VALUES
(10, 'Estación Hidroeléctica', 'Estación Machu Picchu Pueblo'),
(1,'KM 104', 'Estación Machu Picchu Pueblo'),
(1, 'Estación Wánchaq', 'Estación Machu Picchu'),
(1, 'Estación San Pedro', 'Estación Machu Picchu'),
(1,'Estación Poroy', 'Estación Machu Picchu'),
(9, 'Estación Ollantaytambo', 'Estación Machu Picchu Pueblo'),
(8, 'Estación Urubamba', 'Estación Machu Picchu'),
(11, 'Estacion Puno', 'Estación Cusco'),
(11, 'Estación Puno-Muelle', 'Estación Cusco'),
(14, 'Estación Arequipa', 'Estacion Puno'),
(14, 'Estacion Arequipa', 'Estacion Puno-Muelle'),
(1, 'Estacion Ciudad Cusco', 'Machu Picchu Pueblo'),
(6, 'Estación Machu Picchu Pueblo', 'Estació Hidroelectica'),
(4,'Estación Machu Picchu Pueblo', 'Estación Ciudad de Cusco'),
(5, 'Estación Machu Picchu', 'Estación Ollantaytambo'),
(7, 'Estación Machu Picchu', 'Urubamba'),
(2, 'Estacion Ciudad de Cusco', 'Estación Puno'),
(3, 'Estacion Ciudad Cusco', 'Estacion Arequipa'),
(12, 'Estacion Puno', 'Estacion Arequipa'),
(13, 'Estacion Arequipa', 'Estacion Cusco'),
(4, 'Estación Machu Picchu', 'Estación Wanchaq'),
(4, 'Estación Machu Picchu', 'Estación Poroy'),
(4, 'Estación Machu Picchu', 'Estación San Pedro');

INSERT IGNORE Clase(nombre_clase) VALUES
('PeruRail Expedition'),
('PeruRail Vistadome Observatory'),
('PeruRail Vistadome'),
('Hiram Bingham'),
('PeruRail Titicaca'),
('Anden Explorer a Belmond Train');

INSERT IGNORE Tren(id_clase, id_trabajador, cap_total, codigo) VALUES
(1, 1, 50, '81'),
(1, 2, 50, '83'),
(1, 3, 50, '33'),
(1, 4, 50, '31'),
(1, 5, 50, '203'),
(1, 6, 50, '73'),
(1, 7, 50, '603'),
(1, 8, 50, '71'),
(1, 9, 50, '91'),
(1, 10, 50, '51'),
(1, 11, 50, '72H'),
(1, 12, 50, '504H'),
(2, 13, 40, '303'),
(2, 14, 40, '603'),
(2, 15, 40, '203'),
(2, 16, 40, '83'),
(2, 17, 40, '33'),
(3, 18, 45, '31'),
(3, 19, 45, '75'),
(3, 20, 45, '301'),
(3, 21, 45, '601'),
(3, 22, 45, '501'),
(4, 23, 30, '11'),
(5, 24, 35, '1'),
(6, 25, 45, '2'),
(1, 26, 50, '204'),
(1, 27, 50, '34'),
(1, 28, 50, '504'),
(1, 29, 50, '50'),
(1, 30, 50, '72'),
(1, 31, 50, '34'),
(1, 32, 50, '604'),
(1, 33, 50, '84'),
(1, 34, 50, '76'),
(1, 35, 50, '71H'),
(1, 36, 50, '501H'),
(2, 37, 40, '204'),
(2, 38, 40, '504'),
(2, 39, 40, '604'),
(2, 40, 40, '302'),
(2, 41, 40, '34'),
(3, 42, 45, '32'),
(3, 43, 45, '606'),
(3, 44, 45, '84'),
(3, 45, 45, '602'),
(3, 46, 45, '76'),
(4, 47, 30, '12');

INSERT IGNORE Bus(placa) VALUES
('A23-432'),
('B21-453'),
('H43-123'),
('L12-AD2'),
('Z12-4S2');

INSERT IGNORE Viaje(id_estacion, id_tren, id_bus, fecha_salida, hora_salida, hora_llegada, precio_pasaje) VALUES
(3, 1, 1, '2025-07-04', '2025-07-04 03:20:00', '2025-07-04 07:40:00', 68),
(3, 16, 2, '2025-07-04', '2025-07-04 04:00:00', '2025-07-04 09:15:00', 138),
(3, 2, 1, '2025-07-04', '2025-07-04 05:10:00', '2025-07-04 09:15:00', 77),
(3, 3, 1, '2025-07-04', '2025-07-04 05:40:00', '2025-07-04 09:54:00', 77),
(3, 17, 2, '2025-07-04', '2025-07-04 05:40:00', '2025-07-04 09:54:00', 137),
(4, 4, NULL, '2025-07-04', '2025-07-04 06:40:00', '2025-07-04 10:52:00', 77),
(4, 18, NULL, '2025-07-04', '2025-07-04 06:40:00', '2025-07-04 10:52:00', 100),
(5, 3, NULL, '2025-07-04', '2025-07-04 06:40:00', '2025-07-04 09:54:00', 73),
(5, 17, NULL, '2025-07-04', '2025-07-04 06:40:00', '2025-07-04 09:54:00', 130),
(4, 5, NULL, '2025-07-04', '2025-07-04 07:30:00', '2025-07-04 12:11:00', 77),
(4, 15, NULL, '2025-07-04', '2025-07-04 07:30:00', '2025-07-04 12:11:00', 155),
(5, 4, NULL, '2025-07-04', '2025-07-04 07:35:00', '2025-07-04 10:52:00', 72),
(5, 18, NULL, '2025-07-04', '2025-07-04 07:35:00', '2025-07-04 10:52:00', 92),
(5, 5, NULL, '2025-07-04', '2025-07-04 08:25:00', '2025-07-04 12:11:00', 72),
(5, 15, NULL, '2025-07-04', '2025-07-04 08:25:00', '2025-07-04 12:11:00', 150),
(5, 23, NULL, '2025-07-04', '2025-07-04 09:05:00', '2025-07-04 12:24:00', 950),
(3, 6, 1, '2025-07-04', '2025-07-04 10:30:00', '2025-07-04 14:25:00', 90),
(3, 14, 3, '2025-07-04', '2025-07-04 12:30:00', '2025-07-04 17:02:00', 152),

(7, 16, NULL, '2025-07-04', '2025-07-04 06:06:00', '2025-07-04 09:15:00', 135),

(6, 8, NULL, '2025-07-04', '2025-07-04 05:05:00', '2025-07-04 06:37:00', 50),
(6, 1, NULL, '2025-07-04', '2025-07-04 06:10:00', '2025-07-04 07:40:00', 63),
(6, 20, NULL, '2025-07-04', '2025-07-04 07:05:00', '2025-07-04 08:27:00', 100),
(6, 2, NULL, '2025-07-04', '2025-07-04 07:45:00', '2025-07-04 09:15:00', 73),
(6, 16, NULL, '2025-07-04', '2025-07-04 07:45:00', '2025-07-04 09:15:00', 130),
(6, 21, NULL, '2025-07-04', '2025-07-04 08:00:00', '2025-07-04 09:25:00', 100),
(6, 3, NULL, '2025-07-04', '2025-07-04 08:29:00', '2025-07-04 09:54:00', 73),
(6, 17, NULL, '2025-07-04', '2025-07-04 08:29:00', '2025-07-04 09:54:00', 130),
(6, 22, NULL, '2025-07-04', '2025-07-04 08:53:00', '2025-07-04 10:29:00', 100),
(6, 4, NULL, '2025-07-04', '2025-07-04 09:15:00', '2025-07-04 10:52:00', 73),
(6, 18, NULL, '2025-07-04', '2025-07-04 09:15:00', '2025-07-04 10:52:00', 100),
(6, 5, NULL, '2025-07-04', '2025-07-04 10:32:00', '2025-07-04 12:11:00',73),
(6, 15, NULL, '2025-07-04', '2025-07-04 10:32:00', '2025-07-04 12:11:00',150),
(6, 23, NULL, '2025-07-04', '2025-07-04 10:53:00', '2025-07-04 12:24:00', 950),
(6, 9, NULL, '2025-07-04', '2025-07-04 11:52:00', '2025-07-04 13:34:00', 60),
(6, 6, NULL, '2025-07-04', '2025-07-04 12:55:00', '2025-07-04 14:25:00', 79),
(6, 13, NULL, '2025-07-04', '2025-07-04 13:27:00', '2025-07-04 14:50:00', 115),
(6, 14, NULL, '2025-07-04', '2025-07-04 15:37:00', '2025-07-04 17:02:00', 150),
(6, 10, NULL, '2025-07-04', '2025-07-04 21:00:00', '2025-07-04 22:45:00', 60),

(1, 11, NULL, '2025-07-04', '2025-07-04 07:54:00', '2025-07-04 08:36:00', 40),
(1, 12, NULL, '2025-07-04', '2025-07-04 14:50:00', '2025-07-04 15:34:00', 40),
-- Arequipa, puno y cusco tienen dias especiales
(10, 25, NULL, '2025-07-06', '2025-07-06 09:00:00', '2025-07-07 08:30:00', 3000),
(10, 25, NULL, '2025-07-06', '2025-07-06 09:00:00', '2025-07-08 13:15:00', 5000),
(10, 24, NULL, '2025-07-05', '2025-07-05 07:50:00', '2025-07-05 18:20:00', 2000),


-- Retorno
(21, 30, 1, '2025-07-04', '2025-07-04 08:53:00', '2025-07-04 13:35:00', 50),
(21, 37, 2, '2025-07-04', '2025-07-04 13:37:00', '2025-07-04 15:30:00', 150),
(21, 31, 1, '2025-07-04', '2025-07-04 15:20:00', '2025-07-04 19:45:00', 140),
(21, 41, 2, '2025-07-04', '2025-07-04 15:20:00', '2025-07-04 19:45:00', 100),
(22, 27, NULL, '2025-07-04', '2025-07-04 15:20:00', '2025-07-04 19:05:00', 90),
(22, 41, NULL, '2025-07-04', '2025-07-04 15:20:00', '2025-07-04 19:05:00', 75),
(21, 28, 1, '2025-07-04', '2025-07-04 16:22:00', '2025-07-04 20:30:00', 60),
(21, 38, 2, '2025-07-04', '2025-07-04 16:22:00', '2025-07-04 21:20:00', 45),
(23, 42, NULL, '2025-07-04', '2025-07-04 16:43:00', '2025-07-04 21:23:00', 70),
(22, 42, NULL, '2025-07-04', '2025-07-04 16:43:00', '2025-07-04 20:23:00', 85),
(23, 32, NULL, '2025-07-04', '2025-07-04 17:23:00', '2025-07-04 21:52:00', 100),
(23, 39, NULL, '2025-07-04', '2025-07-04 17:23:00', '2025-07-04 21:52:00', 70),
(22, 32, NULL, '2025-07-04', '2025-07-04 17:23:00', '2025-07-04 20:52:00', 50),
(22, 39, NULL, '2025-07-04', '2025-07-04 17:23:00', '2025-07-04 20:52:00', 40),
(22, 12, NULL, '2025-07-04', '2025-07-04 17:50:00', '2025-07-04 21:16:00', 100),
(21, 43, 3, '2025-07-04', '2025-07-04 16:10:00', '2025-07-04 22:15:00', 45),
(21, 33, 1, '2025-07-04', '2025-07-04 18:20:00', '2025-07-04 22:30:00', 150),
(21, 44, 3, '2025-07-04', '2025-07-04 18:20:00', '2025-07-04 22:30:00', 100),

(16, 38, NULL, '2025-07-04', '2025-07-04 16:22:00', '2025-07-04 19:29:00',20),

(15, 29, NULL, '2025-07-04', '2025-07-04 05:35:00', '2025-07-04 07:44:00', 63),
(15, 30, NULL, '2025-07-04', '2025-07-04 08:53:00', '2025-07-04 10:52:00', 60),
(15, 40, NULL, '2025-07-04', '2025-07-04 10:55:00', '2025-07-04 12:32:00', 155),
(15, 45, NULL, '2025-07-04', '2025-07-04 12:46:00', '2025-07-04 15:19:00', 150),
(15, 37, NULL, '2025-07-04', '2025-07-04 13:37:00', '2025-07-04 15:04:00', 150),
(15, 27, NULL, '2025-07-04', '2025-07-04 15:20:00', '2025-07-04 17:08:00', 155),
(15, 41, NULL, '2025-07-04', '2025-07-04 15:20:00', '2025-07-04 17:08:00', 100),
(15, 28, NULL, '2025-07-04', '2025-07-04 16:22:00', '2025-07-04 18:10:00', 150),
(15, 38, NULL, '2025-07-04', '2025-07-04 16:22:00', '2025-07-04 18:10:00', 140),
(15, 42, NULL, '2025-07-04', '2025-07-04 16:43:00', '2025-07-04 18:31:00', 150),
(15, 32, NULL, '2025-07-04', '2025-07-04 17:23:00', '2025-07-04 19:02:00', 70),
(15, 39, NULL, '2025-07-04', '2025-07-04 17:23:00', '2025-07-04 19:02:00', 75),
(15, 47, NULL, '2025-07-04', '2025-07-04 17:50:00', '2025-07-04 19:25:00', 950),
(15, 43, NULL, '2025-07-04', '2025-07-04 18:10:00', '2025-07-04 19:51:00', 65),
(15, 33, NULL, '2025-07-04', '2025-07-04 18:20:00', '2025-07-04 20:05:00', 40),
(15, 44, NULL, '2025-07-04', '2025-07-04 18:20:00', '2025-07-04 20:05:00', 50),
(15, 34, NULL, '2025-07-04', '2025-07-04 21:50:00', '2025-07-04 23:37:00', 65),
(15, 46, NULL, '2025-07-04', '2025-07-04 21:50:00', '2025-07-04 23:37:00', 100),

(13, 35, NULL, '2025-07-04', '2025-07-04 06:45:00', '2025-07-04 07:30:00', 40),
(13, 36, NULL, '2025-07-04', '2025-07-04 13:30:00', '2025-07-04 14:15:00', 40),
-- CUSCO AREQUIPA
(18, 25, NULL, '2025-07-10', '2025-07-10 10:00:00', '2025-07-12 15:30:00', 3000),
-- CUSCO PUNO
(17, 24, NULL, '2025-07-06', '2025-07-06 07:50:00', '2025-07-06 18:20:00', 5000),
-- PUNO AREQUIPA
(19, 25, NULL, '2025-07-11', '2025-07-11 15:30:00', '2025-07-12 15:30:00', 2000);

INSERT IGNORE Pago(id_cliente, monto_total, metodo) VALUES
(1, 500, 'Tarjeta'),
(2, 1000, 'Transferencia'),
(3, 2500, 'Efectivo');

INSERT IGNORE Reserva(id_viaje, id_pago, fecha, id_cliente) VALUES
(1, 1, '2025-07-04',2),
(3, 2, '2025-07-04',1),
(5, 3, '2025-07-04',3);

INSERT IGNORE Reserva_asesor(id_reserva, id_trabajador) VALUES
(3, 48);
