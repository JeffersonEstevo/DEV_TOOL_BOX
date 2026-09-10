function dispararGeracaoPessoa() {
    const sexoSelecionado = document.querySelector('input[name="pessoa-sexo"]:checked')?.value || 'I';
    
    const nomesF = ["Ana", "Maria", "Beatriz", "Juliana", "Camila", "Larissa", "Fernanda", "Amanda", "Letícia", "Gabriela"];
    const nomesM = ["João", "Pedro", "Lucas", "Mateus", "Gabriel", "Carlos", "Felipe", "Bruno", "Rodrigo", "Diego"];
    const sobrenomes = ["Silva", "Santos", "Oliveira", "Souza", "Rodrigues", "Ferreira", "Alves", "Pereira", "Lima", "Gomes"];
    
    const cidades = ["São Paulo", "Rio de Janeiro", "Belo Horizonte", "Curitiba", "Porto Alegre", "Salvador", "Recife", "Fortaleza", "Brasília", "Goiânia"];
    const estados = ["SP", "RJ", "MG", "PR", "RS", "BA", "PE", "CE", "DF", "GO"];
    const logradouros = ["Rua das Flores, 123", "Av. Paulista, 985", "Rua Sete de Setembro, 44", "Av. Atlântica, 1020", "Rua Bahia, 312"];
    const signos = ["Áries", "Touro", "Gêmeos", "Câncer", "Leão", "Virgem", "Libra", "Escorpião", "Sagitário", "Capricórnio", "Aquário", "Peixes"];
    const sangues = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

    let sexoFinal = sexoSelecionado;
    if (sexoFinal === 'I') sexoFinal = Math.random() > 0.5 ? 'F' : 'M';
    
    const nomeBase = sexoFinal === 'F' ? nomesF[Math.floor(Math.random() * nomesF.length)] : nomesM[Math.floor(Math.random() * nomesM.length)];
    const sobrenome1 = sobrenomes[Math.floor(Math.random() * sobrenomes.length)];
    const sobrenome2 = sobrenomes[Math.floor(Math.random() * sobrenomes.length)];
    const nomeCompleto = `${nomeBase} ${sobrenome1} ${sobrenome2}`;

    const idade = Math.floor(Math.random() * 50) + 18;
    const anoNasc = new Date().getFullYear() - idade;
    const mesNasc = String(Math.floor(Math.random() * 12) + 1).padStart(2, '0');
    const diaNasc = String(Math.floor(Math.random() * 28) + 1).padStart(2, '0');
    const dataNascimento = `${diaNasc}/${mesNasc}/${anoNasc}`;
    const signo = signos[Math.floor(Math.random() * signos.length)];

    const cpf = Array.from({length: 11}, () => Math.floor(Math.random() * 10)).join('').replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
    const ddd = [11, 21, 31, 41, 51, 61, 71, 81][Math.floor(Math.random() * 8)];
    const numTelefone = Math.floor(10000000 + Math.random() * 90000000);
    const telefone = `(${ddd}) 9${String(numTelefone).replace(/(\d{4})(\d{4})/, "$1-$2")}`;

    const localIdx = Math.floor(Math.random() * cidades.length);
    const cep = Math.floor(10000 + Math.random() * 89999) + "-" + Math.floor(100 + Math.random() * 899);

    const usuario = (nomeBase + sobrenome1).toLowerCase();
    const email = `${usuario}@teste-provedor.com.br`;
    const senha = Math.random().toString(36).slice(-8);

    const band = Math.random() > 0.5 ? 'Visa' : 'Mastercard';
    const numCartao = Array.from({length: 4}, () => Math.floor(1000 + Math.random() * 9000)).join(' ');
    const expMes = String(Math.floor(Math.random() * 12) + 1).padStart(2, '0');
    const expAno = String(new Date().getFullYear() + Math.floor(Math.random() * 5)).slice(-2);
    const cvv = Math.floor(100 + Math.random() * 900);

    const altura = (1.50 + Math.random() * 0.45).toFixed(2) + " m";
    const peso = Math.floor(50 + Math.random() * 55) + " kg";
    const tipoSangue = sangues[Math.floor(Math.random() * sangues.length)];

    const setVal = (id, val) => {
        const el = document.getElementById(id);
        if (el) el.value = val;
    };

    setVal("p-nome", nomeCompleto);
    setVal("p-cpf", cpf);
    setVal("p-telefone", telefone);
    setVal("p-nascimento", dataNascimento);
    setVal("p-idade-signo", `${idade} anos / ${signo}`);
    setVal("p-cep", cep);
    setVal("p-endereco", logradouros[Math.floor(Math.random() * logradouros.length)]);
    setVal("p-cidade", cidades[localIdx]);
    setVal("p-estado", estados[localIdx]);
    setVal("p-email", email);
    setVal("p-usuario", usuario);
    setVal("p-senha", senha);
    setVal("p-cartao-bandeira", band);
    setVal("p-cartao-numero", numCartao);
    setVal("p-cartao-detalhe", `${expMes}/${expAno} - CVV: ${cvv}`);
    setVal("p-sexo", sexoFinal === 'F' ? "Feminino" : "Masculino");
    setVal("p-fisico", `${altura} / ${peso}`);
    setVal("p-sangue", tipoSangue);
    setVal("p-nacionalidade", "Brasileira");
}

// Vincula o evento de forma segura utilizando bloco anônimo ou verificação inline
(function() {
    const btnGerarPessoa = document.getElementById("btn-gerar-pessoa");
    if (btnGerarPessoa && !btnGerarPessoa.dataset.listenerAttached) {
        btnGerarPessoa.dataset.listenerAttached = "true";
        btnGerarPessoa.addEventListener("click", dispararGeracaoPessoa);
    }
    
    // Gera dados iniciais apenas se o campo existir na página atual
    if (document.getElementById("p-nome")) {
        dispararGeracaoPessoa();
    }
})();