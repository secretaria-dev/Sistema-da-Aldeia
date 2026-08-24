// ==========================================
// ELEMENTOS DA PÁGINA
// ==========================================

const listaAlunos =
    document.getElementById("listaAlunos");

const totalAlunos =
    document.getElementById("totalAlunos");

const arquivoExcel =
    document.getElementById("arquivoExcel");

const campoPesquisa =
    document.getElementById("pesquisaAluno");


// ==========================================
// CARREGAR ALUNOS
// ==========================================

let alunos =
    JSON.parse(
        localStorage.getItem("alunos")
    ) || [];


// ==========================================
// MOSTRAR ALUNOS
// ==========================================

function mostrarAlunos() {

    if (!listaAlunos) {
        return;
    }


    // ======================================
    // TOTAL
    // ======================================

    if (totalAlunos) {

        if (alunos.length === 1) {

            totalAlunos.textContent =
                "1 aluno cadastrado";

        } else {

            totalAlunos.textContent =
                `${alunos.length} alunos cadastrados`;

        }

    }


    // ======================================
    // PESQUISA
    // ======================================

    const pesquisa =
        campoPesquisa
            ? normalizar(campoPesquisa.value)
            : "";


    // ======================================
    // FILTRAR
    // ======================================

    let alunosFiltrados =
        alunos.filter(function(aluno) {

            const nome =
                normalizar(aluno.nome);

            const cpf =
                normalizar(aluno.cpf);

            const grupo =
                normalizar(aluno.grupo);

            return (
                nome.includes(pesquisa) ||
                cpf.includes(pesquisa) ||
                grupo.includes(pesquisa)
            );

        });


    // ======================================
    // ORDEM ALFABÉTICA
    // ======================================

    alunosFiltrados.sort(function(a, b) {

        return String(a.nome || "")
            .localeCompare(
                String(b.nome || ""),
                "pt-BR",
                {
                    sensitivity: "base"
                }
            );

    });


    // ======================================
    // NENHUM RESULTADO
    // ======================================

    if (alunosFiltrados.length === 0) {

        listaAlunos.innerHTML = `

            <div class="card">

                <h3>
                    Nenhum aluno encontrado
                </h3>

                <p>
                    ${
                        pesquisa
                            ? "Nenhum aluno corresponde à pesquisa."
                            : "Cadastre um aluno ou importe uma planilha."
                    }
                </p>

            </div>

        `;

        return;

    }


    // ======================================
    // LIMPAR LISTA
    // ======================================

    listaAlunos.innerHTML = "";


    // ======================================
    // MOSTRAR ALUNOS
    // ======================================

    alunosFiltrados.forEach(function(aluno) {

        const indiceReal =
            alunos.indexOf(aluno);


        const card =
            document.createElement("div");


        card.className =
            "card";


        card.innerHTML = `

            <label style="
                display: flex;
                align-items: center;
                gap: 10px;
                margin-bottom: 15px;
                cursor: pointer;
            ">

                <input
                    type="checkbox"
                    class="alunoSelecionado"
                    value="${indiceReal}"
                    style="
                        width: 20px;
                        height: 20px;
                    "
                >

                <strong>
                    Selecionar para excluir
                </strong>

            </label>


            <h3>
                👨‍🎓 ${aluno.nome || "Nome não informado"}
            </h3>


            <p>
                <strong>Grupo:</strong>
                ${aluno.grupo || "Não informado"}
            </p>


            <p>
                <strong>Data de inscrição:</strong>
                ${formatarDataExibicao(aluno.dataInscricao)}
            </p>


            <p>
                <strong>Gênero:</strong>
                ${aluno.genero || "Não informado"}
            </p>


            <p>
                <strong>Idade:</strong>
                ${aluno.idade || "Não informado"}
            </p>


            <p>
                <strong>RG:</strong>
                ${aluno.rg || "Não informado"}
            </p>


            <p>
                <strong>CPF:</strong>
                ${aluno.cpf || "Não informado"}
            </p>


            <p>
                <strong>Telefone:</strong>
                ${aluno.telefone || "Não informado"}
            </p>


            <button
                onclick="excluirAluno(${indiceReal})"
            >
                🗑️ Excluir este aluno
            </button>

        `;


        listaAlunos.appendChild(card);

    });

}


// ==========================================
// PESQUISA AUTOMÁTICA
// ==========================================

if (campoPesquisa) {

    campoPesquisa.addEventListener(
        "input",
        function() {

            mostrarAlunos();

        }
    );

}


// ==========================================
// NORMALIZAR TEXTO
// ==========================================

function normalizar(texto) {

    return String(texto || "")
        .trim()
        .toLowerCase()
        .normalize("NFD")
        .replace(
            /[\u0300-\u036f]/g,
            ""
        );

}


// ==========================================
// FORMATAR DATA PARA EXIBIÇÃO
// ==========================================

