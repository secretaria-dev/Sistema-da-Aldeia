// ==========================================
// SISTEMA ALDEIA DO FUTURO
// LOGIN
// ==========================================


// ==========================================
// USUÁRIO ADMINISTRADOR INICIAL
// ==========================================

const USUARIO_ADMIN = {
    email: "admin@aldeiadfuturo.org.br",
    senha: "Aldeia2026@",
    nome: "Administrador",
    tipo: "admin"
};


// ==========================================
// ELEMENTOS
// ==========================================

const loginForm =
    document.getElementById("loginForm");

const emailInput =
    document.getElementById("email");

const senhaInput =
    document.getElementById("senha");

const mensagem =
    document.getElementById("mensagem");


// ==========================================
// MOSTRAR / OCULTAR SENHA
// ==========================================

const mostrarSenha =
    document.getElementById("mostrarSenha");


if (mostrarSenha) {

    mostrarSenha.addEventListener(
        "click",
        function () {

            if (senhaInput.type === "password") {

                senhaInput.type = "text";

                mostrarSenha.textContent = "🙈";

            } else {

                senhaInput.type = "password";

                mostrarSenha.textContent = "👁";

            }

        }
    );

}


// ==========================================
// MENSAGEM
// ==========================================

function mostrarMensagem(texto) {

    mensagem.textContent = texto;

    mensagem.classList.add("visivel");

}


function esconderMensagem() {

    mensagem.textContent = "";

    mensagem.classList.remove("visivel");

}


// ==========================================
// LOGIN
// ==========================================

if (loginForm) {

    loginForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();

            esconderMensagem();


            const email =
                emailInput.value
                    .trim()
                    .toLowerCase();

            const senha =
                senhaInput.value;


            // ==================================
            // VERIFICAÇÃO
            // ==================================

            if (
                email === USUARIO_ADMIN.email &&
                senha === USUARIO_ADMIN.senha
            ) {


                // ==================================
                // SALVAR SESSÃO
                // ==================================

                const usuarioLogado = {

                    nome:
                        USUARIO_ADMIN.nome,

                    email:
                        USUARIO_ADMIN.email,

                    tipo:
                        USUARIO_ADMIN.tipo,

                    login:
                        new Date().toISOString()

                };


                localStorage.setItem(
                    "usuarioLogado",
                    JSON.stringify(usuarioLogado)
                );


                // ==================================
                // ENTRADA NO SISTEMA
                // ==================================

                window.location.href =
                    "index.html";


            } else {

                mostrarMensagem(
                    "E-mail ou senha incorretos."
                );

            }

        }
    );

}   