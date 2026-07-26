// ==========================================
// MÓDULO DE LIVE PREVIEW (HTML / CSS / JS)
// ==========================================

window.renderizarLivePreview = function() {
    const htmlCodigo = document.getElementById('live-html-input')?.value || '';
    const cssCodigo = document.getElementById('live-css-input')?.value || '';
    const jsCodigo = document.getElementById('live-js-input')?.value || '';
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
            <script>
                // Aguarda o DOM interno do iframe carregar para evitar erros de elemento nulo
                document.addEventListener("DOMContentLoaded", () => {
                    try {
                        ${jsCodigo}
                    } catch (erro) {
                        console.error("Erro no script do usuário: ", erro);
                    }
                });
                // Caso o DOM já tenha disparado
                if (document.readyState === "complete" || document.readyState === "interactive") {
                    try {
                        ${jsCodigo}
                    } catch (erro) {
                        console.error("Erro no script do usuário: ", erro);
                    }
                }
            </script>
        </body>
        </html>
    `;

    iframe.srcdoc = documentoCompleto;
};

// Exporta a abertura em nova aba para o escopo global
window.abrirPreviewNovaAba = function() {
    const htmlCodigo = document.getElementById('live-html-input')?.value || '';
    const cssCodigo = document.getElementById('live-css-input')?.value || '';
    const jsCodigo = document.getElementById('live-js-input')?.value || '';

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
            <script>
                try {
                    ${jsCodigo}
                } catch (erro) {
                    console.error("Erro no script do usuário: ", erro);
                }
            </script>
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
    const jsInput = document.getElementById('live-js-input');
    const iframe = document.getElementById('live-preview-frame');

    if (!htmlInput || !iframe) return false;

    if (htmlInput.dataset.previewInicializado === "true") return true;
    htmlInput.dataset.previewInicializado = "true";

    // Valores padrão iniciais (opcional)
    if (!htmlInput.value) {
        htmlInput.value = `<h1>Título de Teste</h1>\n<p id="texto">Modifique o código e veja a mágica acontecer!</p>\n<button id="meu-botao" class="meu-botao">Clique Aqui</button>`;
    }
    
    if (cssInput && !cssInput.value) {
        cssInput.value = `h1 { color: #3b82f6; }\n.meu-botao {\n  background: #10b981;\n  color: white;\n  border: none;\n  padding: 0.5rem 1rem;\n  border-radius: 4px;\n  cursor: pointer;\n}`;
    }

    if (jsInput && !jsInput.value) {
        jsInput.value = `document.getElementById('meu-botao').addEventListener('click', () => {
        alert('Botão clicado via JavaScript!');
        });

        // Cria um elemento de parágrafo dinamicamente
        const novoParagrafo = document.createElement('p');
        novoParagrafo.textContent = 'Este texto foi gerado dinamicamente via JavaScript!';
        novoParagrafo.style.color = '#7c3aed';
        novoParagrafo.style.fontWeight = 'bold';

        // Adiciona o elemento criado no final do body do preview
        document.body.appendChild(novoParagrafo);`;
    }

    // Escutas de digitação para os três campos
    htmlInput.addEventListener('input', window.renderizarLivePreview);
    if (cssInput) cssInput.addEventListener('input', window.renderizarLivePreview);
    if (jsInput) jsInput.addEventListener('input', window.renderizarLivePreview);

    window.renderizarLivePreview();
    return true;
};

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

if (document.readyState === 'complete' || document.readyState === 'interactive') {
    executarGatilhoLivePreview();
} else {
    document.addEventListener('DOMContentLoaded', executarGatilhoLivePreview);
}

window.addEventListener('hashchange', function() {
    const input = document.getElementById('live-html-input');
    if (input) input.dataset.previewInicializado = "false";
    setTimeout(executarGatilhoLivePreview, 50);
});