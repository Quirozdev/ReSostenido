DROP DATABASE IF EXISTS resostenido;

CREATE DATABASE resostenido;

USE resostenido;

CREATE TABLE usuarios (
  id int(11) AUTO_INCREMENT,
  email VARCHAR(255) UNIQUE NOT NULL,
  nombre VARCHAR(55) NOT NULL,
  apellido_paterno VARCHAR(55) NOT NULL,
  apellido_materno VARCHAR(55) NOT NULL,
  numero_telefono VARCHAR(15) NOT NULL,
  contrasenia VARCHAR(60) NOT NULL,
  es_admin BOOLEAN DEFAULT 0,
  verificado BOOLEAN DEFAULT 0,
  PRIMARY KEY(id)
);

CREATE TABLE tokens_registro (
  token VARCHAR(128) UNIQUE NOT NULL,
  fecha_expiracion DATETIME NOT NULL,
  id_usuario int(11) NOT NULL,
  CONSTRAINT fk_usuario
  FOREIGN KEY (id_usuario) REFERENCES usuarios(id)
);

CREATE TABLE servicios (
  id int(11) AUTO_INCREMENT,
  precio DECIMAL(10, 2) NOT NULL,
  nombre_instrumento VARCHAR(55) NOT NULL,
  descripcion VARCHAR(255),
  url_imagen VARCHAR(255),
  PRIMARY KEY(id)
);