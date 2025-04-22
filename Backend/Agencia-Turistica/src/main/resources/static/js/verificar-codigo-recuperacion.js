// verificar-codigo-recuperacion.js
document.addEventListener('DOMContentLoaded', function() {
    const codigoInputs = document.querySelectorAll('.codigo-input');
    const codigoCompleto = document.getElementById('codigoCompleto');
    const verificarForm = document.getElementById('verificarForm');
    const reenviarCodigo = document.getElementById('reenviarCodigo');

    // Obtener el email almacenado o del campo oculto
    const emailInput = document.querySelector('input[name="email"]');
    const email = emailInput ? emailInput.value : sessionStorage.getItem('recoveryEmail');

    if (emailInput && email) {
        emailInput.value = email; // Asegurar que el campo oculto tenga el email
    }

    // Configurar los inputs del código (código reutilizado)
    codigoInputs.forEach(input => {
        input.addEventListener('input', function() {
            this.value = this.value.replace(/[^0-9]/g, '');
            if (this.value) {
                const nextIndex = parseInt(this.dataset.index) + 1;
                const nextInput = document.querySelector(`.codigo-input[data-index="${nextIndex}"]`);
                if (nextInput) nextInput.focus();
            }
            actualizarCodigoCompleto();
        });

        input.addEventListener('keydown', function(e) {
            if (e.key === 'Backspace' && !this.value) {
                const prevIndex = parseInt(this.dataset.index) - 1;
                const prevInput = document.querySelector(`.codigo-input[data-index="${prevIndex}"]`);
                if (prevInput) {
                    prevInput.focus();
                    prevInput.value = '';
                }
                actualizarCodigoCompleto();
            }
        });
    });

    function actualizarCodigoCompleto() {
        let codigo = '';
        codigoInputs.forEach(input => { codigo += input.value; });
        codigoCompleto.value = codigo;
    }

    // Validar y enviar el formulario
    if (verificarForm) {
        verificarForm.addEventListener('submit', async function (event) {
            event.preventDefault();

            const codigo = codigoCompleto.value;

            if (codigo.length !== 6) {
                mostrarError('Por favor, ingrese el código completo de 6 dígitos');
                return;
            }

            if (!email) {
                mostrarError('No se pudo determinar el correo electrónico');
                return;
            }

            try {
                const response = await fetch('/api/auth/verify-recovery-code', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, codigo }),
                });

                if (response.ok) {
                    alert('Código verificado correctamente.');
                    window.location.href = '/api/auth/change-password?email=' + encodeURIComponent(email);
                } else {
                    const errorData = await response.json().catch(() => ({ message: 'Error de verificación' }));
                    mostrarError(errorData.message || 'Error al verificar el código.');
                }
            } catch (error) {
                console.error('Error en la solicitud:', error);
                mostrarError('Ocurrió un error inesperado. Inténtalo de nuevo.');
            }
        });
    }

    // Reenviar código de recuperación
    if (reenviarCodigo) {
        reenviarCodigo.addEventListener('click', async function(event) {
            event.preventDefault();

            if (!email) {
                mostrarError('No se pudo determinar el correo electrónico');
                return;
            }

            try {
                const response = await fetch('/api/auth/resend-recovery', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email }),
                });

                if (response.ok) {
                    mostrarMensaje('Se ha enviado un nuevo código a tu correo electrónico', 'success');
                } else {
                    const errorData = await response.json().catch(() => ({ message: 'Error al reenviar' }));
                    mostrarError(errorData.message || 'No se pudo reenviar el código.');
                }
            } catch (error) {
                console.error('Error en la solicitud:', error);
                mostrarError('Ocurrió un error. Por favor, inténtalo de nuevo');
            }
        });
    }

    // Funciones de ayuda
    function mostrarError(mensaje) {
        const existingError = document.querySelector('.error-message');
        if (existingError) existingError.remove();

        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = mensaje;
        verificarForm.insertBefore(errorDiv, verificarForm.querySelector('.codigo-container'));
    }

    function mostrarMensaje(mensaje, tipo) {
        const existingMessage = document.querySelector('.message');
        if (existingMessage) existingMessage.remove();

        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${tipo}`;
        messageDiv.textContent = mensaje;
        verificarForm.insertBefore(messageDiv, verificarForm.querySelector('.codigo-container'));

        setTimeout(() => messageDiv.remove(), 5000);
    }
});