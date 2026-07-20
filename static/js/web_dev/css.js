/* ==========================================================================
   GERADOR DE CSS STARTER KIT & SHOWCASE (static/js/web_dev/css.js)
   ========================================================================== */

/**
 * Converte uma cor Hexadecimal (#HEX) para um objeto com valores RGB numéricos.
 * Exemplo: "#2563eb" -> { r: 37, g: 99, b: 235 }
 */
function hexToRgbValues(hex) {
    let c = hex.replace('#', '');
    if (c.length === 3) c = c.split('').map(x => x + x).join('');
    const num = parseInt(c, 16);
    return {
        r: (num >> 16) & 255,
        g: (num >> 8) & 255,
        b: num & 255
    };
}

/**
 * Gera o template final em string CSS contendo variáveis globais em RGB/Hex,
 * escalas fluidas, resets e estilos base para elementos HTML5.
 */
function gerarTemplateCSS(hexPrimary, hexSecondary, hexBg, ffRegular, radius) {
    const pRgb = hexToRgbValues(hexPrimary);
    const sRgb = hexToRgbValues(hexSecondary);
    const bgRgb = hexToRgbValues(hexBg);

    return `/* ==========================================================================
   CSS BASE & STARTER KIT COMPLETO - PRE-SETS DE DESENVOLVIMENTO WEB
   ========================================================================== */

/* --------------------------------------------------------------------------
   1. VARIÁVEIS GLOBAIS (:root)
   -------------------------------------------------------------------------- */
:root {
  /* Escala do Tom Primário (RGB/HEX) */
  --clr-primary-rgb: ${pRgb.r}, ${pRgb.g}, ${pRgb.b};
  --clr-primary-base: ${hexPrimary};
  --clr-primary-light: rgba(var(--clr-primary-rgb), 0.12);
  --clr-primary-hover: rgba(var(--clr-primary-rgb), 0.85);

  /* Escala do Tom Secundário (RGB/HEX) */
  --clr-secondary-rgb: ${sRgb.r}, ${sRgb.g}, ${sRgb.b};
  --clr-secondary-base: ${hexSecondary};
  --clr-secondary-light: rgba(var(--clr-secondary-rgb), 0.12);
  --clr-secondary-hover: rgba(var(--clr-secondary-rgb), 0.85);

  /* Escala de Cinzas (Grays) */
  --clr-gray-ltst: #f8fafc;
  --clr-gray-ltr: #f1f5f9;
  --clr-gray-lt: #e2e8f0;
  --clr-gray-base: #94a3b8;
  --clr-gray-dk: #64748b;
  --clr-gray-dkr: #334155;
  --clr-gray-dkst: #0f172a;

  /* Cores de Fundo & Superfície */
  --clr-bg-rgb: ${bgRgb.r}, ${bgRgb.g}, ${bgRgb.b};
  --clr-bg: ${hexBg};
  --clr-surface: #ffffff;
  --clr-text: var(--clr-gray-dkst);

  /* Tipografia */
  --ff-regular: ${ffRegular};
  --ff-headings: ${ffRegular};
  --ff-mono: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;

  /* Escala Tipográfica Fluida (rem base) */
  --fs-smlst: clamp(1.2rem, 1.092rem + 0.256vw, 1.4rem);
  --fs-smlr: clamp(1.4rem, 1.292rem + 0.256vw, 1.6rem);
  --fs-sm: clamp(1.6rem, 1.492rem + 0.256vw, 1.8rem);
  --fs-base: clamp(1.8rem, 1.692rem + 0.256vw, 2.0rem);
  --fs-bg: clamp(2.0rem, 1.785rem + 0.513vw, 2.4rem);
  --fs-bgr: clamp(2.4rem, 1.969rem + 1.026vw, 3.2rem);

  /* Headings Fluidos */
  --fs-h1: clamp(3.8rem, 3.262rem + 1.282vw, 4.8rem);
  --fs-h2: clamp(2.8rem, 1.938rem + 2.051vw, 4.4rem);
  --fs-h3: clamp(2.4rem, 1.969rem + 1.026vw, 3.2rem);
  --fs-h4: clamp(2.2rem, 1.877rem + 0.769vw, 2.8rem);
  --fs-h5: clamp(1.8rem, 1.477rem + 0.769vw, 2.4rem);
  --fs-h6: clamp(1.6rem, 1.277rem + 0.769vw, 2.2rem);

  /* Alturas de Linha (Line-Heights) */
  --lh-regular: 1.5;
  --lh-headings: 1.2;
  --lh-mono: 1.3;

  /* Espaçamentos Padronizados */
  --spacing-micro: 0.8rem;
  --spacing-smlst: 1.5rem;
  --spacing-smlr: 2.0rem;
  --spacing-base: 3.0rem;
  --spacing-bg: 4.0rem;

  /* Limites de Layout */
  --mw-grid: 120rem;
  --mw-post: 90rem;

  /* Arredondamento */
  --br-base: ${radius};
}

/* --------------------------------------------------------------------------
   2. RESET MODERNO & BASE
   -------------------------------------------------------------------------- */
*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  font-size: 62.5%;
  scroll-behavior: smooth;
}

body {
  font-family: var(--ff-regular);
  font-size: var(--fs-base);
  line-height: var(--lh-regular);
  background-color: var(--clr-bg);
  color: var(--clr-text);
  -webkit-font-smoothing: antialiased;
}

/* --------------------------------------------------------------------------
   3. ELEMENTOS DE TIPOGRAFIA
   -------------------------------------------------------------------------- */
h1, h2, h3, h4, h5, h6 {
  font-family: var(--ff-headings);
  line-height: var(--lh-headings);
  color: var(--clr-gray-dkst);
  margin-bottom: var(--spacing-smlst);
}

h1 { font-size: var(--fs-h1); }
h2 { font-size: var(--fs-h2); }
h3 { font-size: var(--fs-h3); }
h4 { font-size: var(--fs-h4); }
h5 { font-size: var(--fs-h5); }
h6 { font-size: var(--fs-h6); }

p {
  margin-bottom: var(--spacing-smlr);
}

a {
  color: var(--clr-primary-base);
  text-decoration: none;
  transition: color 0.2s ease;
}

a:hover {
  color: var(--clr-primary-hover);
  text-decoration: underline;
}

blockquote {
  padding: var(--spacing-smlst);
  border-left: 4px solid var(--clr-primary-base);
  background-color: var(--clr-primary-light);
  border-radius: 0 var(--br-base) var(--br-base) 0;
  margin-bottom: var(--spacing-smlr);
}

/* Listas */
ul, ol {
  margin-bottom: var(--spacing-smlr);
  padding-left: var(--spacing-base);
}

li {
  margin-bottom: var(--spacing-micro);
}

/* Blocos de Código */
pre, code {
  font-family: var(--ff-mono);
}

pre {
  background-color: var(--clr-gray-dkst);
  color: var(--clr-gray-ltst);
  padding: var(--spacing-smlst);
  border-radius: var(--br-base);
  overflow-x: auto;
  margin-bottom: var(--spacing-smlr);
  font-size: var(--fs-smlr);
}

code {
  background-color: var(--clr-primary-light);
  color: var(--clr-primary-base);
  padding: 0.2rem 0.4rem;
  border-radius: calc(var(--br-base) / 2);
}

pre code {
  background-color: transparent;
  color: inherit;
  padding: 0;
}

/* --------------------------------------------------------------------------
   4. COMPONENTES & FORMULÁRIOS
   -------------------------------------------------------------------------- */
.card {
  background-color: var(--clr-surface);
  border: 1px solid var(--clr-gray-lt);
  border-radius: var(--br-base);
  padding: var(--spacing-base);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

input, select, textarea {
  width: 100%;
  padding: 0.8rem 1.2rem;
  font-size: var(--fs-smlr);
  font-family: inherit;
  border: 1px solid var(--clr-gray-lt);
  border-radius: var(--br-base);
  background-color: var(--clr-surface);
  color: var(--clr-text);
  outline: none;
  transition: border-color 0.2s ease;
}

input:focus, select:focus, textarea:focus {
  border-color: var(--clr-primary-base);
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.8rem 1.6rem;
  font-size: var(--fs-smlr);
  font-weight: 600;
  border-radius: var(--br-base);
  border: 1px solid transparent;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-primary {
  background-color: var(--clr-primary-base);
  color: #ffffff;
}

.btn-primary:hover {
  background-color: var(--clr-primary-hover);
}

.btn-secondary {
  background-color: var(--clr-secondary-base);
  color: #ffffff;
}

.btn-secondary:hover {
  background-color: var(--clr-secondary-hover);
}
`;
}

