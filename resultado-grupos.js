// ==========================================
// RESULTADO DAS AVALIAÇÕES - GRUPOS
// SISTEMA ALDEIA
// ==========================================


// ==========================================
// ELEMENTOS
// ==========================================

const grupoResultado =
    document.getElementById("grupoResultado");

const btnGerarResultado =
    document.getElementById("btnGerarResultado");

const btnExportarExcel =
    document.getElementById("btnExportarExcel");

const areaResultado =
    document.getElementById("areaResultado");

const resumoResultado =
    document.getElementById("resumoResultado");

const totalAlunos =
    document.getElementById("totalAlunos");

const totalAvaliacoes =
    document.getElementById("totalAvaliacoes");

const mediaTurma =
    document.getElementById("mediaTurma");


// ==========================================
// LER LOCALSTORAGE
// ==========================================

function obterDados(chave) {

    try {

        const dados =
            JSON.parse(
                localStorage.getItem(chave)
            );

        return Array.isArray(dados)
            ? dados
            : [];

    }
    catch (erro) {

        console.error(
            "Erro ao ler:",
            chave,
            erro
        );

        return [];

    }

}


// ==========================================
// NORMALIZAR TEXTO
// ==========================================

function normalizarTexto(valor) {

    return String(valor || "")
        .trim()
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");

}


// ==========================================
// CARREGAR GRUPOS
// ==========================================

function carregarGruposResultado() {

    if (!grupoResultado) {
        return;
    }

    const grupos =
        obterDados("grupos");

    grupoResultado.innerHTML = `
        <option value="">
            Selecione o grupo
        </option>
    `;

    grupos
        .slice()
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
        .forEach(function(grupo) {

            if (!grupo || !grupo.nome) {
                return;
            }

            const option =
                document.createElement("option");

            option.value =
                grupo.nome;

            option.textContent =
                grupo.nome;

            grupoResultado.appendChild(
                option
            );

        });

}


// ==========================================
// OBTER AVALIAÇÕES DO GRUPO
// ==========================================

function obterAvaliacoesDoGrupo(nomeGrupo) {

    const avaliacoes =
        obterDados("avaliacoes");

    const grupoProcurado =
        normalizarTexto(nomeGrupo);

    return avaliacoes.filter(
        function(avaliacao) {

            return normalizarTexto(
                avaliacao.grupo
            ) === grupoProcurado;

        }
    );

}


// ==========================================
// OBTER ALUNOS DO GRUPO
// ==========================================
//
// PRIMEIRO:
// procura no cadastro de alunos.
//
// DEPOIS:
// se não encontrar, procura os alunos
// existentes nas avaliações.
//
// Isso evita o problema de aparecer
// "Nenhum aluno encontrado" quando a
// avaliação já existe.
//

function obterAlunosDoGrupo(nomeGrupo) {

    const alunos =
        obterDados("alunos");

    const avaliacoes =
        obterAvaliacoesDoGrupo(nomeGrupo);

    const grupoProcurado =
        normalizarTexto(nomeGrupo);

    const resultado =
        [];

    // ======================================
    // 1 - ALUNOS CADASTRADOS
    // ======================================

    alunos.forEach(function(aluno) {

        if (!aluno) {
            return;
        }

        const possiveisGrupos = [

            aluno.grupo,
            aluno.grupoNome,
            aluno.nomeGrupo,
            aluno.curso,
            aluno.cursoNome

        ];

        const pertenceAoGrupo =
            possiveisGrupos.some(
                function(valor) {

                    return normalizarTexto(
                        valor
                    ) === grupoProcurado;

                }
            );

        if (!pertenceAoGrupo) {
            return;
        }

        const nome =
            String(
                aluno.nome || ""
            ).trim();

        if (!nome) {
            return;
        }

        const jaExiste =
            resultado.some(
                function(item) {

                    return normalizarTexto(
                        item.nome
                    ) === normalizarTexto(
                        nome
                    );

                }
            );

        if (!jaExiste) {

            resultado.push(
                aluno
            );

        }

    });


    // ======================================
    // 2 - ALUNOS EXISTENTES NAS AVALIAÇÕES
    // ======================================

    avaliacoes.forEach(
        function(avaliacao) {

            if (!avaliacao) {
                return;
            }

            const nome =
                String(
                    avaliacao.aluno || ""
                ).trim();

            if (!nome) {
                return;
            }

            const jaExiste =
                resultado.some(
                    function(aluno) {

                        return normalizarTexto(
                            aluno.nome
                        ) === normalizarTexto(
                            nome
                        );

                    }
                );

            if (!jaExiste) {

                resultado.push({

                    nome: nome,

                    grupo: nomeGrupo

                });

            }

        }
    );


    return resultado;

}


