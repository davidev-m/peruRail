DROP DATABASE IF EXISTS perurail;
CREATE DATABASE perurail;
USE perurail;

CREATE TABLE Nacionalidad(
	id_nacionalidad	INT(11) NOT NULL AUTO_INCREMENT,
    nombre_nacionalidad 	VARCHAR(20) NOT NULL,
    PRIMARY KEY(id_nacionalidad)
);

CREATE TABLE Tipo_documento(
	id_documento	INT(11) NOT NULL AUTO_INCREMENT,
    id_nacionalidad INT(11) NOT NULL,
    nombre_documento	VARCHAR(20) NOT NULL,
    PRIMARY KEY(id_documento),
    FOREIGN KEY(id_nacionalidad)
		REFERENCES Nacionalidad(id_nacionalidad)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
);

CREATE TABLE Cliente(
	id_cliente	INT(11) NOT NULL AUTO_INCREMENT,
    id_documento	INT(11) NOT NULL,
    nombre		VARCHAR(30) NOT NULL,
    apellido	VARCHAR(30) NOT NULL,
    genero		CHAR(1) NOT NULL,
    documento	VARCHAR(15) UNIQUE NOT NULL,
    fecha_nacimiento	DATE NOT NULL,
    PRIMARY KEY(id_cliente),
    FOREIGN KEY(id_documento)
		REFERENCES Tipo_documento(id_documento)
        ON DELETE RESTRICT
        ON UPDATE CASCADE
);

CREATE TABLE Cliente_empresa(
	id_cliente_e	INT(11) NOT NULL AUTO_INCREMENT,
    ruc				VARCHAR(11) NOT NULL, -- ACA
    razon_social	VARCHAR(30) NOT NULL,
    direccion		VARCHAR(30) NOT NULL,
    PRIMARY KEY(id_cliente_e)
);

CREATE TABLE Cliente_comprador(
	id_cliente	INT(11) NOT NULL,
    id_cliente_e	INT(11),
    correo 		VARCHAR(30) NOT NULL,
    num_telf	VARCHAR(10) NOT NULL,
    PRIMARY KEY(id_cliente),
    FOREIGN KEY(id_cliente)
		REFERENCES Cliente(id_cliente)
		ON DELETE CASCADE
        ON UPDATE RESTRICT,
	FOREIGN KEY(id_cliente_e)
		REFERENCES Cliente_empresa(id_cliente_e)
        ON DELETE RESTRICT
        ON UPDATE RESTRICT
);


CREATE TABLE Trabajador(
	id_trabajador	INT(11) NOT NULL AUTO_INCREMENT,
    nombre	VARCHAR(30) NOT NULL,
    apellido	VARCHAR(30) NOT NULL,
    correo 		VARCHAR(30) NOT NULL,
    documento	VARCHAR(15) NOT NULL,
    celular 	VARCHAR(10) NOT NULL,
    PRIMARY KEY (id_trabajador)
);

CREATE TABLE Chofer(
	id_trabajador INT(11) NOT NULL,
    PRIMARY KEY(id_trabajador),
    FOREIGN KEY(id_trabajador)
		REFERENCES Trabajador(id_trabajador)
        ON UPDATE RESTRICT
        ON DELETE CASCADE
);

CREATE TABLE Asesor_venta(
	id_trabajador 	INT(11) NOT NULL,
    PRIMARY KEY(id_trabajador),
    FOREIGN KEY(id_trabajador)
		REFERENCES Trabajador(id_trabajador)
        ON UPDATE RESTRICT
        ON DELETE CASCADE
);

CREATE TABLE Ruta(
	id_ruta INT(11) NOT NULL AUTO_INCREMENT,
    destino	VARCHAR(30) NOT NULL,
    origen 	VARCHAR(30) NOT NULL,
    dias_disponibles VARCHAR(30) NOT NULL,
    PRIMARY KEY(id_ruta)
);

CREATE TABLE Estacion(
	id_estacion 	INT(11) NOT NULL AUTO_INCREMENT,
    id_ruta			INT(11),
    est_origen		VARCHAR(50) NOT NULL,
    est_destino		VARCHAR(50) NOT NULL,
    PRIMARY KEY(id_estacion),
    FOREIGN KEY(id_ruta)
		REFERENCES Ruta(id_ruta)
        ON UPDATE RESTRICT
        ON DELETE RESTRICT
);