/**
 * Lê os inputs de configuração da página, gera o código CSS final e
 * atualiza as propriedades do container de preview em tempo real.
 */
function atualizarCSSPreview() {
    const inputHexPrimary = document.getElementById('hex-primary');
    const inputHexSecondary = document.getElementById('hex-secondary');
    const inputHexBg = document.getElementById('hex-bg');
    
    const hexPrimary = inputHexPrimary?.value || '#2563eb';
    const hexSecondary = inputHexSecondary?.value || '#475569';
    const hexBg = inputHexBg?.value || '#f8fafc';
    const ffRegular = document.getElementById('seletor-ff-regular')?.value || "system-ui, sans-serif";
    const radius = document.getElementById('seletor-radius-css')?.value || "8px";

    // 1. Atualiza o textarea de código para cópia
    const caixaCodigo = document.getElementById('codigo-css-gerado');
    if (caixaCodigo) {
        caixaCodigo.value = gerarTemplateCSS(hexPrimary, hexSecondary, hexBg, ffRegular, radius);
    }

    // 2. Atualiza as variáveis inline do container de visualização
    const previewContainer = document.getElementById('container-preview-css-base');
    if (previewContainer) {
        const pRgb = hexToRgbValues(hexPrimary);
        const sRgb = hexToRgbValues(hexSecondary);

        previewContainer.style.setProperty('--clr-primary-base', hexPrimary);
        previewContainer.style.setProperty('--clr-primary-light', `rgba(${pRgb.r}, ${pRgb.g}, ${pRgb.b}, 0.12)`);
        
        previewContainer.style.setProperty('--clr-secondary-base', hexSecondary);
        previewContainer.style.setProperty('--clr-secondary-light', `rgba(${sRgb.r}, ${sRgb.g}, ${sRgb.b}, 0.12)`);
        
        previewContainer.style.setProperty('--clr-bg', hexBg);
        previewContainer.style.setProperty('--ff-regular', ffRegular);
        previewContainer.style.setProperty('--br-base', radius);
    }
}

