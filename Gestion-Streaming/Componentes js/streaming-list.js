class StreamingList extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.container = document.createElement('div');
        this.estilo = document.createElement('style');
        this.estilo.textContent = `
            .error-alert {
                color: red;
                font-size: 1.5rem;
                text-align: center;
            }
            table {
                width: 100%;
                border-collapse: collapse;
                margin-top: 1rem;
            }
            th, td {
                border: 1px solid #ddd;
                padding: 8px;
                text-align: left;
            }
            th {
                background-color: #f4f4f4;
            }
            button {
                margin-right: 5px;
                padding: 5px 10px;
                cursor: pointer;
            }
        `;
        this.shadowRoot.appendChild(this.estilo);
        this.shadowRoot.appendChild(this.container);
    }

    connectedCallback() {
        const apiURL = this.getAttribute('api-url');
        if (apiURL) {
            this.fetchData(apiURL);
        } else {
            this.container.innerHTML = `<p class="error-alert">Falta la URL de la API</p>`;
        }
    }

    fetchData = async (url) => {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Error al cargar los datos');
            }
            const data = await response.json();
            console.log(data);  // Muestra los datos de la API para ver la estructura
            this.render(data);
        } catch (error) {
            console.error(`Error al realizar fetch: ${error}`);
            this.container.innerHTML = `
                <p class="error-alert">Error con la API: ${error.message}</p>
            `;
        }
    };

    render = (series) => {
        if (!series.length) {
            this.container.innerHTML = `
                <p class="error-alert">No existen series registradas</p>
            `;
            return;
        }
    
        let tableHTML = `
            <table>
                <thead>
                    <tr>
                        <th>ID Serie</th>
                        <th>Nombre Serie</th>
                        <th>Año</th>
                        <th>Géneros</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
        `;
    
        series.forEach((serie) => {
            // Verificar si los géneros existen y son un array
            console.log('Géneros de serie:', serie.generos);  // Ver el contenido de generos
    
            const generos = (Array.isArray(serie.generos) && serie.generos.length > 0)
            ? serie.generos.join(', ')  // Unir géneros con coma
            : 'Sin géneros';  // Si el array está vacío o no es un array

    
            tableHTML += `
                <tr>
                    <td>${serie.id_serie}</td>
                    <td>${serie.nombre}</td>
                    <td>${serie.año}</td>
                    <td>${generos}</td>
                    <td>
                        <button class="btn-update" data-id="${serie.id_serie}">Actualizar</button>
                        <button class="btn-delete" data-id="${serie.id_serie}">Eliminar</button>
                    </td>
                </tr>
            `;
        });
    
        tableHTML += `
                </tbody>
            </table>
        `;
    
        this.container.innerHTML = tableHTML;
    
        // Botones de eliminar y actualizar
        this.container.querySelectorAll('.btn-delete').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.target.getAttribute('data-id');
                this.deleteSerie(id);
            });
        });
    
        this.container.querySelectorAll('.btn-update').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.target.getAttribute('data-id');
                this.updateSerie(id);
            });
        });
    };
    

    deleteSerie = async (id) => {
        if (confirm('¿Estás seguro de eliminar esta serie?')) {
            try {
                const response = await fetch(`${this.getAttribute('api-url')}/${id}`, {
                    method: 'DELETE',
                });
                if (response.ok) {
                    alert('Serie eliminada correctamente');
                    this.connectedCallback(); // Refrescar datos
                } else {
                    alert('Error al eliminar la serie');
                }
            } catch (error) {
                console.error(`Error al eliminar serie: ${error}`);
                alert('Hubo un problema al eliminar la serie.');
            }
        }
    };

    updateSerie = async (id) => {
        console.log('Intentando cargar la serie con ID:', id);
    
        try {
            const response = await fetch(`${this.getAttribute('api-url')}/${id}`);
            if (!response.ok) throw new Error(`Error al obtener los datos de la serie: ${response.statusText}`);
    
            const serie = await response.json();
            console.log('Datos de la serie:', serie);
    
            let formElement = document.querySelector('streaming-form');
            if (!formElement) {
                formElement = document.createElement('streaming-form');
                document.body.appendChild(formElement);
            }
    
            formElement.setAttribute('api-url', this.getAttribute('api-url'));
            formElement.setEditMode(serie);
        } catch (error) {
            console.error(`Error al cargar los datos de la serie: ${error.message}`);
            alert('Hubo un problema al cargar los datos de la serie.');
        }
    };
    
    
    
}

window.customElements.define('streaming-list', StreamingList);
