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
                window.location.href = '/Home/Login'; // Redirigir si no hay sesión
            } else {
                const name = data.find(claim => claim.type === 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name');
                const emailAddress = data.find(claim => claim.type === 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress');

                document.getElementById('name').textContent = name ? name.value : 'Nombre no encontrado';
                document.getElementById('emailaddress').textContent = emailAddress ? emailAddress.value : 'Correo electrónico no encontrado';

                initializeApp(); // Inicializar la aplicación si el usuario está autenticado
            }
        })
        .catch(error => {
            console.error('Error al obtener los datos de sesión:', error);
            window.location.href = '/Home/Login'; // Manejar errores de sesión
        });
}

function initializeApp() {
    document.querySelectorAll('.botoesFetch').forEach(button => {
        button.addEventListener('click', () => {
            const url = button.getAttribute('data-url');
            const target = button.getAttribute('data-target');
            const type = button.getAttribute('data-type');

            fetchDataAndDisplay(url, target, type);
        });
    });

    document.getElementById('localidadForm').addEventListener('submit', event => {
        event.preventDefault();
        //document.querySelector("#resultLocalidades").innerHTML = "";
        const idLocalidad = document.getElementById('idLocalidad').value;
        const url = `https://localhost:7282/ControladorLocalidad/ObtenerLocalidad/${idLocalidad}`;
        fetchLocalidad(url, 'resultLocalidad');
    });
}

function fetchDataAndDisplay(url, target, type) {
    // Limpiar todos los resultados anteriores
    document.getElementById('resultLocalidades').innerHTML = '';
    document.getElementById('resultLocalidad').innerHTML = '';
    document.getElementById('resultServicios').innerHTML = '';

    // Realizar la solicitud fetch y mostrar los nuevos datos
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('No se pudo conectar con la API');
            }
            return response.json();
        })
        .then(data => {
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
                    html += `
                        <li class="fade-in">
                            ${item.idLocalidad} - ${item.nombreLocalidad}
                        </li>
                    `;
                }
            });
            html += '</ul>';

            const resultElement = document.getElementById(target);
            resultElement.innerHTML = html;
            void resultElement.offsetWidth; // Forzar reflow para animaciones CSS
        })
        .catch(error => console.error('Error:', error));
}


function fetchLocalidad(url, target) {
    console.log('URL de solicitud:', url); // Verificar la URL que estás enviando
    const resultElement = document.getElementById(target);

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('No se pudo conectar con la API');
            }
            return response.json();
        })
        .then(data => {
            console.log('Datos recibidos:', data); // Verificar los datos recibidos
            const html = `
                <ul class="fade-in">
                    <li class="fade-in">
                        ${data.idLocalidad} - ${data.nombreLocalidad}
                        <div class="highlight"></div>
                    </li>
                </ul>
            `;
            resultElement.innerHTML = html;
            void resultElement.offsetWidth; // Forzar reflow para animaciones CSS
        })
        .catch(error => console.error('Error:', error));
}
