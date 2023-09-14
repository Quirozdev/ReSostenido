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
  verificado BOOLEAN DEFAULT 0,
  PRIMARY KEY(id)
);

CREATE TABLE tokens_registro (
  id int(11) AUTO_INCREMENT,
  token VARCHAR(128) UNIQUE NOT NULL,
  fecha_expiracion DATETIME NOT NULL,
  CONSTRAINT fk_usuario
  FOREIGN KEY (id) REFERENCES usuarios(id),
  PRIMARY KEY(id)
);

CREATE TABLE servicios (
  id int(11) AUTO_INCREMENT,
  precio DECIMAL(10, 2) NOT NULL,
  nombre_instrumento VARCHAR(55) NOT NULL,
  descripcion VARCHAR(255),
  url_imagen VARCHAR(255),
  PRIMARY KEY(id)
);