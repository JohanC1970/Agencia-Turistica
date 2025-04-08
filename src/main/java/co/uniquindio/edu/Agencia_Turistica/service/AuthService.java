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




    public AuthService(UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder,
                       EmailSender emailSender, ClienteRepository clienteRepository,
                       DtoMapper dtoMapper, JwtUtil jwtUtil, CodigoVerificacionConfig codigoVerificacionConfig) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
        this.emailSender = emailSender;
        this.clienteRepository = clienteRepository;
        this.dtoMapper = dtoMapper;
        this.jwtUtil = jwtUtil;
        this.codigoVerificacionConfig = codigoVerificacionConfig;
    }


    /**
     * Registra un nuevo usuario cliente en la base de datos.
     *
     * @param clienteDTO Datos del cliente a registrar.
     * @return UsuarioResponseDTO con los datos del usuario registrado.
     * @throws MessagingException Si ocurre un error al enviar el correo electrónico.
     * @throws IOException Si ocurre un error al procesar el correo electrónico.
     */
    public UsuarioResponseDTO registrarUsuarioCliente(ClienteDTO clienteDTO) throws MessagingException, IOException {

        validarDatosCliente(clienteDTO);
        verificarUsuarioNoRegistrado(clienteDTO);

        String codigoVerificacion = generarCodigo();
        Usuario usuario = crearUsuario(clienteDTO, codigoVerificacion);
        Cliente cliente = crearCliente(clienteDTO,usuario);
        emailSender.enviarCodigoVerificacion(usuario.getEmail(), codigoVerificacion);

        return new UsuarioResponseDTO(clienteDTO.getId(),clienteDTO.getNombre(), clienteDTO.getApellidos(),
                clienteDTO.getEmail(), Rol.CLIENTE);
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
     * Crea un nuevo cliente a partir de los datos del cliente y el usuario.
     *
     * @param clienteDTO Datos del cliente.
     * @param usuario Usuario asociado al cliente.
     * @return Cliente creado.
     */
    private Cliente crearCliente(ClienteDTO clienteDTO, Usuario usuario) {
        Cliente cliente = new Cliente();
        cliente.setId(usuario.getId());
        cliente.setUsuario(usuario);
        cliente.setTelefono(clienteDTO.getTelefono());
        cliente.setFechaNacimiento(clienteDTO.getFechaNacimiento());
        return clienteRepository.save(cliente);
    }

    /**
     * Crea un nuevo usuario a partir de los datos del cliente.
     *
     * @param clienteDTO Datos del cliente.
     * @param codigoVerificacion Código de verificación.
     * @return Usuario creado.
     */
    private Usuario crearUsuario(ClienteDTO clienteDTO, String codigoVerificacion) {
        Usuario usuario = new Usuario();
        usuario.setId(clienteDTO.getId());
        usuario.setNombre(clienteDTO.getNombre());
        usuario.setApellido(clienteDTO.getApellidos());
        usuario.setEmail(clienteDTO.getEmail());
        usuario.setPassword(passwordEncoder.encode(clienteDTO.getPassword()));
        usuario.setRol(Rol.CLIENTE);
        usuario.setCuentaVerificada(false);
        usuario.setCodigoVerificacion(codigoVerificacion);
        usuario.setFechaExpiracionCodigoVerificacion(LocalDateTime.now().plusMinutes(codigoVerificacionConfig.getExpiracionMinutos()));
        return usuarioRepository.save(usuario);
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
            throw new ValidacionException("Faltan los siguientes campos: " + camposFaltantes.toString());
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

        Usuario usuario = usuarioRepository.findByEmail(loginDTO.getEmail())
                .orElseThrow(() -> new UsuarioNoEncontradoException("Usuario no encontrado"));

        if(!usuario.getEstado()){
            throw new ValidacionException("El usuario está bloqueado y no puede iniciar sesión");
        }

        if (!passwordEncoder.matches(loginDTO.getPassword(), usuario.getPassword())) {
            throw new ValidacionException("Contraseña incorrecta");
        }

        if (!usuario.getCuentaVerificada()) {
            throw new ValidacionException("La cuenta no ha sido verificada");
        }

        String token = jwtUtil.generarToken(usuario.getId());

        return new LoginResponseDTO(token,usuario.getNombre());
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
     * Cambia la contraseña del usuario.
     * @param email Correo electrónico del usuario.
     * @param codigo Código de recuperación.
     * @param nuevaPassword Nueva contraseña.
     */
    public void cambiarPassword(String email, String codigo, String nuevaPassword){

        if(email == null || email.isBlank()){
            throw new ValidacionException("El correo electrónico no puede estar vacío");
        }
        if(codigo == null || codigo.isBlank()){
            throw new ValidacionException("El código de recuperación no puede estar vacío");
        }
        if(nuevaPassword == null || nuevaPassword.isBlank()){
            throw new ValidacionException("La nueva contraseña no puede estar vacía");
        }

        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new UsuarioNoEncontradoException("El correo no está registrado"));

        verificarCodigoRecuperacion(usuario, codigo);

        usuario.setPassword(passwordEncoder.encode(nuevaPassword));
        usuario.setCodigoRecuperacion(null);

        usuarioRepository.save(usuario);
    }

    /**
     * Verifica el código de recuperación y su fecha de expiración.
     * @param usuario
     * @param codigo
     */
    private void verificarCodigoRecuperacion(Usuario usuario, String codigo) {

        if(usuario.getCodigoRecuperacion() == null || usuario.getFechaExpiracionCodigoRecuperacion().isBefore(LocalDateTime.now())){
            throw new ValidacionException("El código de recuperación ha expirado");
        }
        if(!usuario.getCodigoRecuperacion().equals(codigo)){
            throw new ValidacionException("El código de recuperación es incorrecto");
        }
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
