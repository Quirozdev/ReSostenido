DROP DATABASE IF EXISTS resostenido;

CREATE DATABASE resostenido;

USE resostenido;

CREATE TABLE usuarios (
  id int(11) AUTO_INCREMENT,
  email VARCHAR(250) UNIQUE NOT NULL,
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

CREATE TABLE estados_citas (
  id TINYINT,
  estado VARCHAR(64),
  PRIMARY KEY(id)
);

INSERT INTO estados_citas (id, estado)
VALUES (1, 'Próxima');

INSERT INTO estados_citas (id, estado)
VALUES (2, 'En progreso');

INSERT INTO estados_citas (id, estado)
VALUES (3, 'Terminada');

INSERT INTO estados_citas (id, estado)
VALUES (4, 'Cancelada');

CREATE TABLE pagos_anticipos (
  id int(11) AUTO_INCREMENT,
  -- la id/token que paypal regresa al realizar un pago
  id_orden VARCHAR(64) NOT NULL,
  total DECIMAL(10, 2) NOT NULL,
  fecha DATETIME NOT NULL,
  PRIMARY KEY(id)
);

CREATE TABLE citas (
  id int(11) AUTO_INCREMENT,
  fecha DATE NOT NULL,
  hora TIME NOT NULL,
  descripcion VARCHAR(255),
  incluye_cuerdas BOOLEAN DEFAULT 0,
  costo_total DECIMAL(10, 2) NOT NULL,
  id_pago_anticipo int(11) DEFAULT NULL,
  anticipo_pagado BOOLEAN GENERATED ALWAYS AS (NOT(ISNULL(id_pago_anticipo))) VIRTUAL NOT NULL,
  id_estado TINYINT NOT NULL,
  id_servicio int(11) NOT NULL,
  id_usuario int(11) NOT NULL,
  CONSTRAINT fk_pago_anticipo
  FOREIGN KEY (id_pago_anticipo) REFERENCES pagos_anticipos(id),
  CONSTRAINT fk_estado_cita
  FOREIGN KEY (id_estado) REFERENCES estados_citas(id),
  CONSTRAINT fk_servicio_cita
  FOREIGN KEY (id_servicio) REFERENCES servicios(id),
  CONSTRAINT fk_servicio_usuario
  FOREIGN KEY (id_usuario) REFERENCES usuarios(id),
  PRIMARY KEY(id)
);

CREATE TABLE anotaciones_citas (
  id int(11) AUTO_INCREMENT,
  anotacion VARCHAR(255) NOT NULL,
  id_cita int(11),
  CONSTRAINT fk_anotacion_cita
  FOREIGN KEY (id_cita) REFERENCES citas(id),
  PRIMARY KEY(id)
);

-- CREATE TABLE detalles_instrumento_cita (
--   id int(11) AUTO_INCREMENT,
--   marca VARCHAR(255) NOT NULL,
--   id_cita int(11),
--   CONSTRAINT fk_anotacion_cita
--   FOREIGN KEY (id_cita) REFERENCES citas(id),
--   PRIMARY KEY(id)
-- );

CREATE TABLE preguntas (
  id int(11) AUTO_INCREMENT,
  pregunta TEXT NOT NULL,
  respuesta TEXT,
  estado ENUM('pendiente', 'respondida') DEFAULT 'pendiente',
  id_usuario_pregunta int(11) NOT NULL,
  id_usuario_respuesta int(11),
  fecha_pregunta TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  fecha_respuesta TIMESTAMP NULL,
  PRIMARY KEY(id)
);

DELIMITER $$
DROP FUNCTION IF EXISTS validar_disponibilidad_fecha_cita;
CREATE FUNCTION validar_disponibilidad_fecha_cita(fecha_a_checar DATE, hora_a_checar TIME, fecha_y_hora_actual DATETIME)
  RETURNS JSON DETERMINISTIC
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

    SELECT hora INTO hora_ya_registrada FROM citas WHERE(citas.id_estado != 4 AND citas.anticipo_pagado = true AND citas.fecha = fecha_a_checar AND ((citas.hora >= hora_a_checar AND citas.hora < hora_20_minutos_despues) OR (citas.hora > hora_20_minutos_antes AND citas.hora < hora_a_checar))) LIMIT 1;

    SET existe_una_cita_entre_el_intervalo = (
      SELECT hora_ya_registrada IS NOT NULL
    );

    IF existe_una_cita_entre_el_intervalo = true THEN
      RETURN JSON_OBJECT('disponibilidad', false, 'mensaje', CONCAT('Ya hay una cita el día ', fecha_a_checar, ' entre las ', hora_ya_registrada, ' y las ', ADDTIME(hora_ya_registrada, '00:20:00')));
    END IF;

    SET cantidad_citas = (
      SELECT COUNT(*)
      FROM citas
      WHERE citas.fecha = fecha_a_checar AND citas.anticipo_pagado = true AND citas.id_estado != 4
    );

    IF cantidad_citas >= 8 THEN
      RETURN JSON_OBJECT('disponibilidad', false, 'mensaje', 'Ya hay 8 citas para este dia');
    END IF;
    
    RETURN JSON_OBJECT('disponibilidad', true, 'mensaje', NULL);
  END;$$
DELIMITER ;

DELIMITER $$
DROP PROCEDURE IF EXISTS obtenerCitas;
CREATE PROCEDURE obtenerCitas(IN id_usuario INT) 
BEGIN
    -- regresa todas las citas si no se especifica id usuario
    IF id_usuario IS NULL THEN
      SELECT citas.id, fecha, hora, citas.descripcion, incluye_cuerdas, costo_total, id_estado, estados_citas.estado, servicios.descripcion AS descripcion_servicio, servicios.nombre_instrumento, usuarios.nombre, usuarios.apellidos 
      FROM citas 
      INNER JOIN estados_citas
      ON citas.id_estado = estados_citas.id
      INNER JOIN servicios 
      ON citas.id_servicio = servicios.id
      INNER JOIN usuarios
      ON citas.id_usuario = usuarios.id
      AND anticipo_pagado = true
      ORDER BY fecha DESC, hora DESC;
    ELSE 
      SELECT citas.id, fecha, hora, citas.descripcion, incluye_cuerdas, costo_total, id_estado, estados_citas.estado, servicios.descripcion AS descripcion_servicio, servicios.nombre_instrumento 
      FROM citas 
      INNER JOIN estados_citas
      ON citas.id_estado = estados_citas.id
      INNER JOIN servicios 
      ON citas.id_servicio = servicios.id AND anticipo_pagado = true AND citas.id_usuario = id_usuario
      ORDER BY fecha DESC, hora DESC;
    END IF;
  END;$$
DELIMITER ;

DELIMITER $$
DROP FUNCTION IF EXISTS validar_plazo_cancelacion;
CREATE FUNCTION validar_plazo_cancelacion(fecha_a_checar DATE, hora_a_checar TIME)
  RETURNS BOOLEAN DETERMINISTIC
  BEGIN

    DECLARE fecha_y_hora_a_checar DATETIME;
    DECLARE fecha_actual DATETIME;

    SET fecha_y_hora_a_checar = ADDTIME(CONVERT(fecha_a_checar, DATETIME), hora_a_checar);


    SET fecha_actual = CONVERT_TZ(UTC_TIMESTAMP(), '+00:00', '-07:00');

    -- Ya paso la fecha de la cita
    IF fecha_y_hora_a_checar <= fecha_actual THEN
      RETURN false;
    END IF;

    -- Ya paso el plazo de cancelación
    IF fecha_y_hora_a_checar <= DATE_SUB(fecha_actual, INTERVAL -24 HOUR) THEN
      RETURN false;
    END IF;

    RETURN true;
  END;$$
DELIMITER ;


DELIMITER $$
DROP PROCEDURE IF EXISTS obtenerDetallesCita;
CREATE PROCEDURE obtenerDetallesCita(IN id_cita INT) 
BEGIN
  SELECT citas.id AS id_cita, citas.fecha, citas.hora, citas.descripcion AS nota_cliente, incluye_cuerdas, costo_total, id_usuario, servicios.nombre_instrumento, servicios.grupo, servicios.descripcion AS descripcion_servicio, servicios.url_imagen, estados_citas.id AS id_estado, estados_citas.estado, pagos_anticipos.total AS anticipo_total, usuarios.nombre, usuarios.apellidos, usuarios.email, usuarios.numero_telefono, validar_plazo_cancelacion(citas.fecha, citas.hora) AS esta_dentro_del_plazo_cancelable
  FROM citas 
  INNER JOIN pagos_anticipos 
  ON citas.id_pago_anticipo = pagos_anticipos.id 
  INNER JOIN servicios 
  ON citas.id_servicio = servicios.id 
  INNER JOIN estados_citas 
  ON citas.id_estado = estados_citas.id 
  INNER JOIN usuarios 
  ON citas.id_usuario = usuarios.id 
  WHERE citas.id = id_cita AND citas.anticipo_pagado = true;
  END;$$
DELIMITER ;

/*-- Inserta información para Guitarras
INSERT INTO servicios (precio, precio_cuerdas, grupo, nombre_instrumento, descripcion, url_imagen)
VALUES (350.00, 215.50, 'Guitarras', 'Guitarra acústica', 'Calibración', 'landingpage-1.webp');

INSERT INTO servicios (precio, precio_cuerdas, grupo, nombre_instrumento, descripcion, url_imagen)
VALUES (350.00, 154.32, 'Guitarras', 'Guitarra eléctrica 6 cuerdas', 'Calibración', 'landingpage-1.webp');

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