/* ==========================================================================
   INICIALIZAÇÃO DE LISTENERS E EVENTOS
   ========================================================================== */
(() => {
    // Referências dos campos de Cor Primária
    const pickerPrimary = document.getElementById('seletor-cor-primary');
    const hexPrimary = document.getElementById('hex-primary');

    // Referências dos campos de Cor Secundária
    const pickerSecondary = document.getElementById('seletor-cor-secondary');
    const hexSecondary = document.getElementById('hex-secondary');

    // Referências dos campos de Cor de Fundo
    const pickerBg = document.getElementById('seletor-cor-bg');
    const hexBg = document.getElementById('hex-bg');

    // Selects e Botões
    const seletorFf = document.getElementById('seletor-ff-regular');
    const seletorRadius = document.getElementById('seletor-radius-css');
    const botoesCopiar = document.querySelectorAll('.btn-copiar-codigo-css');

    // Eventos - Cor Primária
    if (pickerPrimary && hexPrimary) {
        pickerPrimary.addEventListener('input', (e) => {
            hexPrimary.value = e.target.value;
            atualizarCSSPreview();
        });
        hexPrimary.addEventListener('input', (e) => {
            if (/^#[0-9A-F]{6}$/i.test(e.target.value)) {
                pickerPrimary.value = e.target.value;
                atualizarCSSPreview();
            }
        });
    }

    // Eventos - Cor Secundária
    if (pickerSecondary && hexSecondary) {
        pickerSecondary.addEventListener('input', (e) => {
            hexSecondary.value = e.target.value;
            atualizarCSSPreview();
        });
        hexSecondary.addEventListener('input', (e) => {
            if (/^#[0-9A-F]{6}$/i.test(e.target.value)) {
                pickerSecondary.value = e.target.value;
                atualizarCSSPreview();
            }
        });
    }

    // Eventos - Cor de Fundo
    if (pickerBg && hexBg) {
        pickerBg.addEventListener('input', (e) => {
            hexBg.value = e.target.value;
            atualizarCSSPreview();
        });
        hexBg.addEventListener('input', (e) => {
            if (/^#[0-9A-F]{6}$/i.test(e.target.value)) {
                pickerBg.value = e.target.value;
                atualizarCSSPreview();
            }
        });
    }

    // Eventos - Fontes e Arredondamento
    if (seletorFf) seletorFf.addEventListener('change', atualizarCSSPreview);
    if (seletorRadius) seletorRadius.addEventListener('change', atualizarCSSPreview);

    // Evento do botão Copiar Código
    botoesCopiar.forEach(botao => {
        botao.addEventListener('click', () => {
            const idAlvo = botao.getAttribute('data-alvo');
            const elementoTexto = document.getElementById(idAlvo);
            
            if (elementoTexto) {
                navigator.clipboard.writeText(elementoTexto.value).then(() => {
                    const textoOriginal = botao.textContent;
                    botao.textContent = "Copiado!";
                    botao.style.color = "#2ECC71";
                    
                    setTimeout(() => {
                        botao.textContent = textoOriginal;
                        botao.style.color = "var(--primary-color)";
                    }, 1200);
                }).catch(err => {
                    console.error('Falha ao copiar código CSS:', err);
                });
            }
        });
    });

    // Renderização inicial
    atualizarCSSPreview();
})();


