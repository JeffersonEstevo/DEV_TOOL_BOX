// ==========================================================================
// Constantes e Tabelas Oficiais 2026
// ==========================================================================
const FAIXAS_INSS_2026 = [
    { limite: 1621.00, aliquota: 0.075, desc: "Até R$ 1.621,00" },
    { limite: 2902.84, aliquota: 0.09,  desc: "De R$ 1.621,01 a R$ 2.902,84" },
    { limite: 4354.27, aliquota: 0.12,  desc: "De R$ 2.902,85 a R$ 4.354,27" },
    { limite: 8475.55, aliquota: 0.14,  desc: "De R$ 4.354,28 a R$ 8.475,55 (Teto)" }
];

const FAIXAS_IRRF_2026 = [
    { limite: 2428.80, aliquota: "Isento", deducao: "R$ 0,00", desc: "Até R$ 2.428,80" },
    { limite: 2826.65, aliquota: "7,5%",   deducao: "R$ 182,16", desc: "De R$ 2.428,81 a R$ 2.826,65" },
    { limite: 3751.05, aliquota: "15%",    deducao: "R$ 394,16", desc: "De R$ 2.826,66 a R$ 3.751,05" },
    { limite: 4664.68, aliquota: "22,5%",  deducao: "R$ 675,49", desc: "De R$ 3.751,06 a R$ 4.664,68" },
    { limite: Infinity,aliquota: "27,5%",  deducao: "R$ 908,73", desc: "Acima de R$ 4.664,68" }
];

const TETO_INSS = 988.09;

// ==========================================================================
// Controle de Abas Internas (Com gatilho para carregar as tabelas)
// ==========================================================================
function alternarAbaTrabalhista(abaId) {
    document.querySelectorAll('.tool-container .rede-tabs .tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tool-container .tab-content').forEach(content => content.classList.remove('active'));

    const btnClicado = Array.from(document.querySelectorAll('.tool-container .rede-tabs .tab-btn')).find(btn => btn.getAttribute('onclick').includes(abaId));
    if (btnClicado) btnClicado.classList.add('active');
    
    const conteudoAba = document.getElementById(abaId);
    if (conteudoAba) conteudoAba.classList.add('active');

    // Se o usuário abriu a aba de tabelas, garante o preenchimento imediato
    if (abaId === 'aba-tabelas-trabalhista') {
        renderizarTabelasInformativas();
    }
}

// ==========================================================================
// Funções de Cálculo
// ==========================================================================
function calcularINSS(salario) {
    let inss = 0;
    let anterior = 0;

    for (let i = 0; i < FAIXAS_INSS_2026.length; i++) {
        let faixaAtual = FAIXAS_INSS_2026[i].limite;
        let aliquota = FAIXAS_INSS_2026[i].aliquota;

        if (salario > faixaAtual) {
            inss += (faixaAtual - anterior) * aliquota;
            anterior = faixaAtual;
        } else {
            inss += (salario - anterior) * aliquota;
            break;
        }

        if (i === FAIXAS_INSS_2026.length - 1 && salario > faixaAtual) {
            inss = TETO_INSS; 
        }
    }
    return Math.min(inss, TETO_INSS);
}

function calcularIRRF(salarioBase) {
    let irrf = 0;
    
    if (salarioBase <= 2428.80) {
        irrf = 0;
    } else if (salarioBase <= 2826.65) {
        irrf = (salarioBase * 0.075) - 182.16;
    } else if (salarioBase <= 3751.05) {
        irrf = (salarioBase * 0.15) - 394.16;
    } else if (salarioBase <= 4664.68) {
        irrf = (salarioBase * 0.225) - 675.49;
    } else {
        irrf = (salarioBase * 0.275) - 908.73;
    }

    if (irrf < 0) irrf = 0;

    if (salarioBase <= 5000.00) {
        irrf = 0; 
    } else if (salarioBase > 5000.00 && salarioBase <= 7350.00) {
        const redutor = 978.62 - (0.133145 * salarioBase);
        irrf = irrf - redutor;
        if (irrf < 0) irrf = 0;
    }

    return irrf;
}

function calcularTrabalhistaImediata() {
    const brutoInput = document.getElementById("salario-bruto");
    const inssInput = document.getElementById("desconto-inss");
    const irrfInput = document.getElementById("desconto-irrf");
    const liquidoInput = document.getElementById("salario-liquido");

    if (!brutoInput || !liquidoInput) return;

    const bruto = parseFloat(brutoInput.value);

    if (isNaN(bruto) || bruto <= 0) {
        inssInput.value = "";
        irrfInput.value = "";
        liquidoInput.value = "";
        return;
    }

    const valorInss = calcularINSS(bruto);
    const baseIrrf = bruto - valorInss;
    let valorIrrf = calcularIRRF(baseIrrf);

    const liquido = bruto - valorInss - valorIrrf;

    inssInput.value = `R$ ${valorInss.toFixed(2).replace('.', ',')}`;
    irrfInput.value = `R$ ${valorIrrf.toFixed(2).replace('.', ',')}`;
    liquidoInput.value = `R$ ${liquido.toFixed(2).replace('.', ',')}`;
}

function limparTrabalhista() {
    const ids = ["salario-bruto", "desconto-inss", "desconto-irrf", "salario-liquido"];
    ids.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = "";
    });
}

// ==========================================================================
// Renderizador Dinâmico das Tabelas Informativas
// ==========================================================================
function renderizarTabelasInformativas() {
    const corpoInss = document.getElementById("corpo-tabela-inss");
    const corpoIrrf = document.getElementById("corpo-tabela-irrf");

    if (corpoInss) {
        corpoInss.innerHTML = FAIXAS_INSS_2026.map(f => `
            <tr>
                <td>${f.desc}</td>
                <td><strong>${(f.aliquota * 100).toFixed(1).replace('.', ',')}%</strong></td>
            </tr>
        `).join('');
    }

    if (corpoIrrf) {
        corpoIrrf.innerHTML = FAIXAS_IRRF_2026.map(f => `
            <tr>
                <td>${f.desc}</td>
                <td><strong>${f.aliquota}</strong></td>
                <td>${f.deducao}</td>
            </tr>
        `).join('');
    }
}

function inicializarTrabalhista() {
    const brutoInput = document.getElementById("salario-bruto");
    if (brutoInput) {
        brutoInput.removeEventListener("input", calcularTrabalhistaImediata);
        brutoInput.addEventListener("input", calcularTrabalhistaImediata);
    }
    // Já pré-carrega as tabelas no carregamento da ferramenta
    renderizarTabelasInformativas();
}

inicializarTrabalhista();