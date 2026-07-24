window.RAIZ_3 = window.RAIZ_3 || Math.sqrt(3);
var RAIZ_3 = window.RAIZ_3;

function calcularTrifasicaLivre(idOrigem) {
    const inputFn = document.getElementById('tri-calc-fn');
    const inputFf = document.getElementById('tri-calc-ff');
    
    if (!inputFn || !inputFf) return;

    const inputOrigem = idOrigem === 'tri-calc-fn' ? inputFn : inputFf;
    const valor = parseFloat(inputOrigem.value);

    // Se o campo for limpo, esvazia o outro campo simultaneamente
    if (isNaN(valor)) {
        if (idOrigem === 'tri-calc-fn') inputFf.value = '';
        if (idOrigem === 'tri-calc-ff') inputFn.value = '';
        return;
    }

    if (idOrigem === 'tri-calc-fn') {
        // Vff = Vfn * √3
        const resFf = valor * RAIZ_3;
        inputFf.value = formatarSaidaTrifasica(resFf);
    } else if (idOrigem === 'tri-calc-ff') {
        // Vfn = Vff / √3
        const resFn = valor / RAIZ_3;
        inputFn.value = formatarSaidaTrifasica(resFn);
    }
}

function formatarSaidaTrifasica(num) {
    if (num === 0) return 0;
    // Duas casas decimais atendem perfeitamente o nível de precisão de multímetros
    return Number(num.toFixed(2)).toString();
}

// Altere de limparCamposTrifasica para limparTrifasica
function limparTrifasica() {
    const inputFn = document.getElementById('tri-calc-fn');
    const inputFf = document.getElementById('tri-calc-ff');
    if (inputFn) inputFn.value = '';
    if (inputFf) inputFf.value = '';
}

function inicializarConversorTrifasico() {
    const inputFn = document.getElementById('tri-calc-fn');
    const inputFf = document.getElementById('tri-calc-ff');

    if (inputFn) {
        if (inputFn._handleInputTri) inputFn.removeEventListener('input', inputFn._handleInputTri);
        inputFn._handleInputTri = () => calcularTrifasicaLivre('tri-calc-fn');
        inputFn.addEventListener('input', inputFn._handleInputTri);
    }

    if (inputFf) {
        if (inputFf._handleInputTri) inputFf.removeEventListener('input', inputFf._handleInputTri);
        inputFf._handleInputTri = () => calcularTrifasicaLivre('tri-calc-ff');
        inputFf.addEventListener('input', inputFf._handleInputTri);
    }
}

inicializarConversorTrifasico();