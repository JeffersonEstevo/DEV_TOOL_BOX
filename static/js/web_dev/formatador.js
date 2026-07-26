// ==========================================
// MÓDULO FORMATADOR E EMBELEZADOR DE CÓDIGO (COM LAZY LOADING DE CDNs)
// ==========================================

// Controle de CDNs já injetadas na página para evitar duplicidade
var cdnsCarregadas = {};

function carregarScriptCDN(url) {
    return new Promise((resolve, reject) => {
        if (cdnsCarregadas[url]) {
            resolve();
            return;
        }
        const script = document.createElement('script');
        script.src = url;
        script.async = true;
        script.onload = () => {
            cdnsCarregadas[url] = true;
            resolve();
        };
        script.onerror = () => reject(new Error(`Falha ao carregar CDN: ${url}`));
        document.head.appendChild(script);
    });
}

// Configuração modular e expansível para o futuro
var LANGUAGES_CONFIG = {
    "javascript": {
        nome: "JavaScript",
        placeholder: "function teste(){let x=10;console.log(x);}",
        cdn: "https://cdnjs.cloudflare.com/ajax/libs/js-beautify/1.14.7/beautify.min.js",
        formatar: async (codigo) => {
            await carregarScriptCDN(LANGUAGES_CONFIG["javascript"].cdn);
            // js_beautify já trata erros e formata perfeitamente
            return js_beautify(codigo, { indent_size: 2, space_in_empty_paren: false });
        }
    },
    "html": {
        nome: "HTML / Django Template",
        placeholder: "<div>\n<h1>Hello</h1><p>Mundo</p>\n</div>",
        cdn: "https://cdnjs.cloudflare.com/ajax/libs/js-beautify/1.14.7/beautify-html.min.js",
        formatar: async (codigo) => {
            await carregarScriptCDN(LANGUAGES_CONFIG["html"].cdn);
            
            // 1. Validação estrita usando o DOMParser nativo do navegador
            const parser = new DOMParser();
            const doc = parser.parseFromString(codigo, 'text/html');
            const parserError = doc.querySelector('parsererror');
            
            if (parserError) {
                // Se o navegador detectou erro estrutural (tags faltando, mal formadas, etc.)
                throw new Error("Erro de Sintaxe HTML: Detectada tag sem fechamento ou estrutura inválida.");
            }

            // 2. Se estiver tudo certo, formata normalmente
            return html_beautify(codigo, { indent_size: 2, unformatted: ['code', 'pre'] });
        }
    },
    "css": {
        nome: "CSS",
        placeholder: "body{margin:0;padding:0;} h1{color:blue;}",
        cdn: "https://cdnjs.cloudflare.com/ajax/libs/js-beautify/1.14.7/beautify-css.min.js",
        formatar: async (codigo) => {
            await carregarScriptCDN(LANGUAGES_CONFIG["css"].cdn);
            return css_beautify(codigo, { indent_size: 2 });
        }
    },
    "json": {
        nome: "JSON",
        placeholder: '{"nome":"Teste","ativo":true,"valores":[1,2,3]}',
        cdn: null, // JSON nativo do JS não precisa de CDN!
        formatar: async (codigo) => {
            // Validação nativa rigorosa de JSON (pega chaves, aspas e vírgulas erradas)
            const objetoJogado = JSON.parse(codigo);
            return JSON.stringify(objetoJogado, null, 2);
        }
    }
};

// Armazena o código limpo gerado para facilitar a cópia exata
var codigoFormatadoGlobal = "";

// --- RENDERIZADOR VS CODE STYLE ---

