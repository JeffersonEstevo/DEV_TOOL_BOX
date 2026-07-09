// Escopo de variáveis globais de controle controladas via window
window.leituraInterval = window.leituraInterval || null;
window.leituraPalavras = [];
window.leituraIndex = 0;

function iniciarLeituraDinamica() {
    const inputText = document.getElementById("input-text");
    const reader = document.getElementById("dynamic-reader");
    const readerContainer = document.getElementById("reader-container");
    const currentWord = document.getElementById("current-word");
    const speedInput = document.getElementById("speed");
    const fontSizeInput = document.getElementById("font-size");
    const themeSelect = document.getElementById("theme");

    if (!inputText || !reader || !currentWord) return;

    window.leituraPalavras = inputText.value.trim().split(/\s+/).filter(w => w.length > 0);
    window.leituraIndex = 0;

    if (window.leituraPalavras.length === 0) {
        alert("Por favor, digite ou cole um texto para realizar a leitura.");
        return;
    }

    // Customizações dinâmicas inline permitidas por se tratarem de preferência do usuário
    currentWord.style.fontSize = `${fontSizeInput?.value || 48}px`;

    if (themeSelect?.value === "dark") {
        readerContainer.classList.remove("reader-light");
        readerContainer.classList.add("reader-dark");
    } else {
        readerContainer.classList.remove("reader-dark");
        readerContainer.classList.add("reader-light");
    }

    // Exibe o painel flutuante tirando a classe hidden
    reader.classList.remove("hidden");

    // Previne concorrência de múltiplos loops rodando juntos
    if (window.leituraInterval) clearInterval(window.leituraInterval);

    const velocidade = parseInt(speedInput?.value || 300, 10);

    window.leituraInterval = setInterval(() => {
        if (window.leituraIndex < window.leituraPalavras.length) {
            currentWord.textContent = window.leituraPalavras[window.leituraIndex];
            window.leituraIndex++;
        } else {
            pararLeituraDinamica();
        }
    }, velocidade);
}

function pararLeituraDinamica() {
    if (window.leituraInterval) {
        clearInterval(window.leituraInterval);
        window.leituraInterval = null;
    }
    
    const reader = document.getElementById("dynamic-reader");
    if (reader) {
        reader.classList.add("hidden");
    }
}

console.log("Módulo de Leitura Dinâmica carregado com sucesso!");