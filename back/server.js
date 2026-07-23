
const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());
const port = 3000;
const fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname, '../database/cars.json');
const usersFilePath = path.join(__dirname, '../database/users.json');


app.get("/cars", (req, res) => {

    fs.readFile(filePath, "utf-8", (err, data) => {
        if (err) {
            return res.status(500).json({ erro: "Erro ao ler arquivo" });
        }
        const cars = JSON.parse(data);
        res.json(cars);
    })
});

app.get("/cars/:id", (req, res) => {

    fs.readFile(filePath, "utf-8", (err, data) => {
        if (err) {
            return res.status(500).json({ erro: "Erro ao ler arquivo" });
        }
        const cars = JSON.parse(data);
        const id = parseInt(req.params.id);
        const car = cars.find(c => c.id === id);
        if (!car) {
            return res.status(404).json({ erro: "Carro não encontrado" });
        }
        res.json(car);
    })
});

app.post("/cars", (req, res) => {

    fs.readFile(filePath, "utf-8", (err, data) => {
        if (err) {
            return res.status(500).json({ erro: "Erro ao ler arquivo" });
        }
        const cars = JSON.parse(data);
        const newCar = req.body;
        const lastId = cars.length > 0 ? cars[cars.length - 1].id : 0;
        newCar.id = lastId + 1;
        cars.push(newCar);

        fs.writeFile(filePath, JSON.stringify(cars, null, 2), (err) => {
            if (err) {
                return res.status(500).json({ erro: "Erro ao escrever arquivo" });
            }
            res.status(201).json(newCar);
        });
    });
});

app.delete("/cars/:id", (req, res) => {

    fs.readFile(filePath, "utf-8", (err, data) => {
        if (err) {
            return res.status(500).json({erro: "Erro ao ler o arquivo"});
        }
        const cars = JSON.parse(data);
        const id = parseInt(req.params.id);
        const updatedCars = cars.filter(c => c.id === id);

        if (updatedCars.length === cars.length) {
            return res.status(404).json({erro: "Carro não encontrado"});
        }
        cars.splice(cars.findIndex(c => c.id === id), 1);

        fs.writeFile(filePath, JSON.stringify(cars, null, 2), (err) => {
            if (err) {
                return res.status(500).json({erro: "Erro ao escrever o arquivo"});
            }
            res.json({mensagem: "Carro removido com sucesso"});
        });
    });
});

app.put("/cars/:id", (req, res) => {

    fs.readFile(filePath, "utf-8", (err, data) => {
        if (err) {
            return res.status(500).json({erro: "Erro ao ler o arquivo"});
        }
        const cars = JSON.parse(data);
        const id = parseInt(req.params.id);
        const carIndex = cars.findIndex(c => c.id === id);

        if (carIndex === -1) {
            return res.status(404).json({erro: "Carro não encontrado"});
        }

        const updatedCar = {...cars[carIndex], ...req.body};
        cars[carIndex] = updatedCar;

        fs.writeFile(filePath, JSON.stringify(cars, null, 2), (err) => {
            if (err) {
                return res.status(500).json({erro: "Erro ao escrever o arquivo"});
            }
            res.json({mensagem: "Carro atualizado com sucesso",
                carro: updatedCar });
        });
    });
});

app.listen(port, () => {
    console.log("Servidor rodando na porta " + port);
});

/* AREA DOS USUARIOS */

app.post("/register", (req, res) => {
    fs.readFile(usersFilePath, "utf-8", (err, data) => {
        if (err) {
            return res.status(500).json({ erro: "Erro ao ler arquivo" });
        }
        const users = JSON.parse(data);
        const newUser = req.body;
        if (!newUser.name || !newUser.email || !newUser.password) {
            return res.status(400).json({ erro: "Todos os campos são obrigatórios" });
        }
        if (users.some(user => user.email === newUser.email)) {
            return res.status(400).json({ erro: "E-mail já cadastrado" });
        }
        const lastId = users.length > 0 ? users[users.length - 1].id : 0;
        newUser.id = lastId + 1;
        users.push(newUser);

        fs.writeFile(usersFilePath, JSON.stringify(users, null, 2), (err) => {
            if (err) {
                return res.status(500).json({ erro: "Erro ao escrever arquivo" });
            }
            res.status(201).json({ mensagem: "Usuário cadastrado com sucesso"});
        });
    });
});

app.get("/users", (req, res) => {
    fs.readFile(usersFilePath, "utf-8", (err, data) => {
        if (err) {
            return res.status(500).json({ erro: "Erro ao ler arquivo" });
        }
        const users = JSON.parse(data);
        res.json(users);
    })
});