function inicializarFrequenciaPalavras() {
    const textArea = document.getElementById("original-text");
    const container = document.getElementById("repeated-words");
    const termInput = document.getElementById("custom-term-input");
    const addBtn = document.getElementById("add-term-btn");
    const tagsContainer = document.getElementById("custom-tags-container");
    const matchCaseCheckbox = document.getElementById("match-case-checkbox");

    if (!textArea || !container) return;

    let customTerms = [];

    function renderTags() {
        if (!tagsContainer) return;
        tagsContainer.innerHTML = "";
        customTerms.forEach((term, index) => {
            const tag = document.createElement("span");
            tag.className = "custom-tag-item";
            tag.innerHTML = `
                <span>${term}</span>
                <button type="button" data-index="${index}">&times;</button>
            `;
            
            tag.querySelector("button").addEventListener("click", (e) => {
                const idx = e.target.getAttribute("data-index");
                customTerms.splice(idx, 1);
                renderTags();
                countWords();
            });

            tagsContainer.appendChild(tag);
        });
    }

    function handleAddTerm() {
        const val = termInput.value.trim();
        if (!val) return;
        
        // Se não consider case sensitive, guardamos em minúsculo para unificar, senão guardamos exato
        const isCaseSensitive = matchCaseCheckbox ? matchCaseCheckbox.checked : false;
        const termToStore = isCaseSensitive ? val : val.toLowerCase();

        if (!customTerms.includes(termToStore)) {
            customTerms.push(termToStore);
            termInput.value = "";
            renderTags();
            countWords();
        }
    }

    if (addBtn && termInput) {
        addBtn.addEventListener("click", handleAddTerm);
        termInput.addEventListener("keypress", (e) => {
            if (e.key === "Enter") {
                e.preventDefault();
                handleAddTerm();
            }
        });
    }

    // Se o usuário alternar o checkbox, recalculamos a contagem na hora
    if (matchCaseCheckbox) {
        matchCaseCheckbox.addEventListener("change", countWords);
    }

    function countWords() {
        const text = textArea.value;
        const isCaseSensitive = matchCaseCheckbox ? matchCaseCheckbox.checked : false;

        // 1. Contagem padrão de palavras isoladas
        const processedText = isCaseSensitive ? text : text.toLowerCase();
        const words = processedText
            .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?"'\n]/g, " ")
            .split(/\s+/)
            .filter(word => word.length > 0);

        const wordFreq = {};
        words.forEach(word => {
            wordFreq[word] = (wordFreq[word] || 0) + 1;
        });

        const repeatedWords = Object.keys(wordFreq)
            .filter(word => wordFreq[word] > 1)
            .sort((a, b) => wordFreq[b] - wordFreq[a]);

        // 2. Contagem dos trechos personalizados
        const customResults = {};
        customTerms.forEach(term => {
            if (term.length === 0) return;

            const escapedTerm = term.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
            // Se for case-sensitive, usamos regex normal; senão, adicionamos a flag 'i'
            const flags = isCaseSensitive ? 'g' : 'gi';
            const regex = new RegExp(escapedTerm, flags);
            const matches = text.match(regex);
            
            customResults[term] = matches ? matches.length : 0;
        });

        const hasRepeated = repeatedWords.length > 0;
        const hasCustom = customTerms.length > 0;

        if (!hasRepeated && !hasCustom && words.length === 0) {
            container.innerHTML = `<p class="empty-state">As palavras repetidas e trechos aparecerão aqui...</p>`;
            return;
        }

        container.innerHTML = "";

        // Renderiza trechos personalizados
        if (hasCustom) {
            const customHeader = document.createElement("div");
            customHeader.className = "freq-section-title";
            customHeader.textContent = "Trechos Personalizados:";
            container.appendChild(customHeader);

            customTerms.forEach(term => {
                const row = document.createElement("div");
                row.className = "freq-row";

                const nameSpan = document.createElement("span");
                nameSpan.className = "freq-word-name";
                nameSpan.textContent = `"${term}"`;

                const badgeSpan = document.createElement("span");
                badgeSpan.className = "freq-badge";
                badgeSpan.textContent = `${customResults[term]}x`;

                row.appendChild(nameSpan);
                row.appendChild(badgeSpan);
                container.appendChild(row);
            });

            if (hasRepeated) {
                const divider = document.createElement("hr");
                divider.className = "freq-divider";
                container.appendChild(divider);
            }
        }

        // Renderiza palavras repetidas normais
        if (hasRepeated) {
            if (hasCustom) {
                const wordsHeader = document.createElement("div");
                wordsHeader.className = "freq-section-title";
                wordsHeader.textContent = "Palavras Repetidas:";
                container.appendChild(wordsHeader);
            }

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

        if (!hasRepeated && !hasCustom) {
            container.innerHTML = `<p class="empty-state">Nenhum resultado encontrado ainda.</p>`;
        }
    }

    textArea.addEventListener("input", countWords);
    countWords();
}

inicializarFrequenciaPalavras();