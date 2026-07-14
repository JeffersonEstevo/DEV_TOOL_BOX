function renderizarPreviewHtml() {
    const inputArea = document.getElementById("pdf-html-input");
    const previewArea = document.getElementById("pdf-preview-area");
    
    if (!inputArea || !previewArea) return;

    const htmlTexto = inputArea.value.trim();

    if (!htmlTexto) {
        previewArea.innerHTML = "<p style='color: var(--text-muted); font-style: italic;'>Aguardando código HTML para visualização...</p>";
        return;
    }

    // Injeta o HTML diretamente para renderização nativa do navegador
    previewArea.innerHTML = htmlTexto;
}

function baixarPdfGerado() {
    const previewArea = document.getElementById("pdf-preview-area");
    const inputArea = document.getElementById("pdf-html-input");

    if (!previewArea || !inputArea || !inputArea.value.trim()) return;

    if (typeof html2pdf === 'undefined') {
        alert("Erro: Biblioteca html2pdf não foi carregada corretamente.");
        return;
    }

    // CLONE ISOLADO: Cria uma cópia na memória para limpar heranças do painel
    const elementoParaPdf = previewArea.cloneNode(true);
    
    // Força o elemento a zerar margens, paddings externos e floats que empurram o texto
    elementoParaPdf.style.margin = "0px";
    elementoParaPdf.style.padding = "0px";
    elementoParaPdf.style.width = "100%";
    elementoParaPdf.style.height = "auto";
    elementoParaPdf.style.display = "block";

    // Configurações otimizadas para quebras físicas reais
    const opcoes = {
        margin:       [15, 15, 15, 15], // 15mm de margem real em cada folha do PDF
        filename:     'documento_convertido.pdf',
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { 
            scale: 2, 
            useCORS: true, 
            logging: false,
            scrollY: 0, // Evita que o scroll atual da sua tela desloque o texto no PDF
            scrollX: 0
        },
        jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' },
        pagebreak:    { 
            mode: ['avoid-all', 'css', 'legacy'],
            before: '.break-before', // Permite forçar quebra usando class="break-before" se quiser
            after: '.break-after'
        }
    };

    // Gera o PDF a partir do clone isolado e limpo
    html2pdf().set(opcoes).from(elementoParaPdf).save();
}

function limparGeradorPdf() {
    const inputArea = document.getElementById("pdf-html-input");
    if (inputArea) {
        inputArea.value = "";
        renderizarPreviewHtml();
    }
}

function inicializarGeradorPdf() {
    const inputArea = document.getElementById("pdf-html-input");

    if (inputArea) {
        inputArea.removeEventListener("input", renderizarPreviewHtml);
        inputArea.addEventListener("input", renderizarPreviewHtml);
    }
    
    // Roda uma vez para definir o estado inicial vazio da Preview
    renderizarPreviewHtml();
}

// Inicialização segura do módulo
inicializarGeradorPdf();