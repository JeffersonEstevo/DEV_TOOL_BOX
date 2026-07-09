function inicializarMediaAritmetica() {
    const inputElement = document.getElementById("input-numbers");
    if (!inputElement) return;

    // Remove ouvintes duplicados antigos e liga a escuta em tempo real
    inputElement.removeEventListener("input", calcularResultadosMedia);
    inputElement.addEventListener("input", calcularResultadosMedia);
}

function calcularResultadosMedia() {
    const input = document.getElementById("input-numbers").value;

    // Divide os elementos por vírgulas ou quebras de linha de forma flexível
    const values = input.split(/[\n,;\t]+/) 
        .map(v => {
            // Remove espaços e padroniza separadores decimais para ponto do JS
            let clean = v.trim().replace(',', '.');
            return parseFloat(clean);
        })
        .filter(v => !isNaN(v)); // Mantém estritamente os numéricos válidos

    const numberOfTerms = values.length;
    
    const termsField = document.getElementById("number-of-terms");
    const minField = document.getElementById("min-value");
    const maxField = document.getElementById("max-value");
    const rangeField = document.getElementById("range-values");
    const meanField = document.getElementById("mean-value");

    if (!numberOfTerms) {
        if (termsField) termsField.value = "Nenhum valor";
        if (minField) minField.value = "Nenhum valor";
        if (maxField) maxField.value = "Nenhum valor";
        if (rangeField) rangeField.value = "Nenhum valor";
        if (meanField) meanField.value = "Nenhum valor";
        return;
    }

    const minValue = Math.min(...values);
    const maxValue = Math.max(...values);
    const range = maxValue - minValue;
    const sum = values.reduce((acc, val) => acc + val, 0);
    const meanValue = sum / numberOfTerms;

    if (termsField) termsField.value = numberOfTerms;
    if (minField) minField.value = Number.isInteger(minValue) ? minValue : minValue.toFixed(4);
    if (maxField) maxField.value = Number.isInteger(maxValue) ? maxValue : maxValue.toFixed(4);
    if (rangeField) rangeField.value = Number.isInteger(range) ? range : range.toFixed(4);
    if (meanField) meanField.value = Number.isInteger(meanValue) ? meanValue : meanValue.toFixed(4);
}

function limparMediaAritmetica() {
    const inputElement = document.getElementById("input-numbers");
    if (inputElement) {
        inputElement.value = "";
        calcularResultadosMedia(); // Executa o recálculo para redefinir as labels para "Nenhum valor"
    }
    console.log("[Média] Dados limpos.");
}

// Dispara o setup interno assim que o script carrega assincronamente na SPA
inicializarMediaAritmetica();