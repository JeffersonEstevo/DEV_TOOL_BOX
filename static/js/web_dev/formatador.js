// ==========================================
// MÓDULO FORMATADOR E EMBELEZADOR DE CÓDIGO
// ==========================================

// JSON Expansível contendo as linguagens e suas configurações
const LANGUAGES_CONFIG = {
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
let codigoFormatadoGlobal = "";

// --- ENGINES NATIVAS DE FORMATAÇÃO (VERSÃO 1) ---

function formatarEstruturaTags(html) {
    let formatado = '';
    let indent = 0;
    
    // Divide o HTML separando estritamente onde começam e terminam as tags
    const tokens = html.replace(/>\s*</g, '><').replace(/</g, '\n<').replace(/>/g, '>\n').split('\n');
    
    tokens.forEach(token => {
        let t = token.trim();
        if (!t) return;
        
        // Se for tag de fechamento (ex: </main>)
        if (t.startsWith('</')) {
            indent = Math.max(0, indent - 1);
            formatado += '  '.repeat(indent) + t + '\n';
        } 
        // Se for tag de abertura (ex: <main> ou <input />)
        else if (t.startsWith('<')) {
            formatado += '  '.repeat(indent) + t + '\n';
            // Só aumenta o recuo se NÃO for tag auto-contida (ex: <img />, <br>)
            if (!t.endsWith('/>') && !t.match(/^<(br|hr|img|input|link|meta)/i)) {
                indent++;
            }
        } 
        // Se for texto puro dentro da tag
        else {
            formatado += '  '.repeat(indent) + t + '\n';
        }
    });
    
    return formatado.trim();
}

function formatarEstiloCSS(css) {
    return css
        .replace(/\s*([{\};,])\s*/g, '$1') // Limpa espaços ao redor de chaves e pontuações
        .replace(/\{/g, ' {\n  ')
        .replace(/;/g, ';\n  ')
        .replace(/\s*\}\s*/g, '\n}\n\n')
        .replace(/  \}/g, '}')
        .trim();
}

function formatarScriptsJS(js) {
    // Alinhamento básico por abertura e fechamento de chaves estruturais
    let formatado = '';
    let indent = 0;
    const linhas = js.replace(/\{/g, '{\n').replace(/\}/g, '\n}').replace(/;/g, ';\n').split('\n');
    
    linhas.forEach(linha => {
        let l = linha.trim();
        if (!l) return;
        if (l.startsWith('}')) indent = Math.max(0, indent - 1);
        formatado += '  '.repeat(indent) + l + '\n';
        if (l.endsWith('{')) indent++;
    });
    return formatado.trim();
}

function formatarRecuoPython(py) {
    // Analisa quebras de linhas estruturais baseadas em dois pontos ':'
    let formatado = '';
    let indent = 0;
    const linhas = py.split('\n');
    
    linhas.forEach(linha => {
        let l = linha.trim();
        if (!l) return;
        // Se a linha anterior pediu recuo e comandos de saída de bloco forem detectados
        if (l.startsWith('return') || l.startsWith('pass') || l.startsWith('break')) {
            formatado += '    '.repeat(indent) + l + '\n';
            indent = Math.max(0, indent - 1);
            return;
        }
        formatado += '    '.repeat(indent) + l + '\n';
        if (l.endsWith(':')) indent++;
    });
    return formatado.trim();
}

// --- RENDERIZADOR VS CODE STYLE ---

