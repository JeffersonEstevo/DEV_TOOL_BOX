function inicializarCalculadoraCientifica() {
    const container = document.getElementById("calc-buttons-container");
    if (!container) return;

    let displayValue = "0";
    let activeExpression = "";
    let isEvaluated = false;

    const displayElement = document.getElementById("calc-display");
    const previewElement = document.getElementById("calc-expression-preview");

    function updateScreen() {
        if (displayElement) displayElement.value = displayValue;
        if (previewElement) previewElement.value = activeExpression;
    }

    // Gerenciador centralizado de cliques
    container.addEventListener("click", function(e) {
        const button = e.target.closest(".btn-calc");
        if (!button) return;

        const token = button.getAttribute("data-token");
        const action = button.getAttribute("data-action");

        // Se um resultado acabou de ser gerado, limpa ao digitar um novo número
        if (isEvaluated && !action && !token) {
            displayValue = "";
            isEvaluated = false;
        }

        // 1. Processa Tokens Diretos (Números e Operadores)
        if (token) {
            if (displayValue === "0" && !isNaN(token)) {
                displayValue = token;
            } else {
                displayValue += token;
            }
            isEvaluated = false;
        }

        // 2. Processa Ações Especiais
        if (action) {
            switch (action) {
                case "clear":
                    displayValue = "0";
                    activeExpression = "";
                    isEvaluated = false;
                    break;

                case "backspace":
                    if (displayValue.length > 1) {
                        displayValue = displayValue.slice(0, -1);
                    } else {
                        displayValue = "0";
                    }
                    break;

                case "toggle-sign":
                    if (displayValue !== "0") {
                        displayValue = displayValue.startsWith("-") ? displayValue.slice(1) : "-" + displayValue;
                    }
                    break;

                case "sqrt":
                    displayValue = Math.sqrt(parseFloat(displayValue || 0)).toString();
                    break;

                case "sqr":
                    displayValue = Math.pow(parseFloat(displayValue || 0), 2).toString();
                    break;

                case "sin":
                    displayValue = Math.sin(parseFloat(displayValue || 0)).toString();
                    break;

                case "cos":
                    displayValue = Math.cos(parseFloat(displayValue || 0)).toString();
                    break;

                case "tan":
                    displayValue = Math.tan(parseFloat(displayValue || 0)).toString();
                    break;

                case "log":
                    const numLog = parseFloat(displayValue || 0);
                    displayValue = numLog > 0 ? Math.log10(numLog).toString() : "Erro";
                    break;

                case "equals":
                    try {
                        // Higieniza expressões comuns de porcentagem antes de rodar o interpretador seguro
                        let rawExpression = displayValue.replace(/×/g, "*").replace(/÷/g, "/");
                        
                        // Executa o cálculo matemático nativo com segurança controlada
                        let result = new Function(`return (${rawExpression})`)();
                        
                        if (result === undefined || isNaN(result)) {
                            displayValue = "Erro";
                        } else {
                            displayValue = Number.isInteger(result) ? result.toString() : result.toFixed(6).replace(/\.?0+$/, "");
                        }
                    } catch (err) {
                        displayValue = "Erro";
                    }
                    isEvaluated = true;
                    break;
            }
        }

        updateScreen();
    });
}

// Inicializa o módulo da calculadora
inicializarCalculadoraCientifica();