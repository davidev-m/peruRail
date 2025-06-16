USE perurail;

-- ====================================================
-- 1) RUTA: solo los valores que tú proporcionaste (14 en total)
-- ====================================================
INSERT INTO Ruta (origen, destino, dias_disponibles) VALUES
  ('ciudad de cusco','Machu Picchu',    'Todos los dias'),
  ('ciudad de cusco','Puno',            'Jueves'),
  ('ciudad de cusco','Arequipa',       'Jueves'),
  ('Machu Picchu','ciudad de cusco',    'Todos los dias'),
  ('Machu Picchu','Ollantaytambo',      'Todos los dias'),
  ('Machu Picchu','Hidroelectrica',     'Todos los dias'),
  ('Machu Picchu','Urubamba',           'Todos los dias'),
  ('Urubamba','Machu Picchu',           'Todos los dias'),
  ('Ollantaytambo','Machu Picchu',      'Todos los dias'),
  ('Hidroelectrica','Machu Picchu',     'Todos los dias'),
  ('Puno','ciudad de cusco',            'Viernes'),
  ('Puno','Arequipa',                   'Viernes'),
  ('Arequipa','ciudad de cusco',        'Domingo'),
  ('Arequipa','Puno',                   'Domingo');

-- ====================================================
-- 2) CLIENTE_FINAL (15 registros)
-- ====================================================
INSERT INTO Cliente_final (nacionalidad, documento, nombre, apellido, genero, fech_nac) VALUES
  ('Peruana','DNI10000001','Ana','Gonzalez','F','1980-01-15'),
  ('Argentina','DNI10000002','Luis','Fernandez','M','1975-03-22'),
  ('Chile','DNI10000003','María','Rodriguez','F','1990-07-05'),
  ('Peruana','DNI10000004','Carlos','Lopez','M','1982-12-11'),
  ('Boliviana','DNI10000005','Sofia','Martinez','F','1995-09-30'),
  ('Colombiana','DNI10000006','Juan','Perez','M','1988-06-17'),
  ('Ecuatoriana','DNI10000007','Valentina','Diaz','F','1979-02-28'),
  ('Peruana','DNI10000008','Miguel','Alvarez','M','1985-05-09'),
  ('Venezolana','DNI10000009','Laura','Jimenez','F','1992-11-23'),
  ('Uruguaya','DNI10000010','Diego','Torres','M','1978-08-14'),
  ('Paraguaya','DNI10000011','Julia','Vasquez','F','1983-04-02'),
  ('Peruana','DNI10000012','Raul','Ramos','M','1987-10-29'),
  ('Boliviana','DNI10000013','Carla','Sanchez','F','1991-01-07'),
  ('Ecuatoriana','DNI10000014','Pedro','Castro','M','1976-07-21'),
  ('Colombiana','DNI10000015','Elena','Morales','F','1984-03-18');

-- ====================================================
-- 3) CLIENTE_EMPRESA (tomando los primeros 5 clientes como empresas)
-- ====================================================
INSERT INTO Cliente_empresa (id_cliente_final, ruc, razon_social, direccion) VALUES
  (1,'20500000001','Andes Travels SAC','Av. Lima 123'),
  (2,'20500000002','Cusco Expeditions SAC','Jr. Cuzco 45'),
  (3,'20500000003','Misti Tours SAC','Av. Arequipa 678'),
  (4,'20500000004','Puno Travel SAC','Jr. Juliaca 12'),
  (5,'20500000005','Urubamba Guides SAC','Av. Urubamba 90');

-- ====================================================
-- 4) CLIENTE_USUARIO (los otros 10 clientes como usuarios)
-- ====================================================
INSERT INTO Cliente_usuario (id_cliente_final) VALUES
  (6),(7),(8),(9),(10),(11),(12),(13),(14),(15);

-- ====================================================
-- 5) CLIENTE_USUARIO_ADULTO (todos los usuarios naturales)
-- ====================================================
INSERT INTO Cliente_usuario_adulto (id_cliente_final, email, numero) VALUES
  (6,'juan.perez@example.com','987100001'),
  (7,'valentina.diaz@example.com','987100002'),
  (8,'miguel.alvarez@example.com','987100003'),
  (9,'laura.jimenez@example.com','987100004'),
  (10,'diego.torres@example.com','987100005'),
  (11,'julia.vasquez@example.com','987100006'),
  (12,'raul.ramos@example.com','987100007'),
  (13,'carla.sanchez@example.com','987100008'),
  (14,'pedro.castro@example.com','987100009'),
  (15,'elena.morales@example.com','987100010');

-- ====================================================
-- 6) CLIENTE_USUARIO_NINO (ninguno o algunos, por ejemplo 3)
-- ====================================================
INSERT INTO Cliente_usuario_nino (id_cliente_final) VALUES
  (6),(7),(8);

