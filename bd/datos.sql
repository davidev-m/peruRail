-- ------------------------------------------------------------------
-- 15 registros en Pago
-- ------------------------------------------------------------------
INSERT INTO Pago (cant_reserva, metodo, fecha) VALUES
  (2, 'Tarjeta',      '2025-06-01 08:15:00'),
  (1, 'Efectivo',     '2025-06-01 12:30:00'),
  (4, 'Yape',         '2025-06-02 09:45:00'),
  (3, 'Plin',         '2025-06-02 17:20:00'),
  (5, 'Transferencia','2025-06-03 10:00:00'),
  (1, 'Tarjeta',      '2025-06-04 11:10:00'),
  (2, 'Efectivo',     '2025-06-05 14:50:00'),
  (3, 'Yape',         '2025-06-06 07:30:00'),
  (1, 'Plin',         '2025-06-06 16:40:00'),
  (2, 'Transferencia','2025-06-07 09:00:00'),
  (4, 'Tarjeta',      '2025-06-08 13:25:00'),
  (5, 'Efectivo',     '2025-06-09 15:55:00'),
  (3, 'Yape',         '2025-06-10 08:05:00'),
  (1, 'Plin',         '2025-06-11 14:30:00'),
  (2, 'Transferencia','2025-06-12 10:45:00');

-- ------------------------------------------------------------------
-- 15 registros en Horario
-- ------------------------------------------------------------------
INSERT INTO Horario (fech_salida, hr_salida, hr_llegada, duracion, estado) VALUES
  ('2025-06-15','2025-06-15 06:00:00','2025-06-15 08:30:00',150,'Confirmado'),
  ('2025-06-16','2025-06-16 07:00:00','2025-06-16 09:00:00',120,'Confirmado'),
  ('2025-06-17','2025-06-17 08:30:00','2025-06-17 11:00:00',150,'Pendiente'),
  ('2025-06-18','2025-06-18 06:45:00','2025-06-18 09:15:00',150,'Confirmado'),
  ('2025-06-19','2025-06-19 07:15:00','2025-06-19 09:45:00',150,'Cancelado'),
  ('2025-06-20','2025-06-20 08:00:00','2025-06-20 10:30:00',150,'Confirmado'),
  ('2025-06-21','2025-06-21 09:00:00','2025-06-21 11:30:00',150,'Confirmado'),
  ('2025-06-22','2025-06-22 06:30:00','2025-06-22 08:30:00',120,'Pendiente'),
  ('2025-06-23','2025-06-23 07:45:00','2025-06-23 10:15:00',150,'Confirmado'),
  ('2025-06-24','2025-06-24 08:15:00','2025-06-24 10:45:00',150,'Confirmado'),
  ('2025-06-25','2025-06-25 06:20:00','2025-06-25 08:50:00',150,'Confirmado'),
  ('2025-06-26','2025-06-26 07:30:00','2025-06-26 10:00:00',150,'Pendiente'),
  ('2025-06-27','2025-06-27 08:00:00','2025-06-27 10:30:00',150,'Confirmado'),
  ('2025-06-28','2025-06-28 09:15:00','2025-06-28 11:45:00',150,'Cancelado'),
  ('2025-06-29','2025-06-29 06:10:00','2025-06-29 08:40:00',150,'Confirmado');

-- ------------------------------------------------------------------
-- 15 registros en Tren
-- ------------------------------------------------------------------
INSERT INTO Tren (clase, numero, nombre) VALUES
  ('Vistadome', 101, 'Expedition'),
  ('Vistadome', 102, 'Sacred Valley'),
  ('Expedition',103, 'Hiram Bingham'),
  ('Tourist',   104, 'Andean Explorer'),
  ('First',     105, 'Luxury'),
  ('Tourist',   106, 'Mountainside'),
  ('Vistadome', 107, 'Jungle'),
  ('Expedition',108, 'Sunrise'),
  ('Tourist',   109, 'Sunset'),
  ('First',     110, 'Panoramic'),
  ('Expedition',111, 'Spirit'),
  ('Vistadome', 112, 'Heritage'),
  ('Tourist',   113, 'Valley'),
  ('First',     114, 'Elite'),
  ('Expedition',115, 'Discovery');

-- ------------------------------------------------------------------
-- 15 registros en Ruta
-- ------------------------------------------------------------------
INSERT INTO Ruta (origen, destino, dias_disponibles) VALUES
  ('Cusco','Machu Picchu',    'Lunes,Miércoles,Viernes'),
  ('Cusco','Puno',            'Martes,Jueves,Sábado'),
  ('Puno','Uros',             'Lunes,Martes,Miércoles'),
  ('Cusco','Ollantaytambo',   'Diario'),
  ('Ollantaytambo','Machu Picchu','Diario'),
  ('Cusco','Sacred Valley',   'Miércoles,Sábado'),
  ('Puno','Arequipa',         'Viernes,Domingos'),
  ('Arequipa','Cusco',        'Diario'),
  ('Cusco','Juliaca',         'Martes,Jueves'),
  ('Juliaca','Puno',          'Lunes,Miércoles,Viernes'),
  ('Cusco','Urubamba',        'Diario'),
  ('Urubamba','Machu Picchu', 'Lunes,Jueves,Sábado'),
  ('Cusco','Chinchero',       'Diario'),
  ('Chinchero','Ollantaytambo','Martes,Viernes'),
  ('Sacred Valley','Andahuaylillas','Miércoles,Viernes');

