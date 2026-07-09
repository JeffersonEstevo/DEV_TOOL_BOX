function inicializarFrequenciaPalavras() {
    const textArea = document.getElementById("original-text");
    const container = document.getElementById("repeated-words");

    if (!textArea || !container) return;

    function countWords() {
        const text = textArea.value;
        
        // Separa por palavras e limpa pontuações comuns para uma contagem mais precisa
        const words = text
            .toLowerCase()
            .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?"'\n]/g, " ")
            .split(/\s+/)
            .filter(word => word.length > 0);

        if (words.length === 0) {
            container.innerHTML = `<p class="empty-state">As palavras repetidas aparecerão aqui...</p>`;
            return;
        }

        const wordFreq = {};
        words.forEach(word => {
            wordFreq[word] = (wordFreq[word] || 0) + 1;
        });

        // Filtra apenas as palavras que se repetem e ordena pelas mais frequentes
        const repeatedWords = Object.keys(wordFreq)
            .filter(word => wordFreq[word] > 1)
            .sort((a, b) => wordFreq[b] - wordFreq[a]);

        if (repeatedWords.length === 0) {
            container.innerHTML = `<p class="empty-state">Nenhuma palavra repetida encontrada ainda.</p>`;
            return;
        }

        container.innerHTML = "";
        repeatedWords.forEach(word => {
            const row = document.createElement("div");
            row.className = "freq-row";

            const nameSpan = document.createElement("span");
            nameSpan.className = "freq-word-name";
            nameSpan.textContent = word;

            const badgeSpan = document.createElement("span");
            badgeSpan.className = "freq-badge";
            badgeSpan.textContent = `${wordFreq[word]}x`;

            row.appendChild(nameSpan);
            row.appendChild(badgeSpan);
            container.appendChild(row);
        });
    }

    // Escuta o evento de digitação/colagem de forma limpa
    textArea.addEventListener("input", countWords);
    
    // Inicializa zerado
    countWords();
    console.log("[Frequência] Sistema de análise de repetição iniciado!");
}

// Dispara a inicialização imediatamente
inicializarFrequenciaPalavras();