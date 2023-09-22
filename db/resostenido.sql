DROP DATABASE IF EXISTS resostenido;

CREATE DATABASE resostenido;

USE resostenido;

CREATE TABLE usuarios (
  id int(11) AUTO_INCREMENT,
  email VARCHAR(255) UNIQUE NOT NULL,
  nombre VARCHAR(55) NOT NULL,
  apellidos VARCHAR(110) NOT NULL,
  numero_telefono VARCHAR(15) NOT NULL,
  contrasenia VARCHAR(60) NOT NULL,
  es_admin BOOLEAN DEFAULT 0,
  verificado BOOLEAN DEFAULT 0,
  PRIMARY KEY(id)
);

CREATE TABLE tokens_verificacion (
  token VARCHAR(64) UNIQUE NOT NULL,
  fecha_expiracion DATETIME NOT NULL,
  id_usuario int(11) NOT NULL,
  CONSTRAINT fk_usuario_token_verificacion
  FOREIGN KEY (id_usuario) REFERENCES usuarios(id)
);

CREATE TABLE tokens_recuperacion_contrasenia (
  token VARCHAR(64) UNIQUE NOT NULL,
  id_usuario int(11) NOT NULL,
  CONSTRAINT fk_usuario_token_recuperacion
  FOREIGN KEY (id_usuario) REFERENCES usuarios(id)
);

CREATE TABLE servicios (
  id int(11) AUTO_INCREMENT,
  precio DECIMAL(10, 2) NOT NULL,
  grupo VARCHAR(55),
  nombre_instrumento VARCHAR(55) NOT NULL,
  descripcion VARCHAR(255),
  url_imagen VARCHAR(255),
  activo BOOLEAN DEFAULT 1,
  PRIMARY KEY(id)
);


/*-- Inserta información para Guitarras
INSERT INTO servicios (precio, grupo, nombre_instrumento, descripcion, url_imagen)
VALUES (350.00, 'Guitarras', 'Guitarra acústica', 'Calibración', 'landingpage-1.jpg');

INSERT INTO servicios (precio, grupo, nombre_instrumento, descripcion, url_imagen)
VALUES (350.00, 'Guitarras', 'Guitarra eléctrica 6 cuerdas', 'Calibración', 'landingpage-1.jpg');

INSERT INTO servicios (precio, grupo, nombre_instrumento, descripcion, url_imagen)
VALUES (400.00, 'Guitarras', 'Guitarra eléctrica 7 cuerdas', 'Calibración', 'landingpage-1.jpg');

INSERT INTO servicios (precio, grupo, nombre_instrumento, descripcion, url_imagen)
VALUES (450.00, 'Guitarras', 'Guitarra eléctrica 8 cuerdas', 'Calibración', 'landingpage-1.jpg');

INSERT INTO servicios (precio, grupo, nombre_instrumento, descripcion, url_imagen)
VALUES (550.00, 'Guitarras', 'Guitarra eléctrica con Floyd Rose o Kahler', 'Calibración', 'landingpage-1.jpg');

-- Inserta información para Bajos
INSERT INTO servicios (precio, grupo, nombre_instrumento, descripcion, url_imagen)
VALUES (350.00, 'Bajos', 'Bajo 4 cuerdas', 'Calibración', 'landingpage-1.jpg');

INSERT INTO servicios (precio, grupo, nombre_instrumento, descripcion, url_imagen)
VALUES (400.00, 'Bajos', 'Bajo 5 cuerdas', 'Calibración', 'landingpage-1.jpg');

INSERT INTO servicios (precio, grupo, nombre_instrumento, descripcion, url_imagen)
VALUES (450.00, 'Bajos', 'Bajo 6 cuerdas', 'Calibración', 'landingpage-1.jpg');

-- Inserta información para otros instrumentos
INSERT INTO servicios (precio, grupo, nombre_instrumento, descripcion, url_imagen)
VALUES (450.00, 'Otros', 'Bajo quinto', 'Calibración', 'landingpage-1.jpg');

INSERT INTO servicios (precio, grupo, nombre_instrumento, descripcion, url_imagen)
VALUES (450.00, 'Otros', 'Docerola', 'Calibración', 'landingpage-1.jpg');

INSERT INTO servicios (precio, grupo, nombre_instrumento, descripcion, url_imagen)
VALUES (450.00, 'Otros', 'Bajo sexto', 'Calibración', 'landingpage-1.jpg');

*/