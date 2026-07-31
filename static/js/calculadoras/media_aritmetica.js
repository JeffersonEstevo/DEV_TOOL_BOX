function inicializarMediaAritmetica() {
    const inputElement = document.getElementById("input-numbers");
    if (!inputElement) return;

    // Remove ouvintes duplicados antigos e liga a escuta em tempo real
    inputElement.removeEventListener("input", calcularResultadosMedia);
    inputElement.addEventListener("input", calcularResultadosMedia);

    // Escuta a mudança de modo (Simples / Ponderada)
    const modeRadios = document.querySelectorAll("input[name='mean-mode']");
    modeRadios.forEach(radio => {
        radio.removeEventListener("change", atualizarModoMedia);
        radio.addEventListener("change", atualizarModoMedia);
    });
}

function atualizarModoMedia(e) {
    const currentMode = e.target.value;
    const inputLabel = document.getElementById("input-label");
    const inputNumbers = document.getElementById("input-numbers");
    const meanLabelText = document.getElementById("mean-label-text");
    const labelTermCount = document.getElementById("label-term-count");
    
    const cardMin = document.getElementById("card-min");
    const cardMax = document.getElementById("card-max");
    const cardRange = document.getElementById("card-range");

    if (currentMode === "weighted") {
        if (inputLabel) inputLabel.innerHTML = 'Valores e Pesos <small class="text-muted">(Ex: Valor, Peso por linha)</small>:';
        if (inputNumbers) inputNumbers.placeholder = "Digite no formato valor, peso...\nEx:\n8.5, 2\n7.0, 3\n9.0, 5";
        if (meanLabelText) meanLabelText.textContent = "Média Ponderada";
        if (labelTermCount) labelTermCount.textContent = "Soma dos Pesos";
        
        if (cardMin) cardMin.style.display = "none";
        if (cardMax) cardMax.style.display = "none";
        if (cardRange) cardRange.style.display = "none";
    } else {
        if (inputLabel) inputLabel.innerHTML = "Valores para análise:";
        if (inputNumbers) inputNumbers.placeholder = "Digite os valores separados por vírgula ou um por linha...\nEx:\n10\n20, 35, 42\n50";
        if (meanLabelText) meanLabelText.textContent = "Média Aritmética (x̄)";
        if (labelTermCount) labelTermCount.textContent = "Número de Termos";
        
        if (cardMin) cardMin.style.display = "flex";
        if (cardMax) cardMax.style.display = "flex";
        if (cardRange) cardRange.style.display = "flex";
    }
    calcularResultadosMedia();
}

// Função auxiliar para atualizar o valor e alternar a classe de estilo (empty-state / destacado)
function setFieldValue(field, val) {
    if (!field) return;
    
    if (val === null || val === undefined || val === "" || val === "Nenhum valor") {
        field.value = "Nenhum valor";
        field.classList.add("empty-state");
    } else {
        field.value = val;
        field.classList.remove("empty-state");
    }
}

function calcularResultadosMedia() {
    const inputElement = document.getElementById("input-numbers");
    if (!inputElement) return;
    const input = inputElement.value;

    const termsField = document.getElementById("number-of-terms");
    const minField = document.getElementById("min-value");
    const maxField = document.getElementById("max-value");
    const rangeField = document.getElementById("range-values");
    const meanField = document.getElementById("mean-value");

    const activeModeRadio = document.querySelector("input[name='mean-mode']:checked");
    const currentMode = activeModeRadio ? activeModeRadio.value : "simple";

    if (currentMode === "weighted") {
        // Processamento Média Ponderada
        const lines = input.split('\n');
        let totalWeightedSum = 0;
        let totalWeight = 0;
        let validRows = 0;

        for (let line of lines) {
            if (!line.trim()) continue;
            const parts = line.split(/[\s,;\t]+/);
            if (parts.length >= 2) {
                let val = parseFloat(parts[0].replace(',', '.'));
                let weight = parseFloat(parts[1].replace(',', '.'));

                if (!isNaN(val) && !isNaN(weight)) {
                    totalWeightedSum += val * weight;
                    totalWeight += weight;
                    validRows++;
                }
            }
        }

        if (validRows === 0 || totalWeight === 0) {
            setFieldValue(termsField, "Nenhum valor");
            setFieldValue(meanField, "Nenhum valor");
            return;
        }

        const weightedMean = totalWeightedSum / totalWeight;
        const formattedWeight = Number.isInteger(totalWeight) ? totalWeight : totalWeight.toFixed(4).replace(/\.?0+$/, '');
        const formattedMean = Number.isInteger(weightedMean) ? weightedMean : weightedMean.toFixed(4).replace(/\.?0+$/, '');

        setFieldValue(termsField, formattedWeight);
        setFieldValue(meanField, formattedMean);

    } else {
        // Processamento Média Simples
        const values = input.split(/[\n,;\t]+/) 
            .map(v => {
                let clean = v.trim().replace(',', '.');
                return parseFloat(clean);
            })
            .filter(v => !isNaN(v));

        const numberOfTerms = values.length;

        if (!numberOfTerms) {
            setFieldValue(termsField, "Nenhum valor");
            setFieldValue(minField, "Nenhum valor");
            setFieldValue(maxField, "Nenhum valor");
            setFieldValue(rangeField, "Nenhum valor");
            setFieldValue(meanField, "Nenhum valor");
            return;
        }

        const minValue = Math.min(...values);
        const maxValue = Math.max(...values);
        const range = maxValue - minValue;
        const sum = values.reduce((acc, val) => acc + val, 0);
        const meanValue = sum / numberOfTerms;

        const formattedMin = Number.isInteger(minValue) ? minValue : minValue.toFixed(4).replace(/\.?0+$/, '');
        const formattedMax = Number.isInteger(maxValue) ? maxValue : maxValue.toFixed(4).replace(/\.?0+$/, '');
        const formattedRange = Number.isInteger(range) ? range : range.toFixed(4).replace(/\.?0+$/, '');
        const formattedMean = Number.isInteger(meanValue) ? meanValue : meanValue.toFixed(4).replace(/\.?0+$/, '');

        setFieldValue(termsField, numberOfTerms);
        setFieldValue(minField, formattedMin);
        setFieldValue(maxField, formattedMax);
        setFieldValue(rangeField, formattedRange);
        setFieldValue(meanField, formattedMean);
    }
}

function limparMediaAritmetica() {
    const inputElement = document.getElementById("input-numbers");
    if (inputElement) {
        inputElement.value = "";
        calcularResultadosMedia();
    }
    console.log("[Média] Dados limpos.");
}

// Dispara o setup interno assim que o script carrega assincronamente na SPA
inicializarMediaAritmetica();