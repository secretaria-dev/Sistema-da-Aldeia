// ==========================================
// SISTEMA DE AVALIAÇÕES - SISTEMA ALDEIA
// ==========================================


// ==========================================
// INDICADORES
// ==========================================

const indicadores = [

    "Conhecimento Prático",
    "Conhecimento Técnico",
    "Empatia",
    "Colaboração",
    "Respeito",
    "Cooperação",
    "Comunicação",
    "Pensamento Crítico",
    "Responsabilidade",
    "Frequência"

];


// ==========================================
// ELEMENTOS DA NOVA AVALIAÇÃO
// ==========================================

const campoGrupo =
    document.getElementById("grupo");

const campoOficina =
    document.getElementById("oficina");

const campoAluno =
    document.getElementById("aluno");

const areaIndicadores =
    document.getElementById("indicadores");

const formulario =
    document.getElementById("formAvaliacao");

const numeroAvaliacao =
    document.getElementById("numeroAvaliacao");


// ==========================================
// ELEMENTOS DA ÁREA ADMINISTRATIVA
// ==========================================

const grupoFiltro =
    document.getElementById("grupoFiltro");

const oficinaFiltro =
    document.getElementById("oficinaFiltro");

const pesquisaAluno =
    document.getElementById("pesquisaAluno");

const listaAlunosAvaliacao =
    document.getElementById(
        "listaAlunosAvaliacao"
    );


// ==========================================
// CARREGAR GRUPOS
// ==========================================

function carregarGrupos(campo) {

    if (!campo) {
        return;
    }

    const grupos =
        JSON.parse(
            localStorage.getItem("grupos")
        ) || [];

    campo.innerHTML = `
        <option value="">
            Selecione um grupo
        </option>
    `;

    grupos.forEach(grupo => {

        const option =
            document.createElement("option");

        option.value =
            grupo.nome;

        option.textContent =
            grupo.nome;

        campo.appendChild(
            option
        );

    });

}


// ==========================================
// INICIAR GRUPOS
// ==========================================

carregarGrupos(campoGrupo);

carregarGrupos(grupoFiltro);


// ==========================================
// CARREGAR OFICINAS
// ==========================================

function carregarOficinas(
    grupoSelecionado,
    campo
) {

    if (!campo) {
        return;
    }

    const oficinas =
        JSON.parse(
            localStorage.getItem("oficinas")
        ) || [];

    campo.innerHTML = `
        <option value="">
            Selecione uma oficina
        </option>
    `;

    oficinas
        .filter(
            oficina =>
                oficina.grupo ===
                grupoSelecionado
        )
        .sort(
            (a, b) =>
                String(a.nome || "")
                    .localeCompare(
                        String(b.nome || ""),
                        "pt-BR",
                        {
                            sensitivity: "base"
                        }
                    )
        )
        .forEach(oficina => {

            const option =
                document.createElement(
                    "option"
                );

            option.value =
                oficina.nome;

            option.textContent =
                oficina.nome;

            campo.appendChild(
                option
            );

        });

}


// ==========================================
// CARREGAR ALUNOS
// ==========================================

function carregarAlunos(
    grupoSelecionado
) {

    const alunos =
        JSON.parse(
            localStorage.getItem("alunos")
        ) || [];

    return alunos
        .filter(
            aluno =>
                aluno.grupo ===
                grupoSelecionado
        )
        .sort(
            (a, b) =>
                String(a.nome || "")
                    .localeCompare(
                        String(b.nome || ""),
                        "pt-BR",
                        {
                            sensitivity: "base"
                        }
                    )
        );

}


// ==========================================
// GRUPO NA NOVA AVALIAÇÃO
// ==========================================

if (
    campoGrupo &&
    campoOficina
) {

    campoGrupo.addEventListener(
        "change",
        function () {

            carregarOficinas(
                campoGrupo.value,
                campoOficina
            );

            if (campoAluno) {

                campoAluno.innerHTML = `
                    <option value="">
                        Selecione um aluno
                    </option>
                `;

            }

        }
    );

}


// ==========================================
// OFICINA NA NOVA AVALIAÇÃO
// ==========================================

if (
    campoOficina &&
    campoAluno
) {

    campoOficina.addEventListener(
        "change",
        function () {

            const alunos =
                carregarAlunos(
                    campoGrupo.value
                );

            campoAluno.innerHTML = `
                <option value="">
                    Selecione um aluno
                </option>
            `;

            alunos.forEach(aluno => {

                const option =
                    document.createElement(
                        "option"
                    );

                option.value =
                    aluno.nome;

                option.textContent =
                    aluno.nome;

                campoAluno.appendChild(
                    option
                );

            });

        }
    );

}


// ==========================================
// GRUPO NA ÁREA ADMINISTRATIVA
// ==========================================

