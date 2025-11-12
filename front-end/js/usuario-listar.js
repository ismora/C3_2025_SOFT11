const tablaUsuarios = document.getElementById("tblUsuarios").querySelector("tbody");

async function cargarTabla() {
    fetch("http://localhost:3000/usuarios", {
        method: "GET",
        headers: {
            "Content-Type": "Application/json"
        }
    }).then(response => response.json()
    ).then(listaUsuarios => {
        tablaUsuarios.innerHTML = ""; // Limpiar la tabla
        listaUsuarios.forEach(usuario => {
            const fila = document.createElement("tr");
            
            let informacionCertificaciones = "";
            usuario.certificaciones.forEach(certificacion =>{
                informacionCertificaciones += certificacion.nombre + " en la institución: " + certificacion.institucion + "<br>";
            });

            // `: Comilla francesa, permite utilizar variables o expresiones en un string. Por ejemplo dentro de de la fila crear la celda (td) con lo datos de usuario traidos de la BD (interpolación de variables: Insertar variables o expresiones directamente dentro de una cadena utilizando la sintaxis ${}) 
            fila.innerHTML = `
                <td> ${usuario.nombre} </td>
                <td> ${usuario.correo} </td>
                <td> ${usuario.cedula} </td>
                <td> ${usuario.celular} </td>
                <td> ${informacionCertificaciones} </td>
                `;
            tablaUsuarios.appendChild(fila); // Agregar la fila creada en la tabla
        })
    }).catch(error => {
        console.log(error);
    });
}

cargarTabla();