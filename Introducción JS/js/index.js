// Guardar los inputs
let txtPeso = document.getElementById("txtPeso");
let txtEstatura = document.querySelector("#txtEstatura");
let btnCalcularIMC = document.getElementById("btnCalcularIMC");

let parrafoResultado = document.querySelector("#sctResultadoIMC p");

// Variable: Espacio de memoria en la computadora, en donde un programa almacena un dato que puede o no cambiar durante la ejecución.  

// Forma incorrecta de crear variables.
/*
var nombrePerro = "Firulais";
var nombreGato; 
nombreGato = "Michi";
*/

// Forma adecuada de crear variables.
let nombrePerro = "Firulais"; // let: Variable que puede cambiar su valor durante la ejecución de un programa.
console.log(nombrePerro);

let nombreGato; 
nombreGato = "Michi";
console.log(nombreGato);

let numeroDos = 2;
console.log(numeroDos);

//Constante: Valor que no cambia durante la ejecución de un programa. 

const PI = 3.14;
console.log(PI);

const gravedad = 9.81;
console.log(gravedad);

// Función: Bloque de código reutilizable que realiza una tarea específica.

/* Crear una función para calcular el IMC con la siguiente fórmula:
IMC = peso / estatura^2
Mostrar en la consola un mensaje que diga "El IMC es: --"
Datos de prueba en kg       m       IMC
                    80      1.7     27.7
                    60      1.8     18.5
*/

function calcularIMC() {
    //let imc = peso / (estatura * estatura);
    let peso = txtPeso.value;
    let estatura = txtEstatura.value;
    if(validarCamposVacios()===false){

        let imc = peso / Math.pow(estatura, 2);
        parrafoResultado.innerText = imc.toFixed(2); //Mostrar el resultado en el HTML > sección > p
    }

    else{
        //parrafoResultado.innerText = "Por favor complete los valores en los campos vacios";
        //alert("Por favor complete los valores en los campos vacios"); Esto está prohibido utilizarlo en el curso
        Swal.fire({
            icon: "warning",
            title: "No se pudo calcular el IMC",
            text: "Por favor revise los campos resaltados",
        });
    }
}
function validarCamposVacios() {
    let error = false; // Por defecto se inicializa  en false asumiendo que no hay errores
    if (txtPeso.value === "") {
        txtPeso.classList.add("input-error");
        error = true;
    }
    else {
        txtPeso.classList.remove("input-error");
    }
    if (txtEstatura.value === "") {
        txtEstatura.classList.add("input-error");
        error = true;
    }
    else {
        txtEstatura.classList.remove("input-error");
    }
        return error;
    }


//console.log("El IMC es: ", calcularIMC(80, 1.7));
//console.log("El IMC es: ", calcularIMC(60, 1.8));

/* Crear una función para calcular el área de un rectángulo
Datos de prueba:    base    altura      área
                    5       3           15
                    4                   16 
                    ""      2           Error
                    0       2           Error
*/

function areaRectangulo(base, altura) {
    //Asignar altura = base si solo hay un dato de entrada
    if (altura === undefined) {
        altura = base;
    }
    else if (typeof base !== "number" || typeof altura !== "number" || base <= 0 || altura <= 0) {
        return "Error: Ambos datos deben ser números positivos mayores que cero.";
    }   
    return base * altura;
}

console.log(areaRectangulo(5, 3));
console.log(areaRectangulo(4));
console.log(areaRectangulo("", 2));
console.log(areaRectangulo(2, "2"));
console.log(areaRectangulo(2, 0));

//console.log(5 == "5"); //True (dato1 es igual(==) dato2 en valor pero no en tipo de dato)
//console.log(5 === "5"); //False (tipo(dato1) es diferente(===) tipo(dato2))


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

//calcularIMC(80, 1.7);
//calcularIMC(60, 1.8);

btnCalcularIMC.addEventListener("click", calcularIMC);