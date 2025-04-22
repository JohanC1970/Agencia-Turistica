package co.uniquindio.edu.Agencia_Turistica.service;

import co.uniquindio.edu.Agencia_Turistica.config.CodigoVerificacionConfig;
import co.uniquindio.edu.Agencia_Turistica.dto.ClienteDTO;
import co.uniquindio.edu.Agencia_Turistica.dto.LoginDTO;
import co.uniquindio.edu.Agencia_Turistica.dto.response.LoginResponseDTO;
import co.uniquindio.edu.Agencia_Turistica.dto.response.UsuarioResponseDTO;
import co.uniquindio.edu.Agencia_Turistica.exception.UsuarioNoEncontradoException;
import co.uniquindio.edu.Agencia_Turistica.exception.ValidacionException;
import co.uniquindio.edu.Agencia_Turistica.model.Cliente;
import co.uniquindio.edu.Agencia_Turistica.model.Rol;
import co.uniquindio.edu.Agencia_Turistica.model.Usuario;
import co.uniquindio.edu.Agencia_Turistica.repository.ClienteRepository;
import co.uniquindio.edu.Agencia_Turistica.repository.UsuarioRepository;
import co.uniquindio.edu.Agencia_Turistica.security.JwtUtil;
import co.uniquindio.edu.Agencia_Turistica.util.DtoMapper;
import jakarta.mail.MessagingException;
import jakarta.transaction.Transactional;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.Random;

