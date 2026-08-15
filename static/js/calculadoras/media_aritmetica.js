/* ==========================================================================
   === 02. CALCULADORAS - 02. Média Aritmética (Simples + Ponderada) ===
   === Adaptado para SPA: cliques são delegados globalmente em scripts.js ===
   === Este arquivo só expõe as funções chamadas por lá + os listeners    ===
   === de "input" dos textareas (cálculo em tempo real).                 ===
   ========================================================================== */

/* --------------------------------------------------------------------
 * 0. CONTROLE DE ABAS (ligado via onclick inline no HTML, como no
 * padrão CPF/Trabalhista — não passa pelo delegador de scripts.js)
 * -------------------------------------------------------------------- */
function alternarAbaMedia(idAba) {
    document.querySelectorAll('.tool-container .tab-content').forEach(aba => {
        aba.classList.remove('active');
    });
    document.querySelectorAll('.tool-container .rede-tabs .tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    const alvo = document.getElementById(idAba);
    if (alvo) alvo.classList.add('active');

    document.querySelectorAll('.tool-container .rede-tabs .tab-btn').forEach(btn => {
        if (btn.getAttribute('onclick') && btn.getAttribute('onclick').includes(idAba)) {
            btn.classList.add('active');
        }
    });
}

/* --------------------------------------------------------------------
 * 1. HELPER COMPARTILHADO (idêntico ao original)
 * -------------------------------------------------------------------- */
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

// Mesma formatação do original: inteiro fica limpo, decimal usa 4 casas com zeros à direita removidos
function formatarValor(num) {
    return Number.isInteger(num) ? num : num.toFixed(4).replace(/\.?0+$/, '');
}

/* --------------------------------------------------------------------
 * 2. MÉDIA SIMPLES
 * Lógica de parsing e formatação idêntica ao script original.
 * Nome da função de limpar MANTIDO como "limparMediaAritmetica" porque
 * é esse o nome que o delegador de eventos em scripts.js já chama.
 * -------------------------------------------------------------------- */
function calcularResultadosMediaSimples() {
    const inputElement = document.getElementById("input-numbers");
    if (!inputElement) return;
    const input = inputElement.value;

    const termsField = document.getElementById("number-of-terms");
    const minField = document.getElementById("min-value");
    const maxField = document.getElementById("max-value");
    const rangeField = document.getElementById("range-values");
    const meanField = document.getElementById("mean-value");

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

    setFieldValue(termsField, numberOfTerms);
    setFieldValue(minField, formatarValor(minValue));
    setFieldValue(maxField, formatarValor(maxValue));
    setFieldValue(rangeField, formatarValor(range));
    setFieldValue(meanField, formatarValor(meanValue));
}

function limparMediaAritmetica() {
    const inputElement = document.getElementById("input-numbers");
    if (inputElement) {
        inputElement.value = "";
        calcularResultadosMediaSimples();
        inputElement.focus();
    }
}

/* --------------------------------------------------------------------
 * 3. MÉDIA PONDERADA
 * Formato mantido do original: "valor, peso" (ou separado por espaço/tab/;),
 * uma linha por par.
 * Extra em relação ao original: Mín/Máx/Amplitude calculados sobre a coluna
 * de valores, e "Número de Termos" (pares válidos) exibido separadamente
 * de "Soma dos Pesos".
 * -------------------------------------------------------------------- */
function calcularResultadosMediaPonderada() {
    const inputElement = document.getElementById("input-numbers-ponderada");
    if (!inputElement) return;
    const input = inputElement.value;

    const termsField = document.getElementById("number-of-terms-ponderada");
    const minField = document.getElementById("min-value-ponderada");
    const maxField = document.getElementById("max-value-ponderada");
    const weightField = document.getElementById("weight-total-ponderada");
    const meanField = document.getElementById("mean-value-ponderada");

    const lines = input.split('\n');
    let totalWeightedSum = 0;
    let totalWeight = 0;
    let validRows = 0;
    const valores = [];

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
                valores.push(val);
            }
        }
    }

    if (validRows === 0) {
        setFieldValue(termsField, "Nenhum valor");
        setFieldValue(minField, "Nenhum valor");
        setFieldValue(maxField, "Nenhum valor");
        setFieldValue(weightField, "Nenhum valor");
        setFieldValue(meanField, "Nenhum valor");
        return;
    }

    setFieldValue(termsField, validRows);
    setFieldValue(minField, formatarValor(Math.min(...valores)));
    setFieldValue(maxField, formatarValor(Math.max(...valores)));
    setFieldValue(weightField, formatarValor(totalWeight));

    if (totalWeight === 0) {
        setFieldValue(meanField, "Peso total é zero");
        return;
    }

    const weightedMean = totalWeightedSum / totalWeight;
    setFieldValue(meanField, formatarValor(weightedMean));
}

function limparMediaAritmeticaPonderada() {
    const inputElement = document.getElementById("input-numbers-ponderada");
    if (inputElement) {
        inputElement.value = "";
        calcularResultadosMediaPonderada();
        inputElement.focus();
    }
}

/* --------------------------------------------------------------------
 * 4. INICIALIZAÇÃO
 * Liga apenas os listeners de "input" (cálculo em tempo real).
 * Cliques em botões (limpar/copiar) são tratados pelo delegador
 * global em scripts.js — não registramos listeners de clique aqui.
 * -------------------------------------------------------------------- */
function inicializarMediaAritmetica() {
    const inputSimples = document.getElementById("input-numbers");
    const inputPonderada = document.getElementById("input-numbers-ponderada");
    if (!inputSimples || !inputPonderada) return;

    inputSimples.removeEventListener("input", calcularResultadosMediaSimples);
    inputSimples.addEventListener("input", calcularResultadosMediaSimples);

    inputPonderada.removeEventListener("input", calcularResultadosMediaPonderada);
    inputPonderada.addEventListener("input", calcularResultadosMediaPonderada);

    // Cálculo inicial (garante estado "Nenhum valor" nos dois lados)
    calcularResultadosMediaSimples();
    calcularResultadosMediaPonderada();
}

// Dispara o setup interno assim que o script carrega assincronamente na SPA
inicializarMediaAritmetica();
