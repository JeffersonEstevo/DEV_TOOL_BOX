// Variável global para armazenar as cores após o carregamento
let bancoDeCoresCompleto = [];

// Converte HEX para objeto RGB numérico
function hexParaRgbObjeto(hex) {
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

// Cálculo matemático de Distância Real entre Cores (Euclidiana Ponderada Perceptual)
function calcularDistanciaCores(rgb1, rgb2) {
    const rMean = (rgb1.r + rgb2.r) / 2;
    const r = rgb1.r - rgb2.r;
    const g = rgb1.g - rgb2.g;
    const b = rgb1.b - rgb2.b;
    return Math.sqrt(
        (((512 + rMean) * r * r) >> 8) +
        4 * g * g +
        (((767 - rMean) * b * b) >> 8)
    );
}

// Gera o formato RGB legível
function gerarRgbString(rgb) {
    return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
}

// Exibe a cor principal identificada no card superior
function exibirDetalheCor(cor) {
    const cardDetalhe = document.getElementById('detalhe-cor-pesquisada');
    const preview = document.getElementById('preview-busca-atual');
    const nome = document.getElementById('info-nome-cor');
    const hex = document.getElementById('info-hex-cor');
    const rgb = document.getElementById('info-rgb-cor');

    if (!cardDetalhe) return;

    const rgbObj = hexParaRgbObjeto(cor.hex_code);

    cardDetalhe.style.display = 'flex';
    if (preview) preview.style.backgroundColor = cor.hex_code;
    if (nome) nome.textContent = cor.color_name;
    if (hex) hex.textContent = cor.hex_code.toUpperCase();
    if (rgb) rgb.textContent = gerarRgbString(rgbObj);
}

// Processa a cor informada e ordena o JSON real por proximidade visual
function processarCorReferencia(hexInput) {
    if (bancoDeCoresCompleto.length === 0) return;

    if (!hexInput.startsWith('#')) hexInput = '#' + hexInput;
    if (!/^#[0-9A-Fa-f]{6}$/.test(hexInput)) return;

    const rgbAlvo = hexParaRgbObjeto(hexInput);

    // Mapeia o JSON completo calculando a distância visual de cada uma das 1000+ cores
    const listaComDistancia = bancoDeCoresCompleto.map(cor => {
        const rgbBanco = hexParaRgbObjeto(cor.hex_code);
        const distancia = calcularDistanciaCores(rgbAlvo, rgbBanco);
        return { ...cor, distancia };
    });

    // Ordena da menor distância (mais parecida) para a maior
    listaComDistancia.sort((a, b) => a.distancia - b.distancia);

    // A primeira cor é a mais próxima de fato
    exibirDetalheCor(listaComDistancia[0]);

    // Renderiza as 24 cores mais próximas na grade
    renderizarGridProximas(listaComDistancia.slice(0, 24));
}

// Renderiza a grade de cores próximas
function renderizarGridProximas(lista) {
    const grid = document.getElementById('grid-resultados-busca');
    const contador = document.getElementById('contador-resultados');
    if (!grid) return;

    grid.innerHTML = '';

    if (contador) {
        contador.textContent = "Cores mais próximas encontradas no JSON:";
    }

    lista.forEach(cor => {
        const card = document.createElement('div');
        card.className = 'cor-resultado-card';

        card.innerHTML = `
            <div class="cor-resultado-swatch" style="background-color: ${cor.hex_code};"></div>
            <div class="cor-resultado-texto">
                <span class="cor-resultado-nome" title="${cor.color_name}">${cor.color_name}</span>
                <span class="cor-resultado-hex">${cor.hex_code.toUpperCase()}</span>
            </div>
        `;

        card.addEventListener('click', () => {
            exibirDetalheCor(cor);
            const inputHex = document.getElementById('input-busca-cor');
            const pickerNativo = document.getElementById('picker-busca-nativo');
            if (inputHex) inputHex.value = cor.hex_code.toUpperCase();
            if (pickerNativo) pickerNativo.value = cor.hex_code;
        });

        grid.appendChild(card);
    });
}

// Função principal de inicialização
async function iniciarColorSearch() {
    const grid = document.getElementById('grid-resultados-busca');
    if (!grid) return;

    // Se o banco ainda estiver vazio, carrega o JSON via fetch
    if (bancoDeCoresCompleto.length === 0) {
        try {
            // Ajuste o caminho abaixo para onde o seu arquivo JSON de cores está salvo no projeto
            const resposta = await fetch('cores.json'); 
            bancoDeCoresCompleto = await resposta.json();
        } catch (erro) {
            console.error("Erro ao carregar o JSON de cores:", erro);
            return;
        }
    }

    // Inicializa com uma cor padrão (ex: Azul Royal)
    processarCorReferencia('#4E73DF');

    const inputBusca = document.getElementById('input-busca-cor');
    const pickerNativo = document.getElementById('picker-busca-nativo');

    if (inputBusca && !inputBusca.dataset.listenerAtivo) {
        inputBusca.dataset.listenerAtivo = "true";
        inputBusca.addEventListener('input', (e) => {
            let valor = e.target.value.trim();
            if (valor.length === 6 || (valor.startsWith('#') && valor.length === 7)) {
                processarCorReferencia(valor);
                let hexLimpo = valor.startsWith('#') ? valor : '#' + valor;
                if (pickerNativo && /^#[0-9A-Fa-f]{6}$/.test(hexLimpo)) {
                    pickerNativo.value = hexLimpo;
                }
            }
        });
    }

    if (pickerNativo && !pickerNativo.dataset.listenerAtivo) {
        pickerNativo.dataset.listenerAtivo = "true";
        pickerNativo.addEventListener('input', (e) => {
            const corSelecionada = e.target.value;
            processarCorReferencia(corSelecionada);
            if (inputBusca) {
                inputBusca.value = corSelecionada.toUpperCase();
            }
        });
    }
}

// Execução segura
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    setTimeout(iniciarColorSearch, 50);
}
document.addEventListener('DOMContentLoaded', iniciarColorSearch);
document.addEventListener('router:contentLoaded', iniciarColorSearch);
window.addEventListener('load', iniciarColorSearch);