if (
    grupoFiltro &&
    oficinaFiltro
) {

    grupoFiltro.addEventListener(
        "change",
        function () {

            carregarOficinas(
                grupoFiltro.value,
                oficinaFiltro
            );

            mostrarAlunosAvaliacao();

        }
    );

}


// ==========================================
// OFICINA NA ÁREA ADMINISTRATIVA
// ==========================================

if (oficinaFiltro) {

    oficinaFiltro.addEventListener(
        "change",
        function () {

            mostrarAlunosAvaliacao();

        }
    );

}


// ==========================================
// MOSTRAR ALUNOS
// ==========================================

function mostrarAlunosAvaliacao() {

    if (!listaAlunosAvaliacao) {
        return;
    }

    const grupo =
        grupoFiltro
            ? grupoFiltro.value
            : "";

    const oficina =
        oficinaFiltro
            ? oficinaFiltro.value
            : "";

    const pesquisa =
        pesquisaAluno
            ? pesquisaAluno.value
                .toLowerCase()
                .trim()
            : "";


    if (!grupo || !oficina) {

        listaAlunosAvaliacao.innerHTML = `

            <div class="card">

                <h3>
                    Selecione um grupo e uma oficina
                </h3>

                <p>
                    Os alunos aparecerão aqui.
                </p>

            </div>

        `;

        return;

    }


    let alunos =
        carregarAlunos(grupo);


    // ==========================================
    // PESQUISA
    // ==========================================

    if (pesquisa) {

        alunos =
            alunos.filter(
                aluno =>
                    String(
                        aluno.nome || ""
                    )
                    .toLowerCase()
                    .includes(
                        pesquisa
                    )
            );

    }


    if (alunos.length === 0) {

        listaAlunosAvaliacao.innerHTML = `

            <div class="card">

                <h3>
                    Nenhum aluno encontrado
                </h3>

                <p>
                    Não encontramos alunos
                    neste grupo.
                </p>

            </div>

        `;

        return;

    }


    listaAlunosAvaliacao.innerHTML = "";


    // ==========================================
    // AVALIAÇÕES SALVAS
    // ==========================================

    const avaliacoes =
        JSON.parse(
            localStorage.getItem(
                "avaliacoes"
            )
        ) || [];


    // ==========================================
    // CRIAR CARDS
    // ==========================================

    alunos.forEach(aluno => {

        const card =
            document.createElement(
                "div"
            );

        card.className =
            "card";


        const avaliacoesAluno =
            avaliacoes.filter(
                avaliacao =>
                    avaliacao.aluno ===
                        aluno.nome &&
                    avaliacao.grupo ===
                        grupo &&
                    avaliacao.oficina ===
                        oficina
            );


        // ==========================================
        // PEGAR AVALIAÇÕES
        // ==========================================

        const avaliacao1 =
            avaliacoesAluno.find(
                avaliacao =>
                    Number(
                        avaliacao.momento
                    ) === 1
            );


        const avaliacao2 =
            avaliacoesAluno.find(
                avaliacao =>
                    Number(
                        avaliacao.momento
                    ) === 2
            );


        const avaliacao3 =
            avaliacoesAluno.find(
                avaliacao =>
                    Number(
                        avaliacao.momento
                    ) === 3
            );


        // ==========================================
        // RESULTADOS
        // ==========================================

        const resultados = [];


        if (avaliacao1) {

            resultados.push(
                Number(
                    avaliacao1.resultado
                )
            );

        }


        if (avaliacao2) {

            resultados.push(
                Number(
                    avaliacao2.resultado
                )
            );

        }


        if (avaliacao3) {

            resultados.push(
                Number(
                    avaliacao3.resultado
                )
            );

        }


        let resultadoFinal = "—";


        if (resultados.length > 0) {

            const soma =
                resultados.reduce(
                    (
                        total,
                        valor
                    ) =>
                        total + valor,
                    0
                );


            resultadoFinal =
                (
                    soma /
                    resultados.length
                ).toFixed(1) + "%";

        }


        // ==========================================
        // FUNÇÃO PARA MOSTRAR AVALIAÇÃO
        // ==========================================

        function criarLinhaAvaliacao(
            numero,
            avaliacao,
            bloqueada
        ) {

            let status = "";
            let data = "—";
            let resultado = "—";
            let botao = "";


            if (avaliacao) {

                status =
                    "✅ Realizada";

                data =
                    avaliacao.data ||
                    "—";

                resultado =
                    Number(
                        avaliacao.resultado
                    ) + "%";


                botao = `

                    <button
                        type="button"
                        class="btn-apagar-avaliacao"
                        onclick="apagarAvaliacao(
                            '${aluno.nome.replace(/'/g, "\\'")}',
                            '${grupo.replace(/'/g, "\\'")}',
                            '${oficina.replace(/'/g, "\\'")}',
                            ${numero}
                        )"
                    >
                        🗑️ Apagar
                    </button>

                `;

            }

            else if (bloqueada) {

                status =
                    "🔒 Bloqueada";

            }

            else {

                status =
                    "🟢 Disponível";

            }


            return `

                <div class="linha-avaliacao">

                    <div class="informacoes-avaliacao">

                        <strong>
                            Avaliação ${numero}
                        </strong>

                        <span>
                            ${status}
                        </span>

                    </div>


                    <div class="detalhes-avaliacao">

                        <span>
                            📅 ${data}
                        </span>

                        <span>
                            📊 ${resultado}
                        </span>

                    </div>


                    <div>
                        ${botao}
                    </div>

                </div>

            `;

        }


        // ==========================================
        // CARD
        // ==========================================

        card.innerHTML = `

            <h3>
                👨‍🎓 ${aluno.nome}
            </h3>


            <p>

                <strong>
                    Oficina:
                </strong>

                ${oficina}

            </p>


            <hr>


            <h4>
                📝 Histórico das Avaliações
            </h4>


            ${criarLinhaAvaliacao(
                1,
                avaliacao1,
                false
            )}


            ${criarLinhaAvaliacao(
                2,
                avaliacao2,
                !avaliacao1
            )}


            ${criarLinhaAvaliacao(
                3,
                avaliacao3,
                !avaliacao2
            )}


            <hr>


            <div class="resultado-final">

                <strong>
                    📊 Resultado Final:
                </strong>

                <span>
                    ${resultadoFinal}
                </span>

            </div>

        `;


        listaAlunosAvaliacao.appendChild(
            card
        );

    });

}


