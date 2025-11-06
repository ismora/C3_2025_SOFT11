class CertificacionesApp {
    constructor() {
        this.listaUsuarios = document.getElementById("sltUsuario");
        this.listaCertificaciones = document.getElementById("sltCertificacion");
        this.botonAsociar = document.getElementById("btnAsociar");
        
        this.init();
    }
    
    async init() {
        await this.mostrarUsuarios();
        await this.mostrarCertificaciones();
        this.configurarEventListeners();
    }
    
    configurarEventListeners() {
        this.botonAsociar.addEventListener("click", () => this.asociarCertificacion());
    }
    
    async obtenerDatos(url) {
        try {
            const response = await fetch(url, {
                method: "GET", 
                headers: {"Content-Type": "Application/json"}
            });
            
            if (!response.ok) {
                throw new Error(`Error al obtener datos de ${url}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error("Error:", error);
            return [];
        }
    }
    
    async mostrarUsuarios() {    
        const data = await this.obtenerDatos("http://localhost:3000/usuarios");
        
        this.listaUsuarios.innerHTML = "";
        
        data.forEach(usuario => {
            const opcion = document.createElement("option");
            opcion.value = usuario.cedula;
            opcion.textContent = usuario.nombre;
            this.listaUsuarios.appendChild(opcion);
        });
    }
    
    async mostrarCertificaciones() {
        const data = await this.obtenerDatos("http://localhost:3000/certificaciones");
        
        this.listaCertificaciones.innerHTML = "";
        
        data.forEach(certificacion => {
            const opcion = document.createElement("option");
            opcion.value = certificacion._id;
            opcion.textContent = certificacion.nombre;
            this.listaCertificaciones.appendChild(opcion);
        });
    }
    
    async asociarCertificacion() {
        const datos = {
            cedula: this.listaUsuarios.value,
            certificacionId: this.listaCertificaciones.value
        };
        
        try {
            const response = await fetch("http://localhost:3000/usuarios/agregar-certificacion", {
                method: "PUT",
                headers: {"Content-Type": "Application/json"},
                body: JSON.stringify(datos)
            });
            
            if (!response.ok) {
                throw new Error("No se pudo asociar la certificación");
            }
            
            console.log("Certificación asociada con éxito");
        } catch (error) {
            console.error("Error:", error);
        }
    }
}

// Inicializar la aplicación cuando el DOM esté cargado
document.addEventListener("DOMContentLoaded", () => {
    const app = new CertificacionesApp();
});