class CustomFooter extends HTMLElement {
    constructor() {
        super();

        // Crear Shadow DOM
        this.shadow = this.attachShadow({ mode: 'open' });

        // Crear template
        const template = document.createElement('template');
        template.innerHTML = `
            <style>
                /* Asegurar que el footer siempre esté al final de la página */
                .footer-container {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    background: linear-gradient(135deg, #2c3e50, #34495e);
                    color: white;
                    padding: 1rem;
                }

                /* Diseño de íconos de redes sociales */
                .footer-container .social-icons {
                    display: flex;
                    gap: 1rem;
                }

                .footer-container .social-icons a {
                    color: white;
                    text-decoration: none;
                    font-size: 1.2rem;
                }

                .footer-container .social-icons a:hover {
                    color: #b42424;
                }

                /* Diseño del logo */
                .footer-container .logo {
                    height: 40px; /* Tamaño del logo */
                }

                .footer-container p {
                    margin: 0;
                }
            </style>
            <div class="footer-container">
                <div>
                    <img src="https://www.espe.edu.ec/wp-content/uploads/2023/03/espe.png" alt="Logo de la ESPE" class="logo">
                </div>
                <div>
                    <p>© 2024 ESPE - Todos los derechos reservados</p>
                </div>
                <div class="social-icons">
                    <a href="https://www.facebook.com/" target="_blank">Facebook</a>
                    <a href="https://www.twitter.com/" target="_blank">Twitter</a>
                    <a href="https://www.instagram.com/" target="_blank">Instagram</a>
                </div>
            </div>
        `;

        // Adjuntar template al Shadow DOM
        this.shadow.appendChild(template.content.cloneNode(true));
    }
}

// Definir el componente personalizado
window.customElements.define('custom-footer', CustomFooter);
