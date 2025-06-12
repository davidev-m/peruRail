-- Crear la base de datos si no existe
CREATE DATABASE IF NOT EXISTS PeruRail;

-- Usar la base de datos PeruRail para las siguientes operaciones
USE PeruRail;

-- Tabla Cliente
CREATE TABLE Cliente (
    id_cliente INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    documento VARCHAR(20) UNIQUE NOT NULL,
    nacionalidad VARCHAR(50),
    genero VARCHAR(20),
    fech_nac DATE,
    correo VARCHAR(100) UNIQUE NOT NULL,
    edad INT
);

-- Tabla ClienteEmpresa
CREATE TABLE ClienteEmpresa (
    id_cliente_empresa INT PRIMARY KEY AUTO_INCREMENT,
    ruc VARCHAR(11) UNIQUE NOT NULL,
    razon_social VARCHAR(255) NOT NULL,
    direccion VARCHAR(255)
);

-- Tabla UsuarioFinal
CREATE TABLE UsuarioFinal (
    id_usuario INT PRIMARY KEY AUTO_INCREMENT,
    tipo_usuario VARCHAR(20) NOT NULL,
    id_cliente INT,
    id_cliente_empresa INT,
    FOREIGN KEY (id_cliente) REFERENCES Cliente(id_cliente),
    FOREIGN KEY (id_cliente_empresa) REFERENCES ClienteEmpresa(id_cliente_empresa)
);

-- Tabla Empleado
CREATE TABLE Empleado (
    id_empleado INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    documento VARCHAR(20) UNIQUE NOT NULL,
    correo VARCHAR(100) UNIQUE NOT NULL,
    tipo VARCHAR(50)
);

-- Tabla Reserva
CREATE TABLE Reserva (
    id_reserva INT PRIMARY KEY AUTO_INCREMENT,
    fecha DATE NOT NULL,
    estado VARCHAR(50) DEFAULT 'Pendiente',
    id_usuario INT,
    id_empleado INT,
    FOREIGN KEY (id_usuario) REFERENCES UsuarioFinal(id_usuario),
    FOREIGN KEY (id_empleado) REFERENCES Empleado(id_empleado)
);

-- Tabla Pago
CREATE TABLE Pago (
    id_pago INT PRIMARY KEY AUTO_INCREMENT,
    fecha DATETIME NOT NULL,
    metodo VARCHAR(50) NOT NULL,
    cant_reservas INT,
    id_reserva INT,
    FOREIGN KEY (id_reserva) REFERENCES Reserva(id_reserva)
);

-- Tabla Estacion
CREATE TABLE Estacion (
    id_estacion INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    localidad VARCHAR(100)
);

-- Tabla Ruta
CREATE TABLE Ruta (
    id_ruta INT PRIMARY KEY AUTO_INCREMENT,
    id_origen INT,
    id_destino INT,
    FOREIGN KEY (id_origen) REFERENCES Estacion(id_estacion),
    FOREIGN KEY (id_destino) REFERENCES Estacion(id_estacion)
);

-- Tabla Clase
CREATE TABLE Clase (
    id_clase INT PRIMARY KEY AUTO_INCREMENT,
    nombre_clase VARCHAR(50) NOT NULL,
    precio DECIMAL(10, 2) NOT NULL,
    descripcion TEXT
);

-- Tabla Tren
CREATE TABLE Tren (
    id_tren INT PRIMARY KEY AUTO_INCREMENT,
    numero VARCHAR(50) NOT NULL,
    cap_total INT
);

-- Tabla Vagon
CREATE TABLE Vagon (
    id_vagon INT PRIMARY KEY AUTO_INCREMENT,
    id_tren INT,
    id_clase INT,
    capacidad INT,
    FOREIGN KEY (id_tren) REFERENCES Tren(id_tren),
    FOREIGN KEY (id_clase) REFERENCES Clase(id_clase)
);

-- Tabla Viaje
CREATE TABLE Viaje (
    id_viaje INT PRIMARY KEY AUTO_INCREMENT,
    id_tren INT,
    id_ruta INT,
    id_reserva INT,
    FOREIGN KEY (id_tren) REFERENCES Tren(id_tren),
    FOREIGN KEY (id_ruta) REFERENCES Ruta(id_ruta),
    FOREIGN KEY (id_reserva) REFERENCES Reserva(id_reserva)
);

-- Tabla Horario
CREATE TABLE Horario (
    id_horario INT PRIMARY KEY AUTO_INCREMENT,
    id_viaje INT,
    fech_salida DATETIME,
    hr_llegada DATETIME,
    duracion TIME,
    estado VARCHAR(50),
    FOREIGN KEY (id_viaje) REFERENCES Viaje(id_viaje)
);