-- ------------------------------------------------------------------
-- 15 registros en Trabajador
-- ------------------------------------------------------------------
INSERT INTO Trabajador (nombre, apellido, correo, documento) VALUES
  ('Juan',    'Perez',      'juan.perez@perurail.com',    'A12345678'),
  ('María',   'García',     'maria.garcia@perurail.com',  'B87654321'),
  ('Luis',    'Rodríguez',  'luis.rodriguez@perurail.com','C23456789'),
  ('Ana',     'Martínez',   'ana.martinez@perurail.com',  'D34567890'),
  ('Carlos',  'López',      'carlos.lopez@perurail.com',  'E45678901'),
  ('Sofía',   'González',   'sofia.gonzalez@perurail.com','F56789012'),
  ('Miguel',  'Díaz',       'miguel.diaz@perurail.com',   'G67890123'),
  ('Lucía',   'Sánchez',    'lucia.sanchez@perurail.com', 'H78901234'),
  ('Diego',   'Ramírez',    'diego.ramirez@perurail.com', 'I89012345'),
  ('Valeria', 'Torres',     'valeria.torres@perurail.com','J90123456'),
  ('Pedro',   'Flores',     'pedro.flores@perurail.com',  'K01234567'),
  ('Elena',   'Castro',     'elena.castro@perurail.com',  'L12345678'),
  ('Javier',  'Reyes',      'javier.reyes@perurail.com',  'M23456789'),
  ('Camila',  'Vargas',     'camila.vargas@perurail.com', 'N34567890'),
  ('Rafael',  'Mendoza',    'rafael.mendoza@perurail.com', 'O45678901');

-- ------------------------------------------------------------------
-- 5 registros en Chofer (subclase de Trabajador)
-- ------------------------------------------------------------------
INSERT INTO Chofer (trabajador_id) VALUES
  (1),(3),(5),(7),(9);

-- ------------------------------------------------------------------
-- 5 registros en Asesor_de_venta (subclase de Trabajador)
-- ------------------------------------------------------------------
INSERT INTO Asesor_de_venta (trabajador_id) VALUES
  (2),(4),(6),(8),(10);

-- ------------------------------------------------------------------
-- 15 registros en Cliente_final
-- ------------------------------------------------------------------
INSERT INTO Cliente_final (nacionalidad, documento, nombre, apellido, num_telf, genero, fech_nac, correo) VALUES
  /* Usuarios (10) */
  ('Peruana','U10000001','Ana','Torres','987000001','Femenino','1992-01-10','ana.torres@example.com'),
  ('Peruano','U10000002','Luis','Paredes','987000002','Masculino','1988-05-12','luis.paredes@example.com'),
  ('Peruana','U10000003','María','Quispe','987000003','Femenino','1995-09-20','maria.quispe@example.com'),
  ('Peruano','U10000004','Carlos','Huaman','987000004','Masculino','1990-03-05','carlos.huaman@example.com'),
  ('Peruana','U10000005','Lucía','Salazar','987000005','Femenino','1987-11-22','lucia.salazar@example.com'),
  ('Peruano','U10000006','Diego','Mamani','987000006','Masculino','1993-07-15','diego.mamani@example.com'),
  ('Peruana','U10000007','Elena','Cruz','987000007','Femenino','1994-12-30','elena.cruz@example.com'),
  ('Peruano','U10000008','Miguel','Flores','987000008','Masculino','1985-08-09','miguel.flores@example.com'),
  ('Peruana','U10000009','Valeria','Chávez','987000009','Femenino','1991-04-18','valeria.chavez@example.com'),
  ('Peruano','U10000010','Javier','Soria','987000010','Masculino','1989-02-27','javier.soria@example.com'),
  /* Empresas (5) */
  ('Peruana','E20000001','Inka','Tours','','Empresa','2000-01-01','contacto@inkatours.com'),
  ('Peruana','E20000002','Andes','Travel','','Empresa','2001-02-02','info@andestravel.com'),
  ('Peruana','E20000003','Sacred','Valley','', 'Empresa','2002-03-03','ventas@sacredvalley.com'),
  ('Peruana','E20000004','Misti','Expeditions','','Empresa','2003-04-04','hola@mistiexp.com'),
  ('Peruana','E20000005','Andahuaylillas','SA','','Empresa','2004-05-05','soporte@andahuaylillas.sa.com');

-- ------------------------------------------------------------------
-- 10 registros en Cliente_usuario
-- ------------------------------------------------------------------
INSERT INTO Cliente_usuario (cliente_final_id) VALUES
  (1),(2),(3),(4),(5),(6),(7),(8),(9),(10);