CREATE TABLE Clase(
	id_clase INT(11) NOT NULL AUTO_INCREMENT,
    nombre_clase	VARCHAR(30) NOT NULL,
    PRIMARY KEY(id_clase)
);

CREATE TABLE Tren(
	id_tren	INT(11) NOT NULL AUTO_INCREMENT,
    id_clase INT(11) NOT NULL,
    id_trabajador INT(11) NOT NULL,
    cap_total	INT(11) NOT NULL,
    codigo		VARCHAR(10) NULL,
    PRIMARY KEY(id_tren),
    FOREIGN KEY(id_clase)
		REFERENCES Clase(id_clase)
        ON UPDATE RESTRICT
        ON DELETE RESTRICT,
	FOREIGN KEY(id_trabajador)
		REFERENCES Chofer(id_trabajador)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
);

CREATE TABLE Bus(
	id_bus INT(11) NOT NULL AUTO_INCREMENT,
    placa VARCHAR(10) NOT NULL,
    PRIMARY KEY(id_bus)
);

CREATE TABLE Viaje(
	id_viaje	INT(11) NOT NULL AUTO_INCREMENT,
    id_estacion		INT(11) NOT NULL,
    id_tren		INT(11) NOT NULL,
    id_bus		INT(11),
    fecha_salida	DATE NOT NULL,
    hora_salida		DATETIME NOT NULL,
    hora_llegada	DATETIME NOT NULL,
    precio_pasaje	INT(11) NOT NULL,
    PRIMARY KEY(id_viaje),
    FOREIGN KEY(id_estacion)
		REFERENCES Estacion(id_estacion)
        ON UPDATE RESTRICT
        ON DELETE RESTRICT,
	FOREIGN KEY(id_tren)
		REFERENCES Tren(id_tren)
        ON UPDATE RESTRICT
        ON DELETE RESTRICT,
	FOREIGN KEY(id_bus)
		REFERENCES Bus(id_bus)
        ON UPDATE RESTRICT
        ON DELETE RESTRICT
);

CREATE TABLE Pago(
	id_pago	INT(11) NOT NULL AUTO_INCREMENT,
    id_cliente	INT(11) NOT NULL,
    monto_total	INT(11) NOT NULL, -- modificado de cantidad a monto total
    metodo	VARCHAR(15) NOT NULL,
    PRIMARY KEY(id_pago),
    FOREIGN KEY (id_cliente)
		REFERENCES Cliente_comprador(id_cliente)
        ON UPDATE RESTRICT
        ON DELETE RESTRICT
);

CREATE TABLE Reserva(
	id_reserva	INT(11) NOT NULL AUTO_INCREMENT,
    id_viaje	INT(11) NOT NULL,
    id_pago		INT(11) NOT NULL,
    id_cliente 	INT(11) NOT NULL,
    fecha 		DATE NOT NULL, -- fecha para realizar la compra
    infante     BOOL NOT NULL,
    PRIMARY KEY (id_reserva),
    FOREIGN KEY(id_viaje)
		REFERENCES Viaje(id_viaje)
        ON UPDATE RESTRICT
        ON DELETE RESTRICT,
	FOREIGN KEY(id_pago)
		REFERENCES Pago(id_pago)
        ON UPDATE RESTRICT
        ON DELETE RESTRICT,
	FOREIGN KEY(id_cliente)
		REFERENCES Cliente(id_cliente)
        ON UPDATE RESTRICT
        ON DELETE RESTRICT
);

Create table Reserva_asesor(
	id_reserva 	INT(11) NOT NULL,
    id_trabajador	INT(11) NOT NULL,
    PRIMARY KEY(id_reserva),
    FOREIGN KEY(id_reserva)
		REFERENCES Reserva(id_reserva)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
	FOREIGN KEY(id_trabajador)
		REFERENCES Asesor_venta(id_trabajador)
        ON UPDATE RESTRICT
        ON DELETE RESTRICT
);
