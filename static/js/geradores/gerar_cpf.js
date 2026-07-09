function dispararGeracaoCPF() {
    const formatar = document.getElementById("cpf-formatar")?.checked;
    const output = document.getElementById("cpf-resultado");

    if (!output) return;

    output.value = gerarCPFValido(formatar);
}

// Algoritmo Matemático de Geração de CPF
function gerarCPFValido(comPontuacao = true) {
    const randomDigit = () => Math.floor(Math.random() * 9);
    
    // Gera os 9 primeiros dígitos aleatoriamente
    const n = Array.from({ length: 9 }, randomDigit);

    // Cálculo do Primeiro Dígito Verificador
    let d1 = n.reduce((acc, num, idx) => acc + num * (10 - idx), 0);
    d1 = 11 - (d1 % 11);
    if (d1 >= 10) d1 = 0;

    // Adiciona o primeiro dígito para calcular o segundo
    const nComD1 = [...n, d1];

    // Cálculo do Segundo Dígito Verificador
    let d2 = nComD1.reduce((acc, num, idx) => acc + num * (11 - idx), 0);
    d2 = 11 - (d2 % 11);
    if (d2 >= 10) d2 = 0;

    // Junta tudo em uma string de números
    const cpfLimpo = `${n.join('')}${d1}${d2}`;

    // Aplica a máscara se solicitado
    if (comPontuacao) {
        return cpfLimpo.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
    }

    return cpfLimpo;
}

// Executa uma geração automática inicial assim que o usuário abre a ferramenta
dispararGeracaoCPF();