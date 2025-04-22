document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');

    if (loginForm) {
        loginForm.addEventListener('submit', async function (event) {
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            if (!validateEmail(email)) {
                event.preventDefault();
                showError('email', 'Por favor, ingrese un correo electrónico válido');
            }

            if (password.length < 6) {
                event.preventDefault();
                showError('password', 'La contraseña debe tener al menos 6 caracteres');
            }

            try {
                const response = await fetch('/api/auth/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({email, password}),
                });

                if (response.ok) {
                    // Redirigir al usuario o manejar el éxito
                    const data = await response.json();
                    window.location.href = '/home'; // Cambia la ruta según tu lógica
                } else {
                    // Manejar errores del servidor
                    const errorData = await response.json();
                    showError('password', errorData.message || 'Error al iniciar sesión');
                }
            } catch (error) {
                console.error('Error en la solicitud:', error);
                showError('password', 'Ocurrió un error inesperado. Inténtalo de nuevo.');
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

function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    if (input.type === 'password') {
        input.type = 'text';
    } else {
        input.type = 'password';
    }
}