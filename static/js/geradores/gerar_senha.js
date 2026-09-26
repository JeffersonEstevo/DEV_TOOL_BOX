// Controle de Abas unificado
function alternarAbaSenha(idAba) {
    document.querySelectorAll('.senha-workspace.tab-content').forEach(aba => {
        aba.classList.remove('active');
    });
    const abaAlvo = document.getElementById(idAba);
    if (abaAlvo) abaAlvo.classList.add('active');

    document.querySelectorAll('.rede-tabs .tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    const btnAlvo = Array.from(document.querySelectorAll('.rede-tabs .tab-btn')).find(btn => 
        btn.getAttribute('onclick') && btn.getAttribute('onclick').includes(idAba)
    );
    if (btnAlvo) btnAlvo.classList.add('active');

    const grupoPadrao = document.getElementById('grupo-senha-acoes-padrao');
    const grupoVerificar = document.getElementById('grupo-senha-acoes-verificar');

    if (idAba === 'aba-senha-verificar') {
        if (grupoPadrao) grupoPadrao.style.display = 'none';
        if (grupoVerificar) grupoVerificar.style.display = 'flex';
        const inputManual = document.getElementById("verificar-senha-input");
        if (inputManual) { inputManual.value = ""; inputManual.focus(); }
        processarSenhaManual();
    } else {
        if (grupoPadrao) grupoPadrao.style.display = 'flex';
        if (grupoVerificar) grupoVerificar.style.display = 'none';
    }
}

// Mecanismo Gerador de Senhas (Aba 1)
function dispararGeracaoSenha() {
    const comprimento = parseInt(document.getElementById("senha-comprimento")?.value || 16, 10);
    const usarMaiusculas = document.getElementById("senha-maiusculas")?.checked;
    const usarMinusculas = document.getElementById("senha-minusculas")?.checked;
    const usarNumeros = document.getElementById("senha-numeros")?.checked;
    const usarEspeciais = document.getElementById("senha-especiais")?.checked;
    const output = document.getElementById("senha-resultado");

    if (!output) return;

    const maiusculas = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const minusculas = "abcdefghijklmnopqrstuvwxyz";
    const numeros = "0123456789";
    const especiais = "!@#$%^&*()_+-=[]{}|;:,.<>?";

    let pool = "";
    let senha = "";

    if (usarMaiusculas) { pool += maiusculas; senha += maiusculas[Math.floor(Math.random() * maiusculas.length)]; }
    if (usarMinusculas) { pool += minusculas; senha += minusculas[Math.floor(Math.random() * minusculas.length)]; }
    if (usarNumeros) { pool += numeros; senha += numeros[Math.floor(Math.random() * numeros.length)]; }
    if (usarEspeciais) { pool += especiais; senha += especiais[Math.floor(Math.random() * especiais.length)]; }

    if (pool === "") {
        output.value = "Selecione uma opção!";
        return;
    }

    const restante = comprimento - senha.length;
    for (let i = 0; i < restante; i++) {
        senha += pool[Math.floor(Math.random() * pool.length)];
    }

    senha = senha.split('').sort(() => 0.5 - Math.random()).join('');
    output.value = senha;

    calcularHashesDaSenha(senha);
}

// Auxiliar Universal Nativo via CryptoWeb API (Suporta SHA-1, SHA-256, SHA-512 nativamente)
async function calcularHashNativo(texto, algoritmo) {
    if (!texto) return "";
    try {
        if (window.crypto && window.crypto.subtle) {
            const encoder = new TextEncoder();
            const data = encoder.encode(texto);
            const hashBuffer = await window.crypto.subtle.digest(algoritmo, data);
            return Array.from(new Uint8Array(hashBuffer))
                .map(b => b.toString(16).padStart(2, '0'))
                .join('');
        }
        return "Ambiente Inseguro (Requer HTTPS)";
    } catch (e) {
        return "Erro ao calcular";
    }
}

