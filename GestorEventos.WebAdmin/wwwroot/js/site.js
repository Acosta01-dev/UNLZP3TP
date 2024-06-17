// Please see documentation at https://learn.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

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


fetch('/api/session/userdata')
    .then(response => {
        if (!response.ok) {
            throw new Error('No se pudo obtener los datos de sesión');
        }
        return response.json();
    })
    .then(data => {
        console.log('Datos de sesión:', data);

        // Ejemplo de cómo acceder y utilizar los datos
        const name = data.find(claim => claim.type === 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name');
        //const givenName = data.find(claim => claim.type === 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname');
        //const surname = data.find(claim => claim.type === 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname');
        const emailAddress = data.find(claim => claim.type === 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress');

        // Ejemplo de cómo mostrar los datos en la interfaz
        document.getElementById('name').textContent = name ? name.value : 'Nombre no encontrado';
        //document.getElementById('givenName').textContent = givenName ? givenName.value : 'Nombre no encontrado';
        //document.getElementById('surname').textContent = surname ? surname.value : 'Apellido no encontrado';
        document.getElementById('emailaddress').textContent = emailAddress ? emailAddress.value : 'Correo electrónico no encontrado';
    })
    .catch(error => {
        console.error('Error al obtener los datos de sesión:', error);
    });


