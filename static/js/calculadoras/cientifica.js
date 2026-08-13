/**
 * Módulo de Calculadora Científica (Compatível com SPA / Content Loader - Seguro contra re-declaração)
 */
window.CalculadoraCientifica = window.CalculadoraCientifica || (function () {
    // Estado interno da calculadora
    let state = {
        currentInput: "0",
        expressionTokens: [],
        memoryValue: 0,
        isDegMode: true, // true = DEG, false = RAD
        isEvaluated: false
    };

    const OPERATORS = {
        "+": { precedence: 1, associativity: "L" },
        "-": { precedence: 1, associativity: "L" },
        "*": { precedence: 2, associativity: "L" },
        "/": { precedence: 2, associativity: "L" },
        "^": { precedence: 3, associativity: "R" }
    };

    // --- Utilitários de Interface ---
    function updateScreen() {
        const displayElement = document.getElementById("calc-display");
        const previewElement = document.getElementById("calc-expression-preview");
        const modeIndicator = document.getElementById("calc-mode-indicator");
        const memoryIndicator = document.getElementById("calc-memory-indicator");

        if (displayElement) displayElement.value = state.currentInput;
        if (previewElement) previewElement.textContent = state.expressionTokens.join(" ");
        if (modeIndicator) modeIndicator.textContent = state.isDegMode ? "DEG" : "RAD";
        if (memoryIndicator) {
            memoryIndicator.classList.toggle("hidden", state.memoryValue === 0);
        }
    }

    function setError(message = "Erro") {
        state.currentInput = message;
        state.expressionTokens = [];
        state.isEvaluated = true;
        updateScreen();
    }

    // --- Auxiliares Matemáticos ---
    function toRadians(angle) {
        return state.isDegMode ? (angle * Math.PI) / 180 : angle;
    }

    function toDegrees(rad) {
        return state.isDegMode ? (rad * 180) / Math.PI : rad;
    }

    function factorial(n) {
        if (n < 0 || !Number.isInteger(n)) return NaN;
        if (n === 0 || n === 1) return 1;
        if (n > 170) return Infinity;
        let res = 1;
        for (let i = 2; i <= n; i++) res *= i;
        return res;
    }

    // --- Parser Shunting-Yard & Avaliador RPN ---
    function evaluateRPN(rpnTokens) {
        const stack = [];
        for (const token of rpnTokens) {
            if (!isNaN(parseFloat(token))) {
                stack.push(parseFloat(token));
            } else if (token in OPERATORS) {
                if (stack.length < 2) throw new Error("Expressão inválida");
                const b = stack.pop();
                const a = stack.pop();

                switch (token) {
                    case "+": stack.push(a + b); break;
                    case "-": stack.push(a - b); break;
                    case "*": stack.push(a * b); break;
                    case "/":
                        if (b === 0) throw new Error("Divisão por zero");
                        stack.push(a / b);
                        break;
                    case "^": stack.push(Math.pow(a, b)); break;
                }
            }
        }
        if (stack.length !== 1) throw new Error("Expressão inválida");
        return stack[0];
    }

    function parseAndCalculate(tokens) {
        const outputQueue = [];
        const operatorStack = [];

        const sanitizedTokens = tokens.map(t => {
            if (t === "π") return Math.PI.toString();
            if (t === "e") return Math.E.toString();
            return t;
        });

        for (const token of sanitizedTokens) {
            if (!isNaN(parseFloat(token))) {
                outputQueue.push(token);
            } else if (token in OPERATORS) {
                const o1 = token;
                while (
                    operatorStack.length > 0 &&
                    operatorStack[operatorStack.length - 1] !== "(" &&
                    (
                        OPERATORS[operatorStack[operatorStack.length - 1]].precedence > OPERATORS[o1].precedence ||
                        (OPERATORS[operatorStack[operatorStack.length - 1]].precedence === OPERATORS[o1].precedence && OPERATORS[o1].associativity === "L")
                    )
                ) {
                    outputQueue.push(operatorStack.pop());
                }
                operatorStack.push(o1);
            } else if (token === "(") {
                operatorStack.push(token);
            } else if (token === ")") {
                while (operatorStack.length > 0 && operatorStack[operatorStack.length - 1] !== "(") {
                    outputQueue.push(operatorStack.pop());
                }
                if (operatorStack.length === 0) throw new Error("Parênteses desbalanceados");
                operatorStack.pop();
            }
        }

        while (operatorStack.length > 0) {
            const op = operatorStack.pop();
            if (op === "(" || op === ")") throw new Error("Parênteses desbalanceados");
            outputQueue.push(op);
        }

        return evaluateRPN(outputQueue);
    }

    function calculateResult() {
        try {
            let fullTokens = [...state.expressionTokens];
            if (state.currentInput !== "" && !state.isEvaluated) {
                fullTokens.push(state.currentInput);
            }

            if (fullTokens.length === 0) return;

            const res = parseAndCalculate(fullTokens);

            if (!isFinite(res)) {
                setError(isNaN(res) ? "Entrada Inválida" : "Estouro de Valor");
                return;
            }

            state.currentInput = Number.isInteger(res)
                ? res.toString()
                : parseFloat(res.toFixed(10)).toString();

            state.expressionTokens = [];
            state.isEvaluated = true;
        } catch (err) {
            setError(err.message === "Divisão por zero" ? "Divisão por 0" : "Erro de Sintaxe");
        }
    }

    function applyUnaryFunction(fn) {
        let val = parseFloat(state.currentInput);
        if (isNaN(val)) return;

        let result = 0;
        try {
            switch (fn) {
                case "sin": result = Math.sin(toRadians(val)); break;
                case "cos": result = Math.cos(toRadians(val)); break;
                case "tan": result = Math.tan(toRadians(val)); break;
                case "asin": result = toDegrees(Math.asin(val)); break;
                case "acos": result = toDegrees(Math.acos(val)); break;
                case "atan": result = toDegrees(Math.atan(val)); break;
                case "log":
                    if (val <= 0) throw new Error();
                    result = Math.log10(val);
                    break;
                case "ln":
                    if (val <= 0) throw new Error();
                    result = Math.log(val);
                    break;
                case "sqrt":
                    if (val < 0) throw new Error();
                    result = Math.sqrt(val);
                    break;
                case "cbrt": result = Math.cbrt(val); break;
                case "exp10": result = Math.pow(10, val); break;
                case "expe": result = Math.exp(val); break;
                case "factorial": result = factorial(val); break;
                case "percent": result = val / 100; break;
            }

            if (!isFinite(result) || isNaN(result)) {
                setError("Entrada Inválida");
                return;
            }

            state.currentInput = parseFloat(result.toFixed(10)).toString();
            state.isEvaluated = true;
        } catch (err) {
            setError("Entrada Inválida");
        }
    }

    // --- Ponto de Entrada para o Evento de Clique Global ---
    function processarAcao(buttonElement) {
        if (!buttonElement) return;

        const token = buttonElement.getAttribute("data-token");
        const action = buttonElement.getAttribute("data-action");

        // 1. Processa Tokens
        if (token) {
            if (state.isEvaluated && !isNaN(token)) {
                state.currentInput = token;
                state.isEvaluated = false;
            } else if (token in OPERATORS || token === "(" || token === ")") {
                if (state.currentInput !== "") {
                    state.expressionTokens.push(state.currentInput);
                    state.currentInput = "";
                }
                state.expressionTokens.push(token);
                state.isEvaluated = false;
            } else {
                if (state.currentInput === "0" && token !== ".") {
                    state.currentInput = token;
                } else if (token === "." && state.currentInput.includes(".")) {
                    return;
                } else {
                    state.currentInput += token;
                }
                state.isEvaluated = false;
            }
        }

        // 2. Processa Ações
        if (action) {
            switch (action) {
                case "clear":
                    state.currentInput = "0";
                    state.expressionTokens = [];
                    state.isEvaluated = false;
                    break;

                case "backspace":
                    if (state.isEvaluated) break;
                    state.currentInput = state.currentInput.length > 1 
                        ? state.currentInput.slice(0, -1) 
                        : "0";
                    break;

                case "toggle-sign":
                    if (state.currentInput !== "0" && state.currentInput !== "") {
                        state.currentInput = state.currentInput.startsWith("-")
                            ? state.currentInput.slice(1)
                            : "-" + state.currentInput;
                    }
                    break;

                case "toggle-angle":
                    state.isDegMode = !state.isDegMode;
                    break;

                case "equals":
                    calculateResult();
                    break;

                // Memória
                case "mc": state.memoryValue = 0; break;
                case "mr":
                    state.currentInput = state.memoryValue.toString();
                    state.isEvaluated = true;
                    break;
                case "m-plus":
                    state.memoryValue += parseFloat(state.currentInput || 0);
                    break;
                case "m-minus":
                    state.memoryValue -= parseFloat(state.currentInput || 0);
                    break;

                default:
                    applyUnaryFunction(action);
                    break;
            }
        }

        updateScreen();
    }

    return {
        processarAcao
    };
})();

// Função global exportada para ser chamada no seu Content Loader
window.gerenciarCalculadoraCientifica = function (buttonElement) {
    window.CalculadoraCientifica.processarAcao(buttonElement);
};