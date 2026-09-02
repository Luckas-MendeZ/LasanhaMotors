fetch('http://localhost:3000/users')
    .then(response => response.json())

fetch('http://localhost:3000/cars')
    
    .then(response => response.json())
    .then(data => {
        cars = data;})

function isOwner(car, user) {
    return car.idDono === user.id};