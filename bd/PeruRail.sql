-- 1) Eliminar la base de datos si ya existe
DROP DATABASE IF EXISTS perurail;

-- 2) Crear la base de datos y usarla
CREATE DATABASE perurail;
USE perurail;

-- Tabla de pagos (registro de métodos de pago y cantidad de reservas pagadas)
CREATE TABLE Pago (
  id_pago        INT(11)     NOT NULL AUTO_INCREMENT,
  cant_reserva   INT(11)     NOT NULL,
  metodo         VARCHAR(20) NULL,
  fecha          DATETIME    NOT NULL,
  PRIMARY KEY (id_pago)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de horarios (salidas, llegadas y duración del viaje)
CREATE TABLE Horario (
  id_horario     INT(11)     NOT NULL AUTO_INCREMENT,
  fech_salida    DATE        NOT NULL,
  hr_salida      DATETIME    NOT NULL,
  hr_llegada     DATETIME    NOT NULL,
  duracion       INT(11)     NOT NULL,
  estado         VARCHAR(30) NOT NULL,
  PRIMARY KEY (id_horario)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de trenes
CREATE TABLE Tren (
  id_tren        INT         NOT NULL AUTO_INCREMENT,
  clase          VARCHAR(10) NOT NULL,
  numero         INT(11)     NOT NULL,
  nombre         VARCHAR(20) NOT NULL,
  PRIMARY KEY (id_tren)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de rutas (de qué ciudad a qué ciudad va el tren)
CREATE TABLE Ruta (
  id_ruta         INT         NOT NULL AUTO_INCREMENT,
  origen          VARCHAR(30) NOT NULL,
  destino         VARCHAR(30) NOT NULL,
  dias_disponibles  VARCHAR(30) NOT NULL,
  PRIMARY KEY (id_ruta)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de reservas (depende de pago, tren, ruta y horario)
CREATE TABLE Reserva (
  id_reserva   INT(11)      NOT NULL AUTO_INCREMENT,
  id_pago      INT(11)      NOT NULL,
  id_ruta      INT(11)      NOT NULL,
  id_tren      INT(11)      NOT NULL,
  id_horario   INT(11)      NOT NULL,
  estado       VARCHAR(20)  NOT NULL,
  fecha        DATETIME     NOT NULL,
  PRIMARY KEY (id_reserva),

  FOREIGN KEY (id_pago)
    REFERENCES Pago(id_pago)
    ON UPDATE CASCADE
    ON DELETE RESTRICT,

  FOREIGN KEY (id_ruta)
    REFERENCES Ruta(id_ruta)
    ON UPDATE CASCADE
    ON DELETE RESTRICT,

  FOREIGN KEY (id_tren)
    REFERENCES Tren(id_tren)
    ON UPDATE CASCADE
    ON DELETE RESTRICT,

  FOREIGN KEY (id_horario)
    REFERENCES Horario(id_horario)
    ON UPDATE CASCADE
    ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de viajes (puede almacenar más información sobre cada viaje)
CREATE TABLE Viaje (
  viaje_id     INT AUTO_INCREMENT PRIMARY KEY,
  reserva_id   INT NOT NULL,
  tren_id      INT NOT NULL,
  ruta_id      INT NOT NULL,
  horario_id   INT NOT NULL,
  -- atributos adicionales (ej: asiento, precio, etc.)

  FOREIGN KEY (reserva_id)
    REFERENCES Reserva(id_reserva)
    ON UPDATE CASCADE
    ON DELETE RESTRICT,

  FOREIGN KEY (tren_id)
    REFERENCES Tren(id_tren)
    ON UPDATE CASCADE
    ON DELETE RESTRICT,

  FOREIGN KEY (ruta_id)
    REFERENCES Ruta(id_ruta)
    ON UPDATE CASCADE
    ON DELETE RESTRICT,

  FOREIGN KEY (horario_id)
    REFERENCES Horario(id_horario)
    ON UPDATE CASCADE
    ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de trabajadores (empleados de la empresa)
CREATE TABLE Trabajador (
  trabajador_id  INT(11)     NOT NULL AUTO_INCREMENT,
  nombre         VARCHAR(20) NULL,
  apellido       VARCHAR(20) NULL,
  correo         VARCHAR(50) NULL,
  documento      VARCHAR(15) NULL,
  PRIMARY KEY (trabajador_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Subclase chofer (es un trabajador)
CREATE TABLE Chofer (
  trabajador_id INT(11) NOT NULL,
  PRIMARY KEY (trabajador_id),
  FOREIGN KEY (trabajador_id)
    REFERENCES Trabajador(trabajador_id)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Subclase asesor de venta (es un trabajador)
CREATE TABLE Asesor_de_venta (
  trabajador_id INT(11) NOT NULL,
  PRIMARY KEY (trabajador_id),
  FOREIGN KEY (trabajador_id)
    REFERENCES Trabajador(trabajador_id)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de clientes finales (usuarios y empresas)
CREATE TABLE Cliente_final (
  cliente_final_id INT(11)     NOT NULL AUTO_INCREMENT,
  nacionalidad     VARCHAR(20) NOT NULL,
  documento        VARCHAR(15) NOT NULL,
  nombre           VARCHAR(30) NOT NULL,
  apellido         VARCHAR(30) NOT NULL,
  num_telf         VARCHAR(15) NOT NULL,
  genero           VARCHAR(10) NOT NULL,
  fech_nac         DATE        NOT NULL,
  correo           VARCHAR(30) NOT NULL,
  PRIMARY KEY (cliente_final_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Subtipo cliente empresa
CREATE TABLE Cliente_empresa (
  cliente_final_id INT(11)     NOT NULL,
  ruc              VARCHAR(11) NOT NULL,
  razon_social     VARCHAR(30) NOT NULL,
  direccion        VARCHAR(30) NULL,
  PRIMARY KEY (cliente_final_id),
  FOREIGN KEY (cliente_final_id)
    REFERENCES Cliente_final(cliente_final_id)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Subtipo cliente usuario (persona natural)
CREATE TABLE Cliente_usuario (
  cliente_final_id INT(11) NOT NULL,
  PRIMARY KEY (cliente_final_id),
  FOREIGN KEY (cliente_final_id)
    REFERENCES Cliente_final(cliente_final_id)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de vagones (entidad débil dependiente de tren)
CREATE TABLE Vagon (
  id_tren     INT(11) NOT NULL,
  numero      INT(11) NOT NULL,
  descripcion TEXT    NOT NULL,
  precio      FLOAT   NOT NULL,
  clase       VARCHAR(20) NOT NULL,
  PRIMARY KEY (id_tren, numero),
  FOREIGN KEY (id_tren)
    REFERENCES Tren(id_tren)
    ON UPDATE CASCADE
    ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de estaciones (pertenecen a una ruta)
CREATE TABLE Estacion (
  id_estacion  INT         NOT NULL AUTO_INCREMENT,
  nombre       VARCHAR(20) NOT NULL,
  localidad    VARCHAR(20) NOT NULL,
  id_ruta      INT(11)     NOT NULL,
  PRIMARY KEY (id_estacion),
  FOREIGN KEY (id_ruta)
    REFERENCES Ruta(id_ruta)
    ON UPDATE CASCADE
    ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
