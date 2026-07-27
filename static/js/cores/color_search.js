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

// Processa a busca inteligente (por HEX/Proximidade ou por Nome)
function processarBusca(termo) {
    if (bancoDeCoresCompleto.length === 0) return;

    termo = termo.trim();
    if (!termo) return;

    const contador = document.getElementById('contador-resultados');

    // Verifica se parece um código HEX (começa com # ou tem caracteres hexadecimais de cor)
    const ehHex = termo.startsWith('#') || /^[0-9A-Fa-f]{3,6}$/.test(termo);

    if (ehHex || termo.length >= 4 && /^#[0-9A-Fa-f]+$/.test(termo.startsWith('#') ? termo : '#' + termo)) {
        // --- MODO 1: Busca por Proximidade Visual (HEX) ---
        let hexInput = termo.startsWith('#') ? termo : '#' + termo;
        if (hexInput.length === 4) { // converte #abc para #aabbcc
            hexInput = '#' + hexInput[1]+hexInput[1]+hexInput[2]+hexInput[2]+hexInput[3]+hexInput[3];
        }
        if (!/^#[0-9A-Fa-f]{6}$/.test(hexInput)) return;

        const rgbAlvo = hexParaRgbObjeto(hexInput);

        const listaComDistancia = bancoDeCoresCompleto.map(cor => {
            const rgbBanco = hexParaRgbObjeto(cor.hex_code);
            const distancia = calcularDistanciaCores(rgbAlvo, rgbBanco);
            return { ...cor, distancia };
        });

        listaComDistancia.sort((a, b) => a.distancia - b.distancia);

        exibirDetalheCor(listaComDistancia[0]);
        renderizarGridProximas(listaComDistancia.slice(0, 24), "Cores mais próximas encontradas no JSON:");

    } else {
        // --- MODO 2: Busca Textual por Nome da Cor ---
        const termoBusca = termo.toLowerCase();
        const resultadosNome = bancoDeCoresCompleto.filter(cor => 
            cor.color_name.toLowerCase().includes(termoBusca)
        );

        if (resultadosNome.length > 0) {
            // Exibe a primeira encontrada no card superior
            exibirDetalheCor(resultadosNome[0]);
            // Renderiza até 24 resultados encontrados pelo nome
            renderizarGridProximas(resultadosNome.slice(0, 24), `Encontradas ${resultadosNome.length} cores com "${termo}":`);
        } else {
            if (contador) contador.textContent = `Nenhuma cor encontrada com o nome "${termo}".`;
        }
    }
}

// Renderiza a grade de cores correspondentes
function renderizarGridProximas(lista, mensagemTopo) {
    const grid = document.getElementById('grid-resultados-busca');
    const contador = document.getElementById('contador-resultados');
    if (!grid) return;

    grid.innerHTML = '';

    if (contador) {
        contador.textContent = mensagemTopo;
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
            if (inputHex) inputHex.value = cor.color_name; // Atualiza o input com o nome ou HEX ao clicar
            if (pickerNativo && /^#[0-9A-Fa-f]{6}$/.test(cor.hex_code)) {
                pickerNativo.value = cor.hex_code;
            }
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
            const resposta = await fetch('cores.json'); // ajuste o caminho aqui se necessário
            
            if (!resposta.ok) {
                throw new Error(`Arquivo JSON não encontrado (Status: ${resposta.status})`);
            }
            
            bancoDeCoresCompleto = await resposta.json();
        } catch (erro) {
            console.error("Erro crítico ao carregar as cores:", erro);
            
            // Mensagem amigável opcional na tela para o usuário saber do erro
            const contador = document.getElementById('contador-resultados');
            if (contador) contador.textContent = "Erro: Arquivo de cores não encontrado.";
            return;
        }
    }

    // Inicializa com uma cor padrão do banco (ex: crimson)
    processarBusca('crimson');

    const inputBusca = document.getElementById('input-busca-cor');
    const pickerNativo = document.getElementById('picker-busca-nativo');

    // Evento de digitação unificado (aceita tanto HEX quanto Nomes)
    if (inputBusca && !inputBusca.dataset.listenerAtivo) {
        inputBusca.dataset.listenerAtivo = "true";
        inputBusca.addEventListener('input', (e) => {
            let valor = e.target.value.trim();
            if (valor.length > 0) {
                processarBusca(valor);
                
                // Se o usuário digitou um HEX válido de 6 caracteres, atualiza o picker visual também
                let hexLimpo = valor.startsWith('#') ? valor : '#' + valor;
                if (pickerNativo && /^#[0-9A-Fa-f]{6}$/.test(hexLimpo)) {
                    pickerNativo.value = hexLimpo;
                }
            }
        });
    }

    // Evento de mudança no Seletor Visual Nativo (<input type="color">)
    if (pickerNativo && !pickerNativo.dataset.listenerAtivo) {
        pickerNativo.dataset.listenerAtivo = "true";
        pickerNativo.addEventListener('input', (e) => {
            const corSelecionada = e.target.value;
            processarBusca(corSelecionada);
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