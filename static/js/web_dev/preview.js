// ==========================================
// MÓDULO DE LIVE PREVIEW (HTML / CSS)
// ==========================================

// Torna a função de renderização global para uso em botões e no scripts.js
window.renderizarLivePreview = function() {
    const htmlCodigo = document.getElementById('live-html-input')?.value || '';
    const cssCodigo = document.getElementById('live-css-input')?.value || '';
    const iframe = document.getElementById('live-preview-frame');

    if (!iframe) return;

    const documentoCompleto = `
        <!DOCTYPE html>
        <html lang="pt-BR">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
                body { font-family: system-ui, -apple-system, sans-serif; padding: 1rem; margin: 0; color: #1e293b; background-color: #ffffff; }
                ${cssCodigo}
            </style>
        </head>
        <body>
            ${htmlCodigo}
        </body>
        </html>
    `;

    // srcdoc é mais eficiente e resiliente contra estouro de limite de caracteres
    iframe.srcdoc = documentoCompleto;
};

// Exporta a abertura em nova aba para o escopo global
window.abrirPreviewNovaAba = function() {
    const htmlCodigo = document.getElementById('live-html-input')?.value || '';
    const cssCodigo = document.getElementById('live-css-input')?.value || '';

    const documentoCompleto = `
        <!DOCTYPE html>
        <html lang="pt-BR">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Preview Real-Time</title>
            <style>
                body { font-family: system-ui, -apple-system, sans-serif; padding: 1rem; margin: 0; color: #1e293b; background-color: #ffffff; }
                ${cssCodigo}
            </style>
        </head>
        <body>
            ${htmlCodigo}
        </body>
        </html>
    `;

    const blob = new Blob([documentoCompleto], { type: 'text/html;charset=utf-8' });
    const urlBlob = URL.createObjectURL(blob);

    const linkTemporario = document.createElement('a');
    linkTemporario.href = urlBlob;
    linkTemporario.target = '_blank';
    linkTemporario.style.display = 'none';

    document.body.appendChild(linkTemporario);
    linkTemporario.click();
    
    setTimeout(() => {
        document.body.removeChild(linkTemporario);
        URL.revokeObjectURL(urlBlob);
    }, 100);
};

// ==========================================
// INICIALIZADOR E ESCUTAS DE EVENTOS (SPA)
// ==========================================

window.inicializarLivePreview = function() {
    const htmlInput = document.getElementById('live-html-input');
    const cssInput = document.getElementById('live-css-input');
    const iframe = document.getElementById('live-preview-frame');

    if (!htmlInput || !iframe) return false;

    // Previne vincular listeners repetidos no mesmo elemento
    if (htmlInput.dataset.previewInicializado === "true") return true;
    htmlInput.dataset.previewInicializado = "true";

    // Define valores padrão se os campos estiverem vazios
    if (!htmlInput.value) {
        htmlInput.value = `<h1>Título de Teste</h1>
<p>Modifique o HTML na esquerda e veja o resultado aqui na direita em tempo real!</p>
<button class="meu-botao">Clique Aqui</button>`;
    }
    
    if (cssInput && !cssInput.value) {
        cssInput.value = `h1 {
  color: #3b82f6;
}

.meu-botao {
  background: #10b981;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
}`;
    }

    // Escutas de digitação
    htmlInput.addEventListener('input', window.renderizarLivePreview);
    if (cssInput) {
        cssInput.addEventListener('input', window.renderizarLivePreview);
    }

    // Primeira renderização
    window.renderizarLivePreview();
    return true;
};

// Auto-Disparo resiliente (F5 / NAVEGAÇÃO SPA)
var executarGatilhoLivePreview = function() {
    if (window.inicializarLivePreview()) return;

    var observerPreview = new MutationObserver(function(_, obs) {
        if (document.getElementById('live-html-input')) {
            window.inicializarLivePreview();
            obs.disconnect();
        }
    });

    observerPreview.observe(document.body, { childList: true, subtree: true });
};

// Dispara na montagem
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    executarGatilhoLivePreview();
} else {
    document.addEventListener('DOMContentLoaded', executarGatilhoLivePreview);
}

// Escuta mudança de rota
window.addEventListener('hashchange', function() {
    const input = document.getElementById('live-html-input');
    if (input) input.dataset.previewInicializado = "false";
    setTimeout(executarGatilhoLivePreview, 50);
});