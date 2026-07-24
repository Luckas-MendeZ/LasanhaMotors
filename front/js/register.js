console.log("Script carregado");

    document.getElementById("cadastroForm").addEventListener("submit", function(event){
        event.preventDefault();
        submitUser();
    });

    function submitUser() {
        const nome = document.getElementById('nome').value;
        const email = document.getElementById('email').value;
        const senha = document.getElementById('senha').value;

        const newUser = {
            nome,
            email,
            senha
        };

        fetch('http://localhost:3000/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newUser)
        });

        fetch('http://localhost:3000/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newUser)
        })
        .then(res => res.json())
        .then(data => {
            console.log("Usuário criado: ", data);
        })
        .catch(error => console.error('Erro ao cadastrar usuário:', error));
    }
