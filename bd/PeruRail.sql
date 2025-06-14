-- 1) Eliminar la base de datos si ya existe
DROP DATABASE IF EXISTS perurail;

-- 2) Crear la base de datos y usarla
CREATE DATABASE perurail
  DEFAULT CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;
USE perurail;


-- ==============================================
-- Tabla de clientes finales (superclase)
-- ==============================================
CREATE TABLE Cliente_final (
    id_cliente_final    INT(11)     NOT NULL AUTO_INCREMENT,
    nacionalidad        VARCHAR(20) NOT NULL,
    documento           VARCHAR(15) NOT NULL,
    nombre              VARCHAR(30) NOT NULL,
    apellido            VARCHAR(30) NOT NULL,
    genero              VARCHAR(10) NOT NULL,
    fech_nac            DATE        NOT NULL,
    PRIMARY KEY (id_cliente_final)
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci;


-- ==============================================
-- Subtipo: empresa (hereda de Cliente_final)
-- ==============================================
CREATE TABLE Cliente_empresa (
    id_cliente_final    INT(11)     NOT NULL,
    ruc                 VARCHAR(11) NOT NULL,
    razon_social        VARCHAR(30) NOT NULL,
    direccion           VARCHAR(30) NULL,
    PRIMARY KEY (id_cliente_final),
    FOREIGN KEY (id_cliente_final)
        REFERENCES Cliente_final(id_cliente_final)
        ON DELETE CASCADE
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci;


-- ==============================================
-- Subtipo: usuario natural (hereda de Cliente_final)
-- ==============================================
CREATE TABLE Cliente_usuario (
    id_cliente_final    INT(11)     NOT NULL,
    PRIMARY KEY (id_cliente_final),
    FOREIGN KEY (id_cliente_final)
        REFERENCES Cliente_final(id_cliente_final)
        ON DELETE CASCADE
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci;


-- ==============================================
-- Subtipo: usuario adulto (hereda de Cliente_usuario)
-- ==============================================
CREATE TABLE Cliente_usuario_adulto (
    id_cliente_final    INT(11)     NOT NULL,
    email               VARCHAR(30) NULL,
    numero              VARCHAR(15) NULL,
    PRIMARY KEY (id_cliente_final),
    FOREIGN KEY (id_cliente_final)
        REFERENCES Cliente_usuario(id_cliente_final)
        ON DELETE RESTRICT
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci;


-- ==============================================
-- Subtipo: usuario niño (hereda de Cliente_usuario)
-- ==============================================
CREATE TABLE Cliente_usuario_nino (
    id_cliente_final    INT(11)     NOT NULL,
    PRIMARY KEY (id_cliente_final),
    FOREIGN KEY (id_cliente_final)
        REFERENCES Cliente_usuario(id_cliente_final)
        ON DELETE RESTRICT
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci;


-- ==============================================
-- Tabla de trabajadores (superclase)
-- ==============================================
CREATE TABLE Trabajador (
    id_trabajador       INT(11)     NOT NULL AUTO_INCREMENT,
    nombre              VARCHAR(20) NULL,
    apellido            VARCHAR(20) NULL,
    correo              VARCHAR(50) NULL,
    documento           VARCHAR(15) NULL,
    numero				VARCHAR(15) NULL,
    PRIMARY KEY (id_trabajador)
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci;


-- ==============================================
-- Subclase: chofer (hereda de Trabajador)
-- ==============================================
CREATE TABLE Chofer (
    id_trabajador       INT(11)     NOT NULL,
    PRIMARY KEY (id_trabajador),
    FOREIGN KEY (id_trabajador)
        REFERENCES Trabajador(id_trabajador)
        ON DELETE CASCADE
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci;


-- ==============================================
-- Subclase: asesor de venta (hereda de Trabajador)
-- ==============================================
CREATE TABLE Asesor_de_venta (
    id_trabajador       INT(11)     NOT NULL,
    PRIMARY KEY (id_trabajador),
    FOREIGN KEY (id_trabajador)
        REFERENCES Trabajador(id_trabajador)
        ON DELETE CASCADE
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci;


-- ==============================================
-- Tabla de trenes (cada tren asignado a un chofer)
-- ==============================================
CREATE TABLE Tren (
    id_tren             INT(11)     NOT NULL AUTO_INCREMENT,
    id_trabajador       INT(11)     NOT NULL,
    clase               VARCHAR(10) NOT NULL,
    numero              INT(11)     NOT NULL,
    nombre              VARCHAR(20) NOT NULL,
    PRIMARY KEY (id_tren),
    FOREIGN KEY (id_trabajador)
        REFERENCES Chofer(id_trabajador)
        ON DELETE CASCADE
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci;


-- ==============================================
-- Tabla de pagos (registro de métodos de pago)
-- ==============================================
CREATE TABLE Pago (
    id_pago             INT(11)     NOT NULL AUTO_INCREMENT,
    cant_reserva        INT(11)     NOT NULL,
    metodo              VARCHAR(20) NULL,
    fecha               DATETIME    NOT NULL,
    PRIMARY KEY (id_pago)
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci;


-- ==============================================
-- Tabla de horarios (salidas, llegadas, duración)
-- ==============================================
CREATE TABLE Horario (
    id_horario          INT(11)     NOT NULL AUTO_INCREMENT,
    fech_salida         DATE        NOT NULL,
    hr_salida           DATETIME    NOT NULL,
    hr_llegada          DATETIME    NOT NULL,
    duracion            INT(11)     NOT NULL,
    estado              VARCHAR(30) NOT NULL,
    PRIMARY KEY (id_horario)
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci;


-- ==============================================
-- Tabla de rutas (origen, destino y días disponibles)
-- ==============================================
CREATE TABLE Ruta (
    id_ruta             INT(11)     NOT NULL AUTO_INCREMENT,
    origen              VARCHAR(30) NOT NULL,
    destino             VARCHAR(30) NOT NULL,
    dias_disponibles    VARCHAR(30) NOT NULL,
    PRIMARY KEY (id_ruta)
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci;


-- ==============================================
-- Tabla de reservas (vincula pago, cliente, trabajador)
-- ==============================================
CREATE TABLE Reserva (
    id_reserva          INT(11)     NOT NULL AUTO_INCREMENT,
    id_pago             INT(11)     NOT NULL,
    id_cliente_final    INT(11)     NOT NULL,
    id_trabajador       INT(11)     NOT NULL,
    estado              VARCHAR(20) NOT NULL,
    fecha               DATETIME    NOT NULL,
    PRIMARY KEY (id_reserva),

    FOREIGN KEY (id_pago)
      REFERENCES Pago(id_pago)
      ON UPDATE CASCADE
      ON DELETE RESTRICT,

    FOREIGN KEY (id_cliente_final)
      REFERENCES Cliente_final(id_cliente_final)
      ON UPDATE CASCADE
      ON DELETE RESTRICT,

    FOREIGN KEY (id_trabajador)
      REFERENCES Asesor_de_venta(id_trabajador)
      ON UPDATE CASCADE
      ON DELETE RESTRICT
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci;


-- ==============================================
-- Tabla de viajes (intermedia N:N entre Reserva y Ruta/Tren/Horario)
-- ==============================================
CREATE TABLE Viaje (
    id_viaje            INT         NOT NULL AUTO_INCREMENT,
    id_reserva          INT(11)     NOT NULL,
    id_tren             INT(11)     NOT NULL,
    id_ruta             INT(11)     NOT NULL,
    id_horario          INT(11)     NOT NULL,
    PRIMARY KEY (id_viaje),

    FOREIGN KEY (id_reserva)
      REFERENCES Reserva(id_reserva)
      ON UPDATE CASCADE
      ON DELETE RESTRICT,

    FOREIGN KEY (id_tren)
      REFERENCES Tren(id_tren)
      ON UPDATE CASCADE
      ON DELETE RESTRICT,

    FOREIGN KEY (id_ruta)
      REFERENCES Ruta(id_ruta)
      ON UPDATE CASCADE
      ON DELETE RESTRICT,

    FOREIGN KEY (id_horario)
      REFERENCES Horario(id_horario)
      ON UPDATE CASCADE
      ON DELETE RESTRICT
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci;


-- ==============================================
-- Tabla de vagones (entidad débil de Tren)
-- ==============================================
CREATE TABLE Vagon (
    id_tren             INT(11)     NOT NULL,
    numero              INT(11)     NOT NULL,
    descripcion         TEXT        NOT NULL,
    precio              FLOAT       NOT NULL,
    clase               VARCHAR(20) NOT NULL,
    PRIMARY KEY (id_tren, numero),
    FOREIGN KEY (id_tren)
      REFERENCES Tren(id_tren)
      ON UPDATE CASCADE
      ON DELETE RESTRICT
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci;


-- ==============================================
-- Tabla de estaciones (pertenecen a una Ruta)
-- ==============================================
CREATE TABLE Estacion (
    id_estacion         INT(11)     NOT NULL AUTO_INCREMENT,
    nombre              VARCHAR(20) NOT NULL,
    localidad           VARCHAR(20) NOT NULL,
    id_ruta             INT(11)     NOT NULL,
    PRIMARY KEY (id_estacion),

    FOREIGN KEY (id_ruta)
      REFERENCES Ruta(id_ruta)
      ON UPDATE CASCADE
      ON DELETE RESTRICT
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci;
