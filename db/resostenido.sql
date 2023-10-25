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
  precio_cuerdas DECIMAL(10, 2), -- Si es NULL, significa que el servicio no ofrece cuerdas
  precio_anticipo_cita DECIMAL(10, 2) DEFAULT 125.00 NOT NULL, -- El cliente propuso un rango de entre 100 y 150 pesos para el anticipo de todas las citas
  grupo VARCHAR(55),
  nombre_instrumento VARCHAR(55) NOT NULL,
  descripcion VARCHAR(255),
  url_imagen VARCHAR(255),
  activo BOOLEAN DEFAULT 1,
  PRIMARY KEY(id)
);

CREATE TABLE citas (
  id int(11) AUTO_INCREMENT,
  fecha DATE NOT NULL,
  hora TIME NOT NULL,
  descripcion VARCHAR(255),
  incluye_cuerdas BOOLEAN DEFAULT 0,
  precio_anticipo_total DECIMAL(10, 2) NOT NULL,
  pagada BOOLEAN DEFAULT 0,
  id_servicio int(11) NOT NULL,
  id_usuario int(11) NOT NULL,
  CONSTRAINT fk_servicio_cita
  FOREIGN KEY (id_servicio) REFERENCES servicios(id),
  CONSTRAINT fk_servicio_usuario
  FOREIGN KEY (id_usuario) REFERENCES usuarios(id),
  PRIMARY KEY(id)
);


CREATE TABLE preguntas (
  id int(11) AUTO_INCREMENT,
  pregunta TEXT NOT NULL,
  respuesta TEXT,
  estado ENUM('pendiente', 'respondida') DEFAULT 'pendiente',
  id_usuario_pregunta int(11) NOT NULL,
  id_usuario_respuesta int(11),
  fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY(id)
);




DELIMITER $$
DROP FUNCTION IF EXISTS validar_disponibilidad_fecha_cita;
CREATE FUNCTION validar_disponibilidad_fecha_cita(fecha_a_checar DATE, hora_a_checar TIME, fecha_y_hora_actual DATETIME)
  RETURNS JSON 
  BEGIN

    DECLARE indice_dia_en_la_semana INT;
    DECLARE cantidad_citas INT;
    DECLARE existe_una_cita_entre_el_intervalo BOOLEAN;
    DECLARE hora_ya_registrada TIME;
    DECLARE hora_20_minutos_antes TIME;
    DECLARE hora_20_minutos_despues TIME;

    SET fecha_y_hora_actual = IFNULL(fecha_y_hora_actual, CONVERT_TZ(UTC_TIMESTAMP(), '+00:00', '-07:00'));

    SET indice_dia_en_la_semana = WEEKDAY(fecha_a_checar);

    IF indice_dia_en_la_semana = 6 THEN
      RETURN JSON_OBJECT('disponibilidad', false, 'mensaje', 'El taller no se encuentra abierto los domingos');
    END IF;
    
    IF NOT hora_a_checar >= '09:00:00' OR NOT hora_a_checar <= '17:40:00' THEN
      RETURN JSON_OBJECT('disponibilidad', false, 'mensaje', 'Solo se pueden agendar citas desde las 9:00 AM hasta las 5:40 PM');
    END IF;

    IF ADDTIME(CONVERT(fecha_a_checar, DATETIME), hora_a_checar) <= fecha_y_hora_actual THEN
      RETURN JSON_OBJECT('disponibilidad', false, 'mensaje', 'Esa fecha ya pasó');
    END IF;

    SET hora_20_minutos_antes = SUBTIME(hora_a_checar, '00:20:00');
    SET hora_20_minutos_despues = ADDTIME(hora_a_checar, '00:20:00');

    SELECT hora INTO hora_ya_registrada FROM citas WHERE(citas.pagada = true AND citas.fecha = fecha_a_checar AND ((citas.hora >= hora_a_checar AND citas.hora < hora_20_minutos_despues) OR (citas.hora > hora_20_minutos_antes AND citas.hora < hora_a_checar))) LIMIT 1;

    SET existe_una_cita_entre_el_intervalo = (
      SELECT hora_ya_registrada IS NOT NULL
    );

    IF existe_una_cita_entre_el_intervalo = true THEN
      RETURN JSON_OBJECT('disponibilidad', false, 'mensaje', CONCAT('Ya hay una cita el día ', fecha_a_checar, ' entre las ', hora_ya_registrada, ' y las ', ADDTIME(hora_ya_registrada, '00:20:00')));
    END IF;

    SET cantidad_citas = (
      SELECT COUNT(*)
      FROM citas
      WHERE citas.fecha = fecha_a_checar AND citas.pagada = true
    );

    IF cantidad_citas >= 8 THEN
      RETURN JSON_OBJECT('disponibilidad', false, 'mensaje', 'Ya hay 8 citas para este dia');
    END IF;
    
    RETURN JSON_OBJECT('disponibilidad', true, 'mensaje', NULL);
  END;$$
