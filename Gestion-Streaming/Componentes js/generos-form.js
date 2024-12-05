class GeneroForm extends HTMLElement {
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

    render = () => {
        this.container.innerHTML = `
            <div class="form-container">
                <h2>Agregar Nuevo Género</h2>
                <form id="genero-form">
                    <label for="nombre_genero">Nombre del Género:</label>
                    <input type="text" id="nombre_genero" name="nombre_genero" required>
                    <br>

                    <button type="submit">Registrar Género</button>
                </form>
            </div>
        `;

        this.shadowRoot.querySelector('#genero-form').addEventListener('submit', this.handleSubmit);
    }

    handleSubmit = async (event) => {
        event.preventDefault();

        const nombre_genero = this.shadowRoot.querySelector('#nombre_genero').value;

        const newGenero = {
            nombre_genero
        };

        try {
            const response = await fetch('http://localhost:8000/generos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newGenero)
            });

            if (response.ok) {
                alert('Género agregado correctamente');
                this.shadowRoot.querySelector('#genero-form').reset();
            } else {
                alert('Error al agregar el género');
            }
        } catch (error) {
            console.log('Error al realizar fetch:', error);
            alert('Hubo un problema con la API');
        }
    }
}

window.customElements.define('generos-form', GeneroForm);
