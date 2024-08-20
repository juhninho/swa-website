// main.js

// Verifica se o DOM está carregado e pronto
document.addEventListener('DOMContentLoaded', function() {
    // Código para inicializar o conteúdo do site

    // Exemplo: Manipulação do DOM
    const rootElement = document.getElementById('root');
    if (rootElement) {
        rootElement.innerHTML = `
            <h1>Bem-vindo à SWA International</h1>
            <p>Aprenda um novo idioma, expanda seu Networking, conheça pessoas de todas as partes do mundo e viva um verdadeiro intercâmbio cultural de nível mundial.</p>
            <button id="ctaButton">Saiba Mais</button>
        `;
    }

    // Exemplo: Evento de clique para o botão
    const ctaButton = document.getElementById('ctaButton');
    if (ctaButton) {
        ctaButton.addEventListener('click', function() {
            alert('Obrigado por se interessar! Em breve entraremos em contato.');
        });
    }

    // Inicializar outros componentes ou plugins, se necessário
    // ...
});

// Exemplo: Código para inicializar outros scripts
function initializeThirdPartyScripts() {
    // Código para Google Analytics, Facebook Pixel, etc.
    // Este código já está sendo tratado no HTML, mas pode ser complementado aqui se necessário
    console.log('Third-party scripts initialized.');
}

// Chama a função de inicialização
initializeThirdPartyScripts();// JavaScript Document