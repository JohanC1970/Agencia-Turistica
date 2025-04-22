document.addEventListener('DOMContentLoaded', function() {
    const codigoInputs = document.querySelectorAll('.codigo-input');
    const codigoCompleto = document.getElementById('codigoCompleto');
    const verificarForm = document.getElementById('verificarForm');
    const reenviarCodigo = document.getElementById('reenviarCodigo');

    // Obtener el email almacenado
    const emailInput = document.querySelector('input[name="email"]');
    let email = emailInput ? emailInput.value : '';

    // Si no hay email en el input oculto, buscarlo en sessionStorage
    if (!email) {
        email = sessionStorage.getItem('verificationEmail');

        // Si encontramos el email en sessionStorage, actualizar el campo oculto
        if (email && emailInput) {
            emailInput.value = email;
        }
        // Si no hay un campo oculto, pero sí tenemos email, crearlo
        else if (email && verificarForm && !emailInput) {
            const newEmailInput = document.createElement('input');
            newEmailInput.type = 'hidden';
            newEmailInput.name = 'email';
            newEmailInput.value = email;
            verificarForm.appendChild(newEmailInput);
        }
    }

    console.log('Email para verificación:', email);

    // Mostrar el email en la página para que el usuario sepa dónde se enviará el código
    const emailDisplay = document.getElementById('emailDisplay');
    if (emailDisplay && email) {
        emailDisplay.textContent = email;
    }

    // Función para validar y enviar el formulario
    if (verificarForm) {
        verificarForm.addEventListener('submit', async function (event) {
            event.preventDefault();

            const codigo = codigoCompleto.value;

            if (codigo.length !== 6) {
                mostrarError('Por favor, ingrese el código completo de 6 dígitos');
                return;
            }

            if (!email) {
                mostrarError('No se pudo determinar el correo electrónico. Por favor, vuelva a la página anterior.');
                return;
            }

            console.log('Enviando verificación para:', email, 'con código:', codigo);

            try {
                const response = await fetch('/api/auth/verify', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        email: email,
                        codigo: codigo
                    }),
                });

                console.log('Respuesta del servidor:', response.status);

                if (response.ok) {
                    // Limpiar el email almacenado, ya no es necesario
                    sessionStorage.removeItem('verificationEmail');

                    alert('Cuenta verificada exitosamente.');
                    window.location.href = '/api/auth/login';
                } else {
                    // Intentar obtener el mensaje de error
                    let errorMessage = 'Error al verificar el código.';
                    try {
                        const errorData = await response.json();
                        errorMessage = errorData.message || errorMessage;
                    } catch (e) {
                        console.error('No se pudo parsear la respuesta de error', e);
                    }

                    mostrarError(errorMessage);
                }
            } catch (error) {
                console.error('Error en la solicitud:', error);
                mostrarError('Ocurrió un error inesperado. Inténtalo de nuevo.');
            }
        });
    }

    // Resto del código para reenviar códigos...
    // ...
});

// Función para mostrar errores
function mostrarError(mensaje) {
    const errorDiv = document.getElementById('errorMensaje');

    if (errorDiv) {
        errorDiv.textContent = mensaje;
        errorDiv.style.display = 'block';
    } else {
        console.error('No se encontró un contenedor para mostrar el mensaje de error.');
    }
}