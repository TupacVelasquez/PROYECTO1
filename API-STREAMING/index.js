import express from 'express';
import bodyParser from 'body-parser';
import mysql from 'mysql2';
import cors from 'cors';

const app = express();
const port = 8000;

app.use(cors());
app.use(bodyParser.json());

// Conexión a la base de datos
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123',
    port: 3306,
    database: 'BD_STREAMING',
});

db.connect((error) => {
    if (error) {
        console.error('Error de conexión a la base de datos:', error);
        return;
    }
    console.log('Conexión a la base de datos exitosa');
});

app.get('/', (req, res) => {
    res.send('Bienvenido a la API de Plataforma de Streaming');
});

//Listar todas las series disponibles con generos
app.get('/streaming-list/', (req, res) => {
    const query = `
        SELECT s.id_serie, s.nombre, s.año, GROUP_CONCAT(g.nombre_genero) AS generos
        FROM series s
        INNER JOIN series_generos sg ON s.id_serie = sg.id_serie
        INNER JOIN generos g ON sg.id_genero = g.id_genero
        GROUP BY s.id_serie;
    `;
    db.query(query, (error, results) => {
        if (error) return res.status(500).send('Error al obtener las series');
        
        const series = results.map(serie => ({
            id_serie: serie.id_serie,
            nombre: serie.nombre,
            año: serie.año,
            generos: serie.generos ? serie.generos.split(',') : []
        }));

        res.status(200).json(series);
    });
});


// Crear un nuevo streaming
app.post('/streaming-list', (req, res) => {
    const { nombre, año, generos } = req.body;

    if (!nombre || !año) return res.status(400).send('Nombre y año son obligatorios');

    // Insertar la nueva serie
    const query = 'INSERT INTO series (nombre, año) VALUES (?, ?)';
    db.query(query, [nombre, año], (error, result) => {
        if (error) return res.status(500).send('Error al agregar la serie');

        const id_serie = result.insertId;

        // Si se proporcionan géneros, asignarlos
        if (generos && generos.length > 0) {
            const generoQuery = 'INSERT INTO series_generos (id_serie, id_genero) VALUES ?';
            const generoValues = generos.map(id_genero => [id_serie, id_genero]);

            db.query(generoQuery, [generoValues], (error) => {
                if (error) return res.status(500).send('Error al asignar géneros a la serie');
                res.status(201).send('Serie agregada correctamente con géneros');
            });
        } else {
            res.status(201).send('Serie agregada correctamente sin géneros');
        }
    });
});

// Actualizar un straming existente

app.put('/streaming-list/:id', (req, res) => {
    const { id } = req.params;
    const { nombre, año, generos } = req.body;

    if (!nombre || !año) return res.status(400).send('Nombre y año son obligatorios');

    // Actualizar la serie
    const query = 'UPDATE series SET nombre = ?, año = ? WHERE id_serie = ?';
    db.query(query, [nombre, año, id], (error) => {
        if (error) return res.status(500).send('Error al actualizar la serie');

        // Actualizar los géneros si se proporcionan
        if (generos && generos.length > 0) {
            // Eliminar géneros actuales
            const deleteQuery = 'DELETE FROM series_generos WHERE id_serie = ?';
            db.query(deleteQuery, [id], (error) => {
                if (error) return res.status(500).send('Error al eliminar géneros anteriores');

                // Insertar los nuevos géneros
                const generoQuery = 'INSERT INTO series_generos (id_serie, id_genero) VALUES ?';
                const generoValues = generos.map(id_genero => [id, id_genero]);

                db.query(generoQuery, [generoValues], (error) => {
                    if (error) return res.status(500).send('Error al asignar nuevos géneros a la serie');
                    res.status(200).send('Serie actualizada correctamente con nuevos géneros');
                });
            });
        } else {
            res.status(200).send('Serie actualizada correctamente sin cambios en géneros');
        }
    });
});

// Eliminar un streaming

app.delete('/streaming-list/:id', (req, res) => {
    const { id } = req.params;

    // Eliminar géneros relacionados
    const deleteGenerosQuery = 'DELETE FROM series_generos WHERE id_serie = ?';
    db.query(deleteGenerosQuery, [id], (error) => {
        if (error) return res.status(500).send('Error al eliminar géneros de la serie');

        // Eliminar la serie
        const deleteSerieQuery = 'DELETE FROM series WHERE id_serie = ?';
        db.query(deleteSerieQuery, [id], (error) => {
            if (error) return res.status(500).send('Error al eliminar la serie');
            res.status(200).send('Serie eliminada correctamente');
        });
    });
});


/////////// Series CRUD ///////////

