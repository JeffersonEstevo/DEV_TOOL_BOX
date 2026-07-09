# Dev Tool Box

O **Dev Tool Box** é uma plataforma web centralizada e responsiva que reúne um ecossistema completo de utilitários projetados para otimizar a rotina de desenvolvedores, analistas e usuários finais. Funcionando de forma totalmente *client-side*, a aplicação é construída exclusivamente com tecnologias nativas da web, eliminando a necessidade de qualquer processamento ou armazenamento em servidores backend.

Toda a lógica e o processamento de dados ocorrem instantaneamente no próprio navegador do usuário, garantindo privacidade, velocidade e portabilidade.

---

## ✨ Funcionalidades e Ferramentas Disponíveis

A aplicação organiza suas ferramentas de forma modular em categorias acessíveis pelo menu lateral interativo:

### 📝 Textos (Tratamento e Análise)
* **Substituir Palavra:** Localização e troca de termos em blocos de texto.
* **Contador de Caracteres:** Análise quantitativa de caracteres, palavras e espaços.
* **Frequência de Palavras:** Identificação de termos recorrentes em um texto.
* **Inverter e Revirar Texto:** Inversão da ordem de caracteres ou palavras.
* **Maiúscula & Minúscula:** Conversão rápida de caixa (*UPPERCASE*, *lowercase*, *CaMeL CaSe*).
* **Remoção Avançada:** Módulos dedicados para remover acentos, espaços extras, pontuação, quebras de linha e textos contidos entre caracteres específicos.
* **Similaridade e Comparação:** Ferramentas para confrontar dois textos e identificar diferenças ou o percentual de igualdade entre eles.
* **Leitura Dinâmica:** Utilitário para aumentar a velocidade de absorção de leitura.

### 🧮 Calculadoras
* **Fração:** Operações matemáticas envolvendo frações e números mistos.
* **Porcentagem:** Cálculos rápidos de acréscimos, descontos e proporções.
* **Regra de Três:** Resolução de equações de proporcionalidade direta ou inversa.
* **Média Aritmética:** Cálculo de médias a partir de conjuntos de dados.
* **Científica:** Calculadora completa com funções trigonométricas, logarítmicas e exponenciais.

### 🧬 Geradores (Massa de Dados para Testes)
* **Documentos Nacionais:** Gerador de CPF, CNPJ e CEP válidos para homologação de sistemas.
* **Cartão de Crédito:** Geração de números de cartões simulados que passam em validações de algoritmo (Luhn).
* **Gerar Pessoa:** Criação de perfis completos fictícios para preenchimento de formulários de teste.
* **Gerar UUID:** Emissor de identificadores únicos universais aleatórios.

### 🔄 Conversores de Grandeza
* **Medidas Físicas:** Conversão instantânea de Comprimento, Massa, Temperatura, Tempo e Velocidade.
* **Elétrica:** Conversão de unidades e parâmetros elétricos.
* **Tensão Trifásica ($3\phi$):** Cálculos e conversões específicas para sistemas de potência trifásicos.

### 🌐 Rede e Infraestrutura
* **Máscara de Rede:** Cálculo e sub-redes a partir de IPs e máscaras CIDR.
* **Conversor de Bases:** Conversor numérico entre sistemas Binário, Octal, Decimal e Hexadecimal.

### 📅 Data/Hora
* **Calcular Horas:** Soma e subtração de horas para folhas de ponto ou cronogramas.
* **Contar Dias e Subtrair Datas:** Cálculo exato de intervalos de tempo entre calendários.
* **Data/Decimal:** Conversão de formatos de data para frações decimais e vice-versa.

### 🎨 Cores
* **Color Picker:** Seletor de cores integrado com extração de códigos em formatos Hexadecimal, RGB e HSL.

---

## 🎨 Interface e Experiência de Uso

O **Dev Tool Box** foi projetado com foco em usabilidade e fluidez visual:

* **Navegação SPA (Single Page Application):** A troca de ferramentas ocorre por meio de rotas baseadas em hash (`#/`). Ao clicar em um utilitário no menu, o conteúdo é injetado dinamicamente na área central sem recarregar a página.
* **Suporte a Temas (Light/Dark Mode):** Alternância instantânea de cores através do botão de tema (`#theme-toggle`) localizado na barra superior para maior conforto visual.
* **Layout Responsivo e Retrátil:** O menu lateral pode ser recolhido através do botão de alternância (`#sidebarToggle`), otimizando o espaço de trabalho em telas menores ou dispositivos móveis.
* **Foco em Privacidade:** Nenhum dado inserido nas ferramentas é enviado para servidores externos; todo o tratamento de dados é estritamente local.

---

## 💻 Especificações Técnicas

A arquitetura do projeto é minimalista e independente de instaladores ou dependências complexas:

* **Frontend:** HTML5 estrutural, CSS3 baseado em propriedades customizadas (variáveis de estilo) e JavaScript Vanilla (ES6+).
* **Ícones:** Bootstrap Icons carregados via CDN.
* **Hospedagem:** Por ser estático, o projeto pode ser implantado diretamente em qualquer serviço de hospedagem estática gratuita, como *GitHub Pages*, *Vercel*, *Netlify* ou *Cloudflare Pages*.