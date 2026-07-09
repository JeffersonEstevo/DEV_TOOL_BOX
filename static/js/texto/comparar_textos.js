// Função isolada e pura para processar a comparação de textos
function executarComparacaoDeTextos() {
    const textBefore = document.getElementById("text-before");
    const textAfter = document.getElementById("text-after");
    const resultPanel = document.getElementById("result-panel");
    const outputBefore = document.getElementById("diff-output-before");
    const outputAfter = document.getElementById("diff-output-after");

    if (!textBefore || !textAfter) {
        console.error("[Comparador Erro] Campos de texto não encontrados no DOM.");
        return;
    }

    const txt1 = textBefore.value;
    const txt2 = textAfter.value;

    if (!txt1 && !txt2) {
        alert("Por favor, preencha pelo menos um dos campos de texto para comparar.");
        return;
    }

    // Executa a comparação por palavras
    const palavrasTxt1 = txt1.split(/(\s+)/);
    const palavrasTxt2 = txt2.split(/(\s+)/);

    let htmlBefore = "";
    let htmlAfter = "";

    const setTxt1 = new Set(palavrasTxt1.filter(p => p.trim() !== ""));
    const setTxt2 = new Set(palavrasTxt2.filter(p => p.trim() !== ""));

    // Monta o lado Esquerdo (Texto Original - Remoções)
    palavrasTxt1.forEach(palavra => {
        if (palavra.trim() === "") {
            htmlBefore += palavra; 
        } else if (!setTxt2.has(palavra)) {
            htmlBefore += `<del>${escaparHTML(palavra)}</del>`;
        } else {
            htmlBefore += `<span class="unchanged">${escaparHTML(palavra)}</span>`;
        }
    });

    // Monta o lado Direito (Texto Novo - Adições)
    palavrasTxt2.forEach(palavra => {
        if (palavra.trim() === "") {
            htmlAfter += palavra;
        } else if (!setTxt1.has(palavra)) {
            htmlAfter += `<ins>${escaparHTML(palavra)}</ins>`;
        } else {
            htmlAfter += `<span class="unchanged">${escaparHTML(palavra)}</span>`;
        }
    });

    if (outputBefore) outputBefore.innerHTML = htmlBefore;
    if (outputAfter) outputAfter.innerHTML = htmlAfter;
    
    if (resultPanel) {
        resultPanel.classList.remove("hidden");
        resultPanel.scrollIntoView({ behavior: 'smooth' });
    }
}

// Função isolada para limpar os campos
function limparComparacaoDeTextos() {
    const textBefore = document.getElementById("text-before");
    const textAfter = document.getElementById("text-after");
    const resultPanel = document.getElementById("result-panel");
    const outputBefore = document.getElementById("diff-output-before");
    const outputAfter = document.getElementById("diff-output-after");

    if (textBefore) textBefore.value = "";
    if (textAfter) textAfter.value = "";
    if (outputBefore) outputBefore.innerHTML = "";
    if (outputAfter) outputAfter.innerHTML = "";
    if (resultPanel) resultPanel.classList.add("hidden");
    
    console.log("[Comparador] Campos limpos!");
}

// Auxiliar de escape
function escaparHTML(texto) {
    return texto.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

console.log("Módulo de engine do Comparador carregado com sucesso!");