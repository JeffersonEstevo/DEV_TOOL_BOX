// ==========================================
// MÓDULO FORMATADOR E EMBELEZADOR DE CÓDIGO
// ==========================================

// Variável global em var para evitar erros de redeclaração no hot-reload da SPA
var LANGUAGES_CONFIG = LANGUAGES_CONFIG || {
    "html": {
        nome: "HTML / Django Template",
        placeholder: "<div>\n<h1>Hello</h1><p>Mundo Feio</p>\n</div>",
        formatar: (codigo) => formatarEstruturaTags(codigo)
    },
    "css": {
        nome: "CSS",
        placeholder: "body{margin:0;padding:0;} h1{color:blue;font-size:12px;}",
        formatar: (codigo) => formatarEstiloCSS(codigo)
    },
    "javascript": {
        nome: "JavaScript",
        placeholder: "function teste(){console.log('oi');if(true){return 1;}}",
        formatar: (codigo) => formatarScriptsJS(codigo)
    },
    "python": {
        nome: "Python",
        placeholder: "def minha_funcao():\nx = 1\nif x == 1:\nprint('alinhamento')",
        formatar: (codigo) => formatarRecuoPython(codigo)
    }
};

// Armazena o código limpo gerado para facilitar a cópia exata
var codigoFormatadoGlobal = codigoFormatadoGlobal || "";

// --- ENGINES NATIVAS DE FORMATAÇÃO ---

window.formatarEstruturaTags = function(html) {
    if (typeof html !== 'string') return '';
    let formatado = '';
    let indent = 0;
    
    try {
        // Normaliza os espaços ao redor das tags
        let limpo = html.replace(/>\s+</g, '><').trim();
        
        // Divide mantendo os marcadores de tag
        const tokens = limpo.replace(/</g, '~%~<').replace(/>/g, '>~%~').split('~%~');
        
        let i = 0;
        while (i < tokens.length) {
            let t = tokens[i].trim();
            if (!t) { i++; continue; }
            
            // PADRÃO INLINE: Se detectarmos uma tag de abertura, seguida por texto, seguida por tag de fechamento correspondente
            if (
                t.startsWith('<') && !t.startsWith('</') && !t.endsWith('/>') &&
                i + 2 < tokens.length &&
                !tokens[i + 1].trim().startsWith('<') &&
                tokens[i + 2].trim().startsWith('</')
            ) {
                let tagAbertura = t;
                let conteudoTexto = tokens[i + 1].trim();
                let tagFechamento = tokens[i + 2].trim();
                
                // Extrai os nomes das tags para validar se são o mesmo tipo
                let nomeAbertura = tagAbertura.match(/^<([a-zA-Z0-9-]+)/)?.[1]?.toLowerCase();
                let nomeFechamento = tagFechamento.match(/^<\/([a-zA-Z0-9-]+)/)?.[1]?.toLowerCase();

                if (nomeAbertura && nomeAbertura === nomeFechamento) {
                    formatado += '  '.repeat(indent) + tagAbertura + conteudoTexto + tagFechamento + '\n';
                    i += 3; // Pula os 3 tokens processados em linha
                    continue;
                }
            }

            // Caso regular de formatação
            if (t.startsWith('</')) {
                indent = Math.max(0, indent - 1);
                formatado += '  '.repeat(indent) + t + '\n';
            } else if (t.startsWith('<')) {
                formatado += '  '.repeat(indent) + t + '\n';
                if (!t.endsWith('/>') && !t.match(/^<(br|hr|img|input|link|meta)/i)) {
                    indent++;
                }
            } else {
                formatado += '  '.repeat(indent) + t + '\n';
            }
            i++;
        }
    } catch (e) {
        console.error("Erro ao formatar HTML:", e);
        return html;
    }
    
    return formatado.trim();
};

window.formatarEstiloCSS = function(css) {
    if (typeof css !== 'string') return '';
    try {
        return css
            .replace(/\s*([{\};,])\s*/g, '$1')
            .replace(/\{/g, ' {\n  ')
            .replace(/;/g, ';\n  ')
            .replace(/\s*\}\s*/g, '\n}\n\n')
            .replace(/  \}/g, '}')
            .trim();
    } catch (e) {
        console.error("Erro ao formatar CSS:", e);
        return css;
    }
};

