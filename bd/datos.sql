USE PeruRail;

-- 1) Poblar pago
INSERT INTO pago (cant_reserva, metodo, fecha) VALUES
  (1, 'Tarjeta', '2025-06-01 10:15:00'),
  (2, 'Efectivo', '2025-06-02 14:30:00'),
  (1, 'Transferencia', '2025-06-03 09:00:00');

-- 2) Poblar horario
INSERT INTO horario (Fech_Salida, Hr_salida, Hr_llegada, Duracion, Estado) VALUES
  ('2025-07-01','2025-07-01 08:00:00','2025-07-01 12:00:00',240,'Confirmado'),
  ('2025-07-01','2025-07-01 15:00:00','2025-07-01 19:30:00',270,'Pendiente'),
  ('2025-07-02','2025-07-02 06:30:00','2025-07-02 11:00:00',270,'Confirmado');

-- 3) Poblar tren
INSERT INTO tren (Clase, numero, nombre) VALUES
  ('Expreso', 1, 'Andes Explorer'),
  ('Regional', 2, 'Costa del Sol'),
  ('Turístico', 3, 'Valle Encantado');

-- 4) Poblar ruta
INSERT INTO ruta (Origen, Destino) VALUES
  ('Lima', 'Cusco'),
  ('Cusco', 'Puno'),
  ('Arequipa', 'Lima');

-- 5) Poblar trabajador + subtipos
INSERT INTO trabajador (nombre, apellido, correo, documento) VALUES
  ('Juan', 'Pérez', 'juan.perez@perurail.com', 'DNI12345678'),
  ('María', 'García', 'maria.garcia@perurail.com', 'DNI87654321'),
  ('Luis', 'Rodríguez', 'luis.rodriguez@perurail.com', 'DNI11223344');

-- chofers (toman primer y segundo trabajador)
INSERT INTO chofer (trabajador_id) VALUES
  (1),
  (2);

-- asesores de venta (toma tercer trabajador)
INSERT INTO asesor_de_venta (trabajador_id) VALUES
  (3);

-- 6) Poblar cliente_final + subtipos
INSERT INTO cliente_final (nacionalidad, documento, nombre, apellido, num_telf, genero, fech_nac, correo) VALUES
  ('Peruana','DNI55555555','Ana','Lopez','987654321','F','1990-05-10','ana.lopez@example.com'),
  ('Argentina','PAS123456','Carlos','Rossi','998877665','M','1985-11-20','carlos.rossi@example.com'),
  ('Chile','DNI44444444','Beatriz','Martinez','977665544','F','1992-03-15','beatriz.m@example.com');

-- cliente_empresa (el primero es empresa)
INSERT INTO cliente_empresa (cliente_final_id, ruc, razon_social, direccion) VALUES
  (1, '20512345678', 'Andes Travels SAC', 'Av. Lima 123'),
  (2, '20687654321', 'Rossi Tours SRL', 'Jr. Cuzco 456');

-- cliente_usuario (el tercero es usuario particular)
INSERT INTO cliente_usuario (cliente_final_id) VALUES
  (3);

-- 7) Poblar estación
INSERT INTO estacion (nombre, Localidad, ID_Ruta) VALUES
  ('Est-Lima','Lima',1),
  ('Est-Cusco','Cusco',1),
  ('Est-Puno','Puno',2),
  ('Est-Arequipa','Arequipa',3);

-- 8) Poblar vagon
INSERT INTO Vagon (ID_Tren, Numero, Descripcion, precio, clase) VALUES
  (1, 1, 'Vagón primera clase con asientos reclinables', 120.50, 'Primera'),
  (1, 2, 'Vagón estándar con ventanas panorámicas', 80.00, 'Estándar'),
  (2, 1, 'Vagón panorámico con guía turístico', 150.00, 'Turístico');

-- 9) Poblar reserva
INSERT INTO reserva (id_pago, id_ruta, id_tren, id_horario, estado, fecha) VALUES
  (1, 1, 1, 1, 'Confirmada', '2025-07-01 07:00:00'),
  (2, 2, 2, 3, 'Pendiente',   '2025-07-02 05:30:00'),
  (3, 3, 3, 2, 'Confirmada', '2025-07-01 14:00:00');

-- 10) Poblar viaje
INSERT INTO viaje (reserva_id, tren_id, ruta_id, horario_id) VALUES
  (1, 1, 1, 1),
  (2, 2, 2, 3),
  (3, 3, 3, 2);
