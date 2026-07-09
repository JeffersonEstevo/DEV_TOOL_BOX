// Função principal que orquestra a geração e exibe na tela
function dispararGeracaoCEP() {
    const formatar = document.getElementById("cep-formatar")?.checked;
    const output = document.getElementById("cep-resultado");

    if (!output) return;

    output.value = gerarCEPValido(formatar);
}

// Algoritmo de Geração de CEP (Gera formatos estruturalmente válidos baseados em faixas reais)
function gerarCEPValido(comPontuacao = true) {
    // Lista de prefixos comuns de faixas de CEP válidas (Capitais e regiões metropolitanas)
    const prefixosValidos = ["010", "130", "200", "301", "400", "500", "600", "700", "800", "900"];
    const prefixoAleatorio = prefixosValidos[Math.floor(Math.random() * prefixosValidos.length)];
    
    // Gera os 5 dígitos restantes aleatoriamente
    const randomDigit = () => Math.floor(Math.random() * 10);
    const sufixo = Array.from({ length: 5 }, randomDigit).join('');
    
    const cepLimpo = `${prefixoAleatorio}${sufixo}`;

    // Aplica a máscara de CEP se solicitado (00000-000)
    if (comPontuacao) {
        return cepLimpo.replace(/(\d{5})(\d{3})/, "$1-$2");
    }

    return cepLimpo;
}

// Lógica para copiar o texto gerado para a área de transferência com feedback visual (Toast)
function copiarCEP() {
    const output = document.getElementById("cep-resultado");
    const alerta = document.getElementById("cep-generator-alert");

    if (!output || !output.value) return;

    navigator.clipboard.writeText(output.value).then(() => {
        if (alerta) {
            alerta.classList.remove("hidden");
            
            // Remove o alerta após 2 segundos (ajuste conforme o padrão da aplicação)
            setTimeout(() => {
                alerta.classList.add("hidden");
            }, 2000);
        }
    }).catch(err => {
        console.error("Erro ao copiar CEP: ", err);
    });
}

// Vinculação dos eventos nos botões assim que o DOM carrega
document.addEventListener("DOMContentLoaded", () => {
    const btnGerar = document.getElementById("btn-gerar-cep");
    const btnCopiar = document.getElementById("btn-copiar-cep");

    if (btnGerar) btnGerar.addEventListener("click", dispararGeracaoCEP);
    if (btnCopiar) btnCopiar.addEventListener("click", copiarCEP);

    // Executa uma geração automática inicial assim que o usuário abre a ferramenta
    dispararGeracaoCEP();
});