@Service
public class AuthService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailSender emailSender;
    private final ClienteRepository clienteRepository;
    private final DtoMapper dtoMapper;
    private final JwtUtil jwtUtil;
    private final CodigoVerificacionConfig codigoVerificacionConfig;
    private final AuthenticationManager authenticationManager;


    public AuthService(UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder,
                       EmailSender emailSender, ClienteRepository clienteRepository,
                       DtoMapper dtoMapper, JwtUtil jwtUtil, CodigoVerificacionConfig codigoVerificacionConfig, AuthenticationManager authenticationManager) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
        this.emailSender = emailSender;
        this.clienteRepository = clienteRepository;
        this.dtoMapper = dtoMapper;
        this.jwtUtil = jwtUtil;
        this.codigoVerificacionConfig = codigoVerificacionConfig;
        this.authenticationManager = authenticationManager;
    }


    /**
     * Verifica si el usuario ya está registrado en la base de datos.
     *
     * @param clienteDTO Datos del cliente a verificar.
     * @throws IllegalArgumentException Si el correo electrónico o el ID ya están registrados.
     */
    private void verificarUsuarioNoRegistrado(ClienteDTO clienteDTO) {

        if(usuarioRepository.existsByEmail(clienteDTO.getEmail())) {
            throw new ValidacionException("El correo electrónico ya está registrado.");
        }

        if(usuarioRepository.existsById(clienteDTO.getId())) {
            throw new ValidacionException("El ID ya está registrado.");
        }
    }



    /**
     * Válida los datos del cliente.
     *
     * @param clienteDTO Datos del cliente a validar.
     * @throws IllegalArgumentException Si faltan campos obligatorios o si el formato del email es inválido.
     */
    private void validarDatosCliente(ClienteDTO clienteDTO) {
        StringBuilder camposFaltantes = new StringBuilder();

        if (clienteDTO.getId() == null || clienteDTO.getId().isBlank()) {
            camposFaltantes.append("ID, ");
        }
        if (clienteDTO.getNombre() == null || clienteDTO.getNombre().isBlank()) {
            camposFaltantes.append("Nombre, ");
        }
        if (clienteDTO.getApellidos() == null || clienteDTO.getApellidos().isBlank()) {
            camposFaltantes.append("Apellidos, ");
        }
        if (clienteDTO.getEmail() == null || clienteDTO.getEmail().isBlank()) {
            camposFaltantes.append("Email, ");
        } else if (!clienteDTO.getEmail().matches("^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$")) {
            camposFaltantes.append("Email (formato inválido), ");
        }
        if (clienteDTO.getPassword() == null || clienteDTO.getPassword().isBlank()) {
            camposFaltantes.append("Contraseña, ");
        }
        if(clienteDTO.getTelefono() == null || clienteDTO.getTelefono().isBlank()){
            camposFaltantes.append("Teléfono, ");
        }
        if (clienteDTO.getFechaNacimiento() == null) {
            camposFaltantes.append("Fecha de Nacimiento, ");
        }
        if (camposFaltantes.length() > 0) {
            // Elimina la última coma y espacio
            camposFaltantes.setLength(camposFaltantes.length() - 2);
            throw new ValidacionException("Faltan los siguientes campos: " + camposFaltantes);
        }
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

    /**
     * Esta función se encarga de iniciar sesión en la aplicación.
     * @param loginDTO Contiene el correo electrónico y la contraseña del usuario.
     * @return LoginResponseDTO que contiene el token de acceso y el nombre del usuario.
     */
    public LoginResponseDTO iniciarSesion(LoginDTO loginDTO){

        if(loginDTO.getEmail() == null || loginDTO.getEmail().isBlank()){
            throw new ValidacionException("El correo electrónico no puede estar vacío");
        }

        if(loginDTO.getPassword() == null || loginDTO.getPassword().isBlank()){
            throw new ValidacionException("La contraseña no puede estar vacía");
        }

        try{

            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginDTO.getEmail(), loginDTO.getPassword())
            );

            Usuario usuario = (Usuario) authentication.getPrincipal();
            String token = jwtUtil.generarToken(usuario.getId());
            return new LoginResponseDTO(token, usuario.getEmail());
        }catch (BadCredentialsException e){
            throw new ValidacionException("Credenciales inválidas");
        }

    }

    /**
     * Solicita la recuperación de acceso a la cuenta del usuario.
     * @param email Correo electrónico del usuario.
     */
    public void solicitarRecuperacionAcceso(String email){
        if(email == null || email.isBlank()){
            throw new ValidacionException("El correo electrónico no puede estar vacío");
        }

        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new UsuarioNoEncontradoException("Usuario no encontrado"));

        if(!usuario.getEstado()){
            throw new ValidacionException("El usuario está bloqueado y no puede solicitar recuperar la contraseña");
        }

        String codigoRecuperacion = generarCodigo();

        usuario.setCodigoRecuperacion(codigoRecuperacion);
        usuario.setFechaExpiracionCodigoRecuperacion(LocalDateTime.now().plusMinutes(codigoVerificacionConfig.getExpiracionMinutos()));

        try {
            emailSender.enviarCodigoRecuperacion(usuario.getEmail(), codigoRecuperacion);
        } catch (MessagingException | IOException e) {
            throw new RuntimeException("Error al enviar el correo de recuperación", e);
        }

        usuarioRepository.save(usuario);
    }



    /**
     * Este método solicita un nuevo código de verificación para el usuario.
     * @param email
     */
    public void solicitarNuevoCodigoVerificacion(String email) {
        if (email == null || email.isBlank()) {
            throw new ValidacionException("El correo electrónico no puede estar vacío");
        }

        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new UsuarioNoEncontradoException("Usuario no encontrado"));

        if(!usuario.getEstado()){
            throw new ValidacionException("El usuario está bloqueado y no puede solicitar un nuevo código de verificación");
        }

        String nuevoCodigoVerificacion = generarCodigo();

        usuario.setCodigoVerificacion(nuevoCodigoVerificacion);
        usuario.setFechaExpiracionCodigoVerificacion(LocalDateTime.now().plusMinutes(codigoVerificacionConfig.getExpiracionMinutos()));

        try {
            emailSender.enviarCodigoVerificacion(usuario.getEmail(), nuevoCodigoVerificacion);
        } catch (MessagingException | IOException e) {
            throw new RuntimeException("Error al enviar el correo de verificación", e);
        }

        usuarioRepository.save(usuario);
    }

    /**
     * Este método solicita un nuevo código de recuperación para el usuario.
     * @param email
     */
    public void solicitarNuevoCodigoRecuperacion(String email) {
        if (email == null || email.isBlank()) {
            throw new ValidacionException("El correo electrónico no puede estar vacío");
        }

        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new UsuarioNoEncontradoException("Usuario no encontrado"));

        if(!usuario.getEstado()){
            throw new ValidacionException("El usuario está bloqueado y no puede solicitar un nuevo código de recuperación");
        }

        String nuevoCodigoRecuperacion = generarCodigo();

        usuario.setCodigoRecuperacion(nuevoCodigoRecuperacion);
        usuario.setFechaExpiracionCodigoRecuperacion(LocalDateTime.now().plusMinutes(codigoVerificacionConfig.getExpiracionMinutos()));

        try {
            emailSender.enviarCodigoRecuperacion(usuario.getEmail(), nuevoCodigoRecuperacion);
        } catch (MessagingException | IOException e) {
            throw new RuntimeException("Error al enviar el correo de recuperación", e);
        }

        usuarioRepository.save(usuario);
    }



}
