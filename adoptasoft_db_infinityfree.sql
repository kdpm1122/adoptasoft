-- =====================================================
-- ADOPTASOFT - Base de datos (MySQL/MariaDB)
-- Versión corregida y alineada con el frontend (React)
-- =====================================================


-- =====================================================
-- USUARIOS
-- Dueños, veterinarios y administradores
-- =====================================================
CREATE TABLE usuarios (
    id_usuario      INT AUTO_INCREMENT PRIMARY KEY,
    nombre          VARCHAR(100) NOT NULL,
    email           VARCHAR(150) NOT NULL UNIQUE,
    documento       VARCHAR(50),
    telefono        VARCHAR(20),
    password        VARCHAR(255) NOT NULL,
    rol             ENUM('owner','vet','admin') NOT NULL,
    fecha_registro  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- PERFIL DE VETERINARIO
-- Datos extra que solo aplican cuando usuarios.rol = 'vet'
-- (especialidad, clínica, registro médico, horario, estado)
-- Se separa de "usuarios" porque dueños y admins no tienen
-- estos campos: meterlos en la misma tabla dejaría columnas
-- vacías para la mayoría de usuarios.
-- =====================================================
CREATE TABLE veterinarios_perfil (
    id_usuario        INT PRIMARY KEY,
    especialidad      VARCHAR(100) NOT NULL,
    clinica           VARCHAR(150) NOT NULL,
    registro_medico   VARCHAR(50),
    horario_inicio    TIME NOT NULL DEFAULT '08:00:00',
    horario_fin       TIME NOT NULL DEFAULT '17:00:00',
    estado            ENUM('Activo','Inactivo') DEFAULT 'Activo',
    CONSTRAINT fk_vetperfil_usuario
        FOREIGN KEY (id_usuario)
        REFERENCES usuarios(id_usuario)
        ON DELETE CASCADE
);

-- =====================================================
-- MASCOTAS
-- =====================================================
CREATE TABLE mascotas (
    id_mascota      INT AUTO_INCREMENT PRIMARY KEY,
    nombre          VARCHAR(100) NOT NULL,
    especie         VARCHAR(50) NOT NULL,
    raza            VARCHAR(100),
    edad            VARCHAR(30),
    peso            DECIMAL(5,2),
    sexo            ENUM('Macho','Hembra'),
    estado          ENUM('Activo','Pendiente','Rechazado') DEFAULT 'Activo',
    id_propietario  INT NOT NULL,
    fecha_registro  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_mascota_propietario
        FOREIGN KEY (id_propietario)
        REFERENCES usuarios(id_usuario)
        ON DELETE CASCADE
);

-- =====================================================
-- CITAS
-- =====================================================
CREATE TABLE citas (
    id_cita         INT AUTO_INCREMENT PRIMARY KEY,
    fecha           DATE NOT NULL,
    hora            TIME NOT NULL,
    tipo            VARCHAR(100),
    motivo          TEXT,
    estado          ENUM('Pendiente','Confirmada','Rechazada','Cancelada','Atendida')
                        DEFAULT 'Pendiente',
    id_mascota      INT NOT NULL,
    id_veterinario  INT NULL,
    fecha_creacion  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_cita_mascota
        FOREIGN KEY (id_mascota)
        REFERENCES mascotas(id_mascota)
        ON DELETE CASCADE,
    CONSTRAINT fk_cita_veterinario
        FOREIGN KEY (id_veterinario)
        REFERENCES usuarios(id_usuario)
        ON DELETE SET NULL
);

-- =====================================================
-- HISTORIAL CLINICO
-- =====================================================
CREATE TABLE historial_clinico (
    id_historial    INT AUTO_INCREMENT PRIMARY KEY,
    fecha           DATE NOT NULL,
    tipo            ENUM('vacuna','diagnostico','control') NOT NULL,
    descripcion     TEXT NOT NULL,
    medicamento     TEXT,
    peso_actual     DECIMAL(5,2),
    proxima_cita    DATE,
    id_mascota      INT NOT NULL,
    id_veterinario  INT NOT NULL,
    fecha_creacion  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_historial_mascota
        FOREIGN KEY (id_mascota)
        REFERENCES mascotas(id_mascota)
        ON DELETE CASCADE,
    CONSTRAINT fk_historial_veterinario
        FOREIGN KEY (id_veterinario)
        REFERENCES usuarios(id_usuario)
        ON DELETE CASCADE
);

-- =====================================================
-- SESIONES
-- Tokens de autenticación que genera la API en /auth/login.php
-- El frontend los manda como "Authorization: Bearer <token>"
-- =====================================================
CREATE TABLE sesiones (
    token       CHAR(64) PRIMARY KEY,
    id_usuario  INT NOT NULL,
    creado_en   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expira_en   DATETIME NOT NULL,
    CONSTRAINT fk_sesion_usuario
        FOREIGN KEY (id_usuario)
        REFERENCES usuarios(id_usuario)
        ON DELETE CASCADE
);

-- =====================================================
-- DATOS INICIALES
-- Contraseña real para los 3 usuarios de prueba: "123"
-- (va hasheada con password_hash() de PHP, nunca en texto plano)
-- =====================================================
INSERT INTO usuarios (nombre, email, documento, telefono, password, rol) VALUES
('Paula Rodríguez',   'dueno@demo.com', 'CC 1013592860', '+57 300 000 0000', '$2y$10$zGjHVF.c3mNU5P4TCi1PoOSPJfzfpCAln.uDcnT1RAShrfJs4EMpe', 'owner'),
('Dr. Carlos Ramírez', 'vet@demo.com',  'CC 1019887766', '+57 301 000 0000', '$2y$10$zGjHVF.c3mNU5P4TCi1PoOSPJfzfpCAln.uDcnT1RAShrfJs4EMpe', 'vet'),
('Admin Adoptasoft',   'admin@demo.com', NULL,            NULL,              '$2y$10$zGjHVF.c3mNU5P4TCi1PoOSPJfzfpCAln.uDcnT1RAShrfJs4EMpe', 'admin');

INSERT INTO veterinarios_perfil
    (id_usuario, especialidad, clinica, registro_medico, horario_inicio, horario_fin)
VALUES
    (2, 'Medicina General', 'Clínica Adoptasoft', 'RM 2045', '08:00:00', '17:00:00');

INSERT INTO mascotas (nombre, especie, raza, edad, peso, sexo, id_propietario) VALUES
('Luna', 'Perro', 'Labrador', '2 años', 18.50, 'Hembra', 1);

INSERT INTO citas (fecha, hora, tipo, motivo, id_mascota, id_veterinario) VALUES
(CURDATE() + INTERVAL 3 DAY, '10:00:00', 'Consulta General', 'Chequeo de rutina', 1, 2);

INSERT INTO historial_clinico
    (fecha, tipo, descripcion, medicamento, peso_actual, id_mascota, id_veterinario)
VALUES
    (CURDATE(), 'vacuna', 'Vacuna antirrábica anual', NULL, 18.50, 1, 2);
