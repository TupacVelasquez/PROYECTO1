class Perfil extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
  
      this.container = document.createElement('div');
      this.container.classList.add('perfil-usuario');
  
      this.estilo = document.createElement('style');
      this.estilo.textContent = `
        .perfil-usuario {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 20px;
          border: 1px solid #e0e0e0;
          border-radius: 15px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          max-width: 250px;
          margin: 20px auto;
          background-color: #fff;
          font-family: 'Arial', sans-serif;
          color: #333;
        }
  
        .profile-pic {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          margin-bottom: 15px;
          border: 2px solid #4CAF50;
        }
  
        .username {
          font-size: 18px;
          font-weight: bold;
          margin-bottom: 8px;
        }
  
        .bio {
          font-size: 14px;
          color: #555;
          margin-bottom: 20px;
          text-align: center;
        }
  
        .follow-button, .message-button {
          background-color: #4CAF50;
          color: white;
          padding: 10px 20px;
          border: none;
          border-radius: 25px;
          font-size: 14px;
          cursor: pointer;
          margin: 5px 0;
          transition: background-color 0.3s ease;
        }
  
        .follow-button:hover, .message-button:hover {
          background-color: #45a049;
        }
  
        .message-button {
          background-color: #007BFF;
        }
  
        .message-button:hover {
          background-color: #0069D9;
        }
      `;
  
      this.shadowRoot.appendChild(this.estilo);
      this.shadowRoot.appendChild(this.container);
    }
  
    connectedCallback() {
      this.render();
    }
  
    render = () => {
      const profilePic = this.getAttribute('profile-pic') || 'https://randomuser.me/api/portraits/men/75.jpg';
      const username = this.getAttribute('username') || 'Tupac Velaquez';
      const bio = this.getAttribute('bio') || 'Apasionado por la tecnología y el desarrollo web.';
  
      this.shadowRoot.querySelector('.perfil-usuario').innerHTML = `
        <img src="${profilePic}" alt="Foto de perfil" class="profile-pic" />
        <div class="username">${username}</div>
        <div class="bio">${bio}</div>
        <button class="follow-button">Seguir</button>
        <button class="message-button">Mensaje</button>
      `;
    };
  }
  
  window.customElements.define('custom-profile', Perfil);
  