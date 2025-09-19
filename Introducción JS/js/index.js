//guardar los inputs
let txtPeso = document.getElementById("txtPeso");
let txtEstatura = document.querySelector("#txtEstatura");
let btnCalcularIMC = document.getElementById("btnCalcularIMC");

let parrafoResultado = document.querySelector("#sctResultadoIMC p");
// Variable: Espacio de memoria en la computadora, en donde un programa almacena un dato que puede o no cambiar durante la ejecución.  

// Forma incorrecta de crear variables.
/*
var nombrePerro = "Mia"
var nombreGato;
nombreGato = "Stella"
*/

// Forma adecuada de crear variables.
/*let nombrePerro = "Mia"
let nombreGato;
nombreGato = "Stella"

let numeroDos = 2;
console.log(nombrePerro)
console.log(nombreGato)
console.log(numeroDos)
*/
let nombreBanda = "Oasis"
let nombreCancion = "Slide Away"
let clasificacionBanda;
clasificacionBanda = "1"
console.log(nombreBanda)
console.log(nombreCancion)
console.log(clasificacionBanda)
//Constante: Valor que no cambia durante la ejecución de un programa. 
const PI = 3.14;
console.log(PI);

const edadMinima = 18;
console.log(edadMinima);
const horasDia = 24;
console.log(horasDia);
const distanciaSolMillas = 9000000;
console.log(distanciaSolMillas);

// Función: Bloque de código reutilizable que realiza una tarea específica.


/* Crear una función para calcular el IMC con la siguiente fórmula:
IMC = peso / estatura^2
Mostrar en la consola un mensaje que diga "El IMC es: --"
Datos de prueba en kg       m       IMC
                    80      1.7     27.7
                    60      1.8     18.5
*/
function calcularIMC() {
    let peso = txtPeso.value;
    let estatura = txtEstatura.value;

    if(validarCamposVacios() === false){
        let imc = peso / Math.pow(estatura, 2);
        parrafoResultado.innerText = imc.toFixed(2);
    }
    else{
        Swal.fire({
            icon: "warning",
            title: "No se pudo calcular el IMC",
            text: "Por favor revise los campos resaltados",
            footer: '<a href="#">Why do I have this issue?</a>'
        });
    }
}
function validarCamposVacios(){
    let error = false; // por defecto se inicializa en false asumiento que no hay errores
    if(txtPeso.value === ""){
        txtPeso.classList.add("input-error");
        error = true;
    }
    else{
        txtPeso.classList.remove("input-error");

    }
    if(txtEstatura.value === ""){
        txtEstatura.classList.add("input-error");
        error = true;
    }
    else{
        txtEstatura.classList.remove("input-error");
    }
    return error;
}
/* Crear una función para calcular el área de un rectángulo
Datos de prueba:    base    altura      área
                    5       3           15
                    4                   16 
                    ""      2           Error
                    0       2           Error
*/

function calcularArea(base, altura){
    //Asignar altura =  base si solo hay un dato de entrada
    if(altura === undefined){
    altura = base;
    }
    else if (typeof base!= "number" || typeof altura != "Number"|| base <= 0 || altura <= 0){
        return "Error: Ambos datos deben ser números positivos"

    }
    return base * altura;
}
console.log("Área del rectángulo = ", calcularArea(5, 3));
console.log("Área del rectángulo = ", calcularArea("", 3));

/*
console.log(5 == "5");
console.log(5 === "5");

/*
Ejercicio 1: Crear una función para convertir temperaturas entre Celsius y Fahrenheit.

Diseñar una función llamada convertirTemperatura que convierta una temperatura entre grados Celsius (°C) y Fahrenheit (°F) según la unidad solicitada. 

Datos de prueba:    Temperatura     Escala      Resultado esperado
                    25              F           77
                    32              C           0
                    "100"           C           Error
                    0               a           Error
*/


/*
Ejercicio 2: Crear una función para verificar si una palabra es un palíndromo

Diseñar una función llamada esPalindromo que determine si una palabra se lee igual de izquierda a derecha que de derecha a izquierda.

Datos de prueba:    Palabra         Resultado esperado 
                    analina         es palíndromo
                    reconocer       es palíndromo
                    casa            no es palíndromo

Nota: Puede usar split(), reverse(), join() o toLowerCase(), sin embargo, debe investigar su uso.
*/

btnCalcularIMC.addEventListener("click", calcularIMC);