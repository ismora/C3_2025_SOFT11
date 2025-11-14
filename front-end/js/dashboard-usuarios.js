const dashboardContent = document.getElementById("dashboardContent");
const loadingSpinner = document.getElementById("loadingSpinner");
const errorMessage = document.getElementById("errorMessage");
const errorText = document.getElementById("errorText");
const refreshBtn = document.getElementById("refreshBtn");

// Variables para almacenar datos
let estadisticasGenerales = null;
let topUsuarios = null;

// Función para mostrar/ocultar loading
function mostrarLoading(mostrar) {
    if (mostrar) {
        loadingSpinner.style.display = 'block';
        dashboardContent.style.display = 'none';
        errorMessage.style.display = 'none';
    } else {
        loadingSpinner.style.display = 'none';
        dashboardContent.style.display = 'block';
    }
}

// Función para mostrar error
function mostrarError(mensaje) {
    errorText.textContent = mensaje;
    errorMessage.style.display = 'block';
    dashboardContent.style.display = 'none';
    loadingSpinner.style.display = 'none';
}

// Consultar estadísticas generales
async function consultarEstadisticasGenerales() {
    try {
        const response = await fetch("http://localhost:3000/usuarios/estadisticas-generales", {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const datosGenerales = await response.json();
        return datosGenerales;
    } catch (error) {
        console.error("Error al consultar estadísticas generales:", error);
        throw error;
    }
}

// Consultar top usuarios certificados
async function consultarTopUsuariosCertificados() {
    try {
        const response = await fetch("http://localhost:3000/usuarios/top-usuarios-certificaciones", {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const topUsuariosCertificados = await response.json();
        return topUsuariosCertificados;
    } catch (error) {
        console.error("Error al consultar top usuarios:", error);
        throw error;
    }
}

// Actualizar las tarjetas de estadísticas
function actualizarEstadisticas() {
    if (!estadisticasGenerales) return;

    document.getElementById('totalUsuarios').textContent = estadisticasGenerales.totalUsuarios;
    document.getElementById('usuariosConCertificaciones').textContent = estadisticasGenerales.usuariosConCertificaciones;
    document.getElementById('usuariosSinCertificaciones').textContent = estadisticasGenerales.usuariosSinCertificaciones;
    document.getElementById('porcentajeConCertificaciones').textContent = estadisticasGenerales.porcentajeConCertificaciones + '%';
}

// Actualizar el gráfico de dona
function actualizarGraficoDona() {
    if (!estadisticasGenerales) return;

    const donutChart = document.getElementById('donutChart');
    const donutCenter = document.getElementById('donutCenter');
    const porcentaje = estadisticasGenerales.porcentajeConCertificaciones;

    if (donutChart && donutCenter) {
        donutChart.style.background = `conic-gradient(
            var(--verde) 0% ${porcentaje}%,
            var(--gris) ${porcentaje}% 100%
        )`;
        donutCenter.textContent = porcentaje + '%';
    }

    // Actualizar leyenda
    document.getElementById('legendConCertificaciones').textContent = 
        `Con Certificaciones (${porcentaje}%)`;
    document.getElementById('legendSinCertificaciones').textContent = 
        `Sin Certificaciones (${100 - porcentaje}%)`;
}

// Actualizar lista de top usuarios
function actualizarTopUsuarios() {
    if (!topUsuarios || !Array.isArray(topUsuarios)) return;

    const topUsuariosList = document.getElementById('topUsuariosList');
    if (!topUsuariosList) return;

    topUsuariosList.innerHTML = '';

    topUsuarios.forEach((usuario, index) => {
        const userElement = document.createElement('div');
        userElement.className = 'd-flex align-items-center mb-3 p-3 border rounded';
        
        const avatarColor = index === 0 ? 'var(--naranja)' : 'var(--azul)';
        const avatarText = usuario.nombre ? usuario.nombre.charAt(0) : 'U';
        
        userElement.innerHTML = `
            <div class="ranking-number">${index + 1}</div>
            <div class="user-avatar me-3" style="background-color: ${avatarColor}">${avatarText}</div>
            <div class="flex-grow-1">
                <h6 class="mb-1">${usuario.nombre || 'Sin nombre'}</h6>
                <p class="mb-1 text-muted small">${usuario.correo || 'Sin correo'}</p>
                <div class="d-flex justify-content-between align-items-center">
                    <span class="small">Cédula: ${usuario.cedula || 'N/A'}</span>
                    <span class="user-badge">${usuario.cantidadCertificaciones || 0} certificaciones</span>
                </div>
            </div>
        `;
        
        topUsuariosList.appendChild(userElement);
    });
}

// Actualizar resumen de actividad
function actualizarResumenActividad() {
    if (!estadisticasGenerales || !topUsuarios) return;

    // Calcular promedio de certificaciones
    const promedio = estadisticasGenerales.totalUsuarios > 0 ? 
        (estadisticasGenerales.usuariosConCertificaciones / estadisticasGenerales.totalUsuarios).toFixed(1) : 0;
    
    document.getElementById('promedioCertificaciones').textContent = promedio;

    // Usuario más certificado
    if (topUsuarios.length > 0) {
        const usuarioTop = topUsuarios[0];
        document.getElementById('usuarioMasCertificado').textContent = usuarioTop.nombre || 'N/A';
        document.getElementById('certificacionesUsuarioMasCertificado').textContent = 
            `${usuarioTop.cantidadCertificaciones || 0} certificaciones`;
    }

}

// Cargar todos los datos del dashboard
async function cargarDashboard() {
    mostrarLoading(true);

    try {
        // Consultar datos en paralelo
        const [estadisticas, topUsuariosData] = await Promise.all([
            consultarEstadisticasGenerales(),
            consultarTopUsuariosCertificados()
        ]);

        // Guardar datos
        estadisticasGenerales = estadisticas;
        topUsuarios = topUsuariosData;

        // Actualizar interfaz
        actualizarEstadisticas();
        actualizarGraficoDona();
        actualizarTopUsuarios();
        actualizarResumenActividad();

        mostrarLoading(false);

    } catch (error) {
        console.error('Error al cargar el dashboard:', error);
        mostrarError(`No se pudieron cargar los datos: ${error.message}`);
    }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    // Cargar dashboard al iniciar
    cargarDashboard();

    // Configurar botón de actualización
    if (refreshBtn) {
        refreshBtn.addEventListener('click', cargarDashboard);
    }
});

// Exportar funciones para uso global (si es necesario)
window.cargarDashboard = cargarDashboard;
window.consultarEstadisticasGenerales = consultarEstadisticasGenerales;
window.consultarTopUsuariosCertificados = consultarTopUsuariosCertificados;