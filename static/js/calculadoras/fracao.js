function executarCalculoDeFracao() {
    const num1 = parseInt(document.getElementById("numerator1").value, 10);
    const den1 = parseInt(document.getElementById("denominator1").value, 10);
    const num2 = parseInt(document.getElementById("numerator2").value, 10);
    const den2 = parseInt(document.getElementById("denominator2").value, 10);
    const operation = document.getElementById("operation").value;

    const fractionResult = document.getElementById("fraction-result");
    const decimalResult = document.getElementById("decimal-result");

    if (!fractionResult || !decimalResult) return;

    if (isNaN(num1) || isNaN(den1) || isNaN(num2) || isNaN(den2)) {
        alert("Por favor, preencha todos os campos com números válidos.");
        return;
    }

    if (den1 === 0 || den2 === 0) {
        alert("O denominador de uma fração não pode ser igual a zero.");
        return;
    }

    let resultNum, resultDen;
    switch (operation) {
        case "add":
            resultNum = num1 * den2 + num2 * den1;
            resultDen = den1 * den2;
            break;
        case "subtract":
            resultNum = num1 * den2 - num2 * den1;
            resultDen = den1 * den2;
            break;
        case "multiply":
            resultNum = num1 * num2;
            resultDen = den1 * den2;
            break;
        case "divide":
            if (num2 === 0) {
                alert("Não é possível realizar uma divisão por zero (o numerador da segunda fração virou zero).");
                return;
            }
            resultNum = num1 * den2;
            resultDen = den1 * num2;
            break;
    }

    // Função recursiva para obter Máximo Divisor Comum (MDC)
    const mdc = (a, b) => (b === 0 ? Math.abs(a) : mdc(b, a % b));
    const divisor = mdc(resultNum, resultDen);
    
    resultNum /= divisor;
    resultDen /= divisor;

    // Ajuste elegante de sinal (garante que o sinal negativo fique sempre no numerador)
    if (resultDen < 0) {
        resultNum = -resultNum;
        resultDen = -resultDen;
    }

    // Renderização limpa usando as classes criadas no CSS
    if (resultNum === 0) {
        fractionResult.innerHTML = `<span class="decimal-output-display">0</span>`;
    } else if (resultNum === resultDen) {
        fractionResult.innerHTML = `<span class="decimal-output-display">1</span>`;
    } else {
        fractionResult.innerHTML = `
            <div class="fraction-output-display">
                <span>${resultNum}</span>
                <div class="fraction-output-line"></div>
                <span>${resultDen}</span>
            </div>
        `;
    }

    const decimalValue = resultNum / resultDen;
    decimalResult.innerHTML = `
        <span class="decimal-output-display">
            ${Number.isInteger(decimalValue) ? decimalValue : decimalValue.toFixed(4)}
        </span>
    `;
}

function limparCalculoDeFracao() {
    const fields = ["numerator1", "denominator1", "numerator2", "denominator2"];
    fields.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = "";
    });

    const op = document.getElementById("operation");
    if (op) op.value = "add";

    const fractionResult = document.getElementById("fraction-result");
    const decimalResult = document.getElementById("decimal-result");

    if (fractionResult) fractionResult.innerHTML = `<span class="text-muted">Aguardando dados...</span>`;
    if (decimalResult) decimalResult.innerHTML = `<span class="text-muted">Aguardando dados...</span>`;
    
    console.log("[Frações] Calculadora limpa!");
}

console.log("Módulo de Calculadora de Frações carregado!");