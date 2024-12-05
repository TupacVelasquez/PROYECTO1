class CustomMenu extends HTMLElement {
    constructor() {
        super();

        this.shadow = this.attachShadow({ mode: 'open' });

        this.styleElement = document.createElement('style');
        this.styleElement.textContent = `
            .menu-container {
                display: flex;
                background-color: black;
                color: white;
                padding: 0;
            }

            .menu-container ul {
                display: flex;
                padding: 0;
                margin: 0;
                list-style-type: none;
            }

            .menu-container li {
                padding: 1rem;
                cursor: pointer;
            }

            .menu-container li:hover {
                background-color: #b42424;
                color: black;
            }

            .logo {
                margin-right: 1rem;
                height: 50px; /* Ajusta el tamaño del logo */
            }
        `;

        // Contenedor principal
        this.menuContainer = document.createElement('div');
        this.menuContainer.classList.add('menu-container');

        // Imagen del logo
        this.img = document.createElement('img');
        this.img.src = 'https://www.espe.edu.ec/wp-content/uploads/2023/03/espe.png';
        this.img.alt = 'Logo de la ESPE';
        this.img.classList.add('logo');
        this.menuContainer.appendChild(this.img);

        // Opciones del menú
        this.menuOptions = [
            { title: "INICIO", link: "index.html" },
            { title: "STREAMING", link: "streaming.html" },
            { title: "SERIES", link: "series.html" },
            { title: "GÉNEROS", link: "generos.html" },
            { title: "ACERCA DE", link: "acercade.html" },

        ];

        // Crear lista de menú
        this.ul = document.createElement('ul');
        this.menuOptions.forEach(option => {
            const item = document.createElement('li');
            item.textContent = option.title;

            // Agregar evento click para redirigir
            item.addEventListener('click', () => {
                window.location.href = option.link;
            });

            this.ul.appendChild(item);
        });

        this.menuContainer.appendChild(this.ul);

        // Adjuntar estilos y contenido al Shadow DOM
        this.shadow.appendChild(this.styleElement);
        this.shadow.appendChild(this.menuContainer);
    }
}

// Definir el componente personalizado
window.customElements.define('mi-menu', CustomMenu);