// ==========================================
// 1. BANCO DE PALETAS HARMONIOSAS (LIGHT + DARK)
// ==========================================
const PALETAS_PRESETS = [
    {
        nome: "Modern Tech (Azul & Grafite)",
        light: { primary: "#2563eb", secondary: "#475569", bg: "#f8fafc" },
        dark: { primary: "#3b82f6", secondary: "#94a3b8", bg: "#0f172a" }
    },
    {
        nome: "Emerald Clean (Verde Menta)",
        light: { primary: "#059669", secondary: "#334155", bg: "#f0fdf4" },
        dark: { primary: "#10b981", secondary: "#cbd5e1", bg: "#064e3b" }
    },
    {
        nome: "Purple Horizon (Roxo & Violeta)",
        light: { primary: "#7c3aed", secondary: "#4c1d95", bg: "#faf5ff" },
        dark: { primary: "#a855f7", secondary: "#ddd6fe", bg: "#1e1b4b" }
    },
    {
        nome: "Sunset Corporate (Laranja & Slate)",
        light: { primary: "#ea580c", secondary: "#334155", bg: "#fff7ed" },
        dark: { primary: "#f97316", secondary: "#94a3b8", bg: "#1c1917" }
    },
    {
        nome: "Nordic Minimal (Cinza & Cobre)",
        light: { primary: "#0f172a", secondary: "#b45309", bg: "#f8fafc" },
        dark: { primary: "#f8fafc", secondary: "#f59e0b", bg: "#020617" }
    },
    {
        nome: "Rose Elegance (Rosa Seco & Vinho)",
        light: { primary: "#e11d48", secondary: "#881337", bg: "#fff1f2" },
        dark: { primary: "#fb7185", secondary: "#fecdd3", bg: "#4c0519" }
    },
    {
        nome: "Ocean Breeze (Ciano & Azul Marinho)",
        light: { primary: "#0891b2", secondary: "#1e3a8a", bg: "#ecfeff" },
        dark: { primary: "#22d3ee", secondary: "#93c5fd", bg: "#083344" }
    },
    {
        nome: "Cyber Neon (Roxo & Verde Fluorescente)",
        light: { primary: "#9333ea", secondary: "#15803d", bg: "#fdf4ff" },
        dark: { primary: "#c084fc", secondary: "#4ade80", bg: "#180828" }
    },
    {
        nome: "Coffee & Cream (Tons Terrosos)",
        light: { primary: "#78350f", secondary: "#92400e", bg: "#fef3c7" },
        dark: { primary: "#f59e0b", secondary: "#fde68a", bg: "#271202" }
    },
    {
        nome: "Deep Space (Modo Escuro Nativo)",
        light: { primary: "#6366f1", secondary: "#64748b", bg: "#f1f5f9" },
        dark: { primary: "#818cf8", secondary: "#cbd5e1", bg: "#0b0f19" }
    }
];

// ==========================================
// 2. FUNÇÃO PARA RENDERIZAR OS CARDS DE PALETA
// ==========================================
function renderizarPaletasPresets() {
    const container = document.getElementById('grid-paletas-presets');
    if (!container) return;

    container.innerHTML = PALETAS_PRESETS.map((p, idx) => `
        <div class="card-paleta" style="border: 1px solid var(--border-color); border-radius: var(--radius); padding: 1.2rem; background: var(--bg-main);">
            <h4 style="font-size: 0.95rem; font-weight: 700; margin-bottom: 0.8rem;">${p.nome}</h4>
            
            <!-- Bloco Light -->
            <span style="font-size: 0.75rem; font-weight: 600; color: var(--text-muted);">MODO CLARO</span>
            <div style="display: flex; gap: 0.5rem; margin: 0.4rem 0 1rem 0; align-items: center;">
                ${gerarSwatchCor("Primária", p.light.primary)}
                ${gerarSwatchCor("Secundária", p.light.secondary)}
                ${gerarSwatchCor("Fundo", p.light.bg)}
            </div>

            <!-- Bloco Dark -->
            <span style="font-size: 0.75rem; font-weight: 600; color: var(--text-muted);">MODO ESCURO EQUIVALENTE</span>
            <div style="display: flex; gap: 0.5rem; margin: 0.4rem 0 1rem 0; align-items: center;">
                ${gerarSwatchCor("Primária", p.dark.primary)}
                ${gerarSwatchCor("Secundária", p.dark.secondary)}
                ${gerarSwatchCor("Fundo", p.dark.bg)}
            </div>

            <!-- Ação de Aplicação Direta -->
            <div style="display: flex; gap: 0.5rem; margin-top: 0.8rem; border-top: 1px dashed var(--border-color); padding-top: 0.8rem;">
                <button class="btn btn-secondary" style="flex: 1; font-size: 0.75rem; padding: 0.4rem;" onclick="aplicarPaletaNoGerador('${p.light.primary}', '${p.light.secondary}', '${p.light.bg}')">
                    <i class="bi bi-sun"></i> Usar Claro
                </button>
                <button class="btn btn-secondary" style="flex: 1; font-size: 0.75rem; padding: 0.4rem;" onclick="aplicarPaletaNoGerador('${p.dark.primary}', '${p.dark.secondary}', '${p.dark.bg}')">
                    <i class="bi bi-moon"></i> Usar Escuro
                </button>
            </div>
        </div>
    `).join('');
}

