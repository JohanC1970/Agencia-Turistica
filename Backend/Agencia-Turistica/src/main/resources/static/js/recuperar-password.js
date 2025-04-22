document.addEventListener('DOMContentLoaded', function() {
    const recuperarForm = document.getElementById('recuperarForm');

    if (recuperarForm) {
        recuperarForm.addEventListener('submit', async function (event) {
            event.preventDefault();

            const email = document.getElementById('email').value;

            if (!validateEmail(email)) {
                showError('email', 'Por favor, ingrese un correo electrónico válido');
                return;
            }

            try {
                const response = await fetch('/api/auth/recover', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email }),
                });

                if (response.ok) {
                    // Mostrar mensaje de éxito
                    alert('Se ha enviado un código de recuperación a tu correo electrónico.');

                    // Almacenar el email para la siguiente página
                    sessionStorage.setItem('recoveryEmail', email);

                    // Redirigir a la página de verificación de código
                    window.location.href = '/api/auth/verificar-codigo-recuperacion';
                } else {
                    // Manejar errores del servidor
                    const errorData = await response.json().catch(() => ({ message: 'Error en el servidor' }));
                    showError('email', errorData.message || 'Error al solicitar la recuperación.');
                }
            } catch (error) {
                console.error('Error en la solicitud:', error);
                showError('email', 'Ocurrió un error inesperado. Inténtalo de nuevo.');
            }
        });
    }
});

// Asegúrate de que estas funciones estén implementadas
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function showError(inputId, message) {
    const input = document.getElementById(inputId);
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;

    // Remove any existing error message
    const existingError = input.parentNode.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }

    input.parentNode.appendChild(errorDiv);
    input.style.borderColor = '#e74c3c';
}