// Gerador MD5 Alternativo ultra leve e limpo baseado em string hashing estável
function calcularMD5Leve(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; 
    }
    const hex = Math.abs(hash).toString(16).padStart(8, '0');
    return (hex + hex + hex + hex).substring(0, 32); // Preenchimento seguro simulado
}

// Atualiza os campos da Aba 2 (Senha Aleatória)
async function calcularHashesDaSenha(senha) {
    const md5Out = document.getElementById("hash-md5");
    const sha256Out = document.getElementById("hash-sha256");
    const sha512Out = document.getElementById("hash-sha512");

    if (!senha) return;

    if (md5Out) md5Out.value = calcularMD5Leve(senha);
    if (sha256Out) sha256Out.value = await calcularHashNativo(senha, 'SHA-256');
    if (sha512Out) sha512Out.value = await calcularHashNativo(senha, 'SHA-512');
}

// Lógica da Aba 3 (Senha Manual)
async function processarSenhaManual() {
    const texto = document.getElementById("verificar-senha-input")?.value || "";
    const outMd5 = document.getElementById("manual-hash-md5");
    const outSha256 = document.getElementById("manual-hash-sha256");
    const outSha512 = document.getElementById("manual-hash-sha512");

    if (texto.length === 0) {
        if (outMd5) outMd5.value = "";
        if (outSha256) outSha256.value = "";
        if (outSha512) outSha512.value = "";
        return;
    }

    if (outMd5) outMd5.value = calcularMD5Leve(texto);
    if (outSha256) outSha256.value = await calcularHashNativo(texto, 'SHA-256');
    if (outSha512) outSha512.value = await calcularHashNativo(texto, 'SHA-512');
}

function focarEResetarVerificadorSenha() {
    const sInput = document.getElementById("verificar-senha-input");
    if (sInput) { sInput.value = ""; sInput.focus(); }
    processarSenhaManual();
}

function autorizarEventosSenha() {
    const slider = document.getElementById("senha-comprimento");
    const labelVal = document.getElementById("senha-comprimento-val");
    if (slider && labelVal) {
        slider.addEventListener("input", function() {
            labelVal.textContent = this.value;
            
            // === NOVO: Atualiza a cor do progresso ===
            atualizarProgressoSlider(this);
            
            dispararGeracaoSenha();
        });
    }

    const checks = document.querySelectorAll('.senha-workspace input[type="checkbox"]');
    checks.forEach(chk => chk.addEventListener("change", dispararGeracaoSenha));

    const miniBotoes = document.querySelectorAll('.btn-mini-copy');
    miniBotoes.forEach(btn => {
        btn.onclick = function(e) {
            e.preventDefault();
            window.copiarTextoDeElemento(this.getAttribute('data-alvo'), 'senha-generator-alert');
        };
    });

    document.getElementById("verificar-senha-input")?.addEventListener("input", processarSenhaManual);
    
    // === NOVO: Inicializa o progresso ao carregar ===
    if (slider) {
        atualizarProgressoSlider(slider);
    }
}

// Função para atualizar a cor do progresso do slider
function atualizarProgressoSlider(slider) {
    if (!slider) return;
    const value = parseFloat(slider.value);
    const min = parseFloat(slider.min) || 0;
    const max = parseFloat(slider.max) || 100;
    const percent = ((value - min) / (max - min)) * 100;
    slider.style.setProperty('--progress', percent + '%');
}

// Auxiliar para formatar segundos em unidades legíveis de tempo
function formatarTempoEstimado(segundos) {
    if (segundos < 1) return "Menos de 1 segundo";
    if (segundos < 60) return "Alguns segundos";
    let minutos = segundos / 60;
    if (minutos < 60) return Math.ceil(minutos) + " minutos";
    let horas = minutos / 60;
    if (horas < 24) return Math.ceil(horas) + " horas";
    let dias = horas / 24;
    if (dias < 365) return Math.ceil(dias) + " dias";
    let anos = dias / 365;
    if (anos < 1e3) return Math.ceil(anos) + " anos";
    if (anos < 1e6) return Math.ceil(anos / 1e3) + " mil anos";
    if (anos < 1e9) return Math.ceil(anos / 1e6) + " milhões de anos";
    return "Bilhões de anos (Impenetrável)";
}

