/**
 * Conversor de Markdown para HTML
 * Módulo ES6 estruturado para rodar de forma segura e com suporte a GFM.
 */
(() => {
    'use strict';

    // Elementos do DOM baseados no seu HTML atual
    const inputArea = document.getElementById("markdown-input");
    const outputPre = document.getElementById("markdown-output");
    const cleanButton = document.getElementById("clean-markdown-button");
    const copyButton = document.getElementById("copy-markdown-button");
    const alertSpan = document.getElementById("copy-markdown-alert");

    /**
     * Configura o processador de Markdown (Marked)
     */
    function initMarked() {
        if (typeof marked !== 'undefined') {
            marked.setOptions({
                breaks: true, // Converte quebras de linha simples em <br>
                gfm: true,    // Ativa GitHub Flavored Markdown (tabelas, riscado, etc.)
                mangle: false,
                headerIds: false
            });
        }
    }

    /**
     * Processa a conversão em tempo real
     */
    function processMarkdown() {
        if (!inputArea || !outputPre) return;

        if (typeof marked === 'undefined') {
            outputPre.textContent = "Erro: Biblioteca de conversão 'marked' não foi carregada.";
            return;
        }

        const markdownText = inputArea.value;

        if (!markdownText.trim()) {
            outputPre.textContent = "";
            return;
        }

        try {
            // Converte o Markdown para string HTML pura
            const rawHtml = marked.parse(markdownText);
            
            // Exibe o código bruto gerado dentro da tag <pre> de forma segura
            outputPre.textContent = rawHtml;
        } catch (error) {
            outputPre.textContent = "Erro ao processar o Markdown: " + error.message;
        }
    }

    /**
     * Limpa as áreas de entrada e saída
     */
    function clearFields() {
        if (inputArea) inputArea.value = "";
        if (outputPre) outputPre.textContent = "";
    }

    /**
     * Copia o HTML gerado para a área de transferência
     */
    async function copyToClipboard() {
        if (!outputPre) return;

        const textToCopy = outputPre.textContent;
        if (!textToCopy.trim()) return;

        try {
            await navigator.clipboard.writeText(textToCopy);
            showCopyAlert();
        } catch (err) {
            console.error("Falha ao copiar o HTML: ", err);
        }
    }

    /**
     * Exibe o feedback visual de cópia bem-sucedida
     */
    function showCopyAlert() {
        if (!alertSpan) return;
        
        alertSpan.classList.remove("hidden");
        // Adiciona classe de animação caso exista em seu ecossistema CSS
        alertSpan.classList.add("visible"); 

        setTimeout(() => {
            alertSpan.classList.remove("visible");
            alertSpan.classList.add("hidden");
        }, 2000);
    }

    /**
     * Inicializa os ouvintes de eventos
     */
    function init() {
        initMarked();

        if (inputArea) {
            inputArea.addEventListener("input", processMarkdown);
        }

        if (cleanButton) {
            cleanButton.addEventListener("click", clearFields);
        }

        if (copyButton) {
            copyButton.addEventListener("click", copyToClipboard);
        }
    }

    // Inicializa o módulo assim que o DOM estiver pronto
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
})();