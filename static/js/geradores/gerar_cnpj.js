function dispararGeracaoCNPJ() {
    const formatar = document.getElementById("cnpj-formatar")?.checked;
    const output = document.getElementById("cnpj-resultado");

    if (!output) return;

    output.value = gerarCNPJValido(formatar);
}

// Algoritmo Matemático de Geração de CNPJ
function gerarCNPJValido(comPontuacao = true) {
    const randomDigit = () => Math.floor(Math.random() * 9);
    
    // Gera os 8 primeiros dígitos aleatórios e acrescenta o padrão de filial "0001"
    const n = Array.from({ length: 8 }, randomDigit);
    const cnpjBase = [...n, 0, 0, 0, 1]; // Representa o final /0001

    // Cálculo do Primeiro Dígito Verificador (Pesos: 5,4,3,2,9,8,7,6,5,4,3,2)
    const pesosD1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    let d1 = cnpjBase.reduce((acc, num, idx) => acc + num * pesosD1[idx], 0);
    d1 = d1 % 11;
    d1 = d1 < 2 ? 0 : 11 - d1;

    // Adiciona o primeiro dígito para calcular o segundo
    const cnpjComD1 = [...cnpjBase, d1];

    // Cálculo do Segundo Dígito Verificador (Pesos: 6,5,4,3,2,9,8,7,6,5,4,3,2)
    const pesosD2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    let d2 = cnpjComD1.reduce((acc, num, idx) => acc + num * pesosD2[idx], 0);
    d2 = d2 % 11;
    d2 = d2 < 2 ? 0 : 11 - d2;

    // Junta tudo em uma string de números
    const cnpjLimpo = `${cnpjBase.join('')}${d1}${d2}`;

    // Aplica a máscara se solicitado (00.000.000/0001-00)
    if (comPontuacao) {
        return cnpjLimpo.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, "$1.$2.$3/$4-$5");
    }

    return cnpjLimpo;
}

// Executa uma geração automática inicial assim que o usuário abre a ferramenta
dispararGeracaoCNPJ();