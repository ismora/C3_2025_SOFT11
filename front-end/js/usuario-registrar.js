const inputNombre = document.getElementById("txtNombre");
const inputCedula = document.getElementById("txtCedula");
const inputContrasenia = document.getElementById("txtContrasenia");
const inputCorreo = document.getElementById("txtCorreo");
const inputCelular = document.querySelector("#txtCelular");
const btnGuardar = document.querySelector("#btnGuardar");

const inputsRequeridos = document.querySelectorAll("input[required]"); // Seleccionar todos los input obligatorios

const modalExito = new bootstrap.Modal(document.getElementById('successModal'));

function validar() {
    let error = false;
    for (let i = 0; i < inputsRequeridos.length; i++) {
        if (inputsRequeridos[i].value == "") {
            error = true;
            Swal.fire({
                icon: "warning",
                title: "No se puede registrar el usuario",
                text: "Por favor complete todos los campos.",
                confirmButtonText: "Aceptar"
            });
        }
    }
    if (error == false) {
        registrarUsuario();
    }
}

function registrarUsuario() {
    const datosNuevoUsuario = {
        correo: inputCorreo.value,
        nombre: inputNombre.value,
        cedula: inputCedula.value,
        celular: inputCelular.value,
        contrasenia: inputContrasenia.value
    };
    fetch("http://localhost:3000/usuarios", {
        method: "POST",
        headers: {
            "Content-Type": "Application/json"
        },
        body: JSON.stringify(datosNuevoUsuario)
    }).then(response => {
        if (!response.ok) {
            console.log("No se pudo registrar el usuario");
        } else {
            modalExito.show();
        }
    }).catch(error => {
        console.log(error);
    });
}

btnGuardar.addEventListener("click", validar);