-- ------------------------------------------------------------------
-- 5 registros en Cliente_empresa
-- ------------------------------------------------------------------
INSERT INTO Cliente_empresa (cliente_final_id, ruc, razon_social, direccion) VALUES
  (11,'20456789012','Inka Tours SAC','Av. El Sol 123, Cusco'),
  (12,'20567890123','Andes Travel SAC','Jr. Comercio 456, Puno'),
  (13,'20678901234','Sacred Valley SAC','Plaza Principal, Urubamba'),
  (14,'20789012345','Misti Expeditions SAC','Calle Misti 789, Arequipa'),
  (15,'20890123456','Andahuaylillas SA','Av. Religión 101, Andahuaylillas');

-- ------------------------------------------------------------------
-- 15 registros en Vagon (uno por tren)
-- ------------------------------------------------------------------
INSERT INTO Vagon (id_tren, numero, descripcion, precio, clase) VALUES
  (1,1,'Panorámico con ventanas amplias',120.00,'Turista'),
  (2,1,'Con servicio de bar',130.00,'Turista'),
  (3,1,'Asientos reclinables y wifi',200.00,'Primera'),
  (4,1,'Vistas 360º al valle',150.00,'Turista'),
  (5,1,'Butacas de cuero',250.00,'Primera'),
  (6,1,'Espacios amplios para maletas',140.00,'Turista'),
  (7,1,'Bar y snack incluido',160.00,'Turista'),
  (8,1,'Butacas cama',300.00,'Primera'),
  (9,1,'Asientos estándar',100.00,'Turista'),
  (10,1,'Panorámico superior',220.00,'Primera'),
  (11,1,'Espacio familiar',130.00,'Turista'),
  (12,1,'Vistas históricas',140.00,'Turista'),
  (13,1,'Con cáscara antirruido',145.00,'Turista'),
  (14,1,'Butacas premium',260.00,'Primera'),
  (15,1,'Vagón de lujo',320.00,'Primera');

-- ------------------------------------------------------------------
-- 15 registros en Estacion
-- ------------------------------------------------------------------
INSERT INTO Estacion (nombre, localidad, id_ruta) VALUES
  ('Ollantaytambo','Ollantaytambo',   1),
  ('Poroy',        'Poroy',          1),
  ('Puno Estación','Puno',           2),
  ('Uros','Uros',                    3),
  ('Chinchero','Chinchero',          5),
  ('Maras','Maras',                  6),
  ('Andahuaylillas','Andahuaylillas',15),
  ('Cusco','Cusco',                  4),
  ('Mollepata','Mollepata',          6),
  ('Juliaca','Juliaca',              9),
  ('Urubamba','Urubamba',            11),
  ('Sacred Valley','Urubamba',       12),
  ('Chinchero Alto','Chinchero',     13),
  ('Ollanta','Ollantaytambo',        14),
  ('Andahuaylillas Centro','Andahuaylillas',15);

-- ------------------------------------------------------------------
-- 15 registros en Reserva
-- ------------------------------------------------------------------
INSERT INTO Reserva (id_pago, id_ruta, id_tren, id_horario, estado, fecha) VALUES
  (1,  1,  1,  1, 'Activa',   '2025-06-01 08:20:00'),
  (2,  2,  2,  2, 'Activa',   '2025-06-01 12:35:00'),
  (3,  3,  3,  3, 'Cancelada','2025-06-02 09:50:00'),
  (4,  4,  4,  4, 'Activa',   '2025-06-02 17:25:00'),
  (5,  5,  5,  5, 'Activa',   '2025-06-03 10:05:00'),
  (6,  6,  6,  6, 'Pendiente','2025-06-04 11:15:00'),
  (7,  7,  7,  7, 'Activa',   '2025-06-05 14:55:00'),
  (8,  8,  8,  8, 'Activa',   '2025-06-06 07:35:00'),
  (9,  9,  9,  9, 'Cancelada','2025-06-06 16:45:00'),
  (10, 10, 10, 10,'Activa',   '2025-06-07 09:05:00'),
  (11, 11, 11, 11,'Activa',   '2025-06-08 13:30:00'),
  (12, 12, 12, 12,'Pendiente','2025-06-09 15:57:00'),
  (13, 13, 13, 13,'Activa',   '2025-06-10 08:10:00'),
  (14, 14, 14, 14,'Activa',   '2025-06-11 14:35:00'),
  (15, 15, 15, 15,'Activa',   '2025-06-12 10:50:00');

-- ------------------------------------------------------------------
-- 15 registros en Viaje
-- ------------------------------------------------------------------
INSERT INTO Viaje (reserva_id, tren_id, ruta_id, horario_id) VALUES
  (1,  1,  1,  1),
  (2,  2,  2,  2),
  (3,  3,  3,  3),
  (4,  4,  4,  4),
  (5,  5,  5,  5),
  (6,  6,  6,  6),
  (7,  7,  7,  7),
  (8,  8,  8,  8),
  (9,  9,  9,  9),
  (10, 10, 10, 10),
  (11, 11, 11, 11),
  (12, 12, 12, 12),
  (13, 13, 13, 13),
  (14, 14, 14, 14),
  (15, 15, 15, 15);