window.formatarScriptsJS = function(js) {
    if (typeof js !== 'string') return '';
    let formatado = '';
    let indent = 0;
    
    try {
        // Normaliza o código para garantir que chaves e pontos e vírgulas tenham espaçamento correto antes de processar as linhas
        let limpo = js
            .replace(/\{/g, ' {\n')
            .replace(/\}/g, '\n}\n')
            .replace(/;/g, ';\n')
            .replace(/\n\s*\n/g, '\n'); // Remove linhas em branco excessivas

        const linhas = limpo.split('\n');
        
        linhas.forEach(linha => {
            let l = linha.trim();
            if (!l) return;
            
            // Se a linha começa com fecha-chave, diminui a indentação antes de imprimir
            if (l.startsWith('}')) {
                indent = Math.max(0, indent - 1);
            }
            
            formatado += '  '.repeat(indent) + l + '\n';
            
            // Se a linha termina com abre-chave, aumenta a indentação para a próxima linha
            if (l.endsWith('{')) {
                indent++;
            }
        });
    } catch (e) {
        console.error("Erro ao formatar JS:", e);
        return js;
    }
    
    return formatado.trim();
};

window.formatarRecuoPython = function(py) {
    if (typeof py !== 'string') return '';
    let formatado = '';
    let indent = 0;
    
    try {
        // Normaliza quebras de linha e separa múltiplos comandos na mesma linha se necessário
        const linhas = py.split('\n');
        
        linhas.forEach(linha => {
            let l = linha.trim();
            if (!l) return;
            
            // Se encontrarmos uma nova definição de função ou variável global no início da linha,
            // redefinimos o recuo para 0 para garantir que o código não fique preso dentro de outro bloco.
            if (l.startsWith('def ') || l.startsWith('class ') || /^[a-zA-Z_][a-zA-Z0-9_]*\s*=/.test(l)) {
                // Se for uma nova def, resetamos o indent global a menos que estejamos lidando com aninhamento (neste caso simples, resetamos para 0)
                if (l.startsWith('def ') || l.startsWith('class ')) {
                    indent = 0;
                }
            }
            
            // Tratamento de comandos de saída antecipada
            if (l.startsWith('return') || l.startsWith('pass') || l.startsWith('break') || l.startsWith('continue')) {
                formatado += '    '.repeat(indent) + l + '\n';
                indent = Math.max(0, indent - 1);
                return;
            }
            
            formatado += '    '.repeat(indent) + l + '\n';
            
            // Se a linha termina com dois-pontos, incrementa o recuo para a próxima linha
            if (l.endsWith(':')) {
                indent++;
            }
        });
    } catch (e) {
        console.error("Erro ao formatar Python:", e);
        return py;
    }
    
    return formatado.trim();
};

// --- RENDERIZADOR VS CODE STYLE ---

window.processarEExibirCodigo = function() {
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

    const funcaoFormatadora = LANGUAGES_CONFIG[linguagemSelecionada]?.formatar;
    if (!funcaoFormatadora) return;

    codigoFormatadoGlobal = funcaoFormatadora(codigoCru);

    containerSaida.innerHTML = '';
    const linhasTexto = codigoFormatadoGlobal.split('\n');
    
    // Utilização de DocumentFragment para ganho de performance sem alterar o comportamento DOM
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

        // Correção no escape mantendo a exata lógica original de marcação com tokens coringa seguros
        if (linguagemSelecionada === 'html') {
            htmlEscapado = htmlEscapado.replace(/(&lt;\/?[a-zA-Z1-6!].*?&gt;)/g, '§AZUL§$1§FIM§');
            htmlEscapado = htmlEscapado.replace(/(&quot;[^&]*&quot;|"[^"]*")/g, '§LARANJA§$1§FIM§');
        } else if (linguagemSelecionada === 'css') {
            htmlEscapado = htmlEscapado.replace(/([a-zA-Z-]+)(?=\s*:)/g, '§AZULCLARO§$1§FIM§');
            htmlEscapado = htmlEscapado.replace(/(#[a-zA-Z0-9]+|\d+px|\d+rem|\b(?:purple|blue|red|green|white|black)\b)/g, '§VERDE§$1§FIM§');
        } else if (linguagemSelecionada === 'javascript' || linguagemSelecionada === 'python') {
            htmlEscapado = htmlEscapado.replace(/\b(function|return|if|else|def|import|class|while|for|const|let|var)\b/g, '§ROXO§$1§FIM§');
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
// AUTO-INICIALIZADOR INTELIGENTE
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