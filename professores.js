// ==========================================
// SISTEMA ALDEIA
// PROFESSORES / USUÁRIOS
// ==========================================


// ==========================================
// CONFIGURAÇÃO
// ==========================================

const SENHA_PADRAO =
    "Aldeia@2026";


// ==========================================
// CARREGAR PROFESSORES
// ==========================================

let professores =
    JSON.parse(
        localStorage.getItem("professores")
    ) || [];



// ==========================================
// FORMULÁRIO DE PROFESSOR
// ==========================================

const formulario =
    document.getElementById(
        "formProfessor"
    );


if (formulario) {

    formulario.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            // ==================================
            // PEGAR DADOS
            // ==================================

            const nome =
                document
                    .getElementById("nome")
                    .value
                    .trim();


            const email =
                document
                    .getElementById("email")
                    .value
                    .trim()
                    .toLowerCase();


            const telefone =
                document
                    .getElementById("telefone")
                    .value
                    .trim();


            const tipo =
                document
                    .getElementById("tipo")
                    .value;


            const status =
                document
                    .getElementById("status")
                    .value;



            // ==================================
            // VALIDAR CAMPOS
            // ==================================

            if (
                !nome ||
                !email
            ) {

                alert(
                    "Preencha o nome e o e-mail do professor."
                );

                return;

            }



            // ==================================
            // VERIFICAR E-MAIL DUPLICADO
            // ==================================

            const emailExiste =
                professores.some(
                    function (professor) {

                        return (
                            professor.email &&
                            professor.email
                                .toLowerCase() ===
                            email
                        );

                    }
                );


            if (emailExiste) {

                alert(
                    "Já existe um professor cadastrado com este e-mail."
                );

                return;

            }



            // ==================================
            // CRIAR PROFESSOR
            // ==================================

            const professor = {

                id:
                    Date.now(),

                nome:
                    nome,

                email:
                    email,

                telefone:
                    telefone,

                // O e-mail é o login
                usuario:
                    email,

                // Senha inicial automática
                senha:
                    SENHA_PADRAO,

                tipo:
                    tipo,

                status:
                    status,

                // Obriga trocar a senha
                // no primeiro acesso
                primeiroAcesso:
                    true

            };



            // ==================================
            // ADICIONAR À LISTA
            // ==================================

            professores.push(
                professor
            );



            // ==================================
            // SALVAR
            // ==================================

            localStorage.setItem(
                "professores",
                JSON.stringify(
                    professores
                )
            );



            // ==================================
            // MOSTRAR ACESSO
            // ==================================

            alert(

                "✅ PROFESSOR CADASTRADO COM SUCESSO!\n\n" +

                "Nome: " +
                professor.nome +
                "\n\n" +

                "LOGIN:\n" +
                professor.email +
                "\n\n" +

                "SENHA INICIAL:\n" +
                SENHA_PADRAO +
                "\n\n" +

                "⚠️ No primeiro acesso, o professor deverá criar uma nova senha."

            );



            // ==================================
            // LIMPAR FORMULÁRIO
            // ==================================

            formulario.reset();



            // ==================================
            // VOLTAR PARA LISTA
            // ==================================

            window.location.href =
                "professores.html";

        }
    );

}



// ==========================================
// LISTA DE PROFESSORES
// ==========================================

const listaProfessores =
    document.getElementById(
        "listaProfessores"
    );


if (listaProfessores) {

    mostrarProfessores();

}



// ==========================================
// MOSTRAR PROFESSORES
// ==========================================