// ==========================================
// APAGAR AVALIAÇÃO
// ==========================================

function apagarAvaliacao(
    aluno,
    grupo,
    oficina,
    momento
) {


    const confirmar =
        confirm(

            "⚠️ ATENÇÃO!\n\n" +

            "Você está prestes a apagar:\n\n" +

            "Aluno: " +
            aluno +
            "\n" +

            "Avaliação: " +
            momento +
            "\n" +

            "Oficina: " +
            oficina +
            "\n\n" +

            "Essa ação não poderá ser desfeita.\n\n" +

            "Deseja realmente apagar?"

        );


    if (!confirmar) {

        return;

    }


    let avaliacoes =
        JSON.parse(
            localStorage.getItem(
                "avaliacoes"
            )
        ) || [];


    const quantidadeAntes =
        avaliacoes.length;


    avaliacoes =
        avaliacoes.filter(
            avaliacao =>
                !(
                    avaliacao.aluno ===
                        aluno &&
                    avaliacao.grupo ===
                        grupo &&
                    avaliacao.oficina ===
                        oficina &&
                    Number(
                        avaliacao.momento
                    ) === Number(momento)
                )
        );


    if (
        avaliacoes.length ===
        quantidadeAntes
    ) {

        alert(
            "⚠️ A avaliação não foi encontrada."
        );

        return;

    }


    localStorage.setItem(
        "avaliacoes",
        JSON.stringify(
            avaliacoes
        )
    );


    alert(
        "✅ Avaliação " +
        momento +
        " apagada com sucesso."
    );


    mostrarAlunosAvaliacao();

}


// ==========================================
// PESQUISA
// ==========================================

if (pesquisaAluno) {

    pesquisaAluno.addEventListener(
        "input",
        function () {

            mostrarAlunosAvaliacao();

        }
    );

}


// ==========================================
// CRIAR INDICADORES
// ==========================================

if (areaIndicadores) {

    indicadores.forEach(
        indicador => {

            const bloco =
                document.createElement(
                    "div"
                );

            bloco.className =
                "card";


            let opcoes = "";


            // ==================================
            // FREQUÊNCIA
            // ==================================

            if (
                indicador ===
                "Frequência"
            ) {

                opcoes = `

                    <option value="">
                        Selecione
                    </option>

                    <option value="10">
                        Frequente
                    </option>

                    <option value="7">
                        Às vezes
                    </option>

                    <option value="4">
                        Quase nunca
                    </option>

                    <option value="1">
                        Nunca
                    </option>

                `;

            }


            // ==================================
            // OUTROS INDICADORES
            // ==================================

            else {

                opcoes = `

                    <option value="">
                        Selecione
                    </option>

                    <option value="10">
                        Conquistei
                    </option>

                    <option value="8">
                        Em construção do meu caminho
                    </option>

                    <option value="6">
                        Aberto para o novo
                    </option>

                    <option value="4">
                        Ainda sem direção
                    </option>

                    <option value="2">
                        Resistente à mudança
                    </option>

                `;

            }


            bloco.innerHTML = `

                <label>
                    ${indicador}
                </label>

                <select
                    name="${indicador}"
                    required
                >

                    ${opcoes}

                </select>

            `;


            areaIndicadores.appendChild(
                bloco
            );

        }
    );

}


