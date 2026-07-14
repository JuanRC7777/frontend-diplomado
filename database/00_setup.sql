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

-- Cambia esta contraseña por una fuerte y única (no la reutilices).
-- En producción, este valor debe salir de un secreto (env var / vault),
-- nunca quedar commiteado en el repo.
CREATE USER IF NOT EXISTS 'pawcare_app'@'localhost'
  IDENTIFIED BY 'CAMBIA_ESTA_CONTRASENA_2026!'
  REQUIRE SSL
  PASSWORD EXPIRE INTERVAL 90 DAY
  FAILED_LOGIN_ATTEMPTS 5
  PASSWORD_LOCK_TIME 1;

-- Solo DML sobre la base de la app. Sin DROP, sin GRANT OPTION,
-- sin acceso a otras bases ni privilegios de administración.
GRANT SELECT, INSERT, UPDATE, DELETE ON pawcare.* TO 'pawcare_app'@'localhost';

FLUSH PRIVILEGES;