// ==========================================
// DESCOBRIR OFICINAS
// ==========================================

function descobrirOficinas(avaliacoes) {

    const oficinas = [];


    avaliacoes.forEach(
        function(avaliacao) {

            const oficina =
                String(
                    avaliacao.oficina || ""
                ).trim();


            if (
                oficina &&
                !oficinas.some(
                    function(item) {

                        return normalizarTexto(
                            item
                        ) === normalizarTexto(
                            oficina
                        );

                    }
                )
            ) {

                oficinas.push(
                    oficina
                );

            }

        }
    );


    oficinas.sort(
        function(a, b) {

            return a.localeCompare(
                b,
                "pt-BR",
                {
                    sensitivity: "base"
                }
            );

        }
    );


    return oficinas;

}


// ==========================================
// IDENTIFICAR MARCO DA AVALIAÇÃO
// ==========================================

function obterMarco(avaliacao) {

    if (!avaliacao) {
        return null;
    }


    // PRINCIPAL

    const momento =
        Number(
            avaliacao.momento
        );


    if (
        momento === 1 ||
        momento === 2 ||
        momento === 3
    ) {

        return momento;

    }


    // COMPATIBILIDADE

    const alternativas = [

        avaliacao.avaliacao,

        avaliacao.numeroAvaliacao,

        avaliacao.marco

    ];


    for (
        let i = 0;
        i < alternativas.length;
        i++
    ) {

        const numero =
            Number(
                alternativas[i]
            );


        if (
            numero === 1 ||
            numero === 2 ||
            numero === 3
        ) {

            return numero;

        }

    }


    return null;

}


// ==========================================
// OBTER MARCOS REALIZADOS
// ==========================================

function obterMarcosRealizados(
    avaliacoes
) {

    const marcos = [];


    if (!Array.isArray(avaliacoes)) {

        return marcos;

    }


    avaliacoes.forEach(
        function(avaliacao) {

            const marco =
                obterMarco(
                    avaliacao
                );


            if (
                marco !== null &&
                !marcos.includes(marco)
            ) {

                marcos.push(
                    marco
                );

            }

        }
    );


    marcos.sort(
        function(a, b) {

            return a - b;

        }
    );


    return marcos;

}


// ==========================================
// MÉDIA DAS AVALIAÇÕES
// ==========================================

function calcularMediaMarcos(
    avaliacoes
) {

    if (
        !avaliacoes ||
        avaliacoes.length === 0
    ) {

        return null;

    }


    const valores =
        avaliacoes
            .map(
                function(avaliacao) {

                    return Number(
                        avaliacao.resultado
                    );

                }
            )
            .filter(
                function(valor) {

                    return !isNaN(
                        valor
                    );

                }
            );


    if (
        valores.length === 0
    ) {

        return null;

    }


    const soma =
        valores.reduce(
            function(total, valor) {

                return total + valor;

            },
            0
        );


    return soma /
        valores.length;

}


// ==========================================
// CALCULAR RESULTADO DO ALUNO
// ==========================================