window.processarEExibirCodigo = async function() {
    const input = document.getElementById('formatador-input');
    const seletor = document.getElementById('seletor-linguagem-formatador');
    const containerSaida = document.getElementById('vscode-output-linhas');
    
    if (!input || !seletor || !containerSaida) return;
    
    const linguagemSelecionada = seletor.value;
    const codigoCru = input.value;
    
    if (!codigoCru.trim()) {
        containerSaida.innerHTML = `<div style="color: #6a9955; padding: 0 1rem; font-style: italic;">Por favor, digite ou cole um código antes de formatar.</div>`;
        return;
    }

    const configLinguagem = LANGUAGES_CONFIG[linguagemSelecionada];
    if (!configLinguagem) return;

    // Feedback visual elegante de carregamento/processamento
    containerSaida.innerHTML = `<div style="color: #dcdcaa; padding: 0 1rem; font-style: italic;">Carregando parser e formatando...</div>`;

    try {
        // Executa a formatação (baixa a CDN assincronamente se for a primeira vez)
        codigoFormatadoGlobal = await configLinguagem.formatar(codigoCru);
        
        containerSaida.innerHTML = '';
        const linhasTexto = codigoFormatadoGlobal.split('\n');
        const fragment = document.createDocumentFragment();

        linhasTexto.forEach((textoLinha, index) => {
            const divLinha = document.createElement('div');
            divLinha.style.display = 'flex';
            divLinha.style.alignItems = 'flex-start';
            divLinha.style.padding = '0 0.5rem';
            
            const spanNumero = document.createElement('span');
            spanNumero.textContent = index + 1;
            spanNumero.style.width = '35px';
            spanNumero.style.color = '#858585';
            spanNumero.style.textAlign = 'right';
            spanNumero.style.paddingRight = '12px';
            spanNumero.style.userSelect = 'none';
            spanNumero.style.display = 'inline-block';
            
            const codeTexto = document.createElement('code');
            codeTexto.style.flex = '1';
            codeTexto.style.color = '#d4d4d4';
            codeTexto.style.whiteSpace = 'pre';

            let htmlEscapado = (textoLinha || ' ')
                .replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;");

            // Realce de sintaxe básico adaptado para VS Code Dark
            if (linguagemSelecionada === 'html') {
                htmlEscapado = htmlEscapado.replace(/(&lt;\/?[a-zA-Z1-6!].*?&gt;)/g, '§AZUL§$1§FIM§');
                htmlEscapado = htmlEscapado.replace(/(&quot;[^&]*&quot;|"[^"]*")/g, '§LARANJA§$1§FIM§');
            } else if (linguagemSelecionada === 'css') {
                htmlEscapado = htmlEscapado.replace(/([a-zA-Z-]+)(?=\s*:)/g, '§AZULCLARO§$1§FIM§');
                htmlEscapado = htmlEscapado.replace(/(#[a-zA-Z0-9]+|\d+px|\d+rem)/g, '§VERDE§$1§FIM§');
            } else if (linguagemSelecionada === 'javascript') {
                htmlEscapado = htmlEscapado.replace(/\b(function|return|if|else|let|const|var|for|while)\b/g, '§ROXO§$1§FIM§');
                htmlEscapado = htmlEscapado.replace(/(&quot;[^&]*&quot;|['"][^'"]*['"])/g, '§LARANJA§$1§FIM§');
            }

            htmlEscapado = htmlEscapado
                .replace(/§AZUL§/g, '<span style="color: #569cd6;">')
                .replace(/§LARANJA§/g, '<span style="color: #ce9178;">')
                .replace(/§AZULCLARO§/g, '<span style="color: #9cdcfe;">')
                .replace(/§VERDE§/g, '<span style="color: #b5cea8;">')
                .replace(/§ROXO§/g, '<span style="color: #c586c0;">')
                .replace(/§FIM§/g, '</span>');

            codeTexto.innerHTML = htmlEscapado;

            divLinha.appendChild(spanNumero);
            divLinha.appendChild(codeTexto);
            fragment.appendChild(divLinha);
        });

        containerSaida.appendChild(fragment);

    } catch (erro) {
        // Exibe o erro exato na tela (ex: se faltou uma chave no JSON ou JS)
        containerSaida.innerHTML = `
            <div style="padding: 1rem; color: #f44545; font-family: monospace;">
                <strong>Erro de Sintaxe / Formatação:</strong><br>
                <span>${erro.message}</span>
            </div>`;
    }
};

window.copiarTextoFormatado = function(botao) {
    if (!codigoFormatadoGlobal) return;
    
    navigator.clipboard.writeText(codigoFormatadoGlobal).then(() => {
        const textoOriginal = botao.textContent;
        botao.textContent = "Copiado!";
        botao.style.color = "#2ECC71";
        setTimeout(() => {
            botao.textContent = textoOriginal;
            botao.style.color = "var(--primary-color)";
        }, 1200);
    }).catch(err => {
        console.error("Erro ao copiar:", err);
    });
};

// --- CONTROLE DE INTERFACE ---

window.inicializarFormatador = function() {
    const seletor = document.getElementById('seletor-linguagem-formatador');
    const input = document.getElementById('formatador-input');
    const btnCopiar = document.getElementById('btn-copiar-codigo-formatado');

    if (!seletor) return false;

    if (seletor.dataset.formatadorInicializado === "true") return true;
    seletor.dataset.formatadorInicializado = "true";

    seletor.innerHTML = '';
    for (const key in LANGUAGES_CONFIG) {
        const opt = document.createElement('option');
        opt.value = key;
        opt.textContent = LANGUAGES_CONFIG[key].nome;
        seletor.appendChild(opt);
    }

    seletor.addEventListener('change', () => {
        if (input && LANGUAGES_CONFIG[seletor.value]) {
            input.placeholder = `Exemplo bagunçado:\n${LANGUAGES_CONFIG[seletor.value].placeholder}`;
        }
    });

    if (btnCopiar) {
        btnCopiar.replaceWith(btnCopiar.cloneNode(true));
        const novoBtnCopiar = document.getElementById('btn-copiar-codigo-formatado');
        novoBtnCopiar.addEventListener('click', () => window.copiarTextoFormatado(novoBtnCopiar));
    }

    if (input && LANGUAGES_CONFIG[seletor.value]) {
        input.placeholder = `Exemplo bagunçado:\n${LANGUAGES_CONFIG[seletor.value].placeholder}`;
    }
    
    return true;
};

// ==========================================================================
// AUTO-INICIALIZADOR INTELIGENTE (SPA)
// ==========================================================================

var executarGatilhoFormatador = function() {
    if (window.inicializarFormatador()) return;

    var observadorSPA = new MutationObserver(function(_, obs) {
        if (document.getElementById('seletor-linguagem-formatador')) {
            window.inicializarFormatador();
            obs.disconnect(); 
        }
    });

    observadorSPA.observe(document.body, { childList: true, subtree: true });
};

if (document.readyState === 'complete' || document.readyState === 'interactive') {
    executarGatilhoFormatador();
} else {
    document.addEventListener('DOMContentLoaded', executarGatilhoFormatador);
}

window.addEventListener('hashchange', function() {
    if (window.location.hash.includes('formatador')) {
        const seletor = document.getElementById('seletor-linguagem-formatador');
        if (seletor) seletor.dataset.formatadorInicializado = "false";
        setTimeout(executarGatilhoFormatador, 50);
    }
});