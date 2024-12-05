class SeriesForm extends HTMLElement {
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
            }
            .form-container label {
                display: block;
                margin-bottom: 8px;
            }
            .form-container input, .form-container button {
                width: 100%;
                padding: 10px;
                margin-bottom: 10px;
                border-radius: 4px;
                border: 1px solid #ddd;
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
        this.render();
    }

    render = async () => {
        this.container.innerHTML = `
            <div class="form-container">
                <h2>Agregar Nueva Serie</h2>
                <form id="series-form">
                    <label for="nombre">Nombre de la Serie:</label>
                    <input type="text" id="nombre" name="nombre" required>
                    <br>

                    <label for="anio">Año:</label>
                    <input type="number" id="anio" name="anio" required>
                    <br>

                    <button type="submit">Registrar Serie</button>
                </form>
            </div>
        `;

        this.shadowRoot.querySelector('#series-form').addEventListener('submit', this.handleSubmit);
    }

    handleSubmit = async (event) => {
        event.preventDefault();
    
        const nombre = this.shadowRoot.querySelector('#nombre').value;
        const anio = this.shadowRoot.querySelector('#anio').value;
    
        const newSeries = {
            nombre,
            año: anio // Enviar "año" correctamente
        };
    
        try {
            const response = await fetch('http://localhost:8000/series', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newSeries)
            });
    
            if (response.ok) {
                alert('Serie agregada correctamente');
                this.shadowRoot.querySelector('#series-form').reset();
            } else {
                alert('Error al agregar la serie');
            }
        } catch (error) {
            console.log('Error al realizar fetch:', error);
            alert('Hubo un problema con la API');
        }
    }    
}

window.customElements.define('series-form', SeriesForm);