function calcularResultadoAluno(
    aluno,
    grupo,
    oficinas,
    avaliacoesGrupo
) {

    const resultado = {

        nome:
            aluno.nome || "",

        oficinas: {},

        frequencias: [],

        avaliacoes: [],

        marcos: [],

        desempenho:
            null

    };


    // ======================================
    // AVALIAÇÕES DO ALUNO
    // ======================================

    const avaliacoesAluno =
        avaliacoesGrupo.filter(
            function(avaliacao) {

                return normalizarTexto(
                    avaliacao.aluno
                ) === normalizarTexto(
                    aluno.nome
                );

            }
        );


    resultado.avaliacoes =
        avaliacoesAluno;


    // ======================================
    // MARCOS
    // ======================================

    resultado.marcos =
        obterMarcosRealizados(
            avaliacoesAluno
        );


    // ======================================
    // OFICINAS
    // ======================================

    oficinas.forEach(
        function(oficina) {

            const avaliacoesOficina =
                avaliacoesAluno.filter(
                    function(avaliacao) {

                        return normalizarTexto(
                            avaliacao.oficina
                        ) === normalizarTexto(
                            oficina
                        );

                    }
                );


            const media =
                calcularMediaMarcos(
                    avaliacoesOficina
                );


            resultado.oficinas[
                oficina
            ] = media;

        }
    );


    // ======================================
    // FREQUÊNCIA
    // ======================================

    const avaliacoesFrequencia =
        avaliacoesAluno.filter(
            function(avaliacao) {

                return (
                    avaliacao.notas &&
                    avaliacao.notas[
                        "Frequência"
                    ] !== undefined
                );

            }
        );


    const frequencias = [];


    avaliacoesFrequencia.forEach(
        function(avaliacao) {

            const valor =
                Number(
                    avaliacao.notas[
                        "Frequência"
                    ]
                );


            if (!isNaN(valor)) {

                frequencias.push(
                    valor
                );

            }

        }
    );


    resultado.frequencias =
        frequencias;


    return resultado;

}


// ==========================================
// CALCULAR DESEMPENHO
// ==========================================

function calcularDesempenho(
    resultadoAluno
) {

    const valores = [];


    Object.keys(
        resultadoAluno.oficinas
    ).forEach(
        function(oficina) {

            const valor =
                resultadoAluno.oficinas[
                    oficina
                ];


            if (
                valor !== null &&
                !isNaN(valor)
            ) {

                valores.push(
                    Number(valor)
                );

            }

        }
    );


    if (
        valores.length === 0
    ) {

        return null;

    }


    const soma =
        valores.reduce(
            function(total, valor) {

                return total + valor;

            },
            0
        );


    return soma /
        valores.length;

}


// ==========================================
// MÉDIA DA FREQUÊNCIA
// ==========================================

function calcularMediaFrequencia(
    frequencias
) {

    if (
        !frequencias ||
        frequencias.length === 0
    ) {

        return null;

    }


    const valores =
        frequencias
            .map(function(valor) {

                return Number(valor);

            })
            .filter(function(valor) {

                return !isNaN(valor);

            });


    if (
        valores.length === 0
    ) {

        return null;

    }


    const soma =
        valores.reduce(
            function(total, valor) {

                return total + valor;

            },
            0
        );


    return soma /
        valores.length;

}


// ==========================================
// FORMATAR PERCENTUAL
// ==========================================

function formatarPercentual(valor) {

    if (
        valor === null ||
        valor === undefined ||
        isNaN(valor)
    ) {

        return "—";

    }


    return Number(valor)
        .toFixed(1)
        .replace(".", ",") +
        "%";

}


// ==========================================
// FORMATAR NOTA
// ==========================================

function formatarNota(valor) {

    if (
        valor === null ||
        valor === undefined ||
        isNaN(valor)
    ) {

        return "—";

    }


    return Number(valor)
        .toFixed(1)
        .replace(".", ",");

}


// ==========================================
// FORMATAR MARCOS
// ==========================================

