// ==========================================
// FUNÇÕES AUXILIARES E MATEMÁTICAS
// ==========================================

function hexParaRgbGrad(hex) {
    hex = hex.replace(/^#/, '');
    if (hex.length === 3) {
        hex = hex.split('').map(s => s + s).join('');
    }
    const num = parseInt(hex, 16);
    return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 };
}

function rgbParaHexGrad(r, g, b) {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
}

function rgbParaHslGrad(r, g, b) {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
        h = s = 0;
    } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }
    return { h: h * 360, s: s * 100, l: l * 100 };
}

function hslParaHexGrad(h, s, l) {
    s /= 100; l /= 100; h /= 360;
    let r, g, b;

    if (s === 0) {
        r = g = b = l;
    } else {
        const hue2rgb = (p, q, t) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1/6) return p + (q - p) * 6 * t;
            if (t < 1/2) return q;
            if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        };
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }
    return rgbParaHexGrad(Math.round(r * 255), Math.round(g * 255), Math.round(b * 255));
}

// ==========================================
// ATUALIZAÇÃO DO GRADIENTE E CONTRASTES
// ==========================================

function atualizarInterfaceGradiente(hex) {
    if (!hex.startsWith('#')) hex = '#' + hex;
    if (!/^#[0-9A-Fa-f]{6}$/.test(hex)) return;

    const preview = document.getElementById('preview-grad-cor');
    const pickerNativo = document.getElementById('picker-grad-nativo');
    const inputHex = document.getElementById('grad-cor-hex');
    const painelDemonstracao = document.getElementById('painel-demonstracao');
    const escalaContainer = document.getElementById('escala-tonal-container');

    // Sincroniza elementos de entrada base
    if (preview) preview.style.backgroundColor = hex;
    if (pickerNativo) pickerNativo.value = hex;
    if (inputHex && document.activeElement !== inputHex) inputHex.value = hex.toUpperCase();
    
    // Atualiza o fundo da área de visualização de texto
    if (painelDemonstracao) painelDemonstracao.style.backgroundColor = hex;

    // Gera a Escala Tonal (Claro -> Escuro) mantendo Matiz e Saturação
    if (escalaContainer) {
        escalaContainer.innerHTML = '';
        const rgb = hexParaRgbGrad(hex);
        const hsl = rgbParaHslGrad(rgb.r, rgb.g, rgb.b);

        // Gera 9 variações de luminosidade (de 90% até 10%)
        const passosLuminosidade = [90, 80, 70, 60, 50, 40, 30, 20, 10];

        passosLuminosidade.forEach(luminosidade => {
            const hexTom = hslParaHexGrad(hsl.h, hsl.s, luminosidade);
            const bloco = document.createElement('div');
            bloco.className = 'tom-bloco';
            bloco.style.backgroundColor = hexTom;
            bloco.title = `Luminosidade: ${luminosidade}% (${hexTom})`;
            
            // Se o usuário clicar em um bloco da régua, adota aquela cor como nova base
            bloco.addEventListener('click', () => {
                atualizarInterfaceGradiente(hexTom);
            });

            escalaContainer.appendChild(bloco);
        });
    }
}

// ==========================================
// CAPTURA DE EVENTOS E INICIALIZAÇÃO IMEDIATA
// ==========================================

// Criamos uma função autoexecutável para isolar o escopo e rodar assim que injetado no DOM
(() => {
    const pickerNativo = document.getElementById('picker-grad-nativo');
    const inputHex = document.getElementById('grad-cor-hex');

    if (pickerNativo) {
        // 'input' atualiza em tempo real enquanto arrasta o seletor
        pickerNativo.addEventListener('input', (e) => {
            atualizarInterfaceGradiente(e.target.value);
        });
        
        // 'change' garante o disparo definitivo assim que a paleta fecha ou perde o foco
        pickerNativo.addEventListener('change', (e) => {
            atualizarInterfaceGradiente(e.target.value);
        });
    }

    if (inputHex) {
        inputHex.addEventListener('input', (e) => {
            let valor = e.target.value;
            if (!valor.startsWith('#') && valor.length >= 3) valor = '#' + valor;
            atualizarInterfaceGradiente(valor);
        });
    }

    // Inicializa a interface imediatamente com o azul padrão
    atualizarInterfaceGradiente('#3498DB');
})();