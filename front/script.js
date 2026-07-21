console.log("Script carregado");

let cars = [];
let editingCarId = null;

fetch('http://localhost:3000/cars')
    .then(response => response.json())
    .then(data => {
        cars = data;
        const carList = document.getElementById('cars');
        carList.innerHTML = data.map(car => `
            <div>
                <h2>${car.id}</h2>
                <p>Marca: ${car.marca}</p>
                <p>Modelo: ${car.modelo}</p>
                <p>Cor: ${car.cor}</p>
                <p>Ano: ${car.ano}</p>
                <p>Preço: R$ ${car.preco.toFixed(2)}</p>

                <button onclick='deleteCar(${car.id})'>Excluir carro</button>
                <button onclick='editCar(${car.id})'>Editar carro</button>
            </div>
        `).join('');})

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
        const marca = document.getElementById('marca').value;
        const modelo = document.getElementById('modelo').value;
        const cor = document.getElementById('cor').value;
        const ano = document.getElementById('ano').value;
        const preco = document.getElementById('preco').value;

        const newCar = {
            marca,
            modelo,
            cor,
            ano: Number(ano),
            preco: Number(preco)
        };
        
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
        document.getElementById("marca").value = car.marca;
        document.getElementById("modelo").value = car.modelo;
        document.getElementById("cor").value = car.cor;
        document.getElementById("ano").value = car.ano;
        document.getElementById("preco").value = car.preco;
}

    // Atualiza um carro existente
    function updateCar(){

        const marca = document.getElementById("marca").value;
        const modelo = document.getElementById("modelo").value;
        const cor = document.getElementById("cor").value;
        const ano = document.getElementById("ano").value;
        const preco = document.getElementById("preco").value;
        const updatedCar = {
            marca,
            modelo,
            cor,
            ano: Number(ano),
            preco: Number(preco)
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

