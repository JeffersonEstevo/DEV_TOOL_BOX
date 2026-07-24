// ==========================================
// MÓDULO CONTA-GOTAS DE IMAGENS - SPA SAFE
// ==========================================

// Atribuição no objeto window para evitar erro de re-declaração no ES6
window.cg_imagemAtiva = window.cg_imagemAtiva || null;
var cg_imagemAtiva = window.cg_imagemAtiva;

function cg_rgbParaHex(r, g, b) {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
}

function cg_rgbParaHsl(r, g, b) {
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
    return {
        h: Math.round(h * 360),
        s: Math.round(s * 100),
        l: Math.round(l * 100)
    };
}

function atualizarPainelContaGotas(r, g, b) {
    const hex = cg_rgbParaHex(r, g, b);
    const hsl = cg_rgbParaHsl(r, g, b);

    const boxCor = document.getElementById('box-cor-atual');
    const txtHex = document.getElementById('txt-cor-atual-hex');
    const inputHex = document.getElementById('valor-hex');
    const inputRgb = document.getElementById('valor-rgb');
    const inputHsl = document.getElementById('valor-hsl');

    if (boxCor) boxCor.style.backgroundColor = hex;
    if (txtHex) txtHex.textContent = hex;
    if (inputHex) inputHex.value = hex;
    if (inputRgb) inputRgb.value = `rgb(${r}, ${g}, ${b})`;
    if (inputHsl) inputHsl.value = `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;
}

function renderizarImagemNoCanvas(src) {
    const canvas = document.getElementById('canvas-foto');
    const wrapper = document.getElementById('wrapper-preview-foto');
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    const img = new Image();
    
    img.onload = function() {
        window.cg_imagemAtiva = img;
        cg_imagemAtiva = img;
        
        const maxDimensao = 800;
        let width = img.width;
        let height = img.height;

        if (width > maxDimensao || height > maxDimensao) {
            if (width > height) {
                height = Math.round((height * maxDimensao) / width);
                width = maxDimensao;
            } else {
                width = Math.round((width * maxDimensao) / height);
                height = maxDimensao;
            }
        }

        canvas.width = width;
        canvas.height = height;

        ctx.clearRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);

        if (wrapper) wrapper.style.display = 'flex';
    };
    img.src = src;
}

// Controla a exibição e atualização da Lupa de Zoom
function gerenciarLupa(e, canvas, ctx) {
    const lupa = document.getElementById('lupa-zoom');
    const canvasLupa = document.getElementById('canvas-lupa');
    const container = canvas.parentElement; // Pega o .canvas-container
    if (!lupa || !canvasLupa || !container) return;

    const ctxLupa = canvasLupa.getContext('2d');
    const rectCanvas = canvas.getBoundingClientRect();
    const rectContainer = container.getBoundingClientRect();

    // 1. Mapeamento de coordenadas internas do canvas
    const x = Math.floor(((e.clientX - rectCanvas.left) / rectCanvas.width) * canvas.width);
    const y = Math.floor(((e.clientY - rectCanvas.top) / rectCanvas.height) * canvas.height);

    // Se estiver fora dos limites do canvas, esconde a lupa
    if (x < 0 || x >= canvas.width || y < 0 || y >= canvas.height) {
        lupa.style.display = 'none';
        return;
    }

    lupa.style.display = 'block';
    
    // 2. Posicionamento relativo ao container pai
    const xRelativoContainer = e.clientX - rectContainer.left;
    const yRelativoContainer = e.clientY - rectContainer.top;
    
    lupa.style.left = `${xRelativoContainer - 60}px`; 
    lupa.style.top = `${yRelativoContainer - 140}px`; 

    // Renderiza o zoom pixelado
    ctxLupa.clearRect(0, 0, canvasLupa.width, canvasLupa.height);
    
    ctxLupa.imageSmoothingEnabled = false;
    ctxLupa.mozImageSmoothingEnabled = false;
    ctxLupa.webkitImageSmoothingEnabled = false;
    ctxLupa.msImageSmoothingEnabled = false;

    const tamanhoCorte = 9; 
    const offset = Math.floor(tamanhoCorte / 2);

    ctxLupa.drawImage(
        canvas,
        x - offset, y - offset, tamanhoCorte, tamanhoCorte, // Origem
        0, 0, canvasLupa.width, canvasLupa.height           // Destino
    );
}

// Processa o pixel da coordenada sob o mouse e atualiza a interface
function extrairCorDoPixel(e) {
    const canvas = document.getElementById('canvas-foto');
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext('2d', { willReadFrequently: true });

    const x = Math.floor(((e.clientX - rect.left) / rect.width) * canvas.width);
    const y = Math.floor(((e.clientY - rect.top) / rect.height) * canvas.height);

    if (x < 0 || x >= canvas.width || y < 0 || y >= canvas.height) return;

    const pixelData = ctx.getImageData(x, y, 1, 1).data;
    const r = pixelData[0];
    const g = pixelData[1];
    const b = pixelData[2];

    atualizarPainelContaGotas(r, g, b);
}

function limparContaGotas() {
    const canvas = document.getElementById('canvas-foto');
    const wrapper = document.getElementById('wrapper-preview-foto');
    const uploadInput = document.getElementById('upload-foto');
    const lupa = document.getElementById('lupa-zoom');

    if (canvas && wrapper) {
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        wrapper.style.display = 'none';
    }

    if (lupa) lupa.style.display = 'none';
    if (uploadInput) uploadInput.value = '';

    window.cg_imagemAtiva = null;
    cg_imagemAtiva = null;
    atualizarPainelContaGotas(52, 152, 219);
}

// ==========================================
// ESCUTADORES GLOBAIS COM REMOÇÃO DE EVENTOS DUPLICADOS
// ==========================================

// Handlers nomeados anexados ao window para reutilização e remoção limpa
window._cgChangeHandler = function(e) {
    if (e.target && e.target.id === 'upload-foto') {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = function(event) {
            renderizarImagemNoCanvas(event.target.result);
        };
        reader.readAsDataURL(file);
    }
};

window._cgPasteHandler = function(e) {
    if (!document.getElementById('canvas-foto')) return;

    const items = (e.clipboardData || e.originalEvent?.clipboardData)?.items;
    if (!items) return;

    for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
            const file = items[i].getAsFile();
            const reader = new FileReader();
            reader.onload = function(event) {
                renderizarImagemNoCanvas(event.target.result);
            };
            reader.readAsDataURL(file);
            e.preventDefault();
            break;
        }
    }
};

window._cgClickHandler = function(e) {
    if (e.target && e.target.id === 'canvas-foto') {
        extrairCorDoPixel(e);
    }
};

window._cgMouseMoveHandler = function(e) {
    const canvas = document.getElementById('canvas-foto');
    if (e.target && e.target.id === 'canvas-foto' && canvas) {
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        
        gerenciarLupa(e, canvas, ctx);

        if (e.buttons === 1) {
            extrairCorDoPixel(e);
        }
    } else {
        const lupa = document.getElementById('lupa-zoom');
        if (lupa) lupa.style.display = 'none';
    }
};

function inicializarContaGotas() {
    // Remove listeners antigos antes de registrar novos para evitar acúmulo na SPA
    document.removeEventListener('change', window._cgChangeHandler);
    document.removeEventListener('paste', window._cgPasteHandler);
    document.removeEventListener('click', window._cgClickHandler);
    document.removeEventListener('mousemove', window._cgMouseMoveHandler);

    document.addEventListener('change', window._cgChangeHandler);
    document.addEventListener('paste', window._cgPasteHandler);
    document.addEventListener('click', window._cgClickHandler);
    document.addEventListener('mousemove', window._cgMouseMoveHandler);
}

// Exportações Globais
window.cg_rgbParaHex = cg_rgbParaHex;
window.cg_rgbParaHsl = cg_rgbParaHsl;
window.atualizarPainelContaGotas = atualizarPainelContaGotas;
window.renderizarImagemNoCanvas = renderizarImagemNoCanvas;
window.gerenciarLupa = gerenciarLupa;
window.extrairCorDoPixel = extrairCorDoPixel;
window.limparContaGotas = limparContaGotas;
window.inicializarContaGotas = inicializarContaGotas;

// Executa a inicialização dos ouvintes
inicializarContaGotas();