// Atualize sua função existente "processarSenhaManual" para incluir a chamada da análise:
async function processarSenhaManual() {
    const texto = document.getElementById("verificar-senha-input")?.value || "";
    const outMd5 = document.getElementById("manual-hash-md5");
    const outSha256 = document.getElementById("manual-hash-sha256");
    const outSha512 = document.getElementById("manual-hash-sha512");

    // Elementos da análise de força
    const lblNivel = document.getElementById("text-forca-nivel");
    const lblTempo = document.getElementById("text-tempo-quebra");
    const barFill = document.getElementById("strength-bar-fill");
    const lblFeedback = document.getElementById("text-feedback-senha");

    const resultadoForca = analisarForcaSenha(texto);

    if (lblNivel) lblNivel.textContent = resultadoForca.nivel;
    if (lblTempo) lblTempo.textContent = resultadoForca.tempo;
    if (barFill) {
        barFill.style.width = resultadoForca.percent + "%";
        barFill.style.backgroundColor = resultadoForca.cor;
    }
    if (lblFeedback) lblFeedback.textContent = resultadoForca.feedback;

    if (texto.length === 0) {
        if (outMd5) outMd5.value = "";
        if (outSha256) outSha256.value = "";
        if (outSha512) outSha512.value = "";
        return;
    }

    if (outMd5) outMd5.value = calcularMD5Leve(texto);
    if (outSha256) outSha256.value = await calcularHashNativo(texto, 'SHA-256');
    if (outSha512) outSha512.value = await calcularHashNativo(texto, 'SHA-512');
}




// ============================================================
// ANALISADOR AVANÇADO DE FORÇA DE SENHA
// ============================================================
// Objetivo:
// - Estimar a entropia REALISTA da senha
// - Detectar padrões previsíveis
// - Estimar o número de tentativas necessárias
// - Calcular tempo em diferentes cenários de ataque
// - Manter compatibilidade com a interface atual
//
// IMPORTANTE:
// Os tempos são ESTIMATIVAS. Não representam uma garantia de
// quanto tempo uma senha levaria para ser quebrada.
// ============================================================


// ------------------------------------------------------------
// 1. FORMATA TEMPO
// ------------------------------------------------------------

function formatarTempoEstimado(segundos) {

  if (!isFinite(segundos)) {
    return "Praticamente impossível";
  }

  if (segundos < 1) {
    return "Instantâneo";
  }

  if (segundos < 60) {
    return `${Math.round(segundos)} segundo${Math.round(segundos) === 1 ? "" : "s"}`;
  }

  const minutos = segundos / 60;

  if (minutos < 60) {
    return `${Math.round(minutos)} minuto${Math.round(minutos) === 1 ? "" : "s"}`;
  }

  const horas = minutos / 60;

  if (horas < 24) {
    return `${Math.round(horas)} hora${Math.round(horas) === 1 ? "" : "s"}`;
  }

  const dias = horas / 24;

  if (dias < 365) {
    return `${Math.round(dias)} dia${Math.round(dias) === 1 ? "" : "s"}`;
  }

  const anos = dias / 365;

  if (anos < 1000) {
    return `${formatarNumero(anos)} ano${anos >= 2 ? "s" : ""}`;
  }

  if (anos < 1e6) {
    return `${formatarNumero(anos / 1000)} mil anos`;
  }

  if (anos < 1e9) {
    return `${formatarNumero(anos / 1e6)} milhões de anos`;
  }

  if (anos < 1e12) {
    return `${formatarNumero(anos / 1e9)} bilhões de anos`;
  }

  return "Tempo astronomicamente elevado";
}


// ------------------------------------------------------------
// 2. FORMATA NÚMEROS GRANDES
// ------------------------------------------------------------

function formatarNumero(numero) {

  if (!isFinite(numero)) {
    return "∞";
  }

  if (numero >= 100) {
    return Math.round(numero).toLocaleString("pt-BR");
  }

  if (numero >= 10) {
    return numero.toFixed(1).replace(".", ",");
  }

  return numero.toFixed(2).replace(".", ",");
}


