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
// ELEMENTOS - NOVA AVALIAÇÃO
// ==========================================

const campoGrupo =
    document.getElementById("grupo");

const campoOficina =
    document.getElementById("oficina");

const campoAluno =
    document.getElementById("aluno");

const areaIndicadores =
    document.getElementById("indicadores");

const areaIndicadoresContainer =
    document.getElementById("areaIndicadores");

const formulario =
    document.getElementById("formAvaliacao");

const numeroAvaliacao =
    document.getElementById("numeroAvaliacao");


// ==========================================
// ELEMENTOS - PÁGINA DE AVALIAÇÕES
// ==========================================

const grupoFiltro =
    document.getElementById("grupoFiltro");

const oficinaFiltro =
    document.getElementById("oficinaFiltro");

const pesquisaAluno =
    document.getElementById("pesquisaAluno");

const listaAlunosAvaliacao =
    document.getElementById("listaAlunosAvaliacao");


// ==========================================
// CRIAR INDICADORES
// ==========================================

function criarIndicadores() {

    if (!areaIndicadores) {

        console.error(
            "ERRO: #indicadores não encontrado."
        );

        return;

    }


    areaIndicadores.innerHTML = "";


    indicadores.forEach(function(indicador) {

        const bloco =
            document.createElement("div");

        bloco.className =
            "card indicador-card";


        let opcoes = "";


        // ==================================
        // FREQUÊNCIA
        // ==================================

        if (indicador === "Frequência") {

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


        areaIndicadores.appendChild(bloco);

    });


    console.log(
        "Indicadores criados:",
        indicadores.length
    );

}


// ==========================================
// CARREGAR GRUPOS
// ==========================================

function carregarGrupos(campo) {

    if (!campo) return;


    const grupos =
        JSON.parse(
            localStorage.getItem("grupos")
        ) || [];


    campo.innerHTML = `

        <option value="">
            Selecione um grupo
        </option>

    `;


    grupos.forEach(function(grupo) {

        const option =
            document.createElement("option");


        option.value =
            grupo.nome;


        option.textContent =
            grupo.nome;


        campo.appendChild(option);

    });

}


// ==========================================
// CARREGAR OFICINAS
// ==========================================

function carregarOficinas(
    grupoSelecionado,
    campo
) {

    if (!campo) return;


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
        .filter(function(oficina) {

            return oficina.grupo ===
                grupoSelecionado;

        })
        .sort(function(a, b) {

            return String(a.nome || "")
                .localeCompare(
                    String(b.nome || ""),
                    "pt-BR",
                    {
                        sensitivity: "base"
                    }
                );

        })
        .forEach(function(oficina) {

            const option =
                document.createElement("option");


            option.value =
                oficina.nome;


            option.textContent =
                oficina.nome;


            campo.appendChild(option);

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
        .filter(function(aluno) {

            return aluno.grupo ===
                grupoSelecionado;

        })
        .sort(function(a, b) {

            return String(a.nome || "")
                .localeCompare(
                    String(b.nome || ""),
                    "pt-BR",
                    {
                        sensitivity: "base"
                    }
                );

        });

}


// ==========================================
// PERÍODOS
// ==========================================

function obterPeriodosAvaliacoes() {

    return JSON.parse(
        localStorage.getItem(
            "periodosAvaliacoes"
        )
    ) || {};

}


// ==========================================
// VERIFICAR SE A AVALIAÇÃO ESTÁ ABERTA
// ==========================================

function avaliacaoEstaAberta(numero) {

    const periodos =
        obterPeriodosAvaliacoes();


    const periodo =
        periodos[
            "avaliacao" + numero
        ];


    if (
        !periodo ||
        !periodo.inicio ||
        !periodo.fim
    ) {

        return false;

    }


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


    return (
        hoje >= inicio &&
        hoje <= fim
    );

}


// ==========================================
// FORMATAR DATA
// ==========================================

function formatarData(data) {

    if (!data) {

        return "Data não configurada";

    }


    const partes =
        data.split("-");


    if (
        partes.length !== 3
    ) {

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
// ATUALIZAR VISUAL DAS AVALIAÇÕES
// ==========================================

function atualizarVisualAvaliacoes() {

    for (
        let numero = 1;
        numero <= 3;
        numero++
    ) {

        const botao =
            document.getElementById(
                "btnAvaliacao" + numero
            );


        const titulo =
            document.getElementById(
                "tituloAvaliacao" + numero
            );


        const dataElemento =
            document.getElementById(
                "dataAvaliacao" + numero
            );


        const statusElemento =
            document.getElementById(
                "statusAvaliacao" + numero
            );


        if (
            !botao ||
            !titulo ||
            !dataElemento ||
            !statusElemento
        ) {

            continue;

        }


        const periodos =
            obterPeriodosAvaliacoes();


        const periodo =
            periodos[
                "avaliacao" + numero
            ];


        // ==================================
        // SEM DATA
        // ==================================

        if (
            !periodo ||
            !periodo.inicio ||
            !periodo.fim
        ) {

            botao.disabled = true;


            titulo.innerHTML =
                "🔒 Avaliação " + numero;


            dataElemento.innerHTML =
                "⚠️ Data não configurada";


            statusElemento.innerHTML =
                "🔒 Bloqueada";


            continue;

        }


        // ==================================
        // MOSTRAR DATA
        // ==================================

        dataElemento.innerHTML =
            "📅 " +
            formatarData(periodo.inicio) +
            " até " +
            formatarData(periodo.fim);


        // ==================================
        // ABERTA
        // ==================================

        if (
            avaliacaoEstaAberta(numero)
        ) {

            botao.disabled = false;


            titulo.innerHTML =
                "🟢 Avaliação " + numero;


            statusElemento.innerHTML =
                "🟢 Disponível";

        }


        // ==================================
        // FECHADA
        // ==================================

        else {

            botao.disabled = true;


            titulo.innerHTML =
                "🔒 Avaliação " + numero;


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


            if (
                hoje < inicio
            ) {

                statusElemento.innerHTML =
                    "🔒 Liberada em " +
                    formatarData(
                        periodo.inicio
                    );

            }


            else {

                statusElemento.innerHTML =
                    "🔴 Período encerrado";

            }

        }

    }

}


// ==========================================
// AVALIAÇÕES JÁ REALIZADAS
// ==========================================

function obterAvaliacoesAluno() {

    if (
        !campoGrupo ||
        !campoOficina ||
        !campoAluno
    ) {

        return [];

    }


    if (
        !campoGrupo.value ||
        !campoOficina.value ||
        !campoAluno.value
    ) {

        return [];

    }


    const avaliacoes =
        JSON.parse(
            localStorage.getItem(
                "avaliacoes"
            )
        ) || [];


    return avaliacoes.filter(
        function(avaliacao) {

            return (

                avaliacao.grupo ===
                    campoGrupo.value &&

                avaliacao.oficina ===
                    campoOficina.value &&

                avaliacao.aluno ===
                    campoAluno.value

            );

        }
    );

}


// ==========================================
// ATUALIZAR BOTÕES
// ==========================================

function atualizarBotoesAvaliacoes() {

    atualizarVisualAvaliacoes();


    const avaliacoes =
        obterAvaliacoesAluno();


    for (
        let numero = 1;
        numero <= 3;
        numero++
    ) {

        const botao =
            document.getElementById(
                "btnAvaliacao" + numero
            );


        const titulo =
            document.getElementById(
                "tituloAvaliacao" + numero
            );


        const status =
            document.getElementById(
                "statusAvaliacao" + numero
            );


        if (
            !botao ||
            !titulo ||
            !status
        ) {

            continue;

        }


        const jaFoiRealizada =
            avaliacoes.some(
                function(avaliacao) {

                    return Number(
                        avaliacao.momento
                    ) === numero;

                }
            );


        if (jaFoiRealizada) {

            botao.disabled = true;


            titulo.innerHTML =
                "✅ Avaliação " + numero;


            status.innerHTML =
                "✅ Já realizada";


            continue;

        }


        if (
            avaliacaoEstaAberta(numero)
        ) {

            botao.disabled = false;


            titulo.innerHTML =
                "🟢 Avaliação " + numero;


            status.innerHTML =
                "🟢 Disponível";

        }

    }

}


// ==========================================
// SELECIONAR AVALIAÇÃO
// ==========================================

function selecionarAvaliacao(numero) {

    const botao =
        document.getElementById(
            "btnAvaliacao" + numero
        );


    if (
        !botao ||
        botao.disabled
    ) {

        return;

    }


    if (numeroAvaliacao) {

        numeroAvaliacao.value =
            numero;

    }


    document
        .querySelectorAll(
            ".btn-avaliacao"
        )
        .forEach(function(botaoAtual) {

            botaoAtual.classList.remove(
                "selecionada"
            );

        });


    botao.classList.add(
        "selecionada"
    );


    const mensagem =
        document.getElementById(
            "mensagemAvaliacao"
        );


    if (mensagem) {

        mensagem.style.display =
            "block";


        mensagem.innerHTML =
            "✅ Avaliação " +
            numero +
            " selecionada.";

    }


    if (areaIndicadoresContainer) {

        areaIndicadoresContainer.style.display =
            "block";

    }


    if (areaIndicadores) {

        areaIndicadores.style.display =
            "block";

    }


    if (
        areaIndicadores &&
        areaIndicadores.children.length === 0
    ) {

        criarIndicadores();

    }


    if (areaIndicadores) {

        areaIndicadores.style.visibility =
            "visible";


        areaIndicadores.style.opacity =
            "1";

    }


    setTimeout(function() {

        if (areaIndicadoresContainer) {

            areaIndicadoresContainer.scrollIntoView({

                behavior: "smooth",

                block: "start"

            });

        }

    }, 100);

}


// ==========================================
// GRUPO - NOVA AVALIAÇÃO
// ==========================================

if (campoGrupo) {

    campoGrupo.addEventListener(
        "change",
        function() {

            if (campoOficina) {

                carregarOficinas(
                    campoGrupo.value,
                    campoOficina
                );

            }


            if (campoAluno) {

                campoAluno.innerHTML = `

                    <option value="">
                        Selecione um aluno
                    </option>

                `;

            }


            resetarSelecao();

            atualizarBotoesAvaliacoes();

        }
    );

}


// ==========================================
// OFICINA - NOVA AVALIAÇÃO
// ==========================================

if (campoOficina) {

    campoOficina.addEventListener(
        "change",
        function() {

            if (!campoAluno) return;


            const alunos =
                carregarAlunos(
                    campoGrupo.value
                );


            campoAluno.innerHTML = `

                <option value="">
                    Selecione um aluno
                </option>

            `;


            alunos.forEach(function(aluno) {

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


            resetarSelecao();

            atualizarBotoesAvaliacoes();

        }
    );

}


// ==========================================
// ALUNO - NOVA AVALIAÇÃO
// ==========================================

if (campoAluno) {

    campoAluno.addEventListener(
        "change",
        function() {

            resetarSelecao();

            atualizarBotoesAvaliacoes();

        }
    );

}


// ==========================================
// RESETAR SELEÇÃO
// ==========================================

function resetarSelecao() {

    if (numeroAvaliacao) {

        numeroAvaliacao.value =
            "";

    }


    document
        .querySelectorAll(
            ".btn-avaliacao"
        )
        .forEach(function(botao) {

            botao.classList.remove(
                "selecionada"
            );

        });


    if (areaIndicadoresContainer) {

        areaIndicadoresContainer.style.display =
            "none";

    }


    const mensagem =
        document.getElementById(
            "mensagemAvaliacao"
        );


    if (mensagem) {

        mensagem.style.display =
            "none";

    }

}


// ==========================================
// REVISAR AVALIAÇÃO
// ==========================================

function abrirRevisao() {

    const grupo =
        campoGrupo.value;


    const oficina =
        campoOficina.value;


    const aluno =
        campoAluno.value;


    const momento =
        numeroAvaliacao.value;


    if (
        !grupo ||
        !oficina ||
        !aluno ||
        !momento
    ) {

        alert(
            "⚠️ Preencha Grupo, Oficina, Aluno e escolha a avaliação."
        );

        return;

    }


    const selects =
        document.querySelectorAll(
            "#indicadores select"
        );


    let todosPreenchidos =
        true;


    selects.forEach(function(select) {

        if (!select.value) {

            todosPreenchidos =
                false;


            select.style.border =
                "2px solid #c62828";

        }
        else {

            select.style.border =
                "";

        }

    });


    if (!todosPreenchidos) {

        alert(
            "⚠️ Responda todos os indicadores antes de revisar."
        );

        return;

    }


    let soma = 0;


    selects.forEach(function(select) {

        soma += Number(
            select.value
        );

    });


    const media =
        soma /
        selects.length;


    const resultado =
        media * 10;


    let html = `

        <div class="item-revisao">

            <strong>
                👥 Grupo:
            </strong>

            ${grupo}

        </div>


        <div class="item-revisao">

            <strong>
                🏫 Oficina:
            </strong>

            ${oficina}

        </div>


        <div class="item-revisao">

            <strong>
                👨‍🎓 Aluno:
            </strong>

            ${aluno}

        </div>


        <div class="item-revisao">

            <strong>
                📝 Avaliação:
            </strong>

            Avaliação ${momento}

        </div>


        <hr>


        <h3>
            Indicadores
        </h3>

    `;


    selects.forEach(function(select) {

        html += `

            <div class="item-revisao">

                <strong>
                    ${select.name}:
                </strong>

                ${
                    select.options[
                        select.selectedIndex
                    ].text
                }

            </div>

        `;

    });


    html += `

        <hr>


        <div class="item-revisao">

            <strong>
                📊 Média:
            </strong>

            ${media.toFixed(1)}

        </div>


        <div class="item-revisao">

            <strong>
                🎯 Resultado:
            </strong>

            ${resultado.toFixed(0)}%

        </div>

    `;


    const dados =
        document.getElementById(
            "dadosRevisao"
        );


    const modal =
        document.getElementById(
            "modalRevisao"
        );


    if (dados) {

        dados.innerHTML =
            html;

    }


    if (modal) {

        modal.style.display =
            "block";

    }

}


// ==========================================
// FECHAR REVISÃO
// ==========================================

function fecharRevisao() {

    const modal =
        document.getElementById(
            "modalRevisao"
        );


    if (modal) {

        modal.style.display =
            "none";

    }

}


// ==========================================
// CONFIRMAR REVISÃO
// ==========================================

function confirmarRevisao() {

    fecharRevisao();


    if (formulario) {

        formulario.requestSubmit();

    }

}


// ==========================================
// SALVAR AVALIAÇÃO
// ==========================================

if (formulario) {

    formulario.addEventListener(
        "submit",
        function(event) {

            event.preventDefault();


            const grupo =
                campoGrupo.value;


            const oficina =
                campoOficina.value;


            const aluno =
                campoAluno.value;


            const momento =
                Number(
                    numeroAvaliacao.value
                );


            if (
                !grupo ||
                !oficina ||
                !aluno ||
                !momento
            ) {

                alert(
                    "⚠️ Preencha todos os campos e escolha a avaliação."
                );

                return;

            }


            if (
                !avaliacaoEstaAberta(momento)
            ) {

                alert(
                    "⚠️ Esta avaliação não está disponível neste momento."
                );

                atualizarBotoesAvaliacoes();

                return;

            }


            const selects =
                document.querySelectorAll(
                    "#indicadores select"
                );


            let todosPreenchidos =
                true;


            selects.forEach(function(select) {

                if (!select.value) {

                    todosPreenchidos =
                        false;


                    select.style.border =
                        "2px solid #c62828";

                }
                else {

                    select.style.border =
                        "";

                }

            });


            if (!todosPreenchidos) {

                alert(
                    "⚠️ Responda TODOS os indicadores."
                );

                return;

            }


            let avaliacoes =
                JSON.parse(
                    localStorage.getItem(
                        "avaliacoes"
                    )
                ) || [];


            const jaExiste =
                avaliacoes.some(
                    function(avaliacao) {

                        return (

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

                    }
                );


            if (jaExiste) {

                alert(
                    "⚠️ Este aluno já possui esta avaliação."
                );

                return;

            }


            let soma = 0;


            const notas = {};


            selects.forEach(function(select) {

                const valor =
                    Number(
                        select.value
                    );


                soma += valor;


                notas[
                    select.name
                ] = valor;

            });


            const media =
                soma /
                selects.length;


            const resultado =
                media * 10;


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
                        resultado.toFixed(0)
                    )

            };


            avaliacoes.push(
                avaliacao
            );


            localStorage.setItem(
                "avaliacoes",
                JSON.stringify(
                    avaliacoes
                )
            );


            alert(

                "✅ Avaliação " +
                momento +
                " realizada com sucesso!\n\n" +

                "Aluno: " +
                aluno +
                "\n\n" +

                "Resultado: " +
                resultado.toFixed(0) +
                "%"

            );


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


            resetarSelecao();

            atualizarBotoesAvaliacoes();

        }
    );

}


// ==========================================
// FILTRO - GRUPO
// ==========================================

if (grupoFiltro) {

    grupoFiltro.addEventListener(
        "change",
        function() {

            carregarOficinas(
                grupoFiltro.value,
                oficinaFiltro
            );


            if (pesquisaAluno) {

                pesquisaAluno.value = "";

            }


            mostrarAlunosAvaliacao();

        }
    );

}


// ==========================================
// FILTRO - OFICINA
// ==========================================

if (oficinaFiltro) {

    oficinaFiltro.addEventListener(
        "change",
        function() {

            mostrarAlunosAvaliacao();

        }
    );

}


// ==========================================
// PESQUISA - ALUNO
// ==========================================

if (pesquisaAluno) {

    pesquisaAluno.addEventListener(
        "input",
        function() {

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


    // ==================================
    // PRECISA ESCOLHER GRUPO
    // ==================================

    if (!grupo) {

        listaAlunosAvaliacao.innerHTML = `

            <div
                class="card"
                style="
                    background:#151b18;
                    color:#f1f5f2;
                "
            >

                <h3
                    style="
                        color:#f1f5f2;
                        margin-bottom:8px;
                    "
                >
                    👥 Selecione um grupo
                </h3>

                <p
                    style="
                        color:#aab5af;
                    "
                >
                    Escolha um grupo acima para visualizar os alunos.
                </p>

            </div>

        `;

        return;

    }


    // ==================================
    // ALUNOS
    // ==================================

    let alunos =
        carregarAlunos(grupo);


    // ==================================
    // PESQUISA
    // ==================================

    if (pesquisa) {

        alunos =
            alunos.filter(
                function(aluno) {

                    return String(
                        aluno.nome || ""
                    )
                    .toLowerCase()
                    .includes(pesquisa);

                }
            );

    }


    // ==================================
    // NENHUM ALUNO
    // ==================================

    if (alunos.length === 0) {

        listaAlunosAvaliacao.innerHTML = `

            <div
                class="card"
                style="
                    background:#151b18;
                    color:#f1f5f2;
                "
            >

                <h3
                    style="
                        color:#f1f5f2;
                        margin-bottom:8px;
                    "
                >
                    👨‍🎓 Nenhum aluno encontrado
                </h3>

                <p
                    style="
                        color:#aab5af;
                    "
                >
                    Não existem alunos cadastrados neste grupo.
                </p>

            </div>

        `;

        return;

    }


    // ==================================
    // AVALIAÇÕES
    // ==================================

    const avaliacoes =
        JSON.parse(
            localStorage.getItem(
                "avaliacoes"
            )
        ) || [];


    listaAlunosAvaliacao.innerHTML = "";


    // ==================================
    // CRIAR CARDS
    // ==================================

    alunos.forEach(
        function(aluno) {

            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "card";


            // ==================================
            // AVALIAÇÕES DO ALUNO
            // ==================================

            const avaliacoesAluno =
                avaliacoes.filter(
                    function(avaliacao) {

                        return (

                            avaliacao.aluno ===
                                aluno.nome &&

                            avaliacao.grupo ===
                                grupo &&

                            (
                                !oficina ||
                                avaliacao.oficina ===
                                    oficina
                            )

                        );

                    }
                );


            const avaliacao1 =
                avaliacoesAluno.find(
                    function(avaliacao) {

                        return Number(
                            avaliacao.momento
                        ) === 1;

                    }
                );


            const avaliacao2 =
                avaliacoesAluno.find(
                    function(avaliacao) {

                        return Number(
                            avaliacao.momento
                        ) === 2;

                    }
                );


            const avaliacao3 =
                avaliacoesAluno.find(
                    function(avaliacao) {

                        return Number(
                            avaliacao.momento
                        ) === 3;

                    }
                );


            // ==================================
            // RESULTADO FINAL
            // ==================================

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


            let resultadoFinal =
                "—";


            if (resultados.length > 0) {

                const soma =
                    resultados.reduce(
                        function(total, valor) {

                            return total + valor;

                        },
                        0
                    );


                resultadoFinal =
                    (
                        soma /
                        resultados.length
                    ).toFixed(1) +
                    "%";

            }


            // ==========================================
            // CRIAR LINHA DO HISTÓRICO
            // ==========================================

            function criarLinha(
                numero,
                avaliacao
            ) {

                // ==================================
                // NÃO REALIZADA
                // ==================================

                if (!avaliacao) {

                    return `

                        <div
                            class="linha-avaliacao"
                            style="
                                width:100%;
                                display:flex;
                                align-items:center;
                                justify-content:space-between;
                                gap:20px;
                                padding:18px 20px;
                                margin:10px 0;
                                background:#111714;
                                border:1px solid #2b3630;
                                border-radius:14px;
                                color:#dce5df;
                            "
                        >

                            <div
                                class="informacoes-avaliacao"
                                style="
                                    display:flex;
                                    flex-direction:column;
                                    gap:6px;
                                "
                            >

                                <strong
                                    style="
                                        color:#f4f7f5;
                                        font-size:16px;
                                        font-weight:700;
                                    "
                                >
                                    Avaliação ${numero}
                                </strong>

                                <span
                                    style="
                                        color:#ffb74d;
                                        font-size:14px;
                                        font-weight:600;
                                    "
                                >
                                    ⏳ Não realizada
                                </span>

                            </div>


                            <div
                                class="detalhes-avaliacao"
                                style="
                                    display:flex;
                                    align-items:center;
                                    gap:25px;
                                    flex-wrap:wrap;
                                "
                            >

                                <span
                                    style="
                                        color:#aab5af;
                                        font-size:14px;
                                        font-weight:500;
                                    "
                                >
                                    📅 —
                                </span>

                                <span
                                    style="
                                        color:#aab5af;
                                        font-size:14px;
                                        font-weight:600;
                                    "
                                >
                                    📊 —
                                </span>

                            </div>

                        </div>

                    `;

                }


                // ==================================
                // REALIZADA
                // ==================================

                return `

                    <div
                        class="linha-avaliacao"
                        style="
                            width:100%;
                            display:flex;
                            align-items:center;
                            justify-content:space-between;
                            gap:20px;
                            padding:18px 20px;
                            margin:10px 0;
                            background:linear-gradient(
                                135deg,
                                #151e19,
                                #111714
                            );
                            border:1px solid #304038;
                            border-left:4px solid #43a047;
                            border-radius:14px;
                            color:#f4f7f5;
                            box-shadow:0 6px 18px rgba(0,0,0,.20);
                        "
                    >

                        <div
                            class="informacoes-avaliacao"
                            style="
                                display:flex;
                                flex-direction:column;
                                gap:6px;
                                min-width:150px;
                            "
                        >

                            <strong
                                style="
                                    color:#ffffff;
                                    font-size:16px;
                                    font-weight:700;
                                "
                            >
                                Avaliação ${numero}
                            </strong>

                            <span
                                style="
                                    display:inline-flex;
                                    align-items:center;
                                    width:max-content;
                                    color:#81c784;
                                    background:rgba(67,160,71,.13);
                                    border:1px solid rgba(67,160,71,.30);
                                    padding:5px 10px;
                                    border-radius:20px;
                                    font-size:13px;
                                    font-weight:700;
                                "
                            >
                                ✅ Realizada
                            </span>

                        </div>


                        <div
                            class="detalhes-avaliacao"
                            style="
                                display:flex;
                                align-items:center;
                                justify-content:center;
                                gap:25px;
                                flex:1;
                                flex-wrap:wrap;
                            "
                        >

                            <span
                                style="
                                    color:#64b5f6;
                                    font-size:14px;
                                    font-weight:600;
                                    white-space:nowrap;
                                "
                            >
                                📅 ${avaliacao.data || "—"}
                            </span>

                            <span
                                style="
                                    color:#f06292;
                                    font-size:15px;
                                    font-weight:800;
                                    white-space:nowrap;
                                "
                            >
                                📊 ${avaliacao.resultado || 0}%
                            </span>

                        </div>


                        <div>

                            <button
                                type="button"
                                class="btn-apagar-avaliacao"
                                style="
                                    background:#35151d;
                                    color:#ff6f91;
                                    border:1px solid #6a2638;
                                    border-radius:9px;
                                    padding:9px 13px;
                                    cursor:pointer;
                                    font-size:13px;
                                    font-weight:700;
                                "
                                onclick="apagarAvaliacao(
                                    '${String(aluno.nome).replace(/'/g, "\\'")}',
                                    '${String(grupo).replace(/'/g, "\\'")}',
                                    '${String(avaliacao.oficina || oficina).replace(/'/g, "\\'")}',
                                    ${numero}
                                )"
                            >

                                🗑️ Apagar

                            </button>

                        </div>

                    </div>

                `;

            }


            // ==========================================
            // CARD DO ALUNO
            // ==========================================

            card.innerHTML = `

                <div
                    style="
                        color:#ffffff;
                        margin-bottom:8px;
                    "
                >

                    <h3
                        style="
                            color:#ffffff;
                            font-size:22px;
                            font-weight:800;
                            margin-bottom:12px;
                        "
                    >
                        👨‍🎓 ${aluno.nome}
                    </h3>

                </div>


                <p
                    style="
                        color:#aab5af;
                        font-size:14px;
                        margin:7px 0;
                    "
                >

                    <strong
                        style="
                            color:#64b5f6;
                        "
                    >
                        Grupo:
                    </strong>

                    <span
                        style="
                            color:#f1f5f2;
                        "
                    >
                        ${grupo}
                    </span>

                </p>


                ${
                    oficina
                    ? `

                        <p
                            style="
                                color:#aab5af;
                                font-size:14px;
                                margin:7px 0;
                            "
                        >

                            <strong
                                style="
                                    color:#ec407a;
                                "
                            >
                                Oficina:
                            </strong>

                            <span
                                style="
                                    color:#f1f5f2;
                                "
                            >
                                ${oficina}
                            </span>

                        </p>

                    `
                    : ""
                }


                <hr
                    style="
                        border:0;
                        border-top:1px solid #2b3630;
                        margin:18px 0;
                    "
                >


                <h4
                    style="
                        color:#ffffff;
                        font-size:18px;
                        font-weight:800;
                        margin-bottom:14px;
                    "
                >
                    📝 Histórico das Avaliações
                </h4>


                ${criarLinha(
                    1,
                    avaliacao1
                )}


                ${criarLinha(
                    2,
                    avaliacao2
                )}


                ${criarLinha(
                    3,
                    avaliacao3
                )}


                <hr
                    style="
                        border:0;
                        border-top:1px solid #2b3630;
                        margin:20px 0;
                    "
                >


                <div
                    class="resultado-final"
                    style="
                        display:flex;
                        align-items:center;
                        justify-content:space-between;
                        gap:15px;
                        padding:18px 20px;
                        border-radius:14px;
                        background:linear-gradient(
                            135deg,
                            #21151b,
                            #17151a
                        );
                        border:1px solid rgba(236,64,122,.30);
                    "
                >

                    <strong
                        style="
                            color:#f4f7f5;
                            font-size:16px;
                            font-weight:700;
                        "
                    >
                        📊 Resultado Final:
                    </strong>

                    <span
                        style="
                            color:#f06292;
                            font-size:25px;
                            font-weight:900;
                        "
                    >
                        ${resultadoFinal}
                    </span>

                </div>

            `;


            listaAlunosAvaliacao
                .appendChild(card);

        }
    );

}


// ==========================================
// APAGAR AVALIAÇÃO
// ==========================================

function apagarAvaliacao(
    alunoNome,
    grupoNome,
    oficinaNome,
    numero
) {

    const confirmar =
        confirm(

            "⚠️ Tem certeza que deseja apagar a Avaliação " +
            numero +
            " de " +
            alunoNome +
            "?"

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
            function(avaliacao) {

                return !(
                    String(avaliacao.aluno) ===
                        String(alunoNome) &&

                    String(avaliacao.grupo) ===
                        String(grupoNome) &&

                    String(avaliacao.oficina) ===
                        String(oficinaNome) &&

                    Number(avaliacao.momento) ===
                        Number(numero)
                );

            }
        );


    if (
        avaliacoes.length ===
        quantidadeAntes
    ) {

        alert(
            "⚠️ Avaliação não encontrada."
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
        numero +
        " excluída com sucesso!"
    );


    mostrarAlunosAvaliacao();

}


// ==========================================
// INICIAR SISTEMA
// ==========================================

criarIndicadores();


// ==========================================
// NOVA AVALIAÇÃO
// ==========================================

carregarGrupos(
    campoGrupo
);


// ==========================================
// PÁGINA DE AVALIAÇÕES
// ==========================================

carregarGrupos(
    grupoFiltro
);


// ==========================================
// ATUALIZAR
// ==========================================

atualizarVisualAvaliacoes();

atualizarBotoesAvaliacoes();

mostrarAlunosAvaliacao();


// ==========================================
// ATUALIZAÇÃO AUTOMÁTICA
// ==========================================

setInterval(
    function() {

        atualizarBotoesAvaliacoes();

    },
    30000
);