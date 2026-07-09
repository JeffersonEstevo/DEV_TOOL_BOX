function dispararGeracaoPessoa() {
    const sexoSelecionado = document.querySelector('input[name="pessoa-sexo"]:checked')?.value || 'I';
    
    // Listas de amostragem para simular dados fictícios realistas
    const nomesF = ["Ana", "Maria", "Beatriz", "Juliana", "Camila", "Larissa", "Fernanda", "Amanda", "Letícia", "Gabriela"];
    const nomesM = ["João", "Pedro", "Lucas", "Mateus", "Gabriel", "Carlos", "Felipe", "Bruno", "Rodrigo", "Diego"];
    const sobrenomes = ["Silva", "Santos", "Oliveira", "Souza", "Rodrigues", "Ferreira", "Alves", "Pereira", "Lima", "Gomes"];
    
    const cidades = ["São Paulo", "Rio de Janeiro", "Belo Horizonte", "Curitiba", "Porto Alegre", "Salvador", "Recife", "Fortaleza", "Brasília", "Goiânia"];
    const estados = ["SP", "RJ", "MG", "PR", "RS", "BA", "PE", "CE", "DF", "GO"];
    const logradouros = ["Rua das Flores, 123", "Av. Paulista, 985", "Rua Sete de Setembro, 44", "Av. Atlântica, 1020", "Rua Bahia, 312"];
    const signos = ["Áries", "Touro", "Gêmeos", "Câncer", "Leão", "Virgem", "Libra", "Escorpião", "Sagitário", "Capricórnio", "Aquário", "Peixes"];
    const sangues = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

    // 1. Define Gênero e Nome
    let sexoFinal = sexoSelecionado;
    if (sexoFinal === 'I') sexoFinal = Math.random() > 0.5 ? 'F' : 'M';
    
    const nomeBase = sexoFinal === 'F' ? nomesF[Math.floor(Math.random() * nomesF.length)] : nomesM[Math.floor(Math.random() * nomesM.length)];
    const sobrenome1 = sobrenomes[Math.floor(Math.random() * sobrenomes.length)];
    const sobrenome2 = sobrenomes[Math.floor(Math.random() * sobrenomes.length)];
    const nomeCompleto = `${nomeBase} ${sobrenome1} ${sobrenome2}`;

    // 2. Dados de Nascimento & Idade
    const idade = Math.floor(Math.random() * 50) + 18; // 18 a 67 anos
    const anoNasc = new Date().getFullYear() - idade;
    const mesNasc = String(Math.floor(Math.random() * 12) + 1).padStart(2, '0');
    const diaNasc = String(Math.floor(Math.random() * 28) + 1).padStart(2, '0');
    const dataNascimento = `${diaNasc}/${mesNasc}/${anoNasc}`;
    const signo = signos[Math.floor(Math.random() * signos.length)];

    // 3. Documentos e Contatos
    const cpf = Array.from({length: 11}, () => Math.floor(Math.random() * 10)).join('').replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
    const ddd = [11, 21, 31, 41, 51, 61, 71, 81][Math.floor(Math.random() * 8)];
    const numTelefone = Math.floor(10000000 + Math.random() * 90000000);
    const telefone = `(${ddd}) 9${String(numTelefone).replace(/(\d{4})(\d{4})/, "$1-$2")}`;

    // 4. Endereço
    const localIdx = Math.floor(Math.random() * cidades.length);
    const cep = Math.floor(10000 + Math.random() * 89999) + "-" + Math.floor(100 + Math.random() * 899);

    // 5. Conta Online
    const usuario = (nomeBase + sobrenome1).toLowerCase();
    const email = `${usuario}@teste-provedor.com.br`;
    const senha = Math.random().toString(36).slice(-8);

    // 6. Financeiro
    const band = Math.random() > 0.5 ? 'Visa' : 'Mastercard';
    const numCartao = Array.from({length: 4}, () => Math.floor(1000 + Math.random() * 9000)).join(' ');
    const expMes = String(Math.floor(Math.random() * 12) + 1).padStart(2, '0');
    const expAno = String(new Date().getFullYear() + Math.floor(Math.random() * 5)).slice(-2);
    const cvv = Math.floor(100 + Math.random() * 900);

    // 7. Características Físicas
    const altura = (1.50 + Math.random() * 0.45).toFixed(2) + " m";
    const peso = Math.floor(50 + Math.random() * 55) + " kg";
    const tipoSangue = sangues[Math.floor(Math.random() * sangues.length)];

    // Envio dos valores para a interface gráfica
    document.getElementById("p-nome").value = nomeCompleto;
    document.getElementById("p-cpf").value = cpf;
    document.getElementById("p-telefone").value = telefone;
    document.getElementById("p-nascimento").value = dataNascimento;
    document.getElementById("p-idade-signo").value = `${idade} anos / ${signo}`;
    document.getElementById("p-cep").value = cep;
    document.getElementById("p-endereco").value = logradouros[Math.floor(Math.random() * logradouros.length)];
    document.getElementById("p-cidade").value = cidades[localIdx];
    document.getElementById("p-estado").value = estados[localIdx];
    document.getElementById("p-email").value = email;
    document.getElementById("p-usuario").value = usuario;
    document.getElementById("p-senha").value = senha;
    document.getElementById("p-cartao-bandeira").value = band;
    document.getElementById("p-cartao-numero").value = numCartao;
    document.getElementById("p-cartao-detalhe").value = `${expMes}/${expAno} - CVV: ${cvv}`;
    document.getElementById("p-sexo").value = sexoFinal === 'F' ? "Feminino" : "Masculino";
    document.getElementById("p-fisico").value = `${altura} / ${peso}`;
    document.getElementById("p-sangue").value = tipoSangue;
    document.getElementById("p-nacionalidade").value = "Brasileira";
}

// Inicializa o gerador assim que a página é carregada
dispararGeracaoPessoa();