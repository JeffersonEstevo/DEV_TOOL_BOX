// ==========================================
// FUNÇÕES MATEMÁTICAS DE CONVERSÃO DE CORES
// ==========================================

// HEX -> RGB
function hexParaRgb(hex) {
    hex = hex.replace(/^#/, '');
    if (hex.length === 3) {
        hex = hex.split('').map(s => s + s).join('');
    }
    const num = parseInt(hex, 16);
    return {
        r: (num >> 16) & 255,
        g: (num >> 8) & 255,
        b: num & 255
    };
}

// RGB -> HEX
function rgbParaHex(r, g, b) {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
}

// RGB -> HSL
function rgbParaHsl(r, g, b) {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
        h = s = 0; // Tons de cinza
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
    return {
        h: Math.round(h * 360),
        s: Math.round(s * 100),
        l: Math.round(l * 100)
    };
}

// HSL -> RGB
function hslParaRgb(h, s, l) {
    s /= 100; l /= 100; h /= 360;
    let r, g, b;

    if (s === 0) {
        r = g = b = l; // Tons de cinza
    } else {
        const hueParaRgb = (p, q, t) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1/6) return p + (q - p) * 6 * t;
            if (t < 1/2) return q;
            if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        };
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        r = hueParaRgb(p, q, h + 1/3);
        g = hueParaRgb(p, q, h);
        b = hueParaRgb(p, q, h - 1/3);
    }
    return {
        r: Math.round(r * 255),
        g: Math.round(g * 255),
        b: Math.round(b * 255)
    };
}

// ==========================================
// SINCRONIZAÇÃO DA INTERFACE EM TEMPO REAL
// ==========================================

function atualizarInterfacePorHex(hex) {
    // Garante que comece com # para passar na validação e nos estilos
    if (!hex.startsWith('#')) hex = '#' + hex;

    // Valida o formato hexadecimal de 6 dígitos antes de prosseguir
    if (!/^#[0-9A-Fa-f]{6}$/.test(hex)) return;

    const preview = document.getElementById('preview-cor');
    const pickerNativo = document.getElementById('picker-nativo');
    const inputHex = document.getElementById('cor-hex');
    const inputRgb = document.getElementById('cor-rgb');
    const inputHsl = document.getElementById('cor-hsl');

    // Atualiza visualizadores de cor de fundo e o picker visual
    if (preview) preview.style.backgroundColor = hex;
    if (pickerNativo) pickerNativo.value = hex;
    
    // Atualiza o input de texto HEX (apenas se o usuário não estiver digitando nele)
    if (inputHex && document.activeElement !== inputHex) {
        inputHex.value = hex.toUpperCase(); // Fica mais elegante em maiúsculo
    }

    // Converte e injeta no input RGB
    const rgb = hexParaRgb(hex);
    if (inputRgb && document.activeElement !== inputRgb) {
        inputRgb.value = `${rgb.r}, ${rgb.g}, ${rgb.b}`;
    }

    // Converte e injeta no input HSL
    const hsl = rgbParaHsl(rgb.r, rgb.g, rgb.b);
    if (inputHsl && document.activeElement !== inputHsl) {
        inputHsl.value = `${hsl.h}°, ${hsl.s}%, ${hsl.l}%`;
    }
}

// Atualiza a interface a partir da digitação no input RGB
function atualizarInterfacePorRgb(valorRgb) {
    // Regex para extrair 3 números separados por vírgulas, ignorando espaços
    const match = valorRgb.match(/^\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*$/);
    if (!match) return;

    const r = parseInt(match[1], 10);
    const g = parseInt(match[2], 10);
    const b = parseInt(match[3], 10);

    // Valida se os valores estão entre 0 e 255
    if (r >= 0 && r <= 255 && g >= 0 && g <= 255 && b >= 0 && b <= 255) {
        const hex = rgbParaHex(r, g, b);
        atualizarInterfacePorHex(hex);
    }
}

// Atualiza a interface a partir da digitação no input HSL
function atualizarInterfacePorHsl(valorHsl) {
    // Limpa símbolos (° e %) para facilitar a captura dos números
    const limpo = valorHsl.replace(/[°%]/g, '');
    const match = limpo.match(/^\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*$/);
    if (!match) return;

    const h = parseInt(match[1], 10);
    const s = parseInt(match[2], 10);
    const l = parseInt(match[3], 10);

    // Valida as regras do HSL (Matiz: 0-360, Saturação e Luminosidade: 0-100)
    if (h >= 0 && h <= 360 && s >= 0 && s <= 100 && l >= 0 && l <= 100) {
        const rgb = hslParaRgb(h, s, l);
        const hex = rgbParaHex(rgb.r, rgb.g, rgb.b);
        atualizarInterfacePorHex(hex);
    }
}

// ==========================================
// CAPTURA DE EVENTOS (EVENT LISTENERS)
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    const pickerNativo = document.getElementById('picker-nativo');
    const inputHex = document.getElementById('cor-hex');
    const inputRgb = document.getElementById('cor-rgb');
    const inputHsl = document.getElementById('cor-hsl');

    // 1. Input Nativo (Color Picker do Navegador)
    if (pickerNativo) {
        pickerNativo.addEventListener('input', (e) => {
            atualizarInterfacePorHex(e.target.value);
        });
    }

    // 2. Input de Texto HEX
    if (inputHex) {
        inputHex.addEventListener('input', (e) => {
            let valor = e.target.value;
            if (!valor.startsWith('#')) valor = '#' + valor;
            atualizarInterfacePorHex(valor);
        });
    }

    // 3. Input de Texto RGB
    if (inputRgb) {
        inputRgb.addEventListener('input', (e) => {
            atualizarInterfacePorRgb(e.target.value);
        });
    }

    // 4. Input de Texto HSL
    if (inputHsl) {
        inputHsl.addEventListener('input', (e) => {
            atualizarInterfacePorHsl(e.target.value);
        });
    }

    // Inicializa a interface com uma cor padrão (ex: Azul)
    atualizarInterfacePorHex('#3498DB');
});