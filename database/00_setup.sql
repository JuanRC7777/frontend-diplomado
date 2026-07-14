-- ============================================================
-- 00_setup.sql
-- Ejecutar UNA sola vez, conectado como root o un usuario admin:
--   mysql -u root -p < database/00_setup.sql
--
-- Crea la base de datos y un usuario de aplicación con el
-- MINIMO PRIVILEGIO necesario (nunca uses root desde el backend).
-- ============================================================

CREATE DATABASE IF NOT EXISTS pawcare
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

-- IMPORTANTE: reemplaza CAMBIA_ESTA_CONTRASENA por una fuerte y única
-- SOLO al pegar el comando en tu terminal para ejecutarlo -- nunca guardes
-- la contraseña real en este archivo ni la commitees. El valor real vive
-- únicamente en backend/.env (ignorado por git).
--
-- CREATE USER IF NOT EXISTS es idempotente: si el usuario ya existe, esta
-- sentencia NO actualiza su contraseña. Por eso el ALTER USER de abajo
-- fija la contraseña explícitamente sin importar si el usuario ya existía.
CREATE USER IF NOT EXISTS 'pawcare_app'@'localhost'
  REQUIRE SSL
  PASSWORD EXPIRE INTERVAL 90 DAY
  FAILED_LOGIN_ATTEMPTS 5
  PASSWORD_LOCK_TIME 1;

ALTER USER 'pawcare_app'@'localhost' IDENTIFIED BY 'CAMBIA_ESTA_CONTRASENA';

-- Solo DML sobre la base de la app. Sin DROP, sin GRANT OPTION,
-- sin acceso a otras bases ni privilegios de administración.
GRANT SELECT, INSERT, UPDATE, DELETE ON pawcare.* TO 'pawcare_app'@'localhost';

FLUSH PRIVILEGES;
