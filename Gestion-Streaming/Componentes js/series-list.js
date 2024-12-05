class SerieList extends HTMLElement {
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
        this.fetchData(apiURL);
    }

    fetchData = async (url) => {
        try {
            const response = await fetch(url);
            const data = await response.json();
            this.render(data);  // Ahora 'data' debe ser el array de series directamente
        } catch (error) {
            console.log('Error al realizar fetch:', error);
            this.container.innerHTML = `
            <p class="error-alert">Error con la API</p>
            `;
        }
    };

    render = (series) => {
        if (series.length === 0) {
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
                    <th>Nombre</th>
                    <th>Año</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody>
        `;

        series.forEach(serie => {
            tableHTML += `
            <tr>
                <td>${serie.id_serie}</td>
                <td>${serie.nombre}</td>
                <td>${serie.año}</td>
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
        const serieNombre = this.container.querySelector(`button[data-id="${id}"]`).parentElement.parentElement.querySelector('td:nth-child(2)').textContent;
        if (confirm(`¿Estás seguro de eliminar la serie "${serieNombre}"?`)) {
            try {
                const response = await fetch(`${this.getAttribute('api-url')}/series/${id}`, {
                    method: 'DELETE',
                });
                if (response.ok) {
                    alert('Serie eliminada correctamente');
                    this.connectedCallback(); // Refrescar los datos
                } else {
                    alert('Error al eliminar la serie');
                }
            } catch (error) {
                console.error(`Error al eliminar la serie: ${error}`);
            }
        }
    };

    updateSerie = (id) => {
        alert(`Función de actualizar para la serie con ID ${id}`);
        // Aquí podrías redirigir a un formulario o abrir un modal de edición
    };
}

window.customElements.define('series-list', SerieList);
