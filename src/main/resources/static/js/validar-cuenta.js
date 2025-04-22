document.addEventListener('DOMContentLoaded', function() {
    const validarForm = document.getElementById('validarForm');

    if (validarForm) {
        validarForm.addEventListener('submit', async function (event) {
            const email = document.getElementById('email').value;

            if (!validateEmail(email)) {
                event.preventDefault();
                showError('email', 'Por favor, ingrese un correo electrónico válido');
            }
            try {
                const response = await fetch('/api/auth/resend-verification', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({email}),
                });

                if (response.ok) {
                    // Mostrar mensaje de éxito
                    alert('Se ha enviado un código de verificación a tu correo electrónico.');
                    window.location.href = '/api/auth/verificar'; // Redirige a la página de verificación
                } else {
                    // Manejar errores del servidor
                    const errorData = await response.json();
                    showError('email', errorData.message || 'Error al enviar el código de verificación.');
                }
            } catch (error) {
                console.error('Error en la solicitud:', error);
                showError('email', 'Ocurrió un error inesperado. Inténtalo de nuevo.');
            }

        });
    }
});

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