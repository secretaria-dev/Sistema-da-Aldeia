```javascript
const formulario = document.querySelector("form");

if (formulario) {

    formulario.addEventListener(
        "submit",
        function(event) {

            event.preventDefault();

            const grupo = {

                nome:
                    document.getElementById("nome").value,

                responsavel:
                    document.getElementById("responsavel").value,

                inicio:
                    document.getElementById("inicio").value,

                fim:
                    document.getElementById("fim").value,

                carga:
                    document.getElementById("carga").value,

                vagas:
                    document.getElementById("vagas").value,

                status:
                    document.getElementById("status").value

            };

            let grupos =
                JSON.parse(
                    localStorage.getItem("grupos")
                ) || [];

            grupos.push(grupo);

            localStorage.setItem(
                "grupos",
                JSON.stringify(grupos)
            );

            alert(
                "Grupo cadastrado com sucesso!"
            );

            window.location.href =
                "lista-grupos.html";

        }
    );

}
```