function formatarMarcos(marcos) {

    if (
        !Array.isArray(marcos) ||
        marcos.length === 0
    ) {

        return "Nenhum";

    }


    return marcos
        .slice()
        .sort(function(a, b) {

            return a - b;

        })
        .map(function(marco) {

            return "Marco " + marco;

        })
        .join(" • ");

}


// ==========================================
// GERAR TABELA
// ==========================================

function gerarResultado() {

    const grupo =
        grupoResultado
            ? grupoResultado.value
            : "";


    if (!grupo) {

        alert(
            "⚠️ Selecione um grupo."
        );

        return;

    }


    // ======================================
    // BUSCAR AVALIAÇÕES
    // ======================================

    const avaliacoes =
        obterAvaliacoesDoGrupo(
            grupo
        );


    // ======================================
    // BUSCAR ALUNOS
    // ======================================

    const alunos =
        obterAlunosDoGrupo(
            grupo
        );


    // ======================================
    // DESCOBRIR OFICINAS
    // ======================================

    const oficinas =
        descobrirOficinas(
            avaliacoes
        );


    // ======================================
    // DEBUG
    // ======================================

    console.log(
        "================================="
    );

    console.log(
        "GRUPO SELECIONADO:",
        grupo
    );

    console.log(
        "ALUNOS ENCONTRADOS:",
        alunos
    );

    console.log(
        "AVALIAÇÕES ENCONTRADAS:",
        avaliacoes
    );

    console.log(
        "OFICINAS:",
        oficinas
    );

    console.log(
        "================================="
    );


    // ======================================
    // NENHUM ALUNO
    // ======================================

    if (
        alunos.length === 0
    ) {

        if (areaResultado) {

            areaResultado.innerHTML = `

                <div class="mensagem-resultado">

                    <h3>
                        👨‍🎓 Nenhum aluno encontrado
                    </h3>

                    <p>
                        Não existem alunos cadastrados
                        ou avaliações realizadas neste grupo.
                    </p>

                </div>

            `;

        }


        if (resumoResultado) {

            resumoResultado.style.display =
                "none";

        }

        return;

    }


    // ======================================
    // RESULTADOS DOS ALUNOS
    // ======================================

    const resultados =
        alunos
            .slice()
            .sort(function(a, b) {

                return String(
                    a.nome || ""
                ).localeCompare(
                    String(
                        b.nome || ""
                    ),
                    "pt-BR",
                    {
                        sensitivity: "base"
                    }
                );

            })
            .map(function(aluno) {

                const resultado =
                    calcularResultadoAluno(
                        aluno,
                        grupo,
                        oficinas,
                        avaliacoes
                    );


                resultado.desempenho =
                    calcularDesempenho(
                        resultado
                    );


                return resultado;

            });


    // ======================================
    // CABEÇALHO
    // ======================================

    let html = `

        <div class="tabela-container">

            <table>

                <thead>

                    <tr>

                        <th>
                            Nome
                        </th>

    `;


    // ======================================
    // OFICINAS
    // ======================================

    oficinas.forEach(
        function(oficina) {

            html += `

                <th>
                    ${oficina}
                </th>

            `;

        }
    );


    // ======================================
    // FREQUÊNCIA
    // ======================================

    html += `

        <th>
            Frequência
        </th>

        <th>
            Parcial Frequência
        </th>

        <th>
            Desempenho em
            Competências
            Socioemocionais
        </th>

        <th>
            Marcos Realizados
        </th>

    `;


    html += `

                    </tr>

                </thead>

                <tbody>

    `;


    // ======================================
    // RESUMO
    // ======================================

    let somaDesempenho =
        0;

    let quantidadeDesempenho =
        0;


    // ======================================
    // LINHAS
    // ======================================

    resultados.forEach(
        function(resultado) {

            html += `

                <tr>

                    <td>
                        <strong>
                            ${resultado.nome}
                        </strong>
                    </td>

            `;


            // ==================================
            // OFICINAS
            // ==================================

            oficinas.forEach(
                function(oficina) {

                    html += `

                        <td>
                            ${formatarNota(
                                resultado.oficinas[
                                    oficina
                                ]
                            )}
                        </td>

                    `;

                }
            );


            // ==================================
            // FREQUÊNCIA
            // ==================================

            const mediaFrequencia =
                calcularMediaFrequencia(
                    resultado.frequencias
                );


            html += `

                <td>
                    ${formatarNota(
                        mediaFrequencia
                    )}
                </td>

            `;


            // ==================================
            // PARCIAL FREQUÊNCIA
            // ==================================

            let parcialFrequencia =
                null;


            if (
                mediaFrequencia !== null
            ) {

                parcialFrequencia =
                    mediaFrequencia * 10;

            }


            html += `

                <td>
                    ${formatarPercentual(
                        parcialFrequencia
                    )}
                </td>

            `;


            // ==================================
            // DESEMPENHO
            // ==================================

            if (
                resultado.desempenho !== null
            ) {

                somaDesempenho +=
                    resultado.desempenho;

                quantidadeDesempenho++;

            }


            html += `

                <td>
                    ${formatarPercentual(
                        resultado.desempenho
                    )}
                </td>

            `;


            // ==================================
            // MARCOS REALIZADOS
            // ==================================

            html += `

                <td class="marcos-realizados">

                    ${formatarMarcos(
                        resultado.marcos
                    )}

                </td>

            `;


            html += `

                </tr>

            `;

        }
    );


    html += `

                </tbody>

            </table>

        </div>

    `;


    // ======================================
    // MOSTRAR RESULTADO
    // ======================================

    if (areaResultado) {

        areaResultado.innerHTML =
            html;

    }


    // ======================================
    // RESUMO
    // ======================================

    const media =
        quantidadeDesempenho > 0
            ? somaDesempenho /
              quantidadeDesempenho
            : null;


    if (totalAlunos) {

        totalAlunos.textContent =
            alunos.length;

    }


    if (totalAvaliacoes) {

        totalAvaliacoes.textContent =
            avaliacoes.length;

    }


    if (mediaTurma) {

        mediaTurma.textContent =
            formatarPercentual(
                media
            );

    }


    if (resumoResultado) {

        resumoResultado.style.display =
            "grid";

    }

}


