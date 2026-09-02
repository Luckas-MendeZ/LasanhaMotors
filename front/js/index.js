console.log("Script carregado");

let cars = [];
let editingCarId = null;
let users = [];


const user= JSON.parse(localStorage.getItem("userLog"));
console.log("Usuário logado:", user);

const newCar = {
    titulo: document.getElementById('titulo').value,
    imagem: document.getElementById('imagem').value,
    preco: Number(document.getElementById('preco').value),
    descricao: document.getElementById('descricao').value,
    idDono: user.id
};
console.log(newCar);

fetch('http://localhost:3000/users')
    .then(response => response.json())
    .then(data => {
        users = data;
        console.log("usuários", users);
    });
        fetch('http://localhost:3000/cars')
            .then(response => response.json())
            .then(data => {
        cars = data;
        console.log("carros", data)

            const carList = document.getElementById('cars');
                carList.innerHTML = data.map(car => {

            const user = JSON.parse(localStorage.getItem("userLog"));        
            const vendedor = users.find(user => user.idUser === car.idDono);
            
            if (isOwner(car, user)) {
                return `
                <div>
                    <p>Titulo: ${car.titulo}</p>
                    <p>Imagem: ${car.imagem}</p>
                    <p>Descrição: ${car.descricao}</p>
                    <p>Preço: R$ ${car.preco.toFixed(2)}</p>
                    <p>Dono: <a href="profile.html?id=${vendedor.idUser}">${vendedor.nome}</a></p>
                        <button onclick='deleteCar(${car.id})'>Excluir carro</button>
                        <button onclick='editCar(${car.id})'>Editar carro</button>
                    </div>`;
            } else {
               return `
                <div>
                    <p>Titulo: ${car.titulo}</p>
                    <p>Imagem: ${car.imagem}</p>
                    <p>Descrição: ${car.descricao}</p>
                    <p>Preço: R$ ${car.preco.toFixed(2)}</p>
                    <p>Dono: <a href="profile.html?id=${vendedor.idUser}">${vendedor.nome}</a></p>
                </div>`;}
            }).join('');
        })


    .catch(error => console.error('Erro ao buscar carros:', error));

        document.getElementById("formVenda").addEventListener("submit", function(event){
            event.preventDefault();

        if(editingCarId === null){
            submitCar();
        }else{
            updateCar();
        }
    });


    function submitCar() {
        const titulo = document.getElementById('titulo').value;
        const imagem = document.getElementById('imagem').value;
        const preco = document.getElementById('preco').value;
        const descricao = document.getElementById('descricao').value;

        console.log(user);

        const newCar = {
            titulo,
            imagem,
            preco: Number(preco),
            descricao,
            idDono: user.id
        };
        console.log(newCar);
        
        fetch('http://localhost:3000/cars', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newCar)
        }) 
        .then(res => res.json())
        .then(data => {
            console.log("Carro criado: ", data);
            location.reload();
        })
        .catch(error => console.error('Erro ao adicionar carro:', error));
    }

    // Abre e fecha o formulário de cadastro/edição
    function toggleForm() {
        const form = document.getElementById("formvendaContainer");
        const btn = document.getElementById("btnToggle");

        if (form.style.display === "block") {
            form.style.display = "none";
            btn.textContent = "Adicionar carro";

        // Sai do modo edição
        editingCarId = null;

        // Limpa todos os campos
        document.getElementById("formVenda").reset();

        } else {
        form.style.display = "block";
        btn.textContent = "Fechar";
    }
}

        // Abre o formulário preenchido para editar um carro
    function editCar(id) {
        const car = cars.find(car => car.id === id);
        if (!car) {
            console.error("Carro não encontrado");
            return;
        }

        editingCarId = id;

        const form = document.getElementById("formvendaContainer");
        form.style.display = "block";
        document.getElementById("btnToggle").textContent = "Fechar";
        document.getElementById("titulo").value = car.titulo;
        document.getElementById("imagem").value = car.imagem;
        document.getElementById("preco").value = car.preco;
        document.getElementById("descricao").value = car.descricao;
}

    // Atualiza um carro existente
    function updateCar(){

        const titulo = document.getElementById("titulo").value;
        const imagem = document.getElementById("imagem").value;
        const preco = document.getElementById("preco").value;
        const descricao = document.getElementById("descricao").value;
        const updatedCar = {
            titulo,
            imagem,
            preco: Number(preco),
            descricao
        };

    fetch(`http://localhost:3000/cars/${editingCarId}`,{
        method:"PUT",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify(updatedCar)
    })
        .then(res=>res.json())
        .then(data=>{
            console.log("Carro atualizado",data);
            editingCarId = null;
            location.reload();
    })
    .catch(err=>console.error(err));
}

    function deleteCar(id) {
        console.log("Excluindo carro ", id);

        fetch(`http://localhost:3000/cars/${id}`, {
            method: 'DELETE'
        })
        .then(response => {
            if (response.ok) {
                console.log('Carro excluído com sucesso');
                location.reload();
            } else {
                console.error('Erro ao excluir carro');
            }
        })
        .catch(error => console.error('Erro ao excluir carro:', error));
    }

// AREA DO USUARIO

    if (user) {
        document.getElementById("userInfo").innerHTML = `Bem-vindo ${user.nome}`;
    };

    if (user) {
        document.getElementById("login").innerHTML = `<a href="./login.html">Sair</a>`;
        document.getElementById("register").style.display = "none";
    };

    function logOut() {
        localStorage.removeItem("userLog");
        window.location.href = "./login.html";
    };

    if(!user){ document.getElementById("btnSubmit").disabled = true;
        document.getElementById("btnSubmit"). textContent = "Você precisa estar logado para anunciar";
        }