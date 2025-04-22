document.addEventListener('DOMContentLoaded', function() {
    const registroForm = document.getElementById('registroForm');

    if (registroForm) {
        registroForm.addEventListener('submit', async function (event) {
            let isValid = true;

            // Validar nombre
            const nombre = document.getElementById('nombre').value;
            if (nombre.trim() === '') {
                showError('nombre', 'El nombre es obligatorio');
                isValid = false;
            }

            // Validar apellidos
            const apellidos = document.getElementById('apellidos').value;
            if (apellidos.trim() === '') {
                showError('apellidos', 'Los apellidos son obligatorios');
                isValid = false;
            }

            // Validar identificación
            const identificacion = document.getElementById('identificacion').value;
            if (identificacion.trim() === '') {
                showError('identificacion', 'La identificación es obligatoria');
                isValid = false;
            }

            // Validar email
            const email = document.getElementById('email').value;
            if (!validateEmail(email)) {
                showError('email', 'Por favor, ingrese un correo electrónico válido');
                isValid = false;
            }

            // Validar contraseña
            const password = document.getElementById('password').value;
            if (password.length < 6) {
                showError('password', 'La contraseña debe tener al menos 6 caracteres');
                isValid = false;
            }

            // Validar confirmación de contraseña
            const confirmPassword = document.getElementById('confirmPassword').value;
            if (password !== confirmPassword) {
                showError('confirmPassword', 'Las contraseñas no coinciden');
                isValid = false;
            }

            // Validar fecha de nacimiento
            const fechaNacimiento = document.getElementById('fechaNacimiento').value;
            if (fechaNacimiento === '') {
                showError('fechaNacimiento', 'La fecha de nacimiento es obligatoria');
                isValid = false;
            } else {
                const birthDate = new Date(fechaNacimiento);
                const today = new Date();
                const age = today.getFullYear() - birthDate.getFullYear();
                if (age < 18) {
                    showError('fechaNacimiento', 'Debe ser mayor de 18 años');
                    isValid = false;
                }
            }

            // Validar teléfono
            const telefono = document.getElementById('telefono').value;
            if (!validatePhone(telefono)) {
                showError('telefono', 'Por favor, ingrese un número de teléfono válido');
                isValid = false;
            }

            if (!isValid) {
                event.preventDefault();
            }

            try {
                const response = await fetch('/api/auth/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        nombre,
                        apellidos,
                        identificacion,
                        email,
                        password,
                        fechaNacimiento,
                        telefono
                    }),
                });

                if (response.ok) {
                    // Mostrar mensaje de éxito
                    alert('Registro exitoso. Por favor, verifica tu correo electrónico.');
                    window.location.href = '/api/auth/verificar'; // Redirige a la página de verificación
                } else {
                    // Manejar errores del servidor
                    const errorData = await response.json();
                    showError('email', errorData.message || 'Error al registrar el usuario.');
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

function validatePhone(phone) {
    // Acepta números con o sin guiones, espacios o paréntesis
    const re = /^[\d\s\-()]{7,15}$/;
    return re.test(phone);
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