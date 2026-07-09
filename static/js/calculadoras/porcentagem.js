function inicializarCalculadoraPorcentagem() {
    const mapeamento = [
        { inputs: ['percentage-of-value', 'value-of-percentage'], handler: calculateQuantity },
        { inputs: ['partial-value', 'total-value'], handler: calculatePercentage },
        { inputs: ['partial-value-of-total', 'percentage-of-total'], handler: calculateTotalValue },
        { inputs: ['base-value-increase', 'percentage-increase'], handler: calculateIncrease },
        { inputs: ['base-value-decrease', 'percentage-decrease'], handler: calculateDecrease }
    ];

    mapeamento.forEach(bloco => {
        bloco.inputs.forEach(id => {
            const el = document.getElementById(id);
            if (el) {
                el.removeEventListener('input', bloco.handler);
                el.addEventListener('input', bloco.handler);
            }
        });
    });
}

function calculateQuantity() {
    const percentage = parseFloat(document.getElementById('percentage-of-value').value);
    const value = parseFloat(document.getElementById('value-of-percentage').value);
    const output = document.getElementById('result-quantity');
    
    if (isNaN(percentage) || isNaN(value)) { output.value = ''; return; }
    const result = (percentage / 100) * value;
    output.value = Number.isInteger(result) ? result : result.toFixed(2);
}

function calculatePercentage() {
    const partial = parseFloat(document.getElementById('partial-value').value);
    const total = parseFloat(document.getElementById('total-value').value);
    const output = document.getElementById('result-percentage');
    
    if (isNaN(partial) || isNaN(total)) { output.value = ''; return; }
    if (total === 0) { output.value = 'Divisão por zero'; return; }
    const result = (partial / total) * 100;
    output.value = `${Number.isInteger(result) ? result : result.toFixed(2)}%`;
}

function calculateTotalValue() {
    const partial = parseFloat(document.getElementById('partial-value-of-total').value);
    const percentage = parseFloat(document.getElementById('percentage-of-total').value);
    const output = document.getElementById('result-total-value');
    
    if (isNaN(partial) || isNaN(percentage)) { output.value = ''; return; }
    if (percentage === 0) { output.value = 'Porcentagem inválida'; return; }
    const result = (partial / percentage) * 100;
    output.value = Number.isInteger(result) ? result : result.toFixed(2);
}

function calculateIncrease() {
    const base = parseFloat(document.getElementById('base-value-increase').value);
    const percentage = parseFloat(document.getElementById('percentage-increase').value);
    const output = document.getElementById('result-increase');
    
    if (isNaN(base) || isNaN(percentage)) { output.value = ''; return; }
    const result = base + (base * (percentage / 100));
    output.value = Number.isInteger(result) ? result : result.toFixed(2);
}

function calculateDecrease() {
    const base = parseFloat(document.getElementById('base-value-decrease').value);
    const percentage = parseFloat(document.getElementById('percentage-decrease').value);
    const output = document.getElementById('result-decrease');
    
    if (isNaN(base) || isNaN(percentage)) { output.value = ''; return; }
    const result = base - (base * (percentage / 100));
    output.value = Number.isInteger(result) ? result : result.toFixed(2);
}

function limparCalculadoraPorcentagem() {
    const inputs = [
        'percentage-of-value', 'value-of-percentage', 'result-quantity',
        'partial-value', 'total-value', 'result-percentage',
        'partial-value-of-total', 'percentage-of-total', 'result-total-value',
        'base-value-increase', 'percentage-increase', 'result-increase',
        'base-value-decrease', 'percentage-decrease', 'result-decrease'
    ];
    inputs.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = '';
    });
    console.log("[Porcentagem] Painéis redefinidos.");
}

// Inicialização imediata ao carregar o script de escuta dinâmico
inicializarCalculadoraPorcentagem();