function dispararGeracaoCartao() {
    const formatar = document.getElementById("cartao-formatar")?.checked;
    const bandeiraElement = document.querySelector('input[name="bandeira-cartao"]:checked');
    const bandeira = bandeiraElement ? bandeiraElement.value : 'visa';
    const output = document.getElementById("cartao-resultado");

    if (!output) return;

    output.value = gerarCartaoValido(bandeira, formatar);
}

// Algoritmo de Luhn (Módulo 10) para gerar números de cartões estruturalmente válidos
function gerarCartaoValido(bandeira = 'visa', comEspacos = true) {
    let numeroBase = [];

    // Define os primeiros dígitos (BIN) conforme a bandeira escolhida
    if (bandeira === 'visa') {
        numeroBase.push(4); // Visa sempre começa com 4
    } else if (bandeira === 'mastercard') {
        // Mastercard comumente começa com números de 51 a 55
        const prefixosMaster = [51, 52, 53, 54, 55];
        const prefixoAleatorio = prefixosMaster[Math.floor(Math.random() * prefixosMaster.length)].toString();
        numeroBase.push(...prefixoAleatorio.split('').map(Number));
    }

    // Gera os dígitos restantes até completar 15 dígitos totais
    const tamanhoFaltante = 15 - numeroBase.length;
    for (let i = 0; i < tamanhoFaltante; i++) {
        numeroBase.push(Math.floor(Math.random() * 10));
    }

    // Calcula o 16º dígito (Dígito Verificador) usando a fórmula matemática de Luhn
    let soma = 0;
    for (let i = 0; i < 15; i++) {
        let digito = numeroBase[i];
        // Dobra o valor das posições ímpares (contando de trás para frente, ou seja, índices pares de 0 a 14)
        if (i % 2 === 0) {
            digito *= 2;
            if (digito > 9) digito -= 9;
        }
        soma += digito;
    }

    const digitoVerificador = (10 - (soma % 10)) % 10;
    numeroBase.push(digitoVerificador);

    const numeroLimpo = numeroBase.join('');

    // Aplica a máscara se solicitado (0000 0000 0000 0000)
    if (comEspacos) {
        return numeroLimpo.replace(/(\d{4})(\d{4})(\d{4})(\d{4})/, "$1 $2 $3 $4");
    }

    return numeroLimpo;
}

// Executa uma geração automática inicial assim que o usuário abre a ferramenta
dispararGeracaoCartao();