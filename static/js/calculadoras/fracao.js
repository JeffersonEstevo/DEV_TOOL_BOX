// Adiciona nova fração dinamicamente
document.getElementById("add-fraction-field").addEventListener("click", () => {
    const container = document.getElementById("fraction-container");
    const fractionBlocks = container.querySelectorAll(".fraction-block");
    const nextIndex = fractionBlocks.length + 1;

    // Cria o bloco do operador (padrão soma)
    const opDiv = document.createElement("div");
    opDiv.className = "fraction-operator-block";
    opDiv.innerHTML = `
        <div class="fraction-operator">
            <select class="operation-select" aria-label="Operação Matemática">
                <option value="add">+</option>
                <option value="subtract">−</option>
                <option value="multiply">×</option>
                <option value="divide">÷</option>
            </select>
        </div>
    `;

    // Cria o novo bloco da fração
    const fracDiv = document.createElement("div");
    fracDiv.className = "fraction-block";
    fracDiv.setAttribute("data-index", nextIndex);
    fracDiv.innerHTML = `
        <div class="field-group">
            <input type="number" class="numerator" placeholder="Numerador ${nextIndex}" aria-label="Numerador ${nextIndex}">
        </div>
        <div class="fraction-line"></div>
        <div class="field-group">
            <input type="number" class="denominator" placeholder="Denominador ${nextIndex}" aria-label="Denominador ${nextIndex}">
        </div>
    `;

    container.appendChild(opDiv);
    container.appendChild(fracDiv);
});

// Remove a última fração (mantendo pelo menos 2)
document.getElementById("remove-fraction-field").addEventListener("click", () => {
    const container = document.getElementById("fraction-container");
    const fractionBlocks = container.querySelectorAll(".fraction-block");

    if (fractionBlocks.length <= 2) {
        alert("A calculadora precisa de pelo menos 2 frações para realizar a operação.");
        return;
    }

    // Remove o último bloco de fração e o operador imediatamente anterior
    container.removeChild(container.lastChild);
    container.removeChild(container.lastChild);
});

function executarCalculoDeFracao() {
    const container = document.getElementById("fraction-container");
    const numInputs = container.querySelectorAll(".numerator");
    const denInputs = container.querySelectorAll(".denominator");
    const opSelects = container.querySelectorAll(".operation-select");

    const fractionResult = document.getElementById("fraction-result");
    const decimalResult = document.getElementById("decimal-result");

    if (!fractionResult || !decimalResult) return;

    let nums = [];
    let dens = [];

    for (let i = 0; i < numInputs.length; i++) {
        const num = parseInt(numInputs[i].value, 10);
        const den = parseInt(denInputs[i].value, 10);

        if (isNaN(num) || isNaN(den)) {
            alert("Por favor, preencha todos os campos com números válidos.");
            return;
        }

        if (den === 0) {
            alert("O denominador de uma fração não pode ser igual a zero.");
            return;
        }

        nums.push(num);
        dens.push(den);
    }

    // Coleta as operações sequenciais
    let ops = [];
    opSelects.forEach(sel => ops.push(sel.value));

    // Função auxiliar para aplicar a operação entre duas frações (n1/d1 e n2/d2)
    const operar = (n1, d1, n2, d2, op) => {
        let rNum, rDen;
        switch (op) {
            case "add":
                rNum = n1 * d2 + n2 * d1;
                rDen = d1 * d2;
                break;
            case "subtract":
                rNum = n1 * d2 - n2 * d1;
                rDen = d1 * d2;
                break;
            case "multiply":
                rNum = n1 * n2;
                rDen = d1 * d2;
                break;
            case "divide":
                if (n2 === 0) throw new Error("Divisão por zero.");
                rNum = n1 * d2;
                rDen = d1 * n2;
                break;
        }
        return { num: rNum, den: rDen };
    };

    // Executa o cálculo sequencialmente (ex: (F1 op1 F2) op2 F3 ...)
    let currentNum = nums[0];
    let currentDen = dens[0];

    try {
        for (let i = 0; i < ops.length; i++) {
            const nextNum = nums[i + 1];
            const nextDen = dens[i + 1];
            const res = operar(currentNum, currentDen, nextNum, nextDen, ops[i]);
            currentNum = res.num;
            currentDen = res.den;
        }
    } catch (e) {
        alert("Não é possível realizar uma divisão por zero.");
        return;
    }

    // Máximo Divisor Comum (MDC) para simplificar
    const mdc = (a, b) => (b === 0 ? Math.abs(a) : mdc(b, a % b));
    const divisor = mdc(currentNum, currentDen);

    currentNum /= divisor;
    currentDen /= divisor;

    // Ajuste de sinal
    if (currentDen < 0) {
        currentNum = -currentNum;
        currentDen = -currentDen;
    }

    // Renderização do Resultado em Fração
    if (currentNum === 0) {
        fractionResult.innerHTML = `<span class="decimal-output-display">0</span>`;
    } else if (currentNum === currentDen) {
        fractionResult.innerHTML = `<span class="decimal-output-display">1</span>`;
    } else {
        fractionResult.innerHTML = `
            <div class="fraction-output-display">
                <span>${currentNum}</span>
                <div class="fraction-output-line"></div>
                <span>${currentDen}</span>
            </div>
        `;
    }

    // Renderização do Resultado Decimal
    const decimalValue = currentNum / currentDen;
    decimalResult.innerHTML = `
        <span class="decimal-output-display">
            ${Number.isInteger(decimalValue) ? decimalValue : decimalValue.toFixed(4)}
        </span>
    `;
}

function limparCalculoDeFracao() {
    const container = document.getElementById("fraction-container");
    
    // Reseta para apenas 2 frações originais
    container.innerHTML = `
        <div class="fraction-block" data-index="1">
            <div class="field-group">
                <input type="number" class="numerator" placeholder="Numerador 1" aria-label="Numerador 1">
            </div>
            <div class="fraction-line"></div>
            <div class="field-group">
                <input type="number" class="denominator" placeholder="Denominador 1" aria-label="Denominador 1">
            </div>
        </div>
        <div class="fraction-operator-block">
            <div class="fraction-operator">
                <select class="operation-select" aria-label="Operação Matemática">
                    <option value="add">+</option>
                    <option value="subtract">−</option>
                    <option value="multiply">×</option>
                    <option value="divide">÷</option>
                </select>
            </div>
        </div>
        <div class="fraction-block" data-index="2">
            <div class="field-group">
                <input type="number" class="numerator" placeholder="Numerador 2" aria-label="Numerador 2">
            </div>
            <div class="fraction-line"></div>
            <div class="field-group">
                <input type="number" class="denominator" placeholder="Denominador 2" aria-label="Denominador 2">
            </div>
        </div>
    `;

    document.getElementById("fraction-result").innerHTML = `<span class="text-muted">Aguardando dados...</span>`;
    document.getElementById("decimal-result").innerHTML = `<span class="text-muted">Aguardando dados...</span>`;
    
    console.log("[Frações] Calculadora limpa e reiniciada!");
}