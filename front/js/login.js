console.log("Script carregado");

    document.getElementById("loginForm").addEventListener("submit", function(event){
        event.preventDefault();
        submitLogin();
    });

    function submitLogin() {
        const email = document.getElementById('email').value;
        const senha = document.getElementById('senha').value;

        const loginData = {
            email,
            senha
        };
        fetch('http://localhost:3000/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(loginData)
        })
        .then(async (response) => {
            const data = await response.json();
            if (!response.ok) {
                document.getElementById("errorAlert").textContent = data.erro;
                return;
        }
            document.getElementById("errorAlert").textContent = "";
                    console.log("Login realizado com sucesso:", data);
        })
        .catch(error => {
            console.error(error);
            document.getElementById("errorAlert").textContent = "Erro ao conectar com o servidor.";
        });
}