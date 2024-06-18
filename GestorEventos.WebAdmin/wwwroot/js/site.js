document.addEventListener('DOMContentLoaded', () => {
    checkAuthentication();
});

function checkAuthentication() {
    fetch('/api/session/userdata')
        .then(response => {
            if (!response.ok) {
                throw new Error('No se pudo obtener los datos de sesión');
            }
            return response.json();
        })
        .then(data => {
            if (data.length === 0) {
                // Si no hay datos de sesión, redirigir a la página de inicio de sesión
                window.location.href = '/Home/Test';
            } else {
                console.log('Datos de sesión:', data);
                // Mostrar los datos de sesión en la interfaz
                const name = data.find(claim => claim.type === 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name');
                const emailAddress = data.find(claim => claim.type === 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress');

                document.getElementById('name').textContent = name ? name.value : 'Nombre no encontrado';
                document.getElementById('emailaddress').textContent = emailAddress ? emailAddress.value : 'Correo electrónico no encontrado';

                // Inicializar la aplicación solo si el usuario está autenticado
                initializeApp();
            }
        })
        .catch(error => {
            console.error('Error al obtener los datos de sesión:', error);
            // En caso de error, redirigir a la página de inicio de sesión
            window.location.href = '/Home/Test';
        });
}

function initializeApp() {
    document.querySelectorAll('button[data-url]').forEach(button => {
        button.addEventListener('click', () => {
            const url = button.getAttribute('data-url');
            const target = button.getAttribute('data-target');
            const type = button.getAttribute('data-type');

            fetchDataAndDisplay(url, target, type);
        });
    });

    document.getElementById('localidadForm').addEventListener('submit', event => {
        event.preventDefault();

        document.querySelector("#resultLocalidades").innerHTML = "";
        const idLocalidad = document.getElementById('idLocalidad').value;
        const url = `https://localhost:7282/ControladorLocalidad/ObtenerLocalidad/${idLocalidad}`;
        fetchLocalidad(url, 'resultLocalidad');
    });
}

function fetchDataAndDisplay(url, target, type) {
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('No se pudo conectar con la api');
            }
            return response.json();
        })
        .then(data => {
            console.log(data); // Necesito ver y controlar el json

            let html = '<ul class="fade-in">';
            data.forEach(item => {
                if (type === 'servicios') {
                    html += `
                        <li class="fade-in">
                            ${item.idServicio} - ${item.descripcion}
                            <div class="highlight">$${item.precioServicio}</div>
                        </li>
                    `;
                } else if (type === 'localidades') {
                    document.querySelector("#resultLocalidad").innerHTML = "";
                    html += `
                        <li class="fade-in">
                            ${item.idLocalidad} - ${item.nombreLocalidad}
                        </li>
                    `;
                }
            });
            html += '</ul>';

            const resultElement = document.getElementById(target);
            resultElement.innerHTML = '';
            resultElement.innerHTML = html;

            void resultElement.offsetWidth;
        })
        .catch(error => console.error('Error:', error));
}

function fetchLocalidad(url, target) {
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('No se pudo conectar con la api');
            }
            return response.json();
        })
        .then(data => {
            console.log(data);

            const resultElement = document.getElementById(target);
            resultElement.innerHTML = '';
            const html = `
                <ul class="fade-in">
                    <li class="fade-in">
                        ${data.idLocalidad} - ${data.nombreLocalidad}
                        <div class="highlight"></div>
                    </li>
                </ul>
            `;
            resultElement.innerHTML = html;
            void resultElement.offsetWidth;
        })
        .catch(error => console.error('Error:', error));
}
