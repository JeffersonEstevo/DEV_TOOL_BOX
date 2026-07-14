// Configurações básicas do processador Marked para quebras de linha amigáveis
if (typeof marked !== 'undefined') {
    marked.setOptions({
        breaks: true,   // Converte quebras de linha simples em <br>
        gfm: true       // Ativa o GitHub Flavored Markdown (tabelas, riscado, etc.)
    });
}

function processarConversaoMarkdown() {
    const inputArea = document.getElementById("markdown-input");
    const outputPre = document.getElementById("markdown-output");
    
    if (!inputArea || !outputPre) return;
    if (typeof marked === 'undefined') {
        outputPre.innerText = "Erro: Biblioteca de conversão não carregada.";
        return;
    }

    const markdownTexto = inputArea.value;

    if (!markdownTexto.trim()) {
        outputPre.innerText = "";
        return;
    }

    // Processa o Markdown e converte para String HTML
    try {
        const htmlGerado = marked.parse(markdownTexto);
        // Usamos innerText para exibir o código bruto do HTML em vez de renderizá-lo
        outputPre.innerText = htmlGerado;
    } catch (erro) {
        outputPre.innerText = "Erro ao processar o Markdown: " + erro.message;
    }
}

function limparMarkdown() {
    const inputArea = document.getElementById("markdown-input");
    const outputPre = document.getElementById("markdown-output");
    
    if (inputArea) inputArea.value = "";
    if (outputPre) outputPre.innerText = "";
}

function copiarHtmlConvertido() {
    const outputPre = document.getElementById("markdown-output");
    const alertSpan = document.getElementById("copy-markdown-alert");
    if (!outputPre) return;

    const textoParaCopiar = outputPre.innerText || outputPre.textContent;

    if (!textoParaCopiar.trim()) return;

    navigator.clipboard.writeText(textoParaCopiar).then(() => {
        if (alertSpan) {
            alertSpan.classList.remove("hidden");
            setTimeout(() => {
                alertSpan.classList.add("hidden");
            }, 2000);
        }
    }).catch(err => {
        console.error("Erro ao copiar o código: ", err);
    });
}

function inicializarConversorMarkdown() {
    const inputArea = document.getElementById("markdown-input");

    if (inputArea) {
        // Vincula a conversão ao digitar (input) para acontecer em tempo real
        inputArea.removeEventListener("input", processarConversaoMarkdown);
        inputArea.addEventListener("input", processarConversaoMarkdown);
    }
}

// Inicialização do módulo
inicializarConversorMarkdown();