function formatarDataExibicao(valor) {

    if (!valor) {
        return "Não informado";
    }


    const texto =
        String(valor);


    if (
        /^\d{4}-\d{2}-\d{2}$/.test(texto)
    ) {

        const partes =
            texto.split("-");

        return (
            partes[2] +
            "/" +
            partes[1] +
            "/" +
            partes[0]
        );

    }


    return texto;

}


// ==========================================
// EXCLUIR UM ALUNO
// ==========================================

function excluirAluno(index) {

    const confirmar =
        confirm(
            "Deseja realmente excluir este aluno?"
        );


    if (!confirmar) {
        return;
    }


    alunos.splice(
        index,
        1
    );


    localStorage.setItem(
        "alunos",
        JSON.stringify(alunos)
    );


    mostrarAlunos();

}


// ==========================================
// EXCLUIR SELECIONADOS
// ==========================================

function excluirSelecionados() {

    const selecionados =
        document.querySelectorAll(
            ".alunoSelecionado:checked"
        );


    if (selecionados.length === 0) {

        alert(
            "Selecione pelo menos um aluno para excluir."
        );

        return;

    }


    const indices =
        Array.from(
            selecionados
        ).map(function(checkbox) {

            return Number(
                checkbox.value
            );

        });


    const confirmar =
        confirm(
            `Você selecionou ${indices.length} aluno(s).\n\n` +
            "Deseja realmente excluir esses alunos?"
        );


    if (!confirmar) {
        return;
    }


    indices
        .sort(function(a, b) {

            return b - a;

        })
        .forEach(function(indice) {

            alunos.splice(
                indice,
                1
            );

        });


    localStorage.setItem(
        "alunos",
        JSON.stringify(alunos)
    );


    mostrarAlunos();


    alert(
        `${indices.length} aluno(s) excluído(s) com sucesso.`
    );

}


// ==========================================
// EXCLUIR ALUNOS DE UM GRUPO
// ==========================================

function excluirAlunosGrupo() {

    if (alunos.length === 0) {

        alert(
            "Não existem alunos cadastrados."
        );

        return;

    }


    const grupos = [
        ...new Set(
            alunos
                .map(function(aluno) {

                    return aluno.grupo;

                })
                .filter(function(grupo) {

                    return grupo;

                })
        )
    ];


    if (grupos.length === 0) {

        alert(
            "Nenhum grupo foi encontrado nos alunos."
        );

        return;

    }


    let mensagem =
        "Digite exatamente o nome do grupo que deseja excluir:\n\n";


    grupos.forEach(function(grupo, index) {

        mensagem +=
            `${index + 1}. ${grupo}\n`;

    });


    const escolha =
        prompt(mensagem);


    if (!escolha) {
        return;
    }


    const grupoEscolhido =
        grupos.find(function(grupo) {

            return (
                normalizar(grupo) ===
                normalizar(escolha)
            );

        });


    if (!grupoEscolhido) {

        alert(
            "Grupo não encontrado."
        );

        return;

    }


    const quantidade =
        alunos.filter(function(aluno) {

            return (
                normalizar(aluno.grupo) ===
                normalizar(grupoEscolhido)
            );

        }).length;


    const confirmar =
        confirm(
            `ATENÇÃO!\n\n` +
            `Grupo: ${grupoEscolhido}\n` +
            `Alunos encontrados: ${quantidade}\n\n` +
            "Deseja excluir esses alunos?"
        );


    if (!confirmar) {
        return;
    }


    alunos =
        alunos.filter(function(aluno) {

            return (
                normalizar(aluno.grupo) !==
                normalizar(grupoEscolhido)
            );

        });


    localStorage.setItem(
        "alunos",
        JSON.stringify(alunos)
    );


    mostrarAlunos();


    alert(
        `${quantidade} aluno(s) do grupo "${grupoEscolhido}" foram excluídos.`
    );

}


// ==========================================
// EXCLUIR TODOS OS ALUNOS
// ==========================================

function excluirTodosAlunos() {

    if (alunos.length === 0) {

        alert(
            "Não existem alunos cadastrados."
        );

        return;

    }


    const quantidade =
        alunos.length;


    const confirmar =
        confirm(
            `ATENÇÃO!\n\n` +
            `Você está prestes a excluir TODOS os ${quantidade} alunos.\n\n` +
            "Essa ação não poderá ser desfeita.\n\n" +
            "Deseja continuar?"
        );


    if (!confirmar) {
        return;
    }


    const segundaConfirmacao =
        confirm(
            "Tem certeza absoluta?\n\n" +
            "Todos os alunos serão removidos."
        );


    if (!segundaConfirmacao) {
        return;
    }


    alunos = [];


    localStorage.removeItem(
        "alunos"
    );


    mostrarAlunos();


    alert(
        "Todos os alunos foram excluídos com sucesso."
    );

}


// ==========================================
// INICIAR
// ==========================================

mostrarAlunos();