// ==========================================
// SALVAR AVALIAÇÃO
// ==========================================

if (formulario) {

    formulario.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            // ==================================
            // PEGAR DADOS
            // ==================================

            const grupo =
                document
                    .getElementById("grupo")
                    .value;


            const oficina =
                document
                    .getElementById("oficina")
                    .value;


            const aluno =
                document
                    .getElementById("aluno")
                    .value;


            const momento =
                numeroAvaliacao
                    ? Number(
                        numeroAvaliacao.value
                    )
                    : 0;


            // ==================================
            // VALIDAR
            // ==================================

            if (
                !grupo ||
                !oficina ||
                !aluno
            ) {

                alert(
                    "Preencha Grupo, Oficina e Aluno."
                );

                return;

            }


            if (
                !momento ||
                momento < 1 ||
                momento > 3
            ) {

                alert(
                    "Selecione Avaliação 1, Avaliação 2 ou Avaliação 3."
                );

                return;

            }


            // ==================================
            // PEGAR AVALIAÇÕES EXISTENTES
            // ==================================

            let avaliacoes =
                JSON.parse(
                    localStorage.getItem(
                        "avaliacoes"
                    )
                ) || [];


            // ==================================
            // VERIFICAR DUPLICIDADE
            // ==================================

            const jaExiste =
                avaliacoes.some(
                    avaliacao =>
                        avaliacao.grupo ===
                            grupo &&
                        avaliacao.oficina ===
                            oficina &&
                        avaliacao.aluno ===
                            aluno &&
                        Number(
                            avaliacao.momento
                        ) === momento
                );


            if (jaExiste) {

                alert(
                    "⚠️ Este aluno já possui a Avaliação " +
                    momento +
                    " realizada."
                );

                return;

            }


            // ==================================
            // PEGAR INDICADORES
            // ==================================

            const selects =
                document.querySelectorAll(
                    "#indicadores select"
                );


            let soma = 0;

            let notas = {};


            selects.forEach(
                select => {

                    const valor =
                        Number(
                            select.value
                        );

                    soma += valor;

                    notas[
                        select.name
                    ] = valor;

                }
            );


            // ==================================
            // CALCULAR
            // ==================================

            const media =
                soma /
                selects.length;


            const resultadoFinal =
                media * 10;


            // ==================================
            // CRIAR AVALIAÇÃO
            // ==================================

            const avaliacao = {

                grupo:
                    grupo,

                oficina:
                    oficina,

                aluno:
                    aluno,

                momento:
                    momento,

                status:
                    "Realizado",

                data:
                    new Date()
                        .toLocaleDateString(
                            "pt-BR"
                        ),

                notas:
                    notas,

                media:
                    Number(
                        media.toFixed(1)
                    ),

                resultado:
                    Number(
                        resultadoFinal.toFixed(0)
                    )

            };


            // ==================================
            // SALVAR
            // ==================================

            avaliacoes.push(
                avaliacao
            );


            localStorage.setItem(
                "avaliacoes",
                JSON.stringify(
                    avaliacoes
                )
            );


            // ==================================
            // MENSAGEM
            // ==================================

            alert(

                "✅ Avaliação " +
                momento +
                " realizada com sucesso!\n\n" +

                "Aluno: " +
                aluno +
                "\n" +

                "Média: " +
                media.toFixed(1) +
                "\n" +

                "Resultado: " +
                resultadoFinal.toFixed(0) +
                "%"

            );


            // ==================================
            // LIMPAR FORMULÁRIO
            // ==================================

            formulario.reset();


            if (campoOficina) {

                campoOficina.innerHTML = `
                    <option value="">
                        Selecione uma oficina
                    </option>
                `;

            }


            if (campoAluno) {

                campoAluno.innerHTML = `
                    <option value="">
                        Selecione um aluno
                    </option>
                `;

            }


            // ==================================
            // ESCONDER INDICADORES
            // ==================================

            const area =
                document.getElementById(
                    "areaIndicadores"
                );


            if (area) {

                area.style.display =
                    "none";

            }


            // ==================================
            // LIMPAR AVALIAÇÃO
            // ==================================

            if (numeroAvaliacao) {

                numeroAvaliacao.value =
                    "";

            }


            document
                .querySelectorAll(
                    ".btn-avaliacao"
                )
                .forEach(
                    botao =>
                        botao.classList.remove(
                            "selecionada"
                        )
                );


            const mensagem =
                document.getElementById(
                    "mensagemAvaliacao"
                );


            if (mensagem) {

                mensagem.style.display =
                    "none";

            }

        }
    );

}


// ==========================================
// INICIAR
// ==========================================

mostrarAlunosAvaliacao();