document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');

    if (loginForm) {
        loginForm.addEventListener('submit', async function (event) {
            event.preventDefault(); // Importante: evita que el formulario se envíe de forma tradicional

            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            // Validaciones básicas
            let isValid = true;

            if (!validateEmail(email)) {
                showError('email', 'Por favor, ingrese un correo electrónico válido');
                isValid = false;
            }

            if (password.length < 6) {
                showError('password', 'La contraseña debe tener al menos 6 caracteres');
                isValid = false;
            }

            if (!isValid) {
                return; // Detiene la ejecución si hay errores
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
                    const data = await response.json();
                    // Guardar el token en localStorage
                    localStorage.setItem('token', data.token);
                    // Redireccionar al usuario
                    window.location.href = '/home';
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