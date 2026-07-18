// ==========================================
// MÓDULO E CONTROLE DE TIPOGRAFIA (FONTS)
// ==========================================

function atualizarFontePreview(nomeFonte) {
    if (!nomeFonte) return;

    // 1. Identificar o fallback genérico baseado no nome selecionado
    let fallback = "sans-serif";
    const nomeMinusculo = nomeFonte.toLowerCase();
    
    if (["playfair display", "merriweather", "lora", "cinzel"].some(f => nomeMinusculo.includes(f))) {
        fallback = "serif";
    } else if (["fira code", "source code pro", "inconsolata"].some(f => nomeMinusculo.includes(f))) {
        fallback = "monospace";
    } else if (["pacifico", "dancing script"].some(f => nomeMinusculo.includes(f))) {
        fallback = "cursive";
    }

    // 2. Formata a URL de Requisição para o Google Fonts API
    const nomeUrl = nomeFonte.replace(/ /g, "+");
    const idLinkElemento = `link-google-font-${nomeUrl.toLowerCase()}`;
    
    // Injeta a tag <link> no cabeçalho se ela ainda não foi carregada nesta sessão da SPA
    if (!document.getElementById(idLinkElemento)) {
        const novoLink = document.createElement('link');
        novoLink.id = idLinkElemento;
        novoLink.rel = 'stylesheet';
        novoLink.href = `https://fonts.googleapis.com/css2?family=${nomeUrl}:wght@300;400;700&display=swap`;
        novoLink.className = 'link-fonte-dinamica-spa';
        document.head.appendChild(novoLink);
    }

    // 3. Aplica a nova família tipográfica nos elementos alvo da simulação
    const elementosAlvo = document.querySelectorAll('.alvo-fonte');
    elementosAlvo.forEach(elemento => {
        elemento.style.fontFamily = `"${nomeFonte}", ${fallback}`;
    });

    // 4. Gera as strings de código prontas para as áreas de cópia
    const caixaLinkHtml = document.getElementById('codigo-html-link');
    const caixaCssRule = document.getElementById('codigo-css-rule');

    if (caixaLinkHtml) {
        caixaLinkHtml.value = `<link rel="preconnect" href="https://fonts.googleapis.com">\n<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n<link href="https://fonts.googleapis.com/css2?family=${nomeUrl}:wght@400;700&display=swap" rel="stylesheet">`;
    }

    if (caixaCssRule) {
        caixaCssRule.value = `font-family: '${nomeFonte}', ${fallback};`;
    }
}

// Alterna os textos exibidos dinamicamente caso o usuário escreva uma frase customizada
function aplicarTextoCustomizado(texto) {
    const titulosH = document.querySelectorAll('#container-preview-tipografia h1, #container-preview-tipografia h2, #container-preview-tipografia h3, #container-preview-tipografia h4');
    
    titulosH.forEach(h => {
        if (texto.trim() !== "") {
            // Mantém a identificação da tag concatenada à frase
            const tagId = h.tagName;
            h.textContent = `${tagId} - ${texto}`;
        } else {
            // Reseta para as labels padrões
            if (h.tagName === 'H1') h.textContent = "Título Principal H1";
            if (h.tagName === 'H2') h.textContent = "Subtítulo Estrutural H2";
            if (h.tagName === 'H3') h.textContent = "Título de Seção H3";
            if (h.tagName === 'H4') h.textContent = "Subseção Menor H4";
        }
    });
}

// ==========================================
// ESCUTAS DE EVENTOS E INICIALIZAÇÃO IMEDIATA (SPA)
// ==========================================
(() => {
    const seletorFont = document.getElementById('seletor-google-font');
    const inputTexto = document.getElementById('texto-customizado-fonte');
    const botoesCopiar = document.querySelectorAll('.btn-copiar-codigo-fonte');

    if (seletorFont) {
        seletorFont.addEventListener('change', (e) => {
            atualizarFontePreview(e.target.value);
        });
    }

    if (inputTexto) {
        inputTexto.addEventListener('input', (e) => {
            aplicarTextoCustomizado(e.target.value);
        });
    }

    // Gerenciador de cópia unificado para os botões da ferramenta
    botoesCopiar.forEach(botao => {
        botao.addEventListener('click', () => {
            const idAlvo = botao.getAttribute('data-alvo');
            const elementoTexto = document.getElementById(idAlvo);
            
            if (elementoTexto) {
                navigator.clipboard.writeText(elementoTexto.value).then(() => {
                    const textoOriginal = botao.textContent;
                    botao.textContent = "Copiado!";
                    botao.style.color = "#2ECC71";
                    
                    setTimeout(() => {
                        botao.textContent = textoOriginal;
                        botao.style.color = "var(--primary-color)";
                    }, 1200);
                }).catch(err => {
                    console.error('Falha ao copiar código da fonte:', err);
                });
            }
        });
    });

    // Inicializa carregando a primeira opção da lista imediatamente (Roboto)
    if (seletorFont) {
        atualizarFontePreview(seletorFont.value);
    }
})();