class WelcomeMessage extends HTMLElement {
    constructor() {
        super();

        // Adjuntar Shadow DOM
        this.attachShadow({ mode: 'open' });

        // Crear estilos para el mensaje de bienvenida
        const styles = document.createElement('style');
        styles.textContent = `
            .welcome-container {
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100vh; /* Ocupa toda la altura de la ventana */
                text-align: center;
                background-image: url('https://wallpapers.com/images/hd/abstract-futuristic-technology-logo-pmi2ff5h1zbp7klo.jpg'); /* URL de la imagen de fondo */
                background-size: cover; /* Asegura que la imagen cubra todo el fondo */
                background-position: center; /* Centra la imagen de fondo */
                background-repeat: no-repeat; /* Evita que la imagen se repita */
            }

            .welcome-message {
                font-size: 2.5rem; /* Tamaño grande del texto */
                color: #333; /* Color del texto */
                font-family: 'Arial', sans-serif;
                padding: 1rem;
                border: 2px solid #b42424; /* Borde alrededor del texto */
                border-radius: 10px; /* Bordes redondeados */
                background-color: rgba(255, 255, 255, 0.9); /* Fondo blanco semitransparente */
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); /* Sombra */
            }
        `;

        // Crear el contenedor principal
        const container = document.createElement('div');
        container.classList.add('welcome-container');

        // Crear el mensaje de bienvenida
        const message = document.createElement('div');
        message.classList.add('welcome-message');
        message.textContent = '¡Bienvenido a mi página web!';

        // Añadir elementos al Shadow DOM
        container.appendChild(message);
        this.shadowRoot.appendChild(styles);
        this.shadowRoot.appendChild(container);
    }
}

// Registrar el componente
window.customElements.define('custom-main', WelcomeMessage);
