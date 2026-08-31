console.log("pagina de perfil carregada");

const params = new URLSearchParams(window.location.search);
const userId = Number(params.get("id"))
console.log("ID do perfil:", userId);

fetch(`http://localhost:3000/users/${userId}`)
    .then(response => response.json())
    .then(user => {
        console.log("Dados do usuário:", user);
        document.getElementById("userName").innerText = user.nome;
        document.getElementById("userEmail").innerText = user.email;
    })
    .catch(error => console.error("Erro ao buscar dados do usuário:", error));

    fetch("http://localhost:3000/cars")
    .then(response => response.json())
    .then(cars => {
        const userCars = cars.filter(car => car.idDono === userId);
        
        const userCarsContainer = document.getElementById("userCars");
        if (userCars.length === 0) {
            userCarsContainer.innerHTML = "<p>Este usuário ainda não possui anúncios.</p>";
        }

        userCarsContainer.innerHTML = userCars.map(car => `
            <div class="carCard">
                <img src="${car.imagem}" alt="${car.titulo}" class="carImage">
                <h3>${car.titulo}</h3>
                <p>${car.preco}</p>
                <p>${car.descricao}</p>
            </div>
        `).join('');
    })
    .catch(error => console.error("Erro ao buscar carros:", error));