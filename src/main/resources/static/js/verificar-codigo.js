document.addEventListener('DOMContentLoaded', function() {
    const codigoInputs = document.querySelectorAll('.codigo-input');
    const codigoCompleto = document.getElementById('codigoCompleto');
    const verificarForm = document.getElementById('verificarForm');
    const reenviarCodigo = document.getElementById('reenviarCodigo');

    // Configurar los inputs del código
    codigoInputs.forEach(input => {
        // Manejar la entrada de dígitos
        input.addEventListener('input', function() {
            // Solo permitir números
            this.value = this.value.replace(/[^0-9]/g, '');

            if (this.value) {
                // Mover al siguiente input
                const nextIndex = parseInt(this.dataset.index) + 1;
                const nextInput = document.querySelector(`.codigo-input[data-index="${nextIndex}"]`);

                if (nextInput) {
                    nextInput.focus();
                }
            }

            // Actualizar el valor completo del código
            actualizarCodigoCompleto();
        });

        // Manejar la tecla de retroceso
        input.addEventListener('keydown', function(e) {
            if (e.key === 'Backspace' && !this.value) {
                // Mover al input anterior si está vacío
                const prevIndex = parseInt(this.dataset.index) - 1;
                const prevInput = document.querySelector(`.codigo-input[data-index="${prevIndex}"]`);

                if (prevInput) {
                    prevInput.focus();
                    prevInput.value = '';
                }

                // Actualizar el valor completo del código
                actualizarCodigoCompleto();
            }
        });
    });

    // Función para actualizar el valor completo del código
    function actualizarCodigoCompleto() {
        let codigo = '';
        codigoInputs.forEach(input => {
            codigo += input.value;
        });
        codigoCompleto.value = codigo;
    }

    // Validar el formulario antes de enviar
    if (verificarForm) {
        verificarForm.addEventListener('submit', async function (event) {
            const codigo = codigoCompleto.value;

            if (codigo.length !== 6) {
                event.preventDefault();
                mostrarError('Por favor, ingrese el código completo de 6 dígitos');
            }

            try {
                const response = await fetch('/api/auth/verify', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({email, codigo}),
                });

                if (response.ok) {
                    alert('Cuenta verificada exitosamente.');
                    window.location.href = '/api/auth/login';
                } else {
                    const errorData = await response.json();
                    mostrarError(errorData.message || 'Error al verificar el código.');
                }
            } catch (error) {
                console.error('Error en la solicitud:', error);
                mostrarError('Ocurrió un error inesperado. Inténtalo de nuevo.');
            }

        });
    }

    // Reenviar código
    if (reenviarCodigo) {
        reenviarCodigo.addEventListener('click', function(event) {
            event.preventDefault();

            // Obtener el email del formulario
            const email = document.querySelector('input[name="email"]').value;

            // Enviar solicitud para reenviar código
            fetch('/reenviar-codigo', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: email }),
            })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        mostrarMensaje('Se ha enviado un nuevo código a tu correo electrónico', 'success');
                    } else {
                        mostrarError('No se pudo reenviar el código. Por favor, inténtalo de nuevo');
                    }
                })
                .catch(error => {
                    mostrarError('Ocurrió un error. Por favor, inténtalo de nuevo');
                });
        });
    }

    // Función para mostrar mensajes de error
    function mostrarError(mensaje) {
        // Eliminar mensajes existentes
        const existingError = document.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }

        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = mensaje;

        verificarForm.insertBefore(errorDiv, verificarForm.querySelector('.form-group'));
    }

    // Función para mostrar mensajes de éxito
    function mostrarMensaje(mensaje, tipo) {
        // Eliminar mensajes existentes
        const existingMessage = document.querySelector('.message');
        if (existingMessage) {
            existingMessage.remove();
        }

        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${tipo}`;
        messageDiv.textContent = mensaje;

        verificarForm.insertBefore(messageDiv, verificarForm.querySelector('.form-group'));

        // Eliminar el mensaje después de 5 segundos
        setTimeout(() => {
            messageDiv.remove();
        }, 5000);
    }
});