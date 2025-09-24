//Guardar los inputs de html

let txtPeso = document.getElementById("txtPeso");
//segunda forma usando clases CSS
// let txtPeso = document.querySelector("#txtPeso");

let txtAltura = document.getElementById("txtAltura");
let btnCalcularIMC = document.getElementById("btnCalcularIMC");

let parrafoResultado = document.querySelector("#sctResultadoIMC p")

// Variable: Espacio de memoria en la computadora, en donde un programa almacena un dato que puede o no cambiar durante la ejecución.  

// Forma incorrecta de crear variables.


// Forma adecuada de crear variables.
let nombreGatoUno = "Prince Artemins";
console.log(nombreGatoUno)

let nombreGatoDos = "May";
console.log(nombreGatoDos)

//Constante: Valor que no cambia durante la ejecución de un programa. 

const nombreGatoTres = "Peter Pancho";
console.log(nombreGatoTres)


// Función: Bloque de código reutilizable que realiza una tarea específica.


/* Crear una función para calcular el IMC con la siguiente fórmula:
IMC = peso / estatura^2
Mostrar en la consola un mensaje que diga "El IMC es: --"
Datos de prueba en kg       m       IMC
                    80      1.7     27.7
                    60      1.8     18.5
*/


function calcularIMC(){
    
    let peso = txtPeso.value;
    let altura = txtAltura.value;

    if (validarCamposVacios() === false){
        let imc = peso / Math.pow(altura,2);
        parrafoResultado.innerText = "El IMC es: " + imc.toFixed(2);
    } else {
        Swal.fire({
            title: "No se pudo calcular el IMC",
            text: "Porfavor revise los campos resaltados",
            icon: "warning",
        });
    }
}

function validarCamposVacios(){
    let error = false;

    if (txtPeso.value === "") {
        txtPeso.classList.add("input-error");
        error = true;
    } else {
        txtPeso.classList.remove("input-error");
    }
    if (txtAltura.value == "") {
        txtAltura.classList.add("input-error");
        error = true;
    } else {
        txtAltura.classList.remove("input-error");
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

function areaRectangulo(base, altura){
    // Asignar altura = base si solo hay un dato de entrada
    if (altura === undefined){
        altura = base;
    }
    else if (typeof base != "number" || typeof altura != "number" || base <= 0 || altura <= 0){
        return "Error: Ambos datos deben ser números"

    }
    return base * altura;
 }


console.log(5 == "5"); // True (dato1 es igual (==) al dato2)
console.log( 5 === "5");  // False (tipo(dato1) es igual (==) al tipo(dato2) y dato1 es igual (==) al dato2)

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