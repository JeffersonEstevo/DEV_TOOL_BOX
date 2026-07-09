function executarCalculoDeSimilaridade() {
    const txt1Element = document.getElementById("text1");
    const txt2Element = document.getElementById("text2");
    const resultElement = document.getElementById("similarity-result");

    if (!txt1Element || !txt2Element || !resultElement) return;

    const val1 = txt1Element.value.trim();
    const val2 = txt2Element.value.trim();

    if (val1 === "" && val2 === "") {
        resultElement.innerHTML = "Aguardando dados...";
        resultElement.className = "similarity-badge similarity-none";
        return;
    }

    // Tokeniza strings separando por palavras e filtrando vazios
    const words1 = val1.toLowerCase().split(/\W+/).filter(w => w.length > 0);
    const words2 = val2.toLowerCase().split(/\W+/).filter(w => w.length > 0);

    const set1 = new Set(words1);
    const set2 = new Set(words2);

    if (set1.size === 0 || set2.size === 0) {
        resultElement.innerHTML = "0%<br><span style='font-size:0.9rem; font-weight:normal;'>Nenhuma Similaridade</span>";
        resultElement.className = "similarity-badge similarity-none";
        return;
    }

    // Operações Matemáticas de Conjunto (Jaccard Index)
    const intersection = new Set([...set1].filter(word => set2.has(word)));
    const union = new Set([...set1, ...set2]);

    const similarity = (intersection.size / union.size) * 100;
    
    let description = "";
    let cssClass = "";

    // Calibração exata das faixas de cores com base nas novas classes CSS
    if (similarity === 0) {
        description = "Nenhuma Similaridade";
        cssClass = "similarity-none";
    } else if (similarity <= 35) {
        // Pega seus 25% (Fundo Vermelho)
        description = "Baixa Similaridade";
        cssClass = "similarity-low";
    } else if (similarity <= 70) {
        // Pega seus 50% (Fundo Amarelo)
        description = "Média Similaridade";
        cssClass = "similarity-medium";
    } else if (similarity < 100) {
        // Fundo Verde Claro
        description = "Alta Similaridade";
        cssClass = "similarity-high";
    } else {
        // Exatamente 100% (Fundo Verde Intenso)
        description = "Textos Idênticos!";
        cssClass = "similarity-full";
    }

    // Usando innerHTML para aplicar o número grande em cima e a legenda menor embaixo
    resultElement.innerHTML = `${similarity.toFixed(2)}%<br><span style='font-size:0.9rem; font-weight:normal;'>${description}</span>`;
    resultElement.className = `similarity-badge ${cssClass}`;
}

function limparCalculoDeSimilaridade() {
    const txt1Element = document.getElementById("text1");
    const txt2Element = document.getElementById("text2");
    const resultElement = document.getElementById("similarity-result");

    if (txt1Element) txt1Element.value = "";
    if (txt2Element) txt2Element.value = "";
    if (resultElement) {
        resultElement.innerHTML = "Aguardando dados...";
        resultElement.className = "similarity-badge similarity-none";
    }
    console.log("[Similaridade] Campos reiniciados.");
}

console.log("Módulo de Similaridade de Textos carregado com sucesso!");