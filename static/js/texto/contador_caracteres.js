// Criamos uma função de inicialização autocontida
function inicializarContadorCaracteres() {
    const textArea = document.getElementById("original-text");
    const charCount = document.getElementById("char-count");
    const wordCount = document.getElementById("word-count");
    const paragraphCount = document.getElementById("paragraph-count");
    const lineCount = document.getElementById("line-count");

    // Aborta se a ferramenta não estiver de fato renderizada na tela
    if (!textArea) return;

    function updateCounts() {
        const text = textArea.value;

        if (charCount) charCount.textContent = text.length;

        if (wordCount) {
            const words = text.trim().split(/\s+/);
            wordCount.textContent = text.trim() === "" ? 0 : words.filter(word => word).length;
        }

        if (paragraphCount) {
            const paragraphs = text.split(/\n+/);
            paragraphCount.textContent = text.trim() === "" ? 0 : paragraphs.filter(p => p.trim()).length;
        }

        if (lineCount) {
            const lines = text.split("\n");
            lineCount.textContent = text === "" ? 0 : lines.length;
        }
    }

    // Vincula o evento diretamente ao elemento injetado
    textArea.addEventListener("input", updateCounts);
    
    // Roda uma primeira vez para zerar/atualizar o estado
    updateCounts(); 
    console.log("[Contador] Sistema de escuta ativa iniciado!");
}

// Executa a inicialização imediatamente ao carregar o script
inicializarContadorCaracteres();