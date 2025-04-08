package co.uniquindio.edu.Agencia_Turistica.service;

import co.uniquindio.edu.Agencia_Turistica.dto.ClienteDTO;
import co.uniquindio.edu.Agencia_Turistica.dto.LoginDTO;
import co.uniquindio.edu.Agencia_Turistica.dto.UsuarioDTO;
import co.uniquindio.edu.Agencia_Turistica.dto.response.LoginResponseDTO;
import co.uniquindio.edu.Agencia_Turistica.model.Cliente;
import co.uniquindio.edu.Agencia_Turistica.model.Rol;
import co.uniquindio.edu.Agencia_Turistica.model.Usuario;
import co.uniquindio.edu.Agencia_Turistica.repository.ClienteRepository;
import co.uniquindio.edu.Agencia_Turistica.repository.UsuarioRepository;
import co.uniquindio.edu.Agencia_Turistica.security.JwtUtil;
import co.uniquindio.edu.Agencia_Turistica.util.DtoMapper;
import jakarta.mail.MessagingException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
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

    private static final int CODIGO_EXPIRACION_MINUTOS = 15;


    public AuthService(UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder,
                       EmailSender emailSender, ClienteRepository clienteRepository,
                       DtoMapper dtoMapper, JwtUtil jwtUtil) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
        this.emailSender = emailSender;
        this.clienteRepository = clienteRepository;
        this.dtoMapper = dtoMapper;
        this.jwtUtil = jwtUtil;
    }


    /**
     * Registra un nuevo usuario cliente en la base de datos.
     * @param clienteDTO
     * @return
     * @throws MessagingException
     * @throws IOException
     */
    public UsuarioDTO registrarUsuarioCliente(ClienteDTO clienteDTO) throws MessagingException, IOException {

        verificarUsuarioNoRegistrado(clienteDTO);

        validarDatosCliente(clienteDTO);

        String codigoVerificacion = generarCodigo();

        Usuario usuario = crearUsuario(clienteDTO, codigoVerificacion);
        Cliente cliente = crearCliente(clienteDTO,usuario);


        emailSender.enviarCodigoVerificacion(usuario.getEmail(), codigoVerificacion);

        return dtoMapper.mapToEntity(usuario, UsuarioDTO.class);
    }

    /**
     * Verifica si el usuario ya está registrado en la base de datos.
     *
     * @param clienteDTO Datos del cliente a verificar.
     * @throws IllegalArgumentException Si el correo electrónico o el ID ya están registrados.
     */
    private void verificarUsuarioNoRegistrado(ClienteDTO clienteDTO) {

        if(usuarioRepository.existsByEmail(clienteDTO.getEmail())) {
            throw new IllegalArgumentException("El correo electrónico ya está registrado.");
        }

        if(usuarioRepository.existsById(clienteDTO.getId())) {
            throw new IllegalArgumentException("El ID ya está registrado.");
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
        usuario.setFechaExpiracionCodigoVerificacion(LocalDateTime.now().plusMinutes(CODIGO_EXPIRACION_MINUTOS));
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
        if (clienteDTO.getFechaNacimiento() == null) {
            camposFaltantes.append("Fecha de Nacimiento, ");
        }
        if (camposFaltantes.length() > 0) {
            // Elimina la última coma y espacio
            camposFaltantes.setLength(camposFaltantes.length() - 2);
            throw new IllegalArgumentException("Faltan los siguientes campos: " + camposFaltantes.toString());
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
            throw new IllegalArgumentException("El correo electrónico no puede estar vacío");
        }

        if(loginDTO.getPassword() == null || loginDTO.getPassword().isBlank()){
            throw new IllegalArgumentException("La contraseña no puede estar vacía");
        }

        Usuario usuario = usuarioRepository.findByEmail(loginDTO.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado"));

        if (!passwordEncoder.matches(loginDTO.getPassword(), usuario.getPassword())) {
            throw new IllegalArgumentException("Contraseña incorrecta");
        }

        if (!usuario.getCuentaVerificada()) {
            throw new IllegalArgumentException("La cuenta no ha sido verificada");
        }

        String token = jwtUtil.generarToken(usuario.getId());

        return new LoginResponseDTO(token,usuario.getNombre());
    }


}