function processarEExibirCodigo() {
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

    // 1. Executa a formatação estrutural (Indentação)
    const funcaoFormatadora = LANGUAGES_CONFIG[linguagemSelecionada].formatar;
    codigoFormatadoGlobal = funcaoFormatadora(codigoCru);

    containerSaida.innerHTML = '';
    const linhasTexto = codigoFormatadoGlobal.split('\n');
    
    // 2. Renderiza as linhas
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

        // --- DESTAQUE DE SINTAXE BLINDADO COM TOKENS ---
        let htmlEscapado = (textoLinha || ' ')
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;");

        // Aplica tokens em vez de HTML para não causar conflitos de aspas
        if (linguagemSelecionada === 'html') {
            htmlEscapado = htmlEscapado.replace(/(&lt;\/?[a-zA-Z1-6!].*?&gt;)/g, '§AZUL§$1§FIM§');
            htmlEscapado = htmlEscapado.replace(/("[^"]*")/g, '§LARANJA§$1§FIM§');
        } else if (linguagemSelecionada === 'css') {
            htmlEscapado = htmlEscapado.replace(/([a-zA-Z-]+)(?=\s*:)/g, '§AZULCLARO§$1§FIM§');
            htmlEscapado = htmlEscapado.replace(/(#[a-zA-Z0-9]+|\d+px|\d+rem|\b(?:purple|blue|red|green|white|black)\b)/g, '§VERDE§$1§FIM§');
        } else if (linguagemSelecionada === 'javascript' || linguagemSelecionada === 'python') {
            htmlEscapado = htmlEscapado.replace(/\b(function|return|if|else|def|import|class|while|for|const|let|var)\b/g, '§ROXO§$1§FIM§');
            htmlEscapado = htmlEscapado.replace(/("[^"]*"|'[^']*')/g, '§LARANJA§$1§FIM§');
        }

        // Finalmente, substitui os tokens seguros pelas tags de cores HTML
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
        containerSaida.appendChild(divLinha);
    });
}

function aplicarDestaqueBasico(elementoCode, lang) {
    let textoPuro = elementoCode.textContent;
    
    // Transforma caracteres especiais em texto seguro antes de injetar qualquer tag HTML de cor
    let htmlEscapado = textoPuro
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");

    if (lang === 'html') {
        // CORREÇÃO DEFASADA: Procura estritamente a tag montada e envelopa num span limpo
        htmlEscapado = htmlEscapado.replace(/(&lt;\/?[a-zA-Z1-6!][^&>]*&gt;)/g, '<span style="color: #569cd6;">$1</span>');
        htmlEscapado = htmlEscapado.replace(/("[^"]*")/g, '<span style="color: #ce9178;">$1</span>');
    } else if (lang === 'css') {
        htmlEscapado = htmlEscapado.replace(/([a-zA-Z-]+)(?=\s*:)/g, '<span style="color: #9cdcfe;">$1</span>');
        htmlEscapado = htmlEscapado.replace(/(#[a-zA-Z0-9]+|\d+px|\d+rem|\b(?:purple|blue|red|green|white|black)\b)/g, '<span style="color: #b5cea8;">$1</span>');
    } else if (lang === 'javascript' || lang === 'python') {
        htmlEscapado = htmlEscapado.replace(/\b(function|return|if|else|def|import|class|while|for|const|let|var)\b/g, '<span style="color: #c586c0;">$1</span>');
        htmlEscapado = htmlEscapado.replace(/("[^"]*"|'[^']*')/g, '<span style="color: #ce9178;">$1</span>');
    }
    
    elementoCode.innerHTML = htmlEscapado;
}

function copiarTextoFormatado(botao) {
    if (!codigoFormatadoGlobal) return;
    
    navigator.clipboard.writeText(codigoFormatadoGlobal).then(() => {
        const textoOriginal = botao.textContent;
        botao.textContent = "Copiado!";
        botao.style.color = "#2ECC71";
        setTimeout(() => {
            botao.textContent = textoOriginal;
            botao.style.color = "var(--primary-color)";
        }, 1200);
    });
}

// --- CONTROLE DE INTERFACE ---

(() => {
    const seletor = document.getElementById('seletor-linguagem-formatador');
    const input = document.getElementById('formatador-input');
    const btnCopiar = document.getElementById('btn-copiar-codigo-formatado');

    if (!seletor) return;

    // Popula o seletor baseado no JSON configurado
    seletor.innerHTML = '';
    for (const key in LANGUAGES_CONFIG) {
        const opt = document.createElement('option');
        opt.value = key;
        opt.textContent = LANGUAGES_CONFIG[key].nome;
        seletor.appendChild(opt);
    }

    // Altera placeholders dinamicamente ao mudar a linguagem
    seletor.addEventListener('change', () => {
        if (input) input.placeholder = `Exemplo bagunçado:\n${LANGUAGES_CONFIG[seletor.value].placeholder}`;
    });

    if (btnCopiar) {
        btnCopiar.addEventListener('click', () => copiarTextoFormatado(btnCopiar));
    }

    // Define o placeholder inicial da primeira chave ativa
    if (input) input.placeholder = `Exemplo bagunçado:\n${LANGUAGES_CONFIG[seletor.value].placeholder}`;
})();