-- Esquema de la base de datos Adoptasoft (Postgres / Neon)

CREATE TABLE usuarios (
    id_usuario      SERIAL PRIMARY KEY,
    nombre          VARCHAR(100) NOT NULL,
    email           VARCHAR(150) NOT NULL UNIQUE,
    documento       VARCHAR(50),
    telefono        VARCHAR(20),
    password        VARCHAR(255) NOT NULL,
    rol             VARCHAR(10) NOT NULL CHECK (rol IN ('owner','vet','admin')),
    fecha_registro  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE veterinarios_perfil (
    id_usuario        INT PRIMARY KEY REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
    especialidad      VARCHAR(100) NOT NULL,
    clinica           VARCHAR(150) NOT NULL,
    registro_medico   VARCHAR(50),
    horario_inicio    TIME NOT NULL DEFAULT '08:00:00',
    horario_fin       TIME NOT NULL DEFAULT '17:00:00',
    estado            VARCHAR(10) DEFAULT 'Activo' CHECK (estado IN ('Activo','Inactivo'))
);

CREATE TABLE mascotas (
    id_mascota      SERIAL PRIMARY KEY,
    nombre          VARCHAR(100) NOT NULL,
    especie         VARCHAR(50) NOT NULL,
    raza            VARCHAR(100),
    edad            VARCHAR(30),
    peso            DECIMAL(5,2),
    sexo            VARCHAR(10) CHECK (sexo IN ('Macho','Hembra')),
    estado          VARCHAR(15) DEFAULT 'Activo' CHECK (estado IN ('Activo','Pendiente','Rechazado')),
    id_propietario  INT NOT NULL REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
    fecha_registro  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE citas (
    id_cita         SERIAL PRIMARY KEY,
    fecha           DATE NOT NULL,
    hora            TIME NOT NULL,
    tipo            VARCHAR(100),
    motivo          TEXT,
    estado          VARCHAR(15) DEFAULT 'Pendiente'
                        CHECK (estado IN ('Pendiente','Confirmada','Rechazada','Cancelada','Atendida')),
    id_mascota      INT NOT NULL REFERENCES mascotas(id_mascota) ON DELETE CASCADE,
    id_veterinario  INT REFERENCES usuarios(id_usuario) ON DELETE SET NULL,
    fecha_creacion  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE historial_clinico (
    id_historial    SERIAL PRIMARY KEY,
    fecha           DATE NOT NULL,
    tipo            VARCHAR(15) NOT NULL CHECK (tipo IN ('vacuna','diagnostico','control')),
    descripcion     TEXT NOT NULL,
    medicamento     TEXT,
    peso_actual     DECIMAL(5,2),
    proxima_cita    DATE,
    id_mascota      INT NOT NULL REFERENCES mascotas(id_mascota) ON DELETE CASCADE,
    id_veterinario  INT NOT NULL REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
    fecha_creacion  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE sesiones (
    token       CHAR(64) PRIMARY KEY,
    id_usuario  INT NOT NULL REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
    creado_en   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expira_en   TIMESTAMP NOT NULL
);
