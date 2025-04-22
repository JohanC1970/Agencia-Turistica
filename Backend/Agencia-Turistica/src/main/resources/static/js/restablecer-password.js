document.addEventListener('DOMContentLoaded', function() {
    const cambiarPasswordForm = document.getElementById('cambiarPasswordForm');

    // Obtener el email de la URL o de sessionStorage
    const urlParams = new URLSearchParams(window.location.search);
    const email = urlParams.get('email') || sessionStorage.getItem('recoveryEmail');

    if (!email) {
        alert('No se pudo determinar el correo electrónico. Por favor, reinicie el proceso de recuperación.');
        window.location.href = '/api/auth/recuperar-password';
        return;
    }

    // Agregar un campo oculto con el email si no existe
    if (!document.querySelector('input[name="email"]')) {
        const emailInput = document.createElement('input');
        emailInput.type = 'hidden';
        emailInput.name = 'email';
        emailInput.value = email;
        cambiarPasswordForm.appendChild(emailInput);
    } else {
        document.querySelector('input[name="email"]').value = email;
    }

    if (cambiarPasswordForm) {
        cambiarPasswordForm.addEventListener('submit', async function (event) {
            event.preventDefault();

            const nuevaPassword = document.getElementById('nueva_contrasena').value;
            const confirmarPassword = document.getElementById('confirmar_contrasena').value;

            // Validaciones básicas
            if (!nuevaPassword || nuevaPassword.length < 6) {
                showError('nueva_contrasena', 'La contraseña debe tener al menos 6 caracteres');
                return;
            }

            if (nuevaPassword !== confirmarPassword) {
                showError('confirmar_contrasena', 'Las contraseñas no coinciden');
                return;
            }

            try {
                const response = await fetch('/api/auth/change-password', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        email: email,
                        nuevaPassword: nuevaPassword
                    }),
                });

                if (response.ok) {
                    alert('Contraseña cambiada con éxito. Ahora podrás iniciar sesión con tu nueva contraseña.');
                    sessionStorage.removeItem('recoveryEmail'); // Limpiar datos guardados
                    window.location.href = '/api/auth/login';
                } else {
                    const errorData = await response.json().catch(() => ({ message: 'Error en el servidor' }));
                    showError('nueva_contrasena', errorData.message || 'Error al cambiar la contraseña.');
                }
            } catch (error) {
                console.error('Error en la solicitud:', error);
                showError('nueva_contrasena', 'Ocurrió un error inesperado. Inténtalo de nuevo.');
            }
        });
    }

    // Función para mostrar errores
    function showError(inputId, message) {
        const input = document.getElementById(inputId);
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;

        // Eliminar mensajes de error existentes
        const existingError = input.parentNode.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }

        input.parentNode.appendChild(errorDiv);
        input.style.borderColor = '#e74c3c';
    }
});