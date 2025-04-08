package co.uniquindio.edu.Agencia_Turistica.service;

import co.uniquindio.edu.Agencia_Turistica.dto.UsuarioDTO;
import co.uniquindio.edu.Agencia_Turistica.exception.ValidacionException;
import co.uniquindio.edu.Agencia_Turistica.model.Usuario;
import co.uniquindio.edu.Agencia_Turistica.repository.UsuarioRepository;
import jakarta.mail.MessagingException;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.Random;

@Service
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailSender emailSender;



    public UsuarioService(UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder, EmailSender emailSender) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
        this.emailSender = emailSender;
    }

    @Transactional
    public Usuario registrarUsuario(UsuarioDTO usuarioDTO) {

        if(usuarioRepository.existsById(usuarioDTO.getId())) {
            throw new IllegalArgumentException("El usuario ya existe");
        }

        if(usuarioRepository.existsByEmail(usuarioDTO.getEmail())) {
            throw new IllegalArgumentException("El usuario ya existe");
        }

        if(usuarioDTO.getRol().equals("CLIENTE")) {

        } else if(usuarioDTO.getRol().equals("EMPLEADO")) {

        } else {
            throw new IllegalArgumentException("El rol no es válido");
        }
        return null;
    }

    /**
     * Método para cambiar la contraseña de un usuario
     * @param usuarioDTO
     * @param nuevaPassword
     */
    public void cambiarPassword(UsuarioDTO usuarioDTO, String nuevaPassword) {

        if(usuarioDTO.getId() == null || usuarioDTO.getId().isEmpty()) {
            throw new ValidacionException("El ID del usuario no puede ser nulo o vacío");
        }
        if(nuevaPassword == null || nuevaPassword.isEmpty()) {
            throw new ValidacionException("La nueva contraseña no puede ser nula o vacía");
        }
        Usuario usuario = usuarioRepository.findById(usuarioDTO.getId())
                .orElseThrow(() -> new IllegalArgumentException("El usuario no existe"));

        if(usuario.getPassword().equals(nuevaPassword)) {
            throw new ValidacionException("La nueva contraseña no puede ser igual a la contraseña actual");
        } else {
            usuario.setPassword(passwordEncoder.encode(nuevaPassword));
            usuarioRepository.save(usuario);
        }
    }

    /**
     * Método para cambiar el correo de un usuario
     * @param usuarioDTO Datos del usuario
     * @param nuevoCorreo Nuevo correo electrónico
     * @throws MessagingException
     * @throws IOException
     */
    public void cambiarCorreo(UsuarioDTO usuarioDTO, String nuevoCorreo) throws MessagingException, IOException {
        if(usuarioDTO.getId() == null || usuarioDTO.getId().isEmpty()) {
            throw new ValidacionException("El ID del usuario no puede ser nulo o vacío");
        }
        if(nuevoCorreo == null || nuevoCorreo.isEmpty()) {
            throw new ValidacionException("El nuevo correo no puede ser nulo o vacío");
        }
        if(!nuevoCorreo.matches("^[A-Za-z0-9+_.-]+@(.+)$")) {
            throw new ValidacionException("El nuevo correo no es válido");
        }

        Usuario usuario = usuarioRepository.findById(usuarioDTO.getId())
                .orElseThrow(() -> new IllegalArgumentException("El usuario no existe"));

        if(usuario.getEmail().equals(nuevoCorreo)) {
            throw new ValidacionException("El nuevo correo no puede ser igual al correo actual");
        }

        // Validación opcional: correo ya en uso
        if(usuarioRepository.existsByEmail(nuevoCorreo)) {
            throw new ValidacionException("Ya existe un usuario con ese correo electrónico");
        }

        enviarCodigoVerificacion(usuario, nuevoCorreo);
        usuarioRepository.save(usuario);
    }

    /**
     * Método para enviar un código de verificación al nuevo correo del usuario
     * @param usuario
     * @param nuevoCorreo
     * @throws MessagingException
     * @throws IOException
     */
    private void enviarCodigoVerificacion(Usuario usuario, String nuevoCorreo) throws MessagingException, IOException {
        String codigo = generarCodigo();
        usuario.setEmail(nuevoCorreo);
        usuario.setCodigoVerificacion(codigo);
        emailSender.enviarCodigoVerificacion(nuevoCorreo, codigo);
    }



    /**
     * Genera un código de verificación aleatorio de 6 dígitos.
     *
     * @return Código de verificación.
     */
    public String generarCodigo(){
        Random random = new Random();
        int code = 100000 + random.nextInt(900000);
        return String.valueOf(code);
    }



}