DELIMITER ;

DELIMITER $$
DROP PROCEDURE IF EXISTS obtenerCitasConCorrespondienteEstado;
CREATE PROCEDURE obtenerCitasConCorrespondienteEstado(IN id_usuario INT) 
BEGIN
    -- regresa todas las citas si no se especifica id usuario
    IF id_usuario IS NULL THEN
      SELECT citas.id, fecha, hora, citas.descripcion, incluye_cuerdas, precio_anticipo_total, servicios.descripcion AS descripcion_servicio, servicios.nombre_instrumento, IF( ADDTIME(CONVERT(citas.fecha, DATETIME), citas.hora) <= CONVERT_TZ(UTC_TIMESTAMP(), '+00:00', '-07:00'), "Terminada", "En proceso") AS estado 
      FROM citas 
      INNER JOIN servicios 
      ON citas.id_servicio = servicios.id AND pagada = true
      ORDER BY fecha DESC, hora DESC;
    ELSE 
      SELECT citas.id, fecha, hora, citas.descripcion, incluye_cuerdas, precio_anticipo_total, servicios.descripcion AS descripcion_servicio, servicios.nombre_instrumento, IF( ADDTIME(CONVERT(citas.fecha, DATETIME), citas.hora) <= CONVERT_TZ(UTC_TIMESTAMP(), '+00:00', '-07:00'), "Terminada", "En proceso") AS estado 
      FROM citas 
      INNER JOIN servicios 
      ON citas.id_servicio = servicios.id AND pagada = true AND citas.id_usuario = id_usuario
      ORDER BY fecha DESC, hora DESC;
    END IF;
  END;$$
DELIMITER ;

/*-- Inserta información para Guitarras
INSERT INTO servicios (precio, grupo, nombre_instrumento, descripcion, url_imagen)
VALUES (350.00, 'Guitarras', 'Guitarra acústica', 'Calibración', 'landingpage-1.webp');

INSERT INTO servicios (precio, grupo, nombre_instrumento, descripcion, url_imagen)
VALUES (350.00, 'Guitarras', 'Guitarra eléctrica 6 cuerdas', 'Calibración', 'landingpage-1.webp');

INSERT INTO servicios (precio, grupo, nombre_instrumento, descripcion, url_imagen)
VALUES (400.00, 'Guitarras', 'Guitarra eléctrica 7 cuerdas', 'Calibración', 'landingpage-1.webp');

INSERT INTO servicios (precio, grupo, nombre_instrumento, descripcion, url_imagen)
VALUES (450.00, 'Guitarras', 'Guitarra eléctrica 8 cuerdas', 'Calibración', 'landingpage-1.webp');

INSERT INTO servicios (precio, grupo, nombre_instrumento, descripcion, url_imagen)
VALUES (450.00, 'Guitarras', 'Guitarra eléctrica con Floyd Rose o Kahler', 'Calibración', 'landingpage-1.webp');

-- Inserta información para Bajos
INSERT INTO servicios (precio, grupo, nombre_instrumento, descripcion, url_imagen)
VALUES (350.00, 'Bajos', 'Bajo 4 cuerdas', 'Calibración', 'landingpage-1.webp');

INSERT INTO servicios (precio, grupo, nombre_instrumento, descripcion, url_imagen)
VALUES (400.00, 'Bajos', 'Bajo 5 cuerdas', 'Calibración', 'landingpage-1.webp');

INSERT INTO servicios (precio, grupo, nombre_instrumento, descripcion, url_imagen)
VALUES (450.00, 'Bajos', 'Bajo 6 cuerdas', 'Calibración', 'landingpage-1.webp');

-- Inserta información para otros instrumentos
INSERT INTO servicios (precio, grupo, nombre_instrumento, descripcion, url_imagen)
VALUES (450.00, 'Otros', 'Bajo quinto', 'Calibración', 'landingpage-1.webp');

INSERT INTO servicios (precio, grupo, nombre_instrumento, descripcion, url_imagen)
VALUES (450.00, 'Otros', 'Docerola', 'Calibración', 'landingpage-1.webp');

INSERT INTO servicios (precio, grupo, nombre_instrumento, descripcion, url_imagen)
VALUES (450.00, 'Otros', 'Bajo sexto', 'Calibración', 'landingpage-1.webp');
*/