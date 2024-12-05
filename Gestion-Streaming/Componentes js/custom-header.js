class HeaderComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.shadowRoot.innerHTML = `
      <style>
        /* Estilos del contenedor del header */
        header {
        background: linear-gradient(135deg, 
            rgba(44, 62, 80, 1) 0%, 
            rgba(52, 152, 219, 1) 25%, 
            rgba(41, 128, 185, 1) 50%, 
            rgba(26, 188, 156, 1) 75%, 
            rgba(46, 204, 113, 1) 100%);
          color: white; 
          padding: 20px;
          text-align: center; 
        }

        h1 {
          font-size: 2.5em; /* Aumenta el tamaño del título */
          margin: 0;
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5); /* Sombra para mejorar la visibilidad del texto */
        }
      </style>
      <header>
        <h1>Mi Aplicación Web</h1>
      </header>
    `;
  }
}

window.customElements.define('custom-header', HeaderComponent);