// ==========================================
// BOTÃO GERAR
// ==========================================

if (btnGerarResultado) {

    btnGerarResultado.addEventListener(
        "click",
        gerarResultado
    );

}


// ==========================================
// CARREGAR GRUPOS
// ==========================================

carregarGruposResultado();


// ==========================================
// EXPORTAÇÃO PARA EXCEL
// ==========================================

function exportarExcel() {

    const tabela =
        areaResultado
            ? areaResultado.querySelector("table")
            : null;


    if (!tabela) {

        alert(
            "⚠️ Primeiro gere o resultado para poder exportar."
        );

        return;

    }


    if (
        typeof XLSX === "undefined"
    ) {

        alert(
            "❌ A biblioteca do Excel não foi carregada."
        );

        return;

    }


    const workbook =
        XLSX.utils.book_new();


    const worksheet =
        XLSX.utils.table_to_sheet(
            tabela
        );


    XLSX.utils.book_append_sheet(
        workbook,
        worksheet,
        "Resultado"
    );


    const grupo =
        grupoResultado
            ? grupoResultado.value
            : "Grupo";


    const nomeArquivo =
        "Resultado_" +
        grupo
            .replace(
                /[^a-zA-Z0-9À-ÿ\s_-]/g,
                ""
            )
            .replace(
                /\s+/g,
                "_"
            ) +
        ".xlsx";


    XLSX.writeFile(
        workbook,
        nomeArquivo
    );

}


if (btnExportarExcel) {

    btnExportarExcel.addEventListener(
        "click",
        exportarExcel
    );

}