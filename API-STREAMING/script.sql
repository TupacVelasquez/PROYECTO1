-- Crear tabla Series
CREATE TABLE series (
    id_serie INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    año INT NOT NULL
);

-- Crear tabla Géneros
CREATE TABLE generos (
    id_genero INT AUTO_INCREMENT PRIMARY KEY,
    nombre_genero VARCHAR(100) NOT NULL
);

-- Crear tabla intermedia SeriesGeneros
CREATE TABLE series_generos (
    id_serie INT NOT NULL,
    id_genero INT NOT NULL,
    PRIMARY KEY (id_serie, id_genero),
    FOREIGN KEY (id_serie) REFERENCES series(id_serie) ON DELETE CASCADE,
    FOREIGN KEY (id_genero) REFERENCES generos(id_genero) ON DELETE CASCADE
);
