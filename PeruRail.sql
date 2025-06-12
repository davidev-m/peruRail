-- 1) Borrar antes si existían versiones anteriores
DROP DATABASE IF EXISTS PeruRail;

-- 2) Crear base de datos y usarla
CREATE DATABASE PeruRail;
USE PeruRail;
CREATE TABLE pago (
  id_pago       INT(11)     NOT NULL AUTO_INCREMENT,
  cant_reserva  INT(11)     NOT NULL,
  metodo        VARCHAR(20) NULL,
  fecha         DATETIME    NOT NULL,
  PRIMARY KEY (id_pago)
);


DROP TABLE IF EXISTS horario;
CREATE TABLE horario (
ID_Horario int(11) not null auto_increment,
Fech_Salida date not null,
Hr_salida datetime not null,
Hr_llegada datetime not null,
Duracion int(11) not null,
Estado varchar(30) not null,
primary key(ID_Horario)
);

DROP TABLE IF EXISTS tren;
CREATE TABLE tren (
ID_Tren int not null auto_increment,
Clase varchar(10) not null,
numero int(11) not null,
nombre varchar(20) not null,
  PRIMARY KEY (ID_Tren)
);

DROP TABLE IF EXISTS ruta;
CREATE TABLE ruta (
ID_Ruta int not null auto_increment,
Origen varchar(30) not null,
Destino varchar(30) not null,
  PRIMARY KEY (ID_Ruta)
);

-- Tabla reserva (depende de pago)
DROP TABLE IF EXISTS reserva;
CREATE TABLE reserva (
  id_reserva   INT(11)      NOT NULL AUTO_INCREMENT,
  id_pago      INT(11)      NOT NULL,
  id_ruta      INT(11)      NOT NULL,
  id_tren      INT(11)      NOT NULL,
  id_horario   INT(11)      NOT NULL,
  estado       VARCHAR(20)  NOT NULL,
  fecha        DATETIME     NOT NULL,
  PRIMARY KEY (id_reserva),

  FOREIGN KEY (id_pago)
    REFERENCES pago(id_pago)
    ON UPDATE CASCADE
    ON DELETE RESTRICT,

  FOREIGN KEY (id_ruta)
    REFERENCES ruta(ID_Ruta)
    ON UPDATE CASCADE
    ON DELETE RESTRICT,

  FOREIGN KEY (id_tren)
    REFERENCES tren(ID_Tren)
    ON UPDATE CASCADE
    ON DELETE RESTRICT,

  FOREIGN KEY (id_horario)
    REFERENCES horario(ID_Horario)
    ON UPDATE CASCADE
    ON DELETE RESTRICT
);

DROP TABLE IF EXISTS viaje;
CREATE TABLE viaje (
  viaje_id     INT AUTO_INCREMENT PRIMARY KEY,
  reserva_id   INT NOT NULL,
  tren_id      INT NOT NULL,
  ruta_id      INT NOT NULL,
  horario_id   INT NOT NULL,
  -- aquí podrías añadir atributos de la relación “viaje”,
  -- por ejemplo: precio, asiento, estado_viaje, etc.

  FOREIGN KEY (reserva_id)
    REFERENCES reserva(id_reserva)
    ON UPDATE CASCADE
    ON DELETE RESTRICT,

  FOREIGN KEY (tren_id)
    REFERENCES tren(ID_Tren)
    ON UPDATE CASCADE
    ON DELETE RESTRICT,

  FOREIGN KEY (ruta_id)
    REFERENCES ruta(ID_Ruta)
    ON UPDATE CASCADE
    ON DELETE RESTRICT,

  FOREIGN KEY (horario_id)
    REFERENCES horario(ID_Horario)
    ON UPDATE CASCADE
    ON DELETE RESTRICT

);

-- Tabla trabajador
DROP TABLE IF EXISTS trabajador;
CREATE TABLE trabajador (
  trabajador_id INT(11)     NOT NULL AUTO_INCREMENT,
  nombre         VARCHAR(20) NULL,
  apellido       VARCHAR(20) NULL,
  correo         VARCHAR(50) NULL,
  documento      VARCHAR(15) NULL,
  PRIMARY KEY (trabajador_id)
);

-- Subclase chofer
DROP TABLE IF EXISTS chofer;
CREATE TABLE chofer (
  trabajador_id INT(11) NOT NULL,
  PRIMARY KEY (trabajador_id),
  FOREIGN KEY (trabajador_id)
    REFERENCES trabajador(trabajador_id)
    ON DELETE CASCADE
);

-- Subclase asesor de venta
drop table if exists asesor_de_venta;
create table asesor_de_venta(
trabajador_id int(11) not null,
primary key (trabajador_id),
foreign key (trabajador_id)
	references trabajador (trabajador_id)
    on delete cascade
);

-- Tabla cliente_final
DROP TABLE IF EXISTS cliente_final;
CREATE TABLE cliente_final (
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
);

-- Subtipo cliente_empresa
DROP TABLE IF EXISTS cliente_empresa;
CREATE TABLE cliente_empresa (
  cliente_final_id INT(11)     NOT NULL,
  ruc              VARCHAR(11) NOT NULL,
  razon_social     VARCHAR(30) NOT NULL,
  direccion        VARCHAR(30) NULL,
  PRIMARY KEY (cliente_final_id),
  FOREIGN KEY (cliente_final_id)
    REFERENCES cliente_final(cliente_final_id)
    ON DELETE CASCADE
);

-- Subtipo cliente_usuario
DROP TABLE IF EXISTS cliente_usuario;
CREATE TABLE cliente_usuario (
  cliente_final_id INT(11) NOT NULL,
  PRIMARY KEY (cliente_final_id),
  FOREIGN KEY (cliente_final_id)
    REFERENCES cliente_final(cliente_final_id)
    ON DELETE CASCADE
);


-- Tabla vagón
DROP TABLE IF EXISTS Vagon;
CREATE TABLE Vagon (
ID_Tren int(11) not null,
Numero int(11) not null,
Descripcion text not null,
precio float not null,
clase varchar(20) not null,
primary key(ID_Tren, Numero),
foreign key (ID_Tren)
references tren(ID_Tren)
on update cascade
on delete restrict
);

-- Tabla estación
DROP TABLE IF EXISTS estacion;
CREATE TABLE estacion (
id_estacion int not null auto_increment,
nombre varchar(20) not null,
Localidad varchar (20) not null,
ID_Ruta int(11) not null,
primary key (id_estacion),
foreign key(ID_Ruta)
references ruta(ID_Ruta)
on update cascade
on delete restrict
);