// Auxiliar para montar a bolinha com o código e botão de copiar
function gerarSwatchCor(label, hex) {
    return `
        <div style="flex: 1; text-align: center; background: var(--bg-sidebar); padding: 0.4rem; border-radius: 6px; border: 1px solid var(--border-color);">
            <div style="width: 100%; height: 24px; background-color: ${hex}; border-radius: 4px; border: 1px solid rgba(0,0,0,0.1); margin-bottom: 0.3rem;"></div>
            <span style="font-size: 0.65rem; display: block; font-weight: 600;">${label}</span>
            <button onclick="navigator.clipboard.writeText('${hex}')" style="background: none; border: none; font-size: 0.7rem; font-family: monospace; color: var(--primary-color); cursor: pointer; font-weight: 700;" title="Copiar HEX">
                ${hex}
            </button>
        </div>
    `;
}

// ==========================================
// 3. ENVIAR A PALETA PARA A ABA DO GERADOR
// ==========================================
function aplicarPaletaNoGerador(primary, secondary, bg) {
    // Atualiza os inputs
    const pPick = document.getElementById('seletor-cor-primary');
    const pHex = document.getElementById('hex-primary');
    const sPick = document.getElementById('seletor-cor-secondary');
    const sHex = document.getElementById('hex-secondary');
    const bgPick = document.getElementById('seletor-cor-bg');
    const bgHex = document.getElementById('hex-bg');

    if (pPick) pPick.value = primary;
    if (pHex) pHex.value = primary;
    if (sPick) sPick.value = secondary;
    if (sHex) sHex.value = secondary;
    if (bgPick) bgPick.value = bg;
    if (bgHex) bgHex.value = bg;

    // Recalcula o preview CSS
    atualizarCSSPreview();

    // Alterna de volta para a aba principal
    alternarAbaCSS('aba-gerador');
}

// ==========================================
// 4. MUDANÇA DE ABAS
// ==========================================
function alternarAbaCSS(idAba) {
    // 1. Alterna as workspaces visíveis
    document.querySelectorAll('.webdev-workspace.tab-content').forEach(aba => {
        aba.classList.remove('active');
    });
    const abaAlvo = document.getElementById(idAba);
    if (abaAlvo) abaAlvo.classList.add('active');

    // 2. Alterna o estado ativo nos botões da barra superior
    document.querySelectorAll('.rede-tabs .tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    const btnAlvo = Array.from(document.querySelectorAll('.rede-tabs .tab-btn')).find(btn => 
        btn.getAttribute('onclick') && btn.getAttribute('onclick').includes(idAba)
    );
    if (btnAlvo) btnAlvo.classList.add('active');

    // 3. Controle de visibilidade dos grupos de ações na barra inferior (Igual ao CPF)
    const grupoGerar = document.getElementById('grupo-acoes-gerador');
    const grupoPaletas = document.getElementById('grupo-acoes-paletas');

    if (idAba === 'aba-gerador') {
        if (grupoGerar) grupoGerar.style.display = 'flex';
        if (grupoPaletas) grupoPaletas.style.display = 'none';
    } else {
        if (grupoGerar) grupoGerar.style.display = 'none';
        if (grupoPaletas) grupoPaletas.style.display = 'flex';
    }
}

// Chamar renderizarPaletasPresets() na inicialização da página
renderizarPaletasPresets();