-- ====================================================
-- 7) TRABAJADOR (15 registros)
-- ====================================================
INSERT INTO Trabajador (nombre, apellido, correo, documento, numero) VALUES
  ('Jose','Martinez','jose.martinez@perurail.com','DNI20000001','999000001'),
  ('Maria','Torres','maria.torres@perurail.com','DNI20000002','999000002'),
  ('Luis','Ramirez','luis.ramirez@perurail.com','DNI20000003','999000003'),
  ('Ana','Flores','ana.flores@perurail.com','DNI20000004','999000004'),
  ('Carlos','Rojas','carlos.rojas@perurail.com','DNI20000005','999000005'),
  ('Sofia','Vega','sofia.vega@perurail.com','DNI20000006','999000006'),
  ('Rafael','Cruz','rafael.cruz@perurail.com','DNI20000007','999000007'),
  ('Paula','Nunez','paula.nunez@perurail.com','DNI20000008','999000008'),
  ('Diego','Silva','diego.silva@perurail.com','DNI20000009','999000009'),
  ('Laura','Ortiz','laura.ortiz@perurail.com','DNI20000010','999000010'),
  ('Marco','Paredes','marco.paredes@perurail.com','DNI20000011','999000011'),
  ('Elena','Mendoza','elena.mendoza@perurail.com','DNI20000012','999000012'),
  ('Victor','Cespedes','victor.cespedes@perurail.com','DNI20000013','999000013'),
  ('Natalia','Reyes','natalia.reyes@perurail.com','DNI20000014','999000014'),
  ('Jorge','Leon','jorge.leon@perurail.com','DNI20000015','999000015');

-- ====================================================
-- 8) CHOFER (tomamos los primeros 5 trabajadores)
-- ====================================================
INSERT INTO Chofer (id_trabajador) VALUES
  (1),(2),(3),(4),(5);

-- ====================================================
-- 9) ASESOR_DE_VENTA (trabajadores restantes)
-- ====================================================
INSERT INTO Asesor_de_venta (id_trabajador) VALUES
  (6),(7),(8),(9),(10),(11),(12),(13),(14),(15);

-- ====================================================
-- 10) TREN (15 registros, asignados a choferes)
-- ====================================================
INSERT INTO Tren (id_trabajador, clase, numero, nombre) VALUES
  (1,'Expreso',1,'Andes Explorer'),
  (2,'Regional',2,'Costa del Sol'),
  (3,'Turistico',3,'Valle Encantado'),
  (4,'Expreso',4,'Ruta del Inca'),
  (5,'Regional',5,'Sierra Andina'),
  (1,'Turistico',6,'Tren del Lago'),
  (2,'Expreso',7,'Camino Real'),
  (3,'Regional',8,'Cordillera Blanca'),
  (4,'Turistico',9,'Selva Andina'),
  (5,'Expreso',10,'Puno Express'),
  (1,'Regional',11,'Yucay Express'),
  (2,'Turistico',12,'Andahuaylillas'),
  (3,'Expreso',13,'Checacupe'),
  (4,'Regional',14,'Ollantaytambo'),
  (5,'Turistico',15,'Hidroelectrica');

-- ====================================================
-- 11) PAGO (15 registros)
-- ====================================================
INSERT INTO Pago (cant_reserva, metodo, fecha) VALUES
  (1,'Tarjeta','2025-06-01 08:00:00'),
  (2,'Efectivo','2025-06-01 09:30:00'),
  (3,'Tarjeta','2025-06-02 10:15:00'),
  (1,'Transferencia','2025-06-02 11:45:00'),
  (2,'Efectivo','2025-06-03 07:20:00'),
  (1,'Tarjeta','2025-06-03 08:50:00'),
  (3,'Efectivo','2025-06-04 10:00:00'),
  (2,'Transferencia','2025-06-04 11:30:00'),
  (1,'Tarjeta','2025-06-05 09:00:00'),
  (2,'Efectivo','2025-06-05 10:30:00'),
  (3,'Tarjeta','2025-06-06 08:45:00'),
  (1,'Transferencia','2025-06-06 09:15:00'),
  (2,'Efectivo','2025-06-07 07:30:00'),
  (1,'Tarjeta','2025-06-07 08:15:00'),
  (2,'Transferencia','2025-06-08 09:45:00');

