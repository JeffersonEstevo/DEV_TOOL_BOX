// ==========================================
// MÓDULO DE LIVE PREVIEW (HTML / CSS)
// ==========================================

function renderizarLivePreview() {
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
                body { font-family: sans-serif; padding: 1rem; margin: 0; color: #1e293b; background-color: #ffffff; }
                ${cssCodigo}
            </style>
        </head>
        <body>
            ${htmlCodigo}
        </body>
        </html>
    `;

    iframe.src = "data:text/html;charset=utf-8," + encodeURIComponent(documentoCompleto);
}

function abrirPreviewNovaAba() {
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
                body { font-family: sans-serif; padding: 1rem; margin: 0; color: #1e293b; background-color: #ffffff; }
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
}

// ==========================================
// ESCUTAS DE EVENTOS E INICIALIZAÇÃO IMEDIATA (SPA)
// ==========================================
(() => {
    const htmlInput = document.getElementById('live-html-input');
    const cssInput = document.getElementById('live-css-input');

    if (htmlInput) htmlInput.addEventListener('input', renderizarLivePreview);
    if (cssInput) cssInput.addEventListener('input', renderizarLivePreview);

    // Valores iniciais padrão com quebras de linha reais (usando crases)
    if (htmlInput && !htmlInput.value) {
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

    setTimeout(renderizarLivePreview, 50);
})();