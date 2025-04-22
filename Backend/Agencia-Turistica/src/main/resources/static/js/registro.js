document.addEventListener('DOMContentLoaded', function() {
    const registroForm = document.getElementById('registroForm');

    if (registroForm) {
        registroForm.addEventListener('submit', async function (event) {
            event.preventDefault();

            // Validar campos (mantén el código de validación que ya tienes)
            // ...

            // Crear el objeto con los datos del formulario
            const formData = {
                id: document.getElementById('identificacion').value,
                nombre: document.getElementById('nombre').value,
                apellidos: document.getElementById('apellidos').value,
                email: document.getElementById('email').value,
                password: document.getElementById('password').value,
                fechaNacimiento: document.getElementById('fechaNacimiento').value,
                telefono: document.getElementById('telefono').value
            };

            // Almacenar el email para usarlo en la página de verificación
            sessionStorage.setItem('verificationEmail', formData.email);

            try {
                console.log('Enviando datos de registro:', formData);

                const response = await fetch('/api/auth/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData),
                });

                console.log('Respuesta del servidor:', response.status);

                if (response.ok) {
                    // Registro exitoso
                    alert('Registro exitoso. Se ha enviado un código de verificación a tu correo electrónico.');

                    // Redireccionar a la página de verificación (corregido)
                    window.location.href = '/api/auth/verificar-codigo';
                } else {
                    // Intentar obtener el mensaje de error del servidor
                    let errorMessage = 'Error al registrar el usuario.';
                    try {
                        const errorData = await response.json();
                        errorMessage = errorData.message || errorMessage;
                    } catch (e) {
                        console.error('No se pudo parsear la respuesta de error', e);
                    }

                    showError('email', errorMessage);
                }
            } catch (error) {
                console.error('Error en la solicitud:', error);
                showError('email', 'Ocurrió un error inesperado. Inténtalo de nuevo.');
            }
        });
    }
});