function mostrarProfessores() {

    professores =
        JSON.parse(
            localStorage.getItem(
                "professores"
            )
        ) || [];



    // ==================================
    // NENHUM PROFESSOR
    // ==================================

    if (
        professores.length === 0
    ) {

        listaProfessores.innerHTML = `

            <div class="card">

                <h3>
                    Nenhum professor cadastrado
                </h3>

                <p>
                    Clique em
                    "Novo Professor"
                    para cadastrar.
                </p>

            </div>

        `;

        return;

    }



    // ==================================
    // LIMPAR LISTA
    // ==================================

    listaProfessores.innerHTML =
        "";



    // ==================================
    // CRIAR CARDS
    // ==================================

    professores.forEach(
        function (professor, index) {

            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "card";



            // ==================================
            // STATUS VISUAL
            // ==================================

            let statusTexto;

            if (
                professor.status ===
                "Ativo"
            ) {

                statusTexto =
                    "🟢 Ativo";

            }

            else {

                statusTexto =
                    "🔴 Inativo";

            }



            // ==================================
            // PERFIL VISUAL
            // ==================================

            let perfilTexto;

            if (
                professor.tipo ===
                "administrador"
            ) {

                perfilTexto =
                    "👑 Administrador";

            }

            else {

                perfilTexto =
                    "👨‍🏫 Educador";

            }



            // ==================================
            // PRIMEIRO ACESSO
            // ==================================

            let primeiroAcessoTexto =
                "";


            if (
                professor.primeiroAcesso
            ) {

                primeiroAcessoTexto = `

                    <p>

                        <strong>
                            Acesso:
                        </strong>

                        ⚠️ Aguardando
                        primeiro acesso

                    </p>

                `;

            }

            else {

                primeiroAcessoTexto = `

                    <p>

                        <strong>
                            Acesso:
                        </strong>

                        ✅ Senha configurada

                    </p>

                `;

            }



            // ==================================
            // CARD
            // ==================================

            card.innerHTML = `

                <h3>
                    👨‍🏫
                    ${professor.nome}
                </h3>

                <p>

                    <strong>
                        Login:
                    </strong>

                    ${professor.email || "-"}

                </p>

                <p>

                    <strong>
                        Perfil:
                    </strong>

                    ${perfilTexto}

                </p>

                <p>

                    <strong>
                        E-mail:
                    </strong>

                    ${professor.email || "-"}

                </p>

                <p>

                    <strong>
                        Telefone:
                    </strong>

                    ${professor.telefone || "-"}

                </p>

                <p>

                    <strong>
                        Status:
                    </strong>

                    ${statusTexto}

                </p>

                ${primeiroAcessoTexto}

                <br>

                <button
                    onclick="copiarAcesso(${index})"
                >
                    📋 Copiar acesso
                </button>

                <button
                    onclick="excluirProfessor(${index})"
                >
                    🗑️ Excluir
                </button>

            `;



            listaProfessores.appendChild(
                card
            );

        }
    );

}



// ==========================================
// COPIAR ACESSO
// ==========================================

function copiarAcesso(index) {

    const professor =
        professores[index];


    if (!professor) {

        return;

    }


    const texto =

        "Aldeia do Futuro\n\n" +

        "Olá, " +
        professor.nome +
        "!\n\n" +

        "Seu acesso ao Sistema Aldeia do Futuro foi criado.\n\n" +

        "Login: " +
        professor.email +
        "\n" +

        "Senha inicial: " +
        SENHA_PADRAO +
        "\n\n" +

        "No primeiro acesso, você deverá criar uma nova senha.";



    navigator.clipboard
        .writeText(texto)
        .then(
            function () {

                alert(
                    "✅ Dados de acesso copiados!"
                );

            }
        )
        .catch(
            function () {

                alert(
                    "Não foi possível copiar automaticamente."
                );

            }
        );

}



// ==========================================
// EXCLUIR PROFESSOR
// ==========================================

function excluirProfessor(index) {


    const professor =
        professores[index];


    if (!professor) {

        return;

    }



    const confirmar =
        confirm(

            "Deseja realmente excluir este professor?\n\n" +

            professor.nome

        );


    if (!confirmar) {

        return;

    }



    // ==================================
    // EXCLUIR
    // ==================================

    professores.splice(
        index,
        1
    );



    // ==================================
    // SALVAR NOVAMENTE
    // ==================================

    localStorage.setItem(
        "professores",
        JSON.stringify(
            professores
        )
    );



    // ==================================
    // ATUALIZAR LISTA
    // ==================================

    mostrarProfessores();

}