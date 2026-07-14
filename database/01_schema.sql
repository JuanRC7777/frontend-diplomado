-- ============================================================
-- 01_schema.sql
-- Ejecutar como root (crear tablas es DDL; pawcare_app solo tiene
-- privilegios DML -- SELECT/INSERT/UPDATE/DELETE -- a propósito):
--   mysql -u root -p pawcare < database/01_schema.sql
--
-- Es seguro volver a correrlo: todas las tablas usan
-- IF NOT EXISTS y el catálogo de vacunas usa INSERT IGNORE.
-- ============================================================

USE pawcare;

-- ------------------------------------------------------------
-- USUARIOS: nunca se guarda la contraseña en texto plano ni
-- cifrada de forma reversible. Solo el hash (bcrypt/argon2id
-- generado en el backend). CHAR(60) es el tamaño exacto de un
-- hash bcrypt.
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS usuarios (
  id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nombre          VARCHAR(120)  NOT NULL,
  email           VARCHAR(190)  NOT NULL,
  telefono        VARCHAR(30)   NULL,
  password_hash   CHAR(60)      NOT NULL,
  rol             ENUM('usuario','admin') NOT NULL DEFAULT 'usuario',
  activo          TINYINT(1)    NOT NULL DEFAULT 1,
  creado_en       TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  actualizado_en  TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_usuarios_email (email)
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- REFRESH TOKENS (JWT): el access token JWT NUNCA se guarda en
-- BD (es autocontenido y de corta duración). Lo que sí se
-- persiste es el refresh token, y solo su hash SHA-256 -- si la
-- base de datos se filtra, los tokens no quedan reutilizables.
-- Permite revocación (logout) y expiración server-side.
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS refresh_tokens (
  id            BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  usuario_id    BIGINT UNSIGNED NOT NULL,
  token_hash    CHAR(64)        NOT NULL,
  user_agent    VARCHAR(255)    NULL,
  ip_address    VARCHAR(45)     NULL,
  expira_en     TIMESTAMP       NOT NULL,
  revocado_en   TIMESTAMP       NULL,
  creado_en     TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_refresh_token_hash (token_hash),
  KEY idx_refresh_usuario (usuario_id),
  CONSTRAINT fk_refresh_usuario FOREIGN KEY (usuario_id)
    REFERENCES usuarios(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- LOGIN_ATTEMPTS: soporte para bloqueo por fuerza bruta
-- (rate limiting) a nivel de aplicación: contar intentos
-- fallidos por email/IP en una ventana de tiempo.
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS login_attempts (
  id          BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  email       VARCHAR(190) NOT NULL,
  ip_address  VARCHAR(45)  NOT NULL,
  exitoso     TINYINT(1)   NOT NULL,
  creado_en   TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY idx_login_email_fecha (email, creado_en),
  KEY idx_login_ip_fecha (ip_address, creado_en)
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- CATALOGO DE VACUNAS (evita texto libre repetido en jornadas)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS vacunas (
  id      SMALLINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nombre  VARCHAR(60) NOT NULL,
  UNIQUE KEY uq_vacuna_nombre (nombre)
) ENGINE=InnoDB;

INSERT IGNORE INTO vacunas (nombre) VALUES
  ('Antirrábica'), ('Parvovirus'), ('Moquillo'),
  ('Triple Felina'), ('Leucemia Felina'), ('Bordetella'), ('Rabia');

-- ------------------------------------------------------------
-- ANIMALES EN ADOPCION
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS animales (
  id                BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  usuario_id        BIGINT UNSIGNED NULL,
  nombre            VARCHAR(80)   NOT NULL,
  especie           VARCHAR(40)   NOT NULL,
  raza              VARCHAR(80)   NOT NULL,
  edad              SMALLINT UNSIGNED NOT NULL,
  unidad_edad       ENUM('meses','años') NOT NULL DEFAULT 'años',
  tamano            ENUM('Pequeño','Mediano','Grande') NOT NULL,
  sexo              ENUM('Macho','Hembra') NOT NULL,
  estado_salud      VARCHAR(60)   NOT NULL DEFAULT 'Buena',
  vacunado          TINYINT(1)    NOT NULL DEFAULT 0,
  esterilizado      TINYINT(1)    NOT NULL DEFAULT 0,
  descripcion       TEXT          NULL,
  foto_url          VARCHAR(500)  NULL,
  ciudad            VARCHAR(80)   NOT NULL,
  contacto_email    VARCHAR(190)  NOT NULL,
  contacto_telefono VARCHAR(30)   NOT NULL,
  carnet            VARCHAR(40)   NULL,
  fecha_publicacion DATE          NOT NULL DEFAULT (CURRENT_DATE),
  KEY idx_animales_ciudad (ciudad),
  KEY idx_animales_usuario (usuario_id),
  CONSTRAINT fk_animales_usuario FOREIGN KEY (usuario_id)
    REFERENCES usuarios(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- JORNADAS DE VACUNACION
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS jornadas (
  id                BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  usuario_id        BIGINT UNSIGNED NULL,
  titulo            VARCHAR(150)  NOT NULL,
  lugar             VARCHAR(150)  NOT NULL,
  ciudad            VARCHAR(80)   NOT NULL,
  fecha             DATE          NOT NULL,
  hora_inicio       TIME          NOT NULL,
  hora_fin          TIME          NOT NULL,
  organizador       VARCHAR(120)  NOT NULL,
  contacto_email    VARCHAR(190)  NOT NULL,
  cupos             SMALLINT UNSIGNED NOT NULL,
  descripcion       TEXT          NULL,
  fecha_publicacion DATE          NOT NULL DEFAULT (CURRENT_DATE),
  KEY idx_jornadas_ciudad_fecha (ciudad, fecha),
  KEY idx_jornadas_usuario (usuario_id),
  CONSTRAINT fk_jornadas_usuario FOREIGN KEY (usuario_id)
    REFERENCES usuarios(id) ON DELETE SET NULL,
  CONSTRAINT chk_jornadas_horario CHECK (hora_fin > hora_inicio)
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- PIVOTE JORNADA <-> VACUNAS (relación N:M)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS jornada_vacunas (
  jornada_id  BIGINT UNSIGNED NOT NULL,
  vacuna_id   SMALLINT UNSIGNED NOT NULL,
  PRIMARY KEY (jornada_id, vacuna_id),
  CONSTRAINT fk_jv_jornada FOREIGN KEY (jornada_id)
    REFERENCES jornadas(id) ON DELETE CASCADE,
  CONSTRAINT fk_jv_vacuna FOREIGN KEY (vacuna_id)
    REFERENCES vacunas(id) ON DELETE RESTRICT
) ENGINE=InnoDB;
