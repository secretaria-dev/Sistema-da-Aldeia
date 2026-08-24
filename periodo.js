// ==========================================
// PERÍODOS DAS AVALIAÇÕES
// SISTEMA ALDEIA
// ==========================================


// ==========================================
// FORMATAR DATA
// ==========================================

function formatarDataPeriodo(data) {

    if (!data) {
        return "—";
    }

    const partes = data.split("-");

    if (partes.length !== 3) {
        return data;
    }

    return (
        partes[2] +
        "/" +
        partes[1] +
        "/" +
        partes[0]
    );
}


// ==========================================
// OBTER PERÍODOS
// ==========================================

function obterPeriodosAvaliacoes() {

    return JSON.parse(
        localStorage.getItem("periodosAvaliacoes")
    ) || {};

}


// ==========================================
// SALVAR PERÍODO
// ==========================================

function salvarPeriodo(numero) {

    const inicioElemento =
        document.getElementById("inicio" + numero);

    const fimElemento =
        document.getElementById("fim" + numero);


    if (!inicioElemento || !fimElemento) {

        console.error(
            "Campos de período não encontrados."
        );

        return;
    }


    const inicio =
        inicioElemento.value;

    const fim =
        fimElemento.value;


    // ------------------------------------------
    // VALIDAR CAMPOS
    // ------------------------------------------

    if (!inicio || !fim) {

        alert(
            "⚠️ Informe a data de início e a data de término da Avaliação " +
            numero +
            "."
        );

        return;
    }


    // ------------------------------------------
    // VALIDAR ORDEM
    // ------------------------------------------

    if (inicio > fim) {

        alert(
            "⚠️ A data de início não pode ser maior que a data de término."
        );

        return;
    }


    // ------------------------------------------
    // PEGAR PERÍODOS EXISTENTES
    // ------------------------------------------

    const periodos =
        obterPeriodosAvaliacoes();


    // ------------------------------------------
    // SALVAR
    // ------------------------------------------

    periodos["avaliacao" + numero] = {

        inicio: inicio,

        fim: fim

    };


    localStorage.setItem(
        "periodosAvaliacoes",
        JSON.stringify(periodos)
    );


    atualizarStatusPeriodo(numero);


    alert(
        "✅ Período da Avaliação " +
        numero +
        " salvo com sucesso!"
    );

}


// ==========================================
// EXCLUIR PERÍODO
// ==========================================

function excluirPeriodo(numero) {

    const confirmar =
        confirm(
            "⚠️ Deseja realmente excluir o período da Avaliação " +
            numero +
            "?"
        );


    if (!confirmar) {
        return;
    }


    const periodos =
        obterPeriodosAvaliacoes();


    delete periodos["avaliacao" + numero];


    localStorage.setItem(
        "periodosAvaliacoes",
        JSON.stringify(periodos)
    );


    const inicio =
        document.getElementById("inicio" + numero);

    const fim =
        document.getElementById("fim" + numero);


    if (inicio) {
        inicio.value = "";
    }

    if (fim) {
        fim.value = "";
    }


    atualizarStatusPeriodo(numero);


    alert(
        "🗑️ Período da Avaliação " +
        numero +
        " excluído com sucesso!"
    );

}


// ==========================================
// ATUALIZAR STATUS DO PERÍODO
// ==========================================

function atualizarStatusPeriodo(numero) {

    const status =
        document.getElementById(
            "status" + numero
        );


    if (!status) {
        return;
    }


    const periodos =
        obterPeriodosAvaliacoes();


    const periodo =
        periodos["avaliacao" + numero];


    // ------------------------------------------
    // SEM PERÍODO
    // ------------------------------------------

    if (
        !periodo ||
        !periodo.inicio ||
        !periodo.fim
    ) {

        status.innerHTML =
            "🔒 Nenhum período configurado.";

        return;
    }


    // ------------------------------------------
    // DATAS
    // ------------------------------------------

    const hoje =
        new Date();

    hoje.setHours(
        0,
        0,
        0,
        0
    );


    const inicio =
        new Date(
            periodo.inicio +
            "T00:00:00"
        );


    const fim =
        new Date(
            periodo.fim +
            "T23:59:59"
        );


    // ------------------------------------------
    // AINDA NÃO LIBERADA
    // ------------------------------------------

    if (hoje < inicio) {

        status.innerHTML = `

            🟡 <strong>Avaliação ainda não liberada.</strong>

            <br><br>

            📅 Início:
            <strong>
                ${formatarDataPeriodo(periodo.inicio)}
            </strong>

            <br>

            📅 Término:
            <strong>
                ${formatarDataPeriodo(periodo.fim)}
            </strong>

        `;

        return;
    }


    // ------------------------------------------
    // LIBERADA
    // ------------------------------------------

    if (
        hoje >= inicio &&
        hoje <= fim
    ) {

        status.innerHTML = `

            🟢 <strong>Avaliação LIBERADA.</strong>

            <br><br>

            📅 Início:
            <strong>
                ${formatarDataPeriodo(periodo.inicio)}
            </strong>

            <br>

            📅 Término:
            <strong>
                ${formatarDataPeriodo(periodo.fim)}
            </strong>

        `;

        return;
    }


    // ------------------------------------------
    // ENCERRADA
    // ------------------------------------------

    if (hoje > fim) {

        status.innerHTML = `

            🔴 <strong>Avaliação encerrada.</strong>

            <br><br>

            📅 Início:
            <strong>
                ${formatarDataPeriodo(periodo.inicio)}
            </strong>

            <br>

            📅 Término:
            <strong>
                ${formatarDataPeriodo(periodo.fim)}
            </strong>

        `;

    }

}


// ==========================================
// CARREGAR PERÍODOS
// ==========================================

function carregarPeriodos() {

    const periodos =
        obterPeriodosAvaliacoes();


    for (
        let numero = 1;
        numero <= 3;
        numero++
    ) {

        const periodo =
            periodos[
                "avaliacao" + numero
            ];


        const inicio =
            document.getElementById(
                "inicio" + numero
            );


        const fim =
            document.getElementById(
                "fim" + numero
            );


        if (periodo) {

            if (inicio) {

                inicio.value =
                    periodo.inicio || "";

            }


            if (fim) {

                fim.value =
                    periodo.fim || "";

            }

        }


        atualizarStatusPeriodo(numero);

    }

}


// ==========================================
// INICIAR
// ==========================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        carregarPeriodos();

    }
);