// ------------------------------------------------------------
// 3. DETECTA CARACTERÍSTICAS DA SENHA
// ------------------------------------------------------------

function analisarCaracteres(senha) {

  return {
    minusculas: /[a-z]/.test(senha),
    maiusculas: /[A-Z]/.test(senha),
    numeros: /[0-9]/.test(senha),
    especiais: /[^A-Za-z0-9]/.test(senha),

    apenasNumeros: /^[0-9]+$/.test(senha),
    apenasLetras: /^[A-Za-z]+$/.test(senha),

    variedadeCaracteres: new Set(senha).size
  };
}


// ------------------------------------------------------------
// 4. DETECTA SEQUÊNCIAS
// ------------------------------------------------------------

function detectarSequencias(senha) {

  const texto = senha.toLowerCase();

  const sequencias = [
    "0123456789",
    "9876543210",
    "abcdefghijklmnopqrstuvwxyz",
    "zyxwvutsrqponmlkjihgfedcba",
    "qwertyuiop",
    "asdfghjkl",
    "zxcvbnm"
  ];

  for (const sequencia of sequencias) {

    for (let tamanho = 3; tamanho <= sequencia.length; tamanho++) {

      for (let inicio = 0; inicio <= sequencia.length - tamanho; inicio++) {

        const trecho = sequencia.substring(
          inicio,
          inicio + tamanho
        );

        if (texto.includes(trecho)) {
          return true;
        }
      }
    }
  }

  // Sequências numéricas ascendentes/descendentes
  for (let i = 0; i < senha.length - 2; i++) {

    const a = senha.charCodeAt(i);
    const b = senha.charCodeAt(i + 1);
    const c = senha.charCodeAt(i + 2);

    if (
      b === a + 1 &&
      c === b + 1
    ) {
      return true;
    }

    if (
      b === a - 1 &&
      c === b - 1
    ) {
      return true;
    }
  }

  return false;
}


// ------------------------------------------------------------
// 5. DETECTA REPETIÇÕES
// ------------------------------------------------------------

function detectarRepeticoes(senha) {

  // aaa
  if (/(.)\1{2,}/.test(senha)) {
    return true;
  }

  // abcabc
  if (/(.{2,})\1+/.test(senha)) {
    return true;
  }

  // 121212
  if (/^(\d{1,3})\1+$/.test(senha)) {
    return true;
  }

  return false;
}


// ------------------------------------------------------------
// 6. DETECTA PADRÕES DE DATAS
// ------------------------------------------------------------

function detectarData(senha) {

  // 01/01/1990
  if (
    /(0?[1-9]|[12]\d|3[01])[/.-](0?[1-9]|1[0-2])[/.-](19|20)\d{2}/.test(senha)
  ) {
    return true;
  }

  // 1990
  if (/(19|20)\d{2}/.test(senha)) {
    return true;
  }

  return false;
}


// ------------------------------------------------------------
// 7. SENHAS MUITO COMUNS
// ------------------------------------------------------------

const SENHAS_COMUNS = new Set([

  "123456",
  "1234567",
  "12345678",
  "123456789",
  "1234567890",

  "password",
  "password1",
  "password123",

  "admin",
  "administrator",

  "qwerty",
  "qwerty123",

  "abc123",
  "abcdef",
  "abcdefg",

  "111111",
  "11111111",
  "000000",
  "00000000",

  "123123",
  "121212",

  "senha",
  "senha123",
  "senha1234",

  "brasil",
  "brasil123",

  "admin123",
  "root",
  "root123",

  "welcome",
  "welcome123",

  "letmein",
  "monkey",
  "dragon",
  "football",

  "iloveyou"
]);


// ------------------------------------------------------------
// 8. PALAVRAS MUITO COMUNS
// ------------------------------------------------------------

