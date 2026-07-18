// ==========================================
// FUNÇÕES MATEMÁTICAS DE INTERPOLAÇÃO (MIXER)
// ==========================================

function hexParaRgbMixer(hex) {
    hex = hex.replace(/^#/, '');
    if (hex.length === 3) {
        hex = hex.split('').map(s => s + s).join('');
    }
    const num = parseInt(hex, 16);
    return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 };
}

function rgbParaHexMixer(r, g, b) {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
}

// Calcula o valor intermediário com base no percentual (0 a 1)
function interpolarCanal(canalA, canalB, percentual) {
    return Math.round(canalA + (canalB - canalA) * percentual);
}

// ==========================================
// ATUALIZAÇÃO DA INTERFACE DO MISTURADOR
// ==========================================

function calcularEMisturarCores() {
    let hexA = document.getElementById('input-mixer-a').value;
    let hexB = document.getElementById('input-mixer-b').value;

    if (!hexA.startsWith('#')) hexA = '#' + hexA;
    if (!hexB.startsWith('#')) hexB = '#' + hexB;

    if (!/^#[0-9A-Fa-f]{6}$/.test(hexA) || !/^#[0-9A-Fa-f]{6}$/.test(hexB)) return;

    const previewA = document.getElementById('preview-mixer-a');
    const previewB = document.getElementById('preview-mixer-b');
    const pickerA = document.getElementById('picker-mixer-a');
    const pickerB = document.getElementById('picker-mixer-b');
    const faixaGradiente = document.getElementById('faixa-gradiente-resultado');
    const listaCodigos = document.getElementById('lista-codigos-mixer');

    if (previewA) previewA.style.backgroundColor = hexA;
    if (previewB) previewB.style.backgroundColor = hexB;
    if (pickerA) pickerA.value = hexA;
    if (pickerB) pickerB.value = hexB;

    if (faixaGradiente) {
        faixaGradiente.style.background = `linear-gradient(to right, ${hexA}, ${hexB})`;
    }

    if (listaCodigos) {
        listaCodigos.innerHTML = '';
        const rgbA = hexParaRgbMixer(hexA);
        const rgbB = hexParaRgbMixer(hexB);

        const totalPassos = 21;

        for (let i = 0; i < totalPassos; i++) {
            const percentual = i / (totalPassos - 1);
            
            const r = interpolarCanal(rgbA.r, rgbB.r, percentual);
            const g = interpolarCanal(rgbA.g, rgbB.g, percentual);
            const b = interpolarCanal(rgbA.b, rgbB.b, percentual);
            
            const hexIntermediario = rgbParaHexMixer(r, g, b);

            const item = document.createElement('div');
            item.className = 'item-codigo-mistura';

            const amostra = document.createElement('div');
            amostra.className = 'bloco-cor-amostra';
            amostra.style.backgroundColor = hexIntermediario;
            amostra.style.cursor = 'pointer'; // Muda o cursor para indicar clique
            amostra.title = "Clique para copiar";

            // --- LÓGICA DE CÓPIA ADICIONADA AQUI ---
            amostra.addEventListener('click', () => {
                navigator.clipboard.writeText(hexIntermediario).then(() => {
                    // Feedback visual simples alterando o tooltip temporariamente
                    amostra.title = "Copiado!";
                    
                    // Altera levemente a opacidade como feedback tátil rápido
                    amostra.style.opacity = '0.5';
                    
                    setTimeout(() => {
                        amostra.title = "Clique para copiar";
                        amostra.style.opacity = '1';
                    }, 1000);
                }).catch(err => {
                    console.error('Erro ao copiar cor: ', err);
                });
            });
            // ----------------------------------------

            const texto = document.createElement('span');
            texto.className = 'texto-codigo-amostra';
            texto.textContent = hexIntermediario;

            item.appendChild(amostra);
            item.appendChild(texto);
            listaCodigos.appendChild(item);
        }
    }
}

// ==========================================
// CAPTURA DE EVENTOS E DISPARO IMEDIATO (SPA)
// ==========================================

(() => {
    const pickerA = document.getElementById('picker-mixer-a');
    const pickerB = document.getElementById('picker-mixer-b');
    const inputA = document.getElementById('input-mixer-a');
    const inputB = document.getElementById('input-mixer-b');

    // Vincular eventos aos seletores visuais da Cor A
    if (pickerA && inputA) {
        pickerA.addEventListener('input', (e) => {
            inputA.value = e.target.value.toUpperCase();
            calcularEMisturarCores();
        });
        pickerA.addEventListener('change', (e) => {
            inputA.value = e.target.value.toUpperCase();
            calcularEMisturarCores();
        });
        inputA.addEventListener('input', (e) => {
            let valor = e.target.value;
            if (!valor.startsWith('#') && valor.length >= 3) valor = '#' + valor;
            if (/^#[0-9A-Fa-f]{6}$/.test(valor)) {
                calcularEMisturarCores();
            }
        });
    }

    // Vincular eventos aos seletores visuais da Cor B
    if (pickerB && inputB) {
        pickerB.addEventListener('input', (e) => {
            inputB.value = e.target.value.toUpperCase();
            calcularEMisturarCores();
        });
        pickerB.addEventListener('change', (e) => {
            inputB.value = e.target.value.toUpperCase();
            calcularEMisturarCores();
        });
        inputB.addEventListener('input', (e) => {
            let valor = e.target.value;
            if (!valor.startsWith('#') && valor.length >= 3) valor = '#' + valor;
            if (/^#[0-9A-Fa-f]{6}$/.test(valor)) {
                calcularEMisturarCores();
            }
        });
    }

    // Inicializa os campos com as cores sugeridas no seu exemplo
    if (inputA) inputA.value = '#66FF99';
    if (inputB) inputB.value = '#33CCFF';

    // Executa a primeira renderização imediatamente
    calcularEMisturarCores();
})();