// Listar todas las series disponibles
app.get('/series', (req, res) => {
    const query = 'SELECT * FROM series';
    
    db.query(query, (error, results) => {
        if (error) return res.status(500).send('Error al obtener las series');
        res.status(200).json(results);
    });
});


app.get('/series/:id', (req, res) => {
    const { id } = req.params; // Obtener el id de los parámetros de la URL
    const query = 'SELECT * FROM series WHERE id_serie = ?'; // Consulta con un placeholder

    db.query(query, [id], (error, results) => {
        if (error) return res.status(500).send('Error al obtener la serie');
        
        // Verificar si se encontró una serie con el id proporcionado
        if (results.length === 0) {
            return res.status(404).send('Serie no encontrada');
        }

        res.status(200).json(results[0]); // Enviar el primer resultado como JSON
    });
});


// Crear una nueva serie
app.post('/series', (req, res) => {
    const { nombre, año } = req.body; // Solo se reciben nombre y año

    // Insertar la nueva serie
    const query = 'INSERT INTO series (nombre, año) VALUES (?, ?)';
    db.query(query, [nombre, año], (error, result) => {
        if (error) return res.status(500).send('Error al agregar la serie');

        res.status(201).send('Serie agregada correctamente');
    });
});


// Actualizar una serie existente
app.put('/series/:id', (req, res) => {
    const { id } = req.params;
    const { nombre, año, generos } = req.body;

    // Actualizar la serie
    const query = 'UPDATE series SET nombre = ?, año = ? WHERE id_serie = ?';
    db.query(query, [nombre, año, id], (error) => {
        if (error) return res.status(500).send('Error al actualizar la serie');

        // Eliminar géneros existentes
        const deleteGenresQuery = 'DELETE FROM series_generos WHERE id_serie = ?';
        db.query(deleteGenresQuery, [id], (error) => {
            if (error) return res.status(500).send('Error al eliminar los géneros antiguos');

            // Asignar nuevos géneros
            if (generos && generos.length > 0) {
                const generoQuery = 'INSERT INTO series_generos (id_serie, id_genero) VALUES ?';
                const generoValues = generos.map(id_genero => [id, id_genero]);

                db.query(generoQuery, [generoValues], (error) => {
                    if (error) return res.status(500).send('Error al asignar los nuevos géneros');
                    res.status(200).send('Serie actualizada correctamente');
                });
            } else {
                res.status(200).send('Serie actualizada correctamente sin géneros');
            }
        });
    });
});

// Eliminar una serie
app.delete('/series/:id', (req, res) => {
    const { id } = req.params;

    // Eliminar los géneros asignados a la serie
    const deleteGenresQuery = 'DELETE FROM series_generos WHERE id_serie = ?';
    db.query(deleteGenresQuery, [id], (error) => {
        if (error) return res.status(500).send('Error al eliminar los géneros');

        // Eliminar la serie
        const deleteSeriesQuery = 'DELETE FROM series WHERE id_serie = ?';
        db.query(deleteSeriesQuery, [id], (error) => {
            if (error) return res.status(500).send('Error al eliminar la serie');
            res.status(200).send('Serie eliminada correctamente');
        });
    });
});

/////////// Generos CRUD ///////////

// Listar todos los géneros disponibles
app.get('/generos', (req, res) => {
    const query = 'SELECT * FROM generos';
    
    db.query(query, (error, results) => {
        if (error) return res.status(500).send('Error al obtener los géneros');
        res.status(200).json(results);
    });
});

// Crear un nuevo género
app.post('/generos', (req, res) => {
    const { nombre_genero } = req.body; // Asegúrate de que estás usando 'nombre_genero'

    const query = 'INSERT INTO generos (nombre_genero) VALUES (?)';
    db.query(query, [nombre_genero], (error) => {
        if (error) {
            console.error('Error al agregar el género:', error);
            return res.status(500).send('Error al agregar el género');
        }
        res.status(201).send('Género agregado correctamente');
    });
});



// Actualizar un género existente
app.put('/generos/:id', (req, res) => {
    const { id } = req.params;
    const { nombre_genero } = req.body;

    const query = 'UPDATE generos SET nombre_genero = ? WHERE id_genero = ?';
    db.query(query, [nombre_genero, id], (error) => {
        if (error) return res.status(500).send('Error al actualizar el género');
        res.status(200).send('Género actualizado correctamente');
    });
});

// Eliminar un género
app.delete('/generos/:id', (req, res) => {
    const { id } = req.params;

    const query = 'DELETE FROM generos WHERE id_genero = ?';
    db.query(query, [id], (error) => {
        if (error) return res.status(500).send('Error al eliminar el género');
        res.status(200).send('Género eliminado correctamente');
    });
});

/////////// Inicio del servidor ///////////
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
