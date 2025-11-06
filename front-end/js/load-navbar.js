document.addEventListener('DOMContentLoaded', function() {
    // Cargar la barra de navegación
    fetch('components/navbar.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('navbar-container').innerHTML = data;
            
            // Después de cargar la navbar, resaltar la página activa
            const currentPage = window.location.pathname.split('/').pop() || 'index.html';
            const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
            
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === currentPage) {
                    link.classList.add('active');
                }
            });
        })
        .catch(error => console.error('Error cargando la barra de navegación:', error));
});