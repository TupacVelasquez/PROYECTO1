class StreamingForm extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.container = document.createElement('div');
        this.estilo = document.createElement('style');
        this.estilo.textContent = `
            .form-container {
                max-width: 500px;
                margin: 0 auto;
                padding: 20px;
                border: 1px solid #ddd;
                border-radius: 8px;
                background-color: #f9f9f9;
                font-family: Arial, sans-serif;
            }
            .form-container label {
                display: block;
                margin-bottom: 8px;
                font-weight: bold;
            }
            .form-container input, .form-container button {
                width: 100%;
                padding: 10px;
                margin-bottom: 10px;
                border-radius: 4px;
                border: 1px solid #ddd;
            }
            .form-container .checkbox-group {
                margin-bottom: 10px;
            }
            .form-container .checkbox-group label {
                display: inline-block;
                margin-right: 10px;
                font-weight: normal;
            }
            .form-container button {
                background-color: #4CAF50;
                color: white;
                cursor: pointer;
            }
            .form-container button:hover {
                background-color: #45a049;
            }
        `;
        this.shadowRoot.appendChild(this.estilo);
        this.shadowRoot.appendChild(this.container);
    }

    connectedCallback() {
        this.renderCreateForm();
    }

    renderCreateForm = async () => {
        const generos = await this.fetchGeneros();

        let generosHtml = '';
        generos.forEach((genero) => {
            generosHtml += `
                <label>
                    <input type="checkbox" name="generos" value="${genero.id_genero}"> ${genero.nombre_genero}
                </label>
            `;
        });

        this.container.innerHTML = `
            <div class="form-container">
                <h2>Agregar Nuevo Streaming</h2>
                <form id="streaming-form">
                    <label for="nombre">Nombre de la Serie:</label>
                    <input type="text" id="nombre" name="nombre" required>

                    <label for="anio">Año:</label>
                    <input type="number" id="anio" name="anio" required>

                    <label>Géneros:</label>
                    <div class="checkbox-group" id="checkbox-group">
                        ${generosHtml}
                    </div>

                    <button type="submit">Registrar Streaming</button>
                </form>
            </div>
        `;

        this.shadowRoot.querySelector('#streaming-form').addEventListener('submit', this.handleSubmit);
    }

    fetchGeneros = async () => {
        try {
            const response = await fetch('http://localhost:8000/generos');
            if (!response.ok) throw new Error('Error al obtener los géneros');
            return await response.json();
        } catch (error) {
            console.error(error);
            alert('Hubo un problema al cargar los géneros');
            return [];
        }
    }

    handleSubmit = async (event) => {
        event.preventDefault();

        const nombre = this.shadowRoot.querySelector('#nombre').value;
        const anio = this.shadowRoot.querySelector('#anio').value;

        const generos = [];
        const checkboxes = this.shadowRoot.querySelectorAll('input[name="generos"]:checked');
        checkboxes.forEach((checkbox) => {
            generos.push(checkbox.value);
        });

        const newStreaming = { nombre, año: anio, generos };

        try {
            const response = await fetch('http://localhost:8000/streaming-list', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newStreaming)
            });

            if (response.ok) {
                alert('Streaming agregado correctamente');
                this.shadowRoot.querySelector('#streaming-form').reset();
            } else {
                alert('Error al agregar el streaming');
            }
        } catch (error) {
            console.error('Error al realizar fetch:', error);
            alert('Hubo un problema con la API');
        }
    }
}

window.customElements.define('streaming-form', StreamingForm);
