/*
Pendiente
*/
let personas;
let divPersonas = document.getElementById("divPersonas");

// Función para cargar el JSON

async function cargarJSON() {
    const respuesta = await fetch("js/personas.json");
    personas = await respuesta.json();
    console.log(personas);

    for(let i = 0; i < personas.length; i++){
        divPersonas.innerText += personas [i].nombre + "\n";
        // Innertext permite definir el texto que se muestra en el div

    }

}
// LLamada de la función
cargarJSON();