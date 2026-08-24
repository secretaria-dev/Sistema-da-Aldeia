const listaGrupos =
    document.getElementById("listaGrupos");


let grupos =
    JSON.parse(
        localStorage.getItem("grupos")
    ) || [];


// ==========================================
// MOSTRAR GRUPOS
// ==========================================

function mostrarGrupos() {

    if (!listaGrupos) {
        return;
    }


    // NENHUM GRUPO

    if (grupos.length === 0) {

        listaGrupos.innerHTML = `

            <div class="card">

                <h3>
                    Nenhum grupo cadastrado
                </h3>

                <p>
                    Ainda não existe nenhum grupo cadastrado.
                </p>

            </div>

        `;

        return;
    }


    // LIMPAR

    listaGrupos.innerHTML = "";


    // ORDEM ALFABÉTICA

    grupos.sort(function(a, b) {

        return String(a.nome || "").localeCompare(
            String(b.nome || ""),
            "pt-BR",
            {
                sensitivity: "base"
            }
        );

    });


    // MOSTRAR

    grupos.forEach(function(grupo, index) {

        const card =
            document.createElement("div");


        card.className = "card";


        card.innerHTML = `

            <h3>
                👥 ${grupo.nome || "Grupo sem nome"}
            </h3>


            <p>
                <strong>Responsável:</strong>
                ${grupo.responsavel || "Não informado"}
            </p>


            <p>
                <strong>Data de início:</strong>
                ${grupo.inicio || "Não informado"}
            </p>


            <p>
                <strong>Data de término:</strong>
                ${grupo.fim || "Não informado"}
            </p>


            <p>
                <strong>Carga horária:</strong>
                ${grupo.carga || "0"} horas
            </p>


            <p>
                <strong>Vagas:</strong>
                ${grupo.vagas || "0"}
            </p>


            <p>
                <strong>Status:</strong>
                ${grupo.status || "Não informado"}
            </p>


            <button
                onclick="excluirGrupo(${index})"
            >
                🗑️ Excluir Grupo
            </button>

        `;


        listaGrupos.appendChild(card);

    });

}


// ==========================================
// EXCLUIR GRUPO
// ==========================================

function excluirGrupo(index) {

    const confirmar =
        confirm(
            "Deseja realmente excluir este grupo?"
        );


    if (!confirmar) {
        return;
    }


    grupos.splice(index, 1);


    localStorage.setItem(
        "grupos",
        JSON.stringify(grupos)
    );


    mostrarGrupos();

}


// ==========================================
// INICIAR
// ==========================================

mostrarGrupos();    