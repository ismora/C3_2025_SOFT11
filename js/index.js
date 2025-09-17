/*
Pendiente
*/

let personas;

async function cargarJSON(){
const respuesta = await fetch("js/personas.json")
    personas = await respuesta.json();
    console.log(personas);
}

let divPersonas = document.getElementById("divPersonas")