class GenerosList extends HTMLElement {
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

    render = (generos) => {
        if (!generos.length) {
            this.container.innerHTML = `
                <p class="error-alert">No existen géneros registrados</p>
            `;
            return;
        }
    
        let tableHTML = `
            <table>
                <thead>
                    <tr>
                        <th>ID Género</th>
                        <th>Nombre Género</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
        `;
    
        generos.forEach((genero) => {
            tableHTML += `
                <tr>
                    <td>${genero.id_genero}</td>
                    <td>${genero.nombre_genero}</td> <!-- Cambié de nombre a nombre_genero -->
                    <td>
                        <button class="btn-update" data-id="${genero.id_genero}">Actualizar</button>
                        <button class="btn-delete" data-id="${genero.id_genero}">Eliminar</button>
                    </td>
                </tr>
            `;
        });
    
        tableHTML += `
                </tbody>
            </table>
        `;
    
        this.container.innerHTML = tableHTML;
    
        // Agregar eventos para eliminar o actualizar
        this.container.querySelectorAll('.btn-delete').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.target.getAttribute('data-id');
                this.deleteGenero(id);
            });
        });
    
        this.container.querySelectorAll('.btn-update').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.target.getAttribute('data-id');
                this.updateGenero(id);
            });
        });
    };
    
    deleteGenero = async (id) => {
        if (confirm('¿Estás seguro de eliminar este género?')) {
            try {
                const response = await fetch(`${this.getAttribute('api-url')}/${id}`, {
                    method: 'DELETE',
                });
                if (response.ok) {
                    alert('Género eliminado correctamente');
                    this.connectedCallback(); // Refrescar datos
                } else {
                    alert('Error al eliminar el género');
                }
            } catch (error) {
                console.error(`Error al eliminar género: ${error}`);
                alert('Hubo un problema al eliminar el género.');
            }
        }
    };

    updateGenero = (id) => {
        alert(`Función de actualizar para el género con ID ${id}`);
        // Llama a editGenero que maneja la edición en el formulario
        document.querySelector('generos-form').editGenero(id); 
    };
    
    
}

window.customElements.define('generos-list', GenerosList);
