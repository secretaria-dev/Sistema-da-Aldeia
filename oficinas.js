// ==========================================
// SISTEMA DE OFICINAS - SISTEMA ALDEIA
// ==========================================


// ==========================================
// CARREGAR GRUPOS
// ==========================================

const campoGrupo = document.getElementById("grupo");

const grupos =
    JSON.parse(localStorage.getItem("grupos")) || [];


if (campoGrupo) {

    campoGrupo.innerHTML = `
        <option value="">
            Selecione um grupo
        </option>
    `;

    grupos.forEach(function(grupo) {

        const option =
            document.createElement("option");

        option.value = grupo.nome;

        option.textContent = grupo.nome;

        campoGrupo.appendChild(option);

    });

}


// ==========================================
// CARREGAR PROFESSORES
// ==========================================

const campoProfessor =
    document.getElementById("professor");

const professores =
    JSON.parse(
        localStorage.getItem("professores")
    ) || [];


if (campoProfessor) {

    campoProfessor.innerHTML = `
        <option value="">
            Selecione um professor
        </option>
    `;

    professores.forEach(function(professor) {

        const option =
            document.createElement("option");

        option.value = professor.nome;

        option.textContent = professor.nome;

        campoProfessor.appendChild(option);

    });

}


// ==========================================
// SALVAR OFICINA
// ==========================================

const formulario =
    document.getElementById("formOficina");


if (formulario) {

    formulario.addEventListener(
        "submit",
        function(event) {

            event.preventDefault();


            const grupo =
                document.getElementById("grupo").value;

            const nome =
                document.getElementById("nome").value.trim();

            const professor =
                document.getElementById("professor").value;

            const carga =
                document.getElementById("carga").value;

            const status =
                document.getElementById("status").value;


            // VALIDAR GRUPO

            if (!grupo) {

                alert("Selecione um grupo.");

                return;

            }


            // VALIDAR NOME

            if (!nome) {

                alert("Digite o nome da oficina.");

                return;

            }


            // VALIDAR PROFESSOR

            if (!professor) {

                alert(
                    "Selecione um professor responsável."
                );

                return;

            }


            // CRIAR OFICINA

            const oficina = {

                grupo: grupo,

                nome: nome,

                professor: professor,

                carga: carga,

                status: status

            };


            // CARREGAR OFICINAS EXISTENTES

            let oficinas =
                JSON.parse(
                    localStorage.getItem("oficinas")
                ) || [];


            // ADICIONAR

            oficinas.push(oficina);


            // SALVAR

            localStorage.setItem(
                "oficinas",
                JSON.stringify(oficinas)
            );


            alert(
                "Oficina cadastrada com sucesso!"
            );


            formulario.reset();


            window.location.href =
                "oficinas.html";

        }
    );

}


// ==========================================
// MOSTRAR OFICINAS
// ==========================================

const listaOficinas =
    document.getElementById("listaOficinas");


if (listaOficinas) {

    const oficinas =
        JSON.parse(
            localStorage.getItem("oficinas")
        ) || [];


    if (oficinas.length === 0) {

        listaOficinas.innerHTML = `

            <div class="card">

                <h3>
                    Nenhuma oficina cadastrada
                </h3>

                <p>
                    Clique em "Nova Oficina"
                    para cadastrar uma oficina.
                </p>

            </div>

        `;

    } else {

        listaOficinas.innerHTML = "";


        oficinas.forEach(
            function(oficina, index) {

                const card =
                    document.createElement("div");


                card.className = "card";


                card.innerHTML = `

                    <h3>
                        🛠️ ${oficina.nome}
                    </h3>

                    <p>
                        <strong>Grupo:</strong>
                        ${oficina.grupo}
                    </p>

                    <p>
                        <strong>
                            Professor responsável:
                        </strong>
                        ${oficina.professor}
                    </p>

                    <p>
                        <strong>
                            Carga horária:
                        </strong>
                        ${oficina.carga} horas
                    </p>

                    <p>
                        <strong>
                            Status:
                        </strong>
                        ${oficina.status}
                    </p>

                    <button
                        onclick="excluirOficina(${index})"
                    >
                        🗑️ Excluir
                    </button>

                `;


                listaOficinas.appendChild(card);

            }
        );

    }

}


// ==========================================
// EXCLUIR OFICINA
// ==========================================

function excluirOficina(index) {

    const confirmar =
        confirm(
            "Deseja realmente excluir esta oficina?"
        );


    if (!confirmar) {

        return;

    }


    let oficinas =
        JSON.parse(
            localStorage.getItem("oficinas")
        ) || [];


    oficinas.splice(index, 1);


    localStorage.setItem(
        "oficinas",
        JSON.stringify(oficinas)
    );


    location.reload();

}