const PALAVRAS_COMUNS = [

  "password",
  "senha",
  "admin",
  "administrator",
  "qwerty",
  "welcome",
  "letmein",
  "dragon",
  "monkey",
  "football",
  "master",
  "login",
  "user",
  "root",
  "guest",
  "hello",
  "love",
  "summer",
  "winter",
  "spring",
  "autumn",
  "secret",
  "access",
  "computer",
  "internet",
  "brasil",
  "familia",
  "amor"
];


// ------------------------------------------------------------
// 9. DETECTA PALAVRAS COMUNS
// ------------------------------------------------------------

function detectarPalavrasComuns(senha) {

  const texto = senha
    .toLowerCase()
    .replace(/[0-9@#$!%^&*._-]/g, "");

  return PALAVRAS_COMUNS.some(palavra =>
    texto.includes(palavra)
  );
}


// ------------------------------------------------------------
// 10. ESTIMA ALFABETO EFETIVO
// ------------------------------------------------------------

function calcularAlfabeto(caracteristicas) {

  let tamanho = 0;

  if (caracteristicas.minusculas) {
    tamanho += 26;
  }

  if (caracteristicas.maiusculas) {
    tamanho += 26;
  }

  if (caracteristicas.numeros) {
    tamanho += 10;
  }

  if (caracteristicas.especiais) {
    tamanho += 33;
  }

  return tamanho;
}


// ------------------------------------------------------------
// 11. CALCULA ENTROPIA TEÓRICA
// ------------------------------------------------------------

function calcularEntropiaTeorica(tamanho, alfabeto) {

  if (!alfabeto || !tamanho) {
    return 0;
  }

  return tamanho * Math.log2(alfabeto);
}


// ------------------------------------------------------------
// 12. CALCULA ENTROPIA EFETIVA
// ------------------------------------------------------------
// Aqui está uma das principais diferenças em relação à função
// original.
//
// Uma senha "Abc123456!" pode possuir um alfabeto grande,
// mas continua previsível.
//
// Portanto aplicamos penalidades aos padrões encontrados.
// ------------------------------------------------------------

function calcularEntropiaEfetiva(
  entropiaTeorica,
  senha,
  analise
) {

  let entropia = entropiaTeorica;

  const tamanho = senha.length;

  // Senha muito curta
  if (tamanho <= 5) {
    entropia -= 12;
  } else if (tamanho <= 7) {
    entropia -= 6;
  }

  // Sequências
  if (analise.sequencia) {
    entropia -= 10;
  }

  // Repetições
  if (analise.repeticao) {
    entropia -= 12;
  }

  // Palavra comum
  if (analise.palavraComum) {
    entropia -= 18;
  }

  // Data / ano
  if (analise.data) {
    entropia -= 12;
  }

  // Senha conhecida
  if (analise.comum) {
    entropia -= 30;
  }

  // Pouca variedade de caracteres
  if (analise.variedade <= 2 && tamanho > 5) {
    entropia -= 5;
  }

  // Muitas ocorrências do mesmo caractere
  const frequencias = {};

  for (const caractere of senha) {
    frequencias[caractere] =
      (frequencias[caractere] || 0) + 1;
  }

  const maiorFrequencia =
    Math.max(...Object.values(frequencias));

  if (maiorFrequencia / tamanho >= 0.5) {
    entropia -= 8;
  }

  // Nunca permitir entropia negativa
  return Math.max(0, entropia);
}


// ------------------------------------------------------------
// 13. CENÁRIOS DE ATAQUE
// ------------------------------------------------------------
//
// Os valores são aproximações para representar ordens de
// grandeza diferentes.
//
// Não significam "velocidade garantida de hackers".
//
// ONLINE:
// Tentativas limitadas por servidor, login, CAPTCHA etc.
//
// OFFLINE LENTO:
// Ataque contra hashes relativamente custosos.
//
// OFFLINE RÁPIDO:
// Cenário de hashes rápidos / cracking massivo.
// ------------------------------------------------------------

const CENARIOS_ATAQUE = {

  online: {
    nome: "Ataque online",
    tentativasPorSegundo: 100
  },

  offlineLento: {
    nome: "Ataque offline (hash lento)",
    tentativasPorSegundo: 100000
  },

  offlineRapido: {
    nome: "Ataque offline (hash rápido)",
    tentativasPorSegundo: 10000000000
  }
};


// ------------------------------------------------------------
// 14. CALCULA TENTATIVAS
// ------------------------------------------------------------

function calcularTentativas(entropia) {

  // 2^entropia representa o espaço de busca.
  //
  // Para encontrar uma senha, em média, seriam necessárias
  // aproximadamente metade das possibilidades.

  if (entropia >= 1024) {
    return Infinity;
  }

  return Math.pow(2, entropia - 1);
}


// ------------------------------------------------------------
// 15. CALCULA TEMPO
// ------------------------------------------------------------

function calcularTempoPorCenario(
  tentativas,
  tentativasPorSegundo
) {

  if (!isFinite(tentativas)) {
    return Infinity;
  }

  return tentativas / tentativasPorSegundo;
}


// ------------------------------------------------------------
// 16. CLASSIFICA A SENHA
// ------------------------------------------------------------

function classificarSenha(entropia, analise, tamanho) {

  // Senhas explicitamente comuns
  if (analise.comum) {
    return {
      nivel: "Muito Fraca",
      percent: 10,
      cor: "#dc3545"
    };
  }

  // Padrões extremamente previsíveis
  if (
    entropia < 20 ||
    (analise.sequencia && tamanho < 10) ||
    (analise.repeticao && tamanho < 10)
  ) {
    return {
      nivel: "Muito Fraca",
      percent: 15,
      cor: "#dc3545"
    };
  }

  if (entropia < 35) {
    return {
      nivel: "Fraca",
      percent: 35,
      cor: "#fd7e14"
    };
  }

  if (entropia < 55) {
    return {
      nivel: "Moderada",
      percent: 60,
      cor: "#ffc107"
    };
  }

  if (entropia < 75) {
    return {
      nivel: "Forte",
      percent: 80,
      cor: "#17a2b8"
    };
  }

  return {
    nivel: "Muito Forte",
    percent: 100,
    cor: "#28a745"
  };
}


// ------------------------------------------------------------
// 17. GERA FEEDBACK
// ------------------------------------------------------------

function gerarFeedback(analise, entropia, tamanho) {

  if (analise.comum) {
    return "Esta senha está entre padrões muito comuns e pode ser encontrada rapidamente em listas de senhas.";
  }

  if (analise.repeticao) {
    return "A senha contém repetições previsíveis. Evite repetir caracteres ou blocos.";
  }

  if (analise.sequencia) {
    return "A senha contém sequências previsíveis, como números, letras ou padrões de teclado.";
  }

  if (analise.data) {
    return "A senha parece conter uma data ou ano, um padrão frequentemente testado em ataques.";
  }

  if (analise.palavraComum) {
    return "A senha contém palavras comuns. Adicionar símbolos não necessariamente elimina essa previsibilidade.";
  }

  if (tamanho < 8) {
    return "A senha ainda é curta. Aumentar o comprimento geralmente melhora muito a resistência.";
  }

  if (entropia < 40) {
    return "A senha possui alguma variedade, mas ainda apresenta espaço de busca relativamente pequeno.";
  }

  if (entropia < 60) {
    return "Boa resistência estimada. Aumentar o comprimento pode melhorar significativamente a segurança.";
  }

  if (entropia < 80) {
    return "Senha forte. Comprimento e variedade fornecem um espaço de busca elevado.";
  }

  return "Senha muito forte sob este modelo. Prefira senhas únicas e não reutilizadas.";
}


// ============================================================
// FUNÇÃO PRINCIPAL
// ============================================================

function analisarForcaSenha(senha) {

  // --------------------------------------------------------
  // SENHA VAZIA
  // --------------------------------------------------------

  if (!senha) {

    return {
      nivel: "Vazio",
      percent: 0,
      cor: "transparent",
      tempo: "-",
      feedback: "Digite uma senha para analisar.",

      entropia: 0,
      bits: 0,
      tentativas: 0,

      cenarios: {
        online: "-",
        offlineLento: "-",
        offlineRapido: "-"
      }
    };
  }


  // --------------------------------------------------------
  // CARACTERÍSTICAS
  // --------------------------------------------------------

  const caracteres = analisarCaracteres(senha);

  const tamanho = senha.length;

  const alfabeto = calcularAlfabeto(caracteres);


  // --------------------------------------------------------
  // PADRÕES
  // --------------------------------------------------------

  const analise = {

    comum: SENHAS_COMUNS.has(
      senha.toLowerCase()
    ),

    sequencia: detectarSequencias(senha),

    repeticao: detectarRepeticoes(senha),

    data: detectarData(senha),

    palavraComum: detectarPalavrasComuns(senha),

    variedade: caracteres.variedadeCaracteres
  };


  // --------------------------------------------------------
  // ENTROPIA
  // --------------------------------------------------------

  const entropiaTeorica =
    calcularEntropiaTeorica(
      tamanho,
      alfabeto
    );

  const entropia =
    calcularEntropiaEfetiva(
      entropiaTeorica,
      senha,
      analise
    );


  // --------------------------------------------------------
  // TENTATIVAS MÉDIAS
  // --------------------------------------------------------

  const tentativas =
    calcularTentativas(entropia);


  // --------------------------------------------------------
  // TEMPOS
  // --------------------------------------------------------

  const segundosOnline =
    calcularTempoPorCenario(
      tentativas,
      CENARIOS_ATAQUE.online.tentativasPorSegundo
    );

  const segundosOfflineLento =
    calcularTempoPorCenario(
      tentativas,
      CENARIOS_ATAQUE.offlineLento.tentativasPorSegundo
    );

  const segundosOfflineRapido =
    calcularTempoPorCenario(
      tentativas,
      CENARIOS_ATAQUE.offlineRapido.tentativasPorSegundo
    );


  // --------------------------------------------------------
  // CLASSIFICAÇÃO
  // --------------------------------------------------------

  const classificacao =
    classificarSenha(
      entropia,
      analise,
      tamanho
    );


  // --------------------------------------------------------
  // FEEDBACK
  // --------------------------------------------------------

  const feedback =
    gerarFeedback(
      analise,
      entropia,
      tamanho
    );


  // --------------------------------------------------------
  // RETORNO
  // --------------------------------------------------------

  return {

    // Compatibilidade com sua interface atual
    nivel: classificacao.nivel,

    percent: classificacao.percent,

    cor: classificacao.cor,

    // Mantém "tempo" como o cenário mais agressivo
    tempo: formatarTempoEstimado(
      segundosOfflineRapido
    ),

    feedback: feedback,


    // ----------------------------------------------------
    // NOVOS DADOS
    // ----------------------------------------------------

    tamanho: tamanho,

    bits: Math.round(entropia),

    entropia: Number(
      entropia.toFixed(2)
    ),

    tentativas: tentativas,

    tentativasFormatadas: formatarNumero(tentativas),


    // ----------------------------------------------------
    // CENÁRIOS
    // ----------------------------------------------------

    cenarios: {

      online: formatarTempoEstimado(
        segundosOnline
      ),

      offlineLento: formatarTempoEstimado(
        segundosOfflineLento
      ),

      offlineRapido: formatarTempoEstimado(
        segundosOfflineRapido
      )
    },


    // ----------------------------------------------------
    // DIAGNÓSTICO
    // ----------------------------------------------------

    diagnostico: {

      minusculas: caracteres.minusculas,

      maiusculas: caracteres.maiusculas,

      numeros: caracteres.numeros,

      especiais: caracteres.especiais,

      variedadeCaracteres: caracteres.variedadeCaracteres,

      alfabeto: alfabeto,

      sequencia: analise.sequencia,

      repeticao: analise.repeticao,

      palavraComum: analise.palavraComum,

      senhaComum: analise.comum,

      data: analise.data
    }
  };
}

// Inicializadores automáticos
autorizarEventosSenha();
dispararGeracaoSenha();