-- ====================================================
-- 12) HORARIO (15 registros)
-- ====================================================
INSERT INTO Horario (fech_salida, hr_salida, hr_llegada, duracion, estado) VALUES
  ('2025-07-01','2025-07-01 06:00:00','2025-07-01 10:00:00',240,'Confirmado'),
  ('2025-07-01','2025-07-01 08:00:00','2025-07-01 12:30:00',270,'Pendiente'),
  ('2025-07-01','2025-07-01 14:00:00','2025-07-01 18:30:00',270,'Confirmado'),
  ('2025-07-02','2025-07-02 06:30:00','2025-07-02 11:00:00',270,'Confirmado'),
  ('2025-07-02','2025-07-02 09:00:00','2025-07-02 13:00:00',240,'Pendiente'),
  ('2025-07-02','2025-07-02 15:00:00','2025-07-02 19:00:00',240,'Confirmado'),
  ('2025-07-03','2025-07-03 07:00:00','2025-07-03 11:30:00',270,'Pendiente'),
  ('2025-07-03','2025-07-03 12:00:00','2025-07-03 16:00:00',240,'Confirmado'),
  ('2025-07-03','2025-07-03 18:00:00','2025-07-03 22:30:00',270,'Pendiente'),
  ('2025-07-04','2025-07-04 06:00:00','2025-07-04 10:00:00',240,'Confirmado'),
  ('2025-07-04','2025-07-04 09:30:00','2025-07-04 14:00:00',270,'Pendiente'),
  ('2025-07-04','2025-07-04 15:00:00','2025-07-04 19:30:00',270,'Confirmado'),
  ('2025-07-05','2025-07-05 08:00:00','2025-07-05 12:00:00',240,'Confirmado'),
  ('2025-07-05','2025-07-05 13:00:00','2025-07-05 17:30:00',270,'Pendiente'),
  ('2025-07-05','2025-07-05 18:00:00','2025-07-05 22:00:00',240,'Confirmado');

-- ====================================================
-- 13) RESERVA (15 registros)
-- ====================================================
INSERT INTO Reserva (id_pago, id_cliente_final, id_trabajador, estado, fecha) VALUES
  (1,6,6,'Confirmada','2025-07-01 05:30:00'),
  (2,7,7,'Pendiente','2025-07-01 07:00:00'),
  (3,8,8,'Cancelada','2025-07-02 06:00:00'),
  (4,9,9,'Confirmada','2025-07-02 08:15:00'),
  (5,10,10,'Pendiente','2025-07-03 09:45:00'),
  (6,11,11,'Confirmada','2025-07-03 11:00:00'),
  (7,12,12,'Pendiente','2025-07-04 07:30:00'),
  (8,13,13,'Confirmada','2025-07-04 10:00:00'),
  (9,14,14,'Cancelada','2025-07-05 06:45:00'),
  (10,15,15,'Confirmada','2025-07-05 08:30:00'),
  (11,6,6,'Pendiente','2025-07-06 09:15:00'),
  (12,7,7,'Confirmada','2025-07-06 11:00:00'),
  (13,8,8,'Pendiente','2025-07-07 07:00:00'),
  (14,9,9,'Confirmada','2025-07-07 09:30:00'),
  (15,10,10,'Cancelada','2025-07-08 06:00:00');

-- ====================================================
-- 14) VIAJE (15 registros)
-- ====================================================
INSERT INTO Viaje (id_reserva, id_tren, id_ruta, id_horario) VALUES
  (1,1,1,1),
  (2,2,2,2),
  (3,3,3,3),
  (4,4,4,4),
  (5,5,5,5),
  (6,6,1,6),
  (7,7,2,7),
  (8,8,3,8),
  (9,9,1,9),
  (10,10,2,10),
  (11,11,3,11),
  (12,12,1,12),
  (13,13,2,13),
  (14,14,3,14),
  (15,15,1,15);

-- ====================================================
-- 15) VAGON (15 registros)
-- ====================================================
INSERT INTO Vagon (id_tren, numero, descripcion, precio, clase) VALUES
  (1,1,'Vagon primera clase','120.00','primera'),
  (1,2,'Vagon estandar','80.00','estandar'),
  (2,1,'Vagon panoramico','150.00','turistico'),
  (2,2,'Vagon economico','60.00','economico'),
  (3,1,'Vagon cama','200.00','cama'),
  (3,2,'Vagon asiento','90.00','asiento'),
  (4,1,'Vagon familiar','110.00','familiar'),
  (4,2,'Vagon VIP','180.00','vip'),
  (5,1,'Vagon estancia','70.00','estancia'),
  (5,2,'Vagon lujo','220.00','lujo'),
  (6,1,'Vagon panoramico plus','160.00','turistico'),
  (6,2,'Vagon estandar plus','85.00','estandar'),
  (7,1,'Vagon cama plus','210.00','cama'),
  (7,2,'Vagon asiento plus','95.00','asiento'),
  (8,1,'Vagon familiar plus','115.00','familiar');

-- ====================================================
-- 16) ESTACION (15 registros)
-- ====================================================
INSERT INTO Estacion (nombre, localidad, id_ruta) VALUES
  ('Est-Cusco','Cusco',1),
  ('Est-Urubamba','Urubamba',1),
  ('Est-Machu','Machu Picchu',1),
  ('Est-Ollanta','Ollantaytambo',5),
  ('Est-Hidro','Hidroelectrica',6),
  ('Est-Puno','Puno',2),
  ('Est-Arequipa','Arequipa',3),
  ('Est-Cusco2','Cusco',11),
  ('Est-Puno2','Puno',12),
  ('Est-Arequipa2','Arequipa',13),
  ('Est-Urubamba2','Urubamba',14),
  ('Est-Machu2','Machu Picchu',4),
  ('Est-Ollanta2','Ollantaytambo',8),
  ('Est-Hidro2','Hidroelectrica',9),
  ('